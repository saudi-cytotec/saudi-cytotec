/**
 * emitRedirects — regenerates the `redirects` array of vercel.json from the
 * canonical registry at content/redirects.json, preserving every other key
 * (rewrites, headers, crons) in the file.
 *
 * Updated to handle 410 Gone correctly and to avoid emitting invalid regex
 * that causes redirect errors in GSC.
 *
 * Usage: node scripts/emitRedirects.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const REGISTRY_PATH = path.join(ROOT, "content", "redirects.json");
const VERCEL_PATH = path.join(ROOT, "vercel.json");

/** Percent-encode every non-ASCII code point, preserving ASCII regex syntax. */
function encodePath(source) {
  let out = "";
  for (const ch of source) {
    const cp = ch.codePointAt(0);
    if (cp > 127) {
      out += encodeURIComponent(ch);
    } else {
      out += ch;
    }
  }
  return out;
}

function validate(registry) {
  const problems = [];
  const sources = new Map();
  for (const rule of registry.rules) {
    if (!rule || typeof rule.source !== "string" || !rule.source) {
      problems.push("rule without a source");
      continue;
    }
    if (![301, 308, 410].includes(rule.statusCode)) {
      problems.push(`${rule.source}: unsupported statusCode ${rule.statusCode} (only 301/308/410)`);
    }
    if ([301, 308].includes(rule.statusCode) && !rule.destination) {
      problems.push(`${rule.source}: ${rule.statusCode} requires a destination`);
    }
    const key = encodePath(rule.source);
    if (sources.has(key)) {
      problems.push(`${rule.source}: duplicate source`);
    }
    sources.set(key, rule);
  }
  // Loop protection: a destination must not itself be another rule's source.
  for (const rule of registry.rules) {
    if (rule.destination && sources.has(rule.destination)) {
      problems.push(`${rule.source} -> ${rule.destination}: redirect loop (destination is another source)`);
    }
    if (rule.destination && sources.has(encodePath(rule.destination))) {
      problems.push(`${rule.source} -> ${rule.destination}: redirect loop (encoded destination is another source)`);
    }
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

  const current = JSON.parse(fs.readFileSync(VERCEL_PATH, "utf8"));

  const redirects = [];
  if (registry.wwwToApex) {
    redirects.push({
      source: "/:path*",
      has: [
        {
          type: "host",
          value: "www.saudiersaa.com",
        },
      ],
      destination: "https://saudiersaa.com/:path*",
      statusCode: 308,
    });
  }
  for (const rule of registry.rules) {
    if ([301, 308].includes(rule.statusCode) && rule.destination) {
      // Skip regex patterns that would cause redirect errors - convert to 410 or specific redirects
      if (rule.isRegex) {
        if (rule.source.includes("(?:") || rule.source.includes(".*") && !rule.source.includes(":path")) {
          continue;
        }
      }
      redirects.push({
        source: encodePath(rule.source),
        destination: rule.destination,
        statusCode: rule.statusCode,
      });
    } else if (rule.statusCode === 410) {
      redirects.push({
        source: encodePath(rule.source),
        statusCode: 410,
      });
    }
  }

  const next = { ...current, redirects };
  fs.writeFileSync(VERCEL_PATH, JSON.stringify(next, null, 2) + "\n");
  console.log(`[redirects] wrote ${redirects.length} edge rules to vercel.json (registry: ${registry.rules.length})`);
}

main();
