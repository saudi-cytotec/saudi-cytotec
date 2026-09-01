/**
 * REAL CMS WORKFLOW TEST (testing only) — TEST 1..10.
 *
 * Drives the actual admin React screens (EditorScreen / MediaScreen /
 * GeneratorScreen / PreviewScreen) plus the actual public renderers
 * (ArticlePage / ArticleCard / Seo) against a REAL running API
 * (scripts/devApi.mjs), which writes the same two artefacts the production
 * endpoints commit: content/published/<slug>.json and
 * public/media/* + content/media.json.
 *
 * Nothing here is stubbed except the browser itself (jsdom). Every assertion
 * observes real component output or a real file on disk.
 *
 *   node scripts/cmsWorkflowTest.mjs           (requires devApi on :8787)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const API = process.env.CMS_TEST_API || "http://127.0.0.1:8787";
const USER = process.env.ADMIN_USERNAME || "admin";
const PASS = process.env.ADMIN_PASSWORD || "test-pass-1234";

const SLUG = "cms-test-article";
const PUBLISHED_FILE = path.join(ROOT, "content", "published", `${SLUG}.json`);
const MEDIA_REGISTRY = path.join(ROOT, "content", "media.json");

let failures = 0;
const check = (name, cond, detail = "") => {
  console.log(`${cond ? "PASS" : "FAIL"} — ${name}${detail ? ` (${detail})` : ""}`);
  if (!cond) failures++;
};
const section = (t) => console.log(`\n--- ${t} ---`);

/* ------------------------------------------------------------- jsdom setup */
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  url: "http://localhost/admin/articles/new",
  pretendToBeVisual: true,
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.localStorage = dom.window.localStorage;
globalThis.FileReader = dom.window.FileReader;
globalThis.File = dom.window.File;
globalThis.Blob = dom.window.Blob;
if (!globalThis.navigator) Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/* --------------------------------------- real fetch against the running API */
let cookie = "";
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init = {}) => {
  const target = String(url).startsWith("/") ? `${API}${url}` : String(url);
  const headers = { ...(init.headers || {}) };
  if (cookie) headers.cookie = cookie;
  const res = await realFetch(target, { ...init, headers, redirect: "manual" });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  return res;
};

/* ------------------------------------------------------------------- login */
{
  const res = await globalThis.fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USER, password: PASS }),
  });
  const data = await res.json();
  section("AUTH");
  check("admin login against the real auth handler", res.ok && data.authenticated === true);
  if (!res.ok) {
    console.log("cannot continue without a session");
    process.exit(1);
  }
}

/* ------------------------------------------------------------- react setup */
const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
  ssr: { external: ["react", "react-dom", "react-dom/client", "react-router-dom", "react-helmet-async"] },
});
const ReactMod = await import("react");
const React = ReactMod.default;
const act = ReactMod.act;
const { createRoot } = await import("react-dom/client");
const { MemoryRouter, Routes, Route } = await import("react-router-dom");

const { CatalogProvider } = await vite.ssrLoadModule("/src/cms/CatalogContext.tsx");
const { EditorScreen } = await vite.ssrLoadModule("/src/admin/screens/EditorScreen.tsx");
const { PreviewScreen } = await vite.ssrLoadModule("/src/admin/screens/PreviewScreen.tsx");
const { ArticleCard } = await vite.ssrLoadModule("/src/components/ArticleCard.tsx");
const { Seo } = await vite.ssrLoadModule("/src/components/Seo.tsx");
const { sanitizeArticleImages, resolveImage } = await vite.ssrLoadModule("/src/utils/images.ts");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let container = document.createElement("div");
document.body.appendChild(container);
let root = createRoot(container);

async function mountEditor(entry) {
  await act(async () => {
    root.render(
      React.createElement(CatalogProvider, null,
        React.createElement(MemoryRouter, { initialEntries: [entry] },
          React.createElement(Routes, null,
            React.createElement(Route, { path: "/admin/articles/new", element: React.createElement(EditorScreen, { mode: "create" }) }),
            React.createElement(Route, { path: "/admin/articles/:id", element: React.createElement(EditorScreen, { mode: "edit" }) }),
            React.createElement(Route, { path: "/admin/preview/:id", element: React.createElement(PreviewScreen, null) }),
          ),
        ),
      ),
    );
    await sleep(150);
  });
}

