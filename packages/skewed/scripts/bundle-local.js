#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Build-time bundling helper:
 * - Copies `packages/core/src` -> `packages/skewed/src/__bundled/core`
 * - Copies `packages/react/src` -> `packages/skewed/src/__bundled/react`
 * - Rewrites `@skewed/core` imports inside bundled react sources to `../core`
 *
 * This makes the published `skewed` package self-contained (no @skewed/* deps).
 */

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const skewedRoot = path.resolve(__dirname, "..");
const outRoot = path.join(skewedRoot, "src/__bundled");
const outCore = path.join(outRoot, "core");
const outReact = path.join(outRoot, "react");

const srcCore = path.join(repoRoot, "packages/core/src");
const srcReact = path.join(repoRoot, "packages/react/src");

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function mkdirp(p) {
  fs.mkdirSync(p, { recursive: true });
}

function isTextFile(filePath) {
  return filePath.endsWith(".ts") || filePath.endsWith(".tsx") || filePath.endsWith(".js");
}

function copyDir(srcDir, dstDir) {
  mkdirp(dstDir);
  for (const ent of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, ent.name);
    const dst = path.join(dstDir, ent.name);
    if (ent.isDirectory()) {
      copyDir(src, dst);
    } else if (ent.isFile()) {
      mkdirp(path.dirname(dst));
      fs.copyFileSync(src, dst);
    }
  }
}

function rewriteImportsInDir(dir, replacers) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) rewriteImportsInDir(p, replacers);
    else if (ent.isFile() && isTextFile(p)) {
      let s = fs.readFileSync(p, "utf8");
      let changed = false;
      for (const [from, to] of replacers) {
        const next = s.split(from).join(to);
        if (next !== s) {
          s = next;
          changed = true;
        }
      }
      if (changed) fs.writeFileSync(p, s);
    }
  }
}

function main() {
  const mode = process.argv[2];
  if (mode !== "prepare" && mode !== "clean") {
    die("Usage: node packages/skewed/scripts/bundle-local.js prepare|clean");
  }

  if (mode === "clean") {
    rmrf(outRoot);
    return;
  }

  if (!fs.existsSync(srcCore)) die(`Missing: ${srcCore}`);
  if (!fs.existsSync(srcReact)) die(`Missing: ${srcReact}`);

  rmrf(outRoot);
  mkdirp(outRoot);

  copyDir(srcCore, outCore);
  copyDir(srcReact, outReact);

  // Rewrite react’s imports so it points at the bundled core.
  rewriteImportsInDir(outReact, [
    ['from "@skewed/core";', 'from "../core";'],
    ['from "@skewed/core"', 'from "../core"'],
    ['require("@skewed/core")', 'require("../core")'],
  ]);
}

main();


