#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const cp = require("child_process");

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function sh(cmd, args, opts = {}) {
  const res = cp.spawnSync(cmd, args, {
    stdio: "pipe",
    encoding: "utf8",
    ...opts,
  });
  if (res.status !== 0) {
    const out = (res.stdout || "").trim();
    const err = (res.stderr || "").trim();
    const detail = [out, err].filter(Boolean).join("\n");
    throw new Error(
      `Command failed: ${cmd} ${args.join(" ")}\n${detail || "(no output)"}`
    );
  }
  return (res.stdout || "").trim();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + "\n");
}

function parseArgs(argv) {
  const out = { version: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--version") {
      out.version = argv[++i] || null;
    } else if (a.startsWith("--version=")) {
      out.version = a.split("=", 2)[1] || null;
    }
  }
  return out;
}

function bumpVersion(current, kind) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(current);
  if (!m) die(`Invalid current version: ${current}`);
  let major = Number(m[1]);
  let minor = Number(m[2]);
  let patch = Number(m[3]);

  if (kind === "major") {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (kind === "minor") {
    minor += 1;
    patch = 0;
  } else if (kind === "patch") {
    patch += 1;
  } else {
    die(`--version must be one of: major | minor | patch (got "${kind}")`);
  }

  return `${major}.${minor}.${patch}`;
}

function getDefaultBaseBranch() {
  // returns like: "origin/main" -> "main"
  try {
    const ref = sh("git", ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"]);
    const parts = ref.split("/");
    return parts[1] || "main";
  } catch {
    return "main";
  }
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.version) die(`Usage: node scripts/release.js --version major|minor|patch`);

  const repoRoot = path.resolve(__dirname, "..");
  const pkgs = [
    path.join(repoRoot, "packages/core/package.json"),
    path.join(repoRoot, "packages/react/package.json"),
    path.join(repoRoot, "packages/skewed/package.json"),
  ];

  const porcelain = sh("git", ["status", "--porcelain"], { cwd: repoRoot });
  if (porcelain) die("Working tree is not clean. Commit/stash your changes first.");

  const corePkg = readJson(pkgs[0]);
  const currentVersion = corePkg.version;
  const newVersion = bumpVersion(currentVersion, args.version);
  const releaseBranch = `release/${newVersion}`;
  const baseBranch = getDefaultBaseBranch();

  console.log(`Releasing v${newVersion}`);
  console.log(`- base: ${baseBranch}`);
  console.log(`- branch: ${releaseBranch}`);

  // Create and switch to release branch.
  sh("git", ["checkout", "-b", releaseBranch], { cwd: repoRoot });

  // Bump versions (keep packages in lockstep).
  for (const p of pkgs) {
    const json = readJson(p);
    json.version = newVersion;
    writeJson(p, json);
  }

  // Commit the bump.
  sh("git", ["add", ...pkgs.map((p) => path.relative(repoRoot, p))], { cwd: repoRoot });
  sh("git", ["commit", "-m", `chore(release): v${newVersion}`], { cwd: repoRoot });

  // Push release branch.
  sh("git", ["push", "-u", "origin", releaseBranch], { cwd: repoRoot });

  // Create PR.
  // gh must be authenticated already (user said it is installed and configured).
  sh(
    "gh",
    [
      "pr",
      "create",
      "--title",
      `Release v${newVersion}`,
      "--body",
      `Automated release PR for v${newVersion}.\n\n- Bumps versions\n- Publishes packages to npm`,
      "--base",
      baseBranch,
      "--head",
      releaseBranch,
    ],
    { cwd: repoRoot }
  );

  // Build packages before publish (safer for tsdx outputs).
  sh("pnpm", ["-r", "--filter", "./packages/**", "build"], { cwd: repoRoot });

  // Publish packages. `--no-git-checks` because we are intentionally publishing from a release branch.
  // NOTE: This may prompt for OTP if the npm account enforces it.
  sh(
    "pnpm",
    [
      "-r",
      "--filter",
      "@skewed/core",
      "--filter",
      "@skewed/react",
      "--filter",
      "skewed",
      "publish",
      "--no-git-checks",
      "--access",
      "public",
    ],
    { cwd: repoRoot, stdio: "inherit" }
  );

  console.log(`Done: v${newVersion}`);
}

try {
  main();
} catch (e) {
  die(e && e.message ? e.message : String(e));
}