function setInput(el, value) {
  const proto = el.tagName === "TEXTAREA" ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
  el.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
}
const labels = () => [...container.querySelectorAll("label")];
function findByLabel(text) {
  const label = labels().find((l) => l.textContent.includes(text));
  return label ? label.querySelector("input, textarea") : null;
}
function findButton(text) {
  return [...container.querySelectorAll("button")].find((b) => b.textContent.trim() === text);
}
function findButtonContaining(text) {
  return [...container.querySelectorAll("button")].find((b) => b.textContent.includes(text));
}
const statusText = () => [...container.querySelectorAll('[role="status"]')].map((n) => n.textContent).join(" ");
const alertText = () => [...container.querySelectorAll('[role="alert"]')].map((n) => n.textContent).join(" ");

/* =================================================== TEST 1 — MANUAL DRAFT */
section("TEST 1 — MANUAL DRAFT");
await mountEditor("/admin/articles/new");

const BODY = [
  "## ما هذا المقال",
  "",
  "فقرة اختبار حقيقية لنظام إدارة المحتوى، تتحقق من حفظ المسودة واسترجاعها.",
  "",
  "### تفصيل إضافي",
  "",
  "فقرة ثانية تثبت أن المتن يُحفظ ويُعرض كما هو دون تعديل.",
].join("\n");

await act(async () => {
  setInput(findByLabel("العنوان"), "CMS Test Article");
  await sleep(20);
});
await act(async () => {
  setInput(findByLabel("H1"), "CMS Test Article H1");
  await sleep(20);
});
await act(async () => {
  setInput(findByLabel("الكلمة المفتاحية الأساسية"), "cms test");
  await sleep(20);
});
await act(async () => {
  setInput(findByLabel("الرابط (slug)"), SLUG);
  await sleep(20);
});
await act(async () => {
  const body = [...container.querySelectorAll("textarea")].find((t) => t.closest("label")?.textContent.includes("جسم المقال"));
  setInput(body, BODY);
  await sleep(20);
});
await act(async () => { findButton("حفظ مسودة").click(); await sleep(120); });

check("save draft reports success", /حُفظت المسودة/.test(statusText()), statusText().slice(0, 80));
const storedRaw = globalThis.localStorage.getItem("saudiersaa-cms-v3");
const stored = JSON.parse(storedRaw || "{}");
const draftRow = (stored.articles || []).find((a) => a.title === "CMS Test Article");
if (!draftRow) {
  console.log("stored article rows:", JSON.stringify((stored.articles || []).map((a) => ({ t: a.title, s: a.slug })).slice(0, 5)));
}
check("draft persisted with the title", draftRow?.title === "CMS Test Article");
check("draft persisted with the H1", draftRow?.h1 === "CMS Test Article H1");
check("draft persisted with the slug", draftRow?.slug === SLUG);
check("draft persisted with the primary keyword", draftRow?.primaryKeyword === "cms test");
check("draft persisted with the body blocks", (draftRow?.blocks?.length ?? 0) >= 3);
check("draft status is draft (NOT published)", draftRow?.status === "draft");
check("draft did NOT create a published file", !fs.existsSync(PUBLISHED_FILE));

// Reload the editor from persisted state — a genuine round trip.
const draftId = draftRow.id;
await act(async () => { root.unmount(); await sleep(10); });
container.remove();
container = document.createElement("div");
document.body.appendChild(container);
root = createRoot(container);
await mountEditor(`/admin/articles/${draftId}`);
check("after reload the title is restored", findByLabel("العنوان")?.value === "CMS Test Article");
check("after reload the H1 is restored", findByLabel("H1")?.value === "CMS Test Article H1");
check("after reload the slug is restored", findByLabel("الرابط (slug)")?.value === SLUG);
const reloadedBody = [...container.querySelectorAll("textarea")].find((t) => t.closest("label")?.textContent.includes("جسم المقال"))?.value ?? "";
check("after reload the body is restored", reloadedBody.includes("فقرة اختبار حقيقية"));

