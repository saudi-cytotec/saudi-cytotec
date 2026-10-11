/**
 * Generate Cloudflare Pages redirects from content/redirects.json.
 * This script deliberately does not read or recreate vercel.json.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(ROOT, "content", "redirects.json");
const OUTPUT_PATH = path.join(ROOT, "public", "_redirects");

function encodePath(source) {
  let out = "";
  for (const ch of source) {
    out += ch.codePointAt(0) > 127 ? encodeURIComponent(ch) : ch;
  }
  return out;
}

function validate(registry) {
  const problems = [];
  const sources = new Set();
  for (const rule of registry.rules || []) {
    if (!rule || typeof rule.source !== "string" || !rule.source) {
      problems.push("rule without a source");
      continue;
    }
    if (![301, 302, 303, 307, 308, 404, 410].includes(rule.statusCode)) {
      problems.push(`${rule.source}: unsupported statusCode ${rule.statusCode}`);
    }
    if ([301, 302, 303, 307, 308].includes(rule.statusCode) && !rule.destination) {
      problems.push(`${rule.source}: ${rule.statusCode} requires a destination`);
    }
    const key = encodePath(rule.source);
    if (sources.has(key)) problems.push(`${rule.source}: duplicate source`);
    sources.add(key);
  }
  return problems;
}

function main() {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  const problems = validate(registry);
  if (problems.length) {
    console.error("[redirects] aborting: " + problems.join("; "));
    process.exit(1);
  }

  const lines = [
    "# Generated from content/redirects.json for Cloudflare Pages.",
    "# Configure www-to-apex host canonicalization separately in Cloudflare.",
  ];
  let emitted = 0;
  let skipped = 0;

  for (const rule of registry.rules || []) {
    if ([301, 308].includes(rule.statusCode) && rule.destination) {
      // Cloudflare Pages _redirects supports path rules, not Vercel host conditions
      // or arbitrary regular expressions.
      if (rule.isRegex || rule.source.includes(":") || rule.source.includes("*")) {
        skipped++;
        continue;
      }
      lines.push(`${encodePath(rule.source)} ${rule.destination} ${rule.statusCode}`);
      emitted++;
    } else if ([404, 410].includes(rule.statusCode)) {
      // Static Pages redirects cannot set arbitrary 410 responses in this file.
      // Use the site's not-found page for retired URLs.
      lines.push(`${encodePath(rule.source)} /404 302`);
      emitted++;
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, lines.join("\n") + "\n");
  console.log(`[redirects] wrote ${emitted} Cloudflare Pages rules; skipped ${skipped} unsupported patterns (registry: ${(registry.rules || []).length})`);
}

main();
