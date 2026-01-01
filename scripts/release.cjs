#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");

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

function shInherit(cmd, args, opts = {}) {
  const res = cp.spawnSync(cmd, args, {
    stdio: "inherit",
    ...opts,
  });
  if (res.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + "\n");
}

function parseArgs(argv) {
  const out = { version: null, tag: null, dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--version") {
      out.version = argv[++i] || null;
    } else if (a.startsWith("--version=")) {
      out.version = a.split("=", 2)[1] || null;
    } else if (a === "--tag") {
      out.tag = argv[++i] || null;
    } else if (a.startsWith("--tag=")) {
      out.tag = a.split("=", 2)[1] || null;
    } else if (a === "--dry-run") {
      out.dryRun = true;
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
  if (!args.version) {
    die(
      [
        "Usage:",
        "  pnpm publish:release --version <major|minor|patch> [--tag <dist-tag>] [--dry-run]",
      ].join("\n")
    );
  }

  const repoRoot = path.resolve(__dirname, "..");
  const pkgPath = path.join(repoRoot, "package.json");

  const porcelain = sh("git", ["status", "--porcelain"], { cwd: repoRoot });
  if (porcelain) die("Working tree is not clean. Commit/stash your changes first.");

  // Fail fast on npm auth, instead of halfway through publishing.
  // (If your org enforces OTP, npm may still prompt during publish.)
  try {
    sh("npm", ["whoami"], { cwd: repoRoot });
  } catch {
    die(
      [
        "npm auth failed (token expired/revoked).",
        "Fix by running `npm login` (or updating your token), then verify with `npm whoami`.",
      ].join("\n")
    );
  }

  const pkg = readJson(pkgPath);
  const currentVersion = pkg.version;
  const newVersion = bumpVersion(currentVersion, args.version);

  const releaseBranch = `release/${newVersion}`;
  const tagName = `v${newVersion}`;
  const baseBranch = getDefaultBaseBranch();

  // Guard against collisions.
  try {
    sh("git", ["rev-parse", "--verify", releaseBranch], { cwd: repoRoot });
    die(`Branch already exists: ${releaseBranch}`);
  } catch {
    // ok
  }
  try {
    sh("git", ["rev-parse", "--verify", tagName], { cwd: repoRoot });
    die(`Tag already exists: ${tagName}`);
  } catch {
    // ok
  }

  console.log(`Releasing v${newVersion}`);
  console.log(`- base: ${baseBranch}`);
  console.log(`- branch: ${releaseBranch}`);
  console.log(`- tag: ${tagName}`);
  if (args.tag) console.log(`- npm dist-tag: ${args.tag}`);
  if (args.dryRun) console.log(`- dry-run: true`);

  // Create and switch to release branch.
  sh("git", ["checkout", "-b", releaseBranch], { cwd: repoRoot });

  // Bump version.
  pkg.version = newVersion;
  writeJson(pkgPath, pkg);

  // Commit + tag.
  sh("git", ["add", "package.json"], { cwd: repoRoot });
  sh("git", ["commit", "-m", `chore(release): v${newVersion}`], { cwd: repoRoot });
  sh("git", ["tag", tagName], { cwd: repoRoot });

  // Push release branch + tag.
  sh("git", ["push", "-u", "origin", releaseBranch, "--follow-tags"], {
    cwd: repoRoot,
  });

  // Create PR (best-effort; don't block publishing if gh isn't authenticated).
  try {
    sh(
      "gh",
      [
        "pr",
        "create",
        "--title",
        `Release v${newVersion}`,
        "--body",
        `Automated release PR for v${newVersion}.`,
        "--base",
        baseBranch,
        "--head",
        releaseBranch,
      ],
      { cwd: repoRoot }
    );
  } catch (e) {
    console.warn(
      `Warning: failed to create release PR via gh (continuing): ${
        e && e.message ? e.message : String(e)
      }`
    );
  }

  // Build and test.
  shInherit("pnpm", ["test"], { cwd: repoRoot });
  shInherit("pnpm", ["build"], { cwd: repoRoot });

  if (args.dryRun) {
    console.log("Dry-run enabled: skipping publish.");
    console.log(`Done: v${newVersion}`);
    return;
  }

  const publishArgs = ["publish", "--no-git-checks", "--access", "public"];
  if (args.tag) publishArgs.push("--tag", args.tag);
  shInherit("pnpm", publishArgs, { cwd: repoRoot });

  console.log(`Done: v${newVersion}`);
}

try {
  main();
} catch (e) {
  die(e && e.message ? e.message : String(e));
}