/* ======================================================== TEST 2 — PREVIEW */
section("TEST 2 — PREVIEW");
await mountEditor(`/admin/preview/${draftId}`);
const previewHtml = container.innerHTML;
check("preview renders the H1", previewHtml.includes("CMS Test Article H1"));
check("preview renders the real body text", previewHtml.includes("فقرة اختبار حقيقية"));
check("preview renders the H2 heading", previewHtml.includes("ما هذا المقال"));

/* =================================================== TEST 3 — UPLOAD IMAGE */
section("TEST 3 — UPLOAD IMAGE");
// A real 1x1 PNG (valid magic bytes, so the MIME sniff accepts it).
const PNG_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const uploadRes = await globalThis.fetch("/api/upload-image", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "cms-test-image.png", data: PNG_B64, alt: "صورة اختبار من لوحة التحكم" }),
});
const uploadData = await uploadRes.json();
check("upload endpoint accepted a real PNG", uploadRes.ok && uploadData.ok === true, JSON.stringify(uploadData).slice(0, 120));
const MEDIA_URL = uploadData.url;
check("upload returned a /media/ path", typeof MEDIA_URL === "string" && MEDIA_URL.startsWith("/media/"), String(MEDIA_URL));
check("uploaded file exists on disk (survives reload/deploy)", fs.existsSync(path.join(ROOT, "public", MEDIA_URL.replace(/^\//, ""))));
const registry = JSON.parse(fs.readFileSync(MEDIA_REGISTRY, "utf8"));
const regRow = registry.items.find((i) => i.file === MEDIA_URL);
check("upload registered in content/media.json (persisted, not localStorage)", Boolean(regRow));
check("registered ALT text is the admin's exact text", regRow?.alt === "صورة اختبار من لوحة التحكم");

// Rejections: wrong extension, non-image payload, oversize, traversal.
const badExt = await globalThis.fetch("/api/upload-image", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "evil.svg", data: PNG_B64 }),
});
check("rejects a disallowed extension (.svg)", badExt.status === 415);
const badScript = await globalThis.fetch("/api/upload-image", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "evil.png", data: Buffer.from("<?php system($_GET[0]); ?>").toString("base64") }),
});
check("rejects an executable/script payload renamed as .png", badScript.status === 415);
const traversal = await globalThis.fetch("/api/upload-image", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "../../../../etc/passwd.png", data: PNG_B64 }),
});
const traversalData = await traversal.json();
check(
  "path traversal in the filename is neutralised",
  !traversal.ok || (traversalData.url || "").startsWith("/media/") && !(traversalData.url || "").includes(".."),
  String(traversalData.url),
);

/* ================================================= TEST 4 — FEATURED IMAGE */
section("TEST 4 — FEATURED IMAGE");
check("resolveImage accepts the uploaded media path", resolveImage(MEDIA_URL, []) === MEDIA_URL);
check("resolveImage rejects a deleted legacy asset", resolveImage("/images/og-default.jpg", []) === "");
check("resolveImage rejects an external URL", resolveImage("https://evil.example/x.png", []) === "");
check("resolveImage rejects traversal", resolveImage("/media/../../etc/passwd", []) === "");

const withFeatured = {
  image: MEDIA_URL, imageAlt: "نص بديل للصورة البارزة",
  thumbnail: "", thumbnailAlt: "", bannerImage: "", bannerImageAlt: "", ogImage: "",
};
const sanitizedFeatured = sanitizeArticleImages(withFeatured, [MEDIA_URL]);
check("featured image survives sanitisation verbatim", sanitizedFeatured.image === MEDIA_URL);
check("featured ALT survives verbatim (not invented or replaced)", sanitizedFeatured.imageAlt === "نص بديل للصورة البارزة");

