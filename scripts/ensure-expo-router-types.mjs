#!/usr/bin/env node
/**
 * Ensures .expo/types/router.d.ts exists and matches app/ routes.
 * Expo generates this file on `expo start`; stale types break typed-route tsc.
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const routerTypes = path.join(root, ".expo/types/router.d.ts");
const appDir = path.join(root, "app");

/** Stale generator output from an old tabs folder name */
const STALE_MARKERS = ["mobile-core"];

/** Routes that must appear in generated types (template-literal form) */
const REQUIRED_MARKERS = [
  "'/(onboarding)'",
  "web-viewer",
  "sign-in",
  "caloric",
];

function typesLookCurrent() {
  if (!fs.existsSync(routerTypes)) return false;
  const content = fs.readFileSync(routerTypes, "utf8");
  if (STALE_MARKERS.some((marker) => content.includes(marker))) return false;
  if (!REQUIRED_MARKERS.every((marker) => content.includes(marker))) {
    return false;
  }
  try {
    const typesMtime = fs.statSync(routerTypes).mtimeMs;
    const newestAppFile = findNewestMtime(appDir);
    return newestAppFile <= typesMtime;
  } catch {
    return false;
  }
}

function findNewestMtime(dir) {
  let newest = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      newest = Math.max(newest, findNewestMtime(full));
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      newest = Math.max(newest, fs.statSync(full).mtimeMs);
    }
  }
  return newest;
}

function waitForTypes(timeoutMs = 60_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (typesLookCurrent()) {
        resolve();
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(
          new Error(
            "Timed out waiting for .expo/types/router.d.ts — run `npx expo start` once locally."
          )
        );
        return;
      }
      setTimeout(tick, 500);
    };
    tick();
  });
}

async function main() {
  if (typesLookCurrent()) {
    return;
  }

  console.log("▸ Regenerating Expo Router types (.expo/types/router.d.ts)...");

  fs.mkdirSync(path.dirname(routerTypes), { recursive: true });

  const child = spawn("npx", ["expo", "start", "--port", "19099"], {
    cwd: root,
    env: { ...process.env, CI: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stderr = "";
  child.stderr?.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForTypes();
  } finally {
    child.kill("SIGTERM");
  }

  if (!typesLookCurrent()) {
    if (stderr) console.error(stderr);
    throw new Error("Failed to regenerate Expo Router types.");
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
