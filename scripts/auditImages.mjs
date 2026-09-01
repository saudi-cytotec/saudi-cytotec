/**
 * auditImages — image-asset policy audit.
 *
 *   node scripts/auditImages.mjs
 *
 * Owner-approved policy (hard rules):
 *   1. The only PERMANENT assets under public/images/ are the owner-approved
 *      files (logo, homepage hero, article WhatsApp banner, social share). Admin-uploaded
 *      CMS media lives separately under public/media/ and is registered in
 *      content/media.json — every such file must be registered, and every
 *      registered file must exist.
 *   2. No image reference may point at any deleted/legacy asset
 *      (og-default.jpg, safety.jpg, hero.jpg, favicons, article-mark, etc.),
 *      and those files must never be recreated under any name.
 *   3. No default/fallback/auto-assignment image mechanism may exist for
 *      article fields (featured, thumbnail or banner). The sole exception is
 *      the explicitly approved global social-share image used by Seo.tsx for
 *      og:image/twitter:image metadata when no custom OG image is selected.
 *   4. Article data (committed JSON + static TS) may only reference an
 *      approved asset or a registered upload; absence of an image is valid.
 *   5. Every referenced image must exist on disk.
 *
 * Exit 1 on any violation.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const APPROVED = [
  "/images/لوجو.png",
  "/images/Bannerrr.png",
  "/images/saudiersaa-article-whatsapp-banner.png.png",
  // Owner-committed social-share asset (908813a, direct to main).
  "/images/saudiersaa-social-share.png",
];

/** Admin-uploaded CMS media: registered in content/media.json, served from /media/. */
const REGISTERED_UPLOADS = (() => {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "media.json"), "utf8"));
    return Array.isArray(parsed.items) ? parsed.items.map((i) => String(i && i.file)) : [];
  } catch {
    return [];
  }
})();

const isAllowedRef = (ref) => APPROVED.includes(ref) || REGISTERED_UPLOADS.includes(ref);

