/**
 * stampBuild — injects a build marker into dist/index.html so a deployment
 * can be verified live: every deploy carries its commit sha + build time,
 * visible at <meta name="build" ...> in production HTML.
 *
 * Usage: node scripts/stampBuild.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HTML = path.join(ROOT, "dist", "index.html");

let sha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || "";
if (!sha) {
  try {
    sha = execSync("git rev-parse HEAD", { cwd: ROOT }).toString().trim().slice(0, 7);
  } catch {
    sha = "unknown";
  }
}
const stamp = `saudiersaa:${sha}:${new Date().toISOString().replace(/[:.]/g, "-")}`;

const html = fs.readFileSync(HTML, "utf8");
const marker = `<meta name="build" content="${stamp}">`;
if (html.includes('name="build"')) {
  fs.writeFileSync(HTML, html.replace(/<meta name="build" content="[^"]*">/, marker));
} else {
  fs.writeFileSync(HTML, html.replace("</head>", `  ${marker}\n  </head>`));
}
console.log(`[build] stamped ${marker}`);