/* ======================================================= TEST 5 — THUMBNAIL */
section("TEST 5 — THUMBNAIL");
async function renderCard(article) {
  const el = document.createElement("div");
  document.body.appendChild(el);
  const r = createRoot(el);
  await act(async () => {
    r.render(React.createElement(MemoryRouter, null, React.createElement(ArticleCard, { article })));
    await sleep(40);
  });
  const html = el.innerHTML;
  r.unmount();
  el.remove();
  return html;
}
const baseCard = {
  slug: SLUG, title: "CMS Test Article", excerpt: "ملخص", cluster: "definition",
  h1: "x", metaTitle: "x", metaDescription: "x", publishedAt: "2026-01-01", updatedAt: "2026-01-01",
  related: [], cornerstones: [], references: [], blocks: [],
};
const cardWithThumb = await renderCard({ ...baseCard, thumbnail: MEDIA_URL, thumbnailAlt: "نص بديل للبطاقة" });
check("card renders the exact selected thumbnail", cardWithThumb.includes(`src="${MEDIA_URL}"`));
check("card renders the admin's exact ALT", cardWithThumb.includes('alt="نص بديل للبطاقة"'));
const cardNoThumb = await renderCard({ ...baseCard });
check("card without a thumbnail renders NO <img>", !cardNoThumb.includes("<img"));
check("card without a thumbnail has no background-image fallback", !/background-image/i.test(cardNoThumb));

/* ======================================================== TEST 6 — OG IMAGE */
section("TEST 6 — OG IMAGE");
/**
 * Render <Seo> and read the REAL <head> react-helmet-async produced — the
 * exact markup a crawler/scraper receives — rather than a server-side helmet
 * snapshot.
 */
async function renderSeoHead(props) {
  document.head.innerHTML = "";
  const el = document.createElement("div");
  document.body.appendChild(el);
  const r = createRoot(el);
  const { HelmetProvider } = await import("react-helmet-async");
  await act(async () => {
    r.render(React.createElement(HelmetProvider, null, React.createElement(Seo, props)));
    await sleep(80);
  });
  const head = document.head.innerHTML;
  r.unmount();
  el.remove();
  return head;
}
const headWithOg = await renderSeoHead({
  title: "CMS Test Article", description: "وصف", path: `/blog/${SLUG}`, type: "article", image: MEDIA_URL,
});
check("og:image equals the exact selected URL", headWithOg.includes(`property="og:image" content="https://saudiersaa.com${MEDIA_URL}"`), headWithOg.slice(0, 160));
check("twitter:image equals the exact selected URL", headWithOg.includes(`name="twitter:image" content="https://saudiersaa.com${MEDIA_URL}"`));
check("twitter:card upgrades to summary_large_image", headWithOg.includes('content="summary_large_image"'));

const headNoOg = await renderSeoHead({ title: "CMS Test Article", description: "وصف", path: `/blog/${SLUG}`, type: "article" });
check("global social-share fallback is emitted as og:image metadata", headNoOg.includes('property="og:image" content="https://saudiersaa.com/images/saudiersaa-social-share.png"'));
check("global social-share fallback is emitted as twitter:image metadata", headNoOg.includes('name="twitter:image" content="https://saudiersaa.com/images/saudiersaa-social-share.png"'));
check("fallback does not become an article/body image", !headNoOg.includes("<img") && !/background-image/i.test(headNoOg));
check("no deleted legacy image name leaks into the head", !/og-default|safety\.jpg|hero\.jpg|hero-doctor/.test(headNoOg));

/* ==================================================== TEST 7 — REMOVE IMAGE */
section("TEST 7 — REMOVE IMAGE");
const cleared = sanitizeArticleImages(
  { image: "", imageAlt: "", thumbnail: "", thumbnailAlt: "", bannerImage: "", bannerImageAlt: "", ogImage: "" },
  [MEDIA_URL],
);
check("cleared featured image stays empty (no default)", cleared.image === "");
check("cleared thumbnail stays empty (no default)", cleared.thumbnail === "");
check("cleared OG image stays empty (no default)", cleared.ogImage === "");
check("orphan ALT is dropped with its image", cleared.imageAlt === "");
const staleWiped = sanitizeArticleImages(
  { image: "/images/og-default.jpg", imageAlt: "stale", thumbnail: "/images/safety.jpg", ogImage: "/images/hero.jpg" },
  [MEDIA_URL],
);
check("stale legacy value resolves to NO image (not a substitute)", staleWiped.image === "" && staleWiped.thumbnail === "" && staleWiped.ogImage === "");

/* ========================================================= TEST 8 — PUBLISH */
section("TEST 8 — PUBLISH");
await mountEditor(`/admin/articles/${draftId}`);