const failures = [];
const pass = (label, detail = "") => console.log(`  [PASS] ${label}${detail ? ` — ${detail}` : ""}`);
const fail = (label, detail = "") => {
  console.log(`  [FAIL] ${label}${detail ? ` — ${detail}` : ""}`);
  failures.push(label);
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist" || entry.name === ".next") continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const IMAGE_EXT = /\.(png|jpe?g|gif|svg|webp|avif|ico)$/i;
const IMAGE_PATH_RE = /\/images\/[^"')\s,;]+\.(?:png|jpe?g|gif|svg|webp|avif)/gi;
// Any /images/ or root image path (also matches Arabic/Unicode names).
const ANY_IMG_PATH_RE = /(?:^|["'`(])(\/(?:images\/|favicon|apple-touch-icon)[^"')\s,;]+\.(?:png|jpe?g|gif|svg|webp|avif|ico))/gi;

console.log("IMAGE ASSET AUDIT — saudiersaa.com\n");

// ------------------------------------------------- 1. only approved files exist
{
  const files = walk(path.join(ROOT, "public"))
    .map((f) => path.relative(ROOT, f).replace(/\\/g, "/"))
    .filter((f) => IMAGE_EXT.test(f));
  const permanent = files.filter((f) => !f.startsWith("public/media/"));
  const uploads = files.filter((f) => f.startsWith("public/media/"));
  const unapproved = permanent.filter((f) => !APPROVED.includes("/" + f.replace(/^public\//, "")));
  const onDisk = new Set(APPROVED.filter((a) => fs.existsSync(path.join(ROOT, "public", a.replace(/^\//, "")))));
  pass(
    "Approved asset files exist",
    `${onDisk.size}/${APPROVED.length} exist (${APPROVED.filter((a) => onDisk.has(a)).join(", ")})`,
  );
  if (onDisk.size !== APPROVED.length) {
    fail(`All ${APPROVED.length} approved asset files exist`, `missing: ${APPROVED.filter((a) => !onDisk.has(a)).join(", ")}`);
  }
  if (unapproved.length === 0) {
    pass("Only approved permanent image files in public/images", `${permanent.length} files, all approved`);
  } else {
    fail("Only approved permanent image files in public/images", `${unapproved.length} extra: ${unapproved.join(", ")}`);
  }
  if (permanent.length > APPROVED.length) {
    fail(`Permanent image file count = ${APPROVED.length}`, `found ${permanent.length}`);
  } else {
    pass(`Permanent image file count = ${APPROVED.length}`, `${permanent.length} files`);
  }

  // Uploaded CMS media must be exactly what the registry says it is.
  const uploadPaths = uploads.map((f) => "/" + f.replace(/^public\//, ""));
  const unregistered = uploadPaths.filter((f) => !REGISTERED_UPLOADS.includes(f));
  const missingUploads = REGISTERED_UPLOADS.filter((f) => !uploadPaths.includes(f));
  if (!unregistered.length && !missingUploads.length) {
    pass("Uploaded media matches its registry", `${uploadPaths.length} uploads, all registered and present`);
  } else {
    if (unregistered.length) fail("Every uploaded file is registered", unregistered.join(", "));
    if (missingUploads.length) fail("Every registered upload exists on disk", missingUploads.join(", "));
  }
}

// ------------------------------------------------- 2. no forbidden tokens in code
{
  // Source/config only (scripts are tooling that legitimately reference legacy
  // names inside their own assertions, so they are excluded).
  const searchable = ["src", "api", "content"];
  const forbiddenTokens = [
    /og-default/i,
    /defaultImage/i,
    /fallbackImage/i,
    /CLUSTER_IMAGE/i,
    /imageMap/i,
    /images\/uploads\//i,
    /favicon/i,
    /apple-touch-icon/i,
    /article-mark/i,
    /hero-doctor/i,
    /\/images\/hero\./i,
    /\/images\/safety\./i,
    /\/images\/sources\./i,
    /\/images\/emergency\./i,
    /\/images\/womens-health\./i,
    /\/images\/whatsapp-consult\./i,
    /\/images\/logo\.png/i,
  ];
  // Ignore comment lines; only code/JSON values count.
  const isComment = (line) =>
    /^\s*(?:\/\/|\*|\/\*|#|<!--)/.test(line) || /^\s*$/.test(line);
  const hits = [];
  for (const dir of searchable) {
    const base = path.join(ROOT, dir);
    if (!fs.existsSync(base)) continue;
    for (const file of walk(base)) {
      if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(file)) continue;
      const text = fs.readFileSync(file, "utf8");
      for (const line of text.split("\n")) {
        if (isComment(line)) continue;
        for (const re of forbiddenTokens) {
          const m = line.match(re);
          if (m) hits.push(`${path.relative(ROOT, file)}: ${m[0]}`);
        }
      }
    }
  }
  // index.html carries real markup; HTML comments are stripped before scanning.
  for (const extra of [path.join(ROOT, "index.html"), path.join(ROOT, "vercel.json"), path.join(ROOT, "package.json")]) {
    if (!fs.existsSync(extra)) continue;
    const text = fs.readFileSync(extra, "utf8").replace(/<!--[\s\S]*?-->/g, "");
    for (const line of text.split("\n")) {
      if (isComment(line)) continue;
      for (const re of forbiddenTokens) {
        const m = line.match(re);
        if (m) hits.push(`${path.relative(ROOT, extra)}: ${m[0]}`);
      }
    }
  }
  if (hits.length === 0) {
    pass("No forbidden image tokens in code/content", "legacy/generated article assets: none");
  } else {
    fail("No forbidden image tokens in code/content", hits.slice(0, 10).join(" | "));
  }

  const seoPath = path.join(ROOT, "src", "components", "Seo.tsx");
  const seoSource = fs.readFileSync(seoPath, "utf8");
  const globalFallbackIsMetadataOnly =
    seoSource.includes("GLOBAL_SOCIAL_SHARE_IMAGE") &&
    seoSource.includes("og:image") &&
    seoSource.includes("twitter:image") &&
    !seoSource.includes("article.image") &&
    !seoSource.includes("article.thumbnail");
  globalFallbackIsMetadataOnly
    ? pass("Global social-share fallback is metadata-only", "custom OG image takes priority; article fields are not consulted")
    : fail("Global social-share fallback is metadata-only", "Seo.tsx fallback policy is missing or reads an article image field");
}

// ------------------------------------------------- 3. every referenced image is approved + exists
{
  const sources = [];
  const addFile = (p) => {
    if (fs.existsSync(p)) sources.push({ path: p, text: fs.readFileSync(p, "utf8") });
  };
  addFile(path.join(ROOT, "dist", "index.html"));
  addFile(path.join(ROOT, "src", "data", "media.ts"));
  for (const dir of ["src", "content", "public"]) {
    for (const f of walk(path.join(ROOT, dir))) {
      if (/\.(tsx?|jsx?|mjs|json|html|md)$/.test(f)) addFile(f);
    }
  }

  const refs = new Set();
  const badRefs = [];
  for (const { path: p, text } of sources) {
    for (const m of text.matchAll(ANY_IMG_PATH_RE)) {
      const ref = m[1];
      const norm = ref.startsWith("/") ? ref : "/" + ref;
      // Normalize URL-encoded unicode to the literal file path.
      const decoded = decodeURIComponent(norm);
      if (!isAllowedRef(decoded)) badRefs.push(`${path.relative(ROOT, p)}: ${decoded}`);
      else refs.add(decoded);
    }
  }
  const uniqueBad = [...new Set(badRefs)];
  if (uniqueBad.length === 0) {
    pass("All image references allowed", `${refs.size} unique references (approved assets + registered uploads)`);
  } else {
    fail("All image references allowed", `${uniqueBad.length}: ${uniqueBad.slice(0, 8).join(" | ")}`);
  }
  const missingApproved = [...refs].filter((r) => !fs.existsSync(path.join(ROOT, "public", r.replace(/^\//, ""))));
  if (missingApproved.length === 0) {
    pass("References exist on disk", `${refs.size} references resolve`);
  } else {
    fail("References exist on disk", missingApproved.join(", "));
  }
}

// ------------------------------------------------- 4. article image values are approved-only
{
  // Path fields: any non-empty value must be one of the approved assets.
  // "No selected image" (absent or "") is a fully valid state. Alt fields are
  // free text and only matter when a path is actually set.
  const PATH_KEYS = ["image", "thumbnail", "bannerImage", "ogImage"];
  const publishedDir = path.join(ROOT, "content", "published");
  let files = 0;
  let withImage = 0;
  const offenders = [];
  for (const f of fs.readdirSync(publishedDir).filter((x) => x.endsWith(".json"))) {
    files++;
    const a = JSON.parse(fs.readFileSync(path.join(publishedDir, f), "utf8"));
    for (const key of PATH_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(a, key)) continue;
      const value = String(a[key] ?? "").trim();
      if (!value) continue; // explicitly no selected image — valid
      if (!isAllowedRef(value)) withImage++, offenders.push(`${a.slug || f}:${key}=${value}`);
    }
  }
  if (withImage === 0) {
    pass("Published article image values are allowed-only", `${files} JSON files, 0 disallowed image paths`);
  } else {
    fail("Published article image values are allowed-only", `${withImage}: ${offenders.slice(0, 5).join(", ")}`);
  }

  // Static TS articles must not invent images either.
  const staticDir = path.join(ROOT, "src", "data", "articles");
  let staticHits = [];
  for (const f of fs.readdirSync(staticDir).filter((x) => x.endsWith(".ts"))) {
    const text = fs.readFileSync(path.join(staticDir, f), "utf8");
    if (/image:\s*["']\/images\//.test(text) || /imageAlt:\s*["']/.test(text)) {
      staticHits.push(f);
    }
  }
  if (staticHits.length === 0) {
    pass("Static article data has no assigned images", "no image/imageAlt fields in src/data/articles");
  } else {
    fail("Static article data has no assigned images", staticHits.join(", "));
  }
}

console.log(
  failures.length
    ? `\nIMAGE AUDIT: FAIL — ${failures.length}: ${failures.join(" | ")}`
    : `\nIMAGE AUDIT: PASS — ${APPROVED.length} approved permanent assets + ${REGISTERED_UPLOADS.length} registered upload(s); every reference resolves`,
);
process.exit(failures.length ? 1 : 0);
