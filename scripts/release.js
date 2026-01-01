#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Release/publish automation for the single-package library (`packages/skewed`).
 *
 * Usage:
 *   pnpm release --version major|minor|patch
 */

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
      `Command failed: ${cmd} ${args.join(" ")}\n${detail || "(no output)"}`,
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

function getDefaultBaseBranch(repoRoot) {
  try {
    const ref = sh(
      "git",
      ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"],
      { cwd: repoRoot },
    );
    const parts = ref.split("/");
    return parts[1] || "main";
  } catch {
    return "main";
  }
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.version)
    die(`Usage: node scripts/release.js --version major|minor|patch`);

  const repoRoot = path.resolve(__dirname, "..");
  const publishPkgPath = path.join(repoRoot, "packages/skewed/package.json");

  const porcelain = sh("git", ["status", "--porcelain"], { cwd: repoRoot });
  if (porcelain)
    die("Working tree is not clean. Commit/stash your changes first.");

  // Fail fast on npm auth. (If your org enforces OTP, publish may still prompt.)
  try {
    sh("npm", ["whoami"], { cwd: repoRoot });
  } catch {
    die(
      [
        "npm auth failed (token expired/revoked).",
        "Fix by running `npm login` (or updating your token), then verify with `npm whoami`.",
      ].join("\n"),
    );
  }

  const publishPkg = readJson(publishPkgPath);
  const currentVersion = publishPkg.version;
  const newVersion = bumpVersion(currentVersion, args.version);
  const releaseBranch = `release/${newVersion}`;
  const baseBranch = getDefaultBaseBranch(repoRoot);

  console.log(`Releasing v${newVersion}`);
  console.log(`- base: ${baseBranch}`);
  console.log(`- branch: ${releaseBranch}`);

  sh("git", ["checkout", "-b", releaseBranch], { cwd: repoRoot });

  publishPkg.version = newVersion;
  writeJson(publishPkgPath, publishPkg);

  sh("git", ["add", path.relative(repoRoot, publishPkgPath)], {
    cwd: repoRoot,
  });
  sh("git", ["commit", "-m", `chore(release): v${newVersion}`], {
    cwd: repoRoot,
  });

  sh("git", ["push", "-u", "origin", releaseBranch], { cwd: repoRoot });

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
    { cwd: repoRoot },
  );

  sh("pnpm", ["--filter", "skewed", "build"], { cwd: repoRoot });

  // NOTE: may require OTP; this will prompt.
  sh(
    "pnpm",
    ["--filter", "skewed", "publish", "--no-git-checks", "--access", "public"],
    { cwd: repoRoot, stdio: "inherit" },
  );

  console.log(`Done: v${newVersion}`);
}

try {
  main();
} catch (e) {
  die(e && e.message ? e.message : String(e));
}