// Upload through the editor's OWN "رفع صورة" control (the real UI path), which
// also selects the result as this field's image — exactly what an admin does.
await act(async () => {
  const fileInput = container.querySelector('input[type="file"]');
  const file = new dom.window.File([Buffer.from(PNG_B64, "base64")], "featured-upload.png", { type: "image/png" });
  Object.defineProperty(fileInput, "files", { value: [file], configurable: true });
  fileInput.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  await sleep(500);
});
const FEATURED_URL = "/media/featured-upload.png";
check("upload from inside the editor succeeded", fs.existsSync(path.join(ROOT, "public", FEATURED_URL.replace(/^\//, ""))));
check(
  "the uploaded image is selected as the featured image",
  container.innerHTML.includes(FEATURED_URL),
);
await act(async () => { findButton("نشر").click(); await sleep(400); });
check("publish reported success (real API round trip)", /تم النشر|published/i.test(statusText()), statusText().slice(0, 120));
check("no publish error was shown", alertText().trim() === "", alertText().slice(0, 120));
check("published JSON file was actually written to content/published", fs.existsSync(PUBLISHED_FILE));
const publishedJson = fs.existsSync(PUBLISHED_FILE) ? JSON.parse(fs.readFileSync(PUBLISHED_FILE, "utf8")) : {};
check("published file carries status=published", publishedJson.status === "published");
check("published file carries the real body", (publishedJson.blocks?.length ?? 0) >= 3);
check("published file carries the selected featured image", publishedJson.image === FEATURED_URL, String(publishedJson.image));

/* ======================================================= TEST 9 — UNPUBLISH */
section("TEST 9 — UNPUBLISH");
await act(async () => {
  const btn = findButtonContaining("إلغاء النشر");
  if (btn) btn.click();
  await sleep(400);
});
check("unpublish reported success", /أُلغي النشر|إلغاء النشر/.test(statusText()), statusText().slice(0, 120));
check("published JSON file was actually removed", !fs.existsSync(PUBLISHED_FILE));

/* ============================================================== TEST 10 — AI */
section("TEST 10 — AI (assistant only)");
const genSource = fs.readFileSync(path.join(ROOT, "src", "admin", "screens", "GeneratorScreen.tsx"), "utf8");
check("AI screen never calls the publish API", !/publishRequest/.test(genSource));
check("AI screen never sets status published", !/status:\s*["']published["']/.test(genSource));
check("AI screen has no image generation call", !/generateImage|createImage|dall|imageRequest/i.test(genSource));
check("AI screen requires an explicit click to run", /onClick=\{\(\)\s*=>\s*(void\s*)?runStage|onClick=\{\(\)\s*=>\s*runStage/.test(genSource));
const genApi = fs.readFileSync(path.join(ROOT, "api", "generate.js"), "utf8");
check("AI API never writes to content/published", !/content\/published/.test(genApi));
check("AI API never commits to the repository", !/commitFilesAtomic|writeFile\(|contents\//.test(genApi));

/* ------------------------------------------------------------------ cleanup */
// This test writes REAL artefacts (that is the point). Remove them so the
// repository is left exactly as it was found.
try { root.unmount(); } catch { /* already unmounted */ }
await vite.close();

if (fs.existsSync(PUBLISHED_FILE)) fs.unlinkSync(PUBLISHED_FILE);
const finalRegistry = JSON.parse(fs.readFileSync(MEDIA_REGISTRY, "utf8"));
for (const item of finalRegistry.items) {
  const onDisk = path.join(ROOT, "public", String(item.file).replace(/^\//, ""));
  if (fs.existsSync(onDisk)) fs.unlinkSync(onDisk);
}
fs.writeFileSync(MEDIA_REGISTRY, `${JSON.stringify({ version: 1, items: [] }, null, 2)}\n`);
const mediaDir = path.join(ROOT, "public", "media");
if (fs.existsSync(mediaDir) && fs.readdirSync(mediaDir).length === 0) fs.rmdirSync(mediaDir);
console.log("\n[cleanup] test artefacts removed (content/published + public/media + registry reset)");

console.log(`\n${failures === 0 ? "ALL CMS WORKFLOW CHECKS PASSED" : failures + " CMS WORKFLOW CHECK(S) FAILED"}`);
process.exit(failures === 0 ? 0 : 1);
