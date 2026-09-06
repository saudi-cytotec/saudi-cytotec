/**
 * Verify the four Phase 3 cornerstones against the actual production bundle.
 *
 * npm run build && npm run test:countries
 *
 * Optional, stronger stable-main regression checks:
 * PHASE3_BASE_REF=main PHASE3_BASELINE_DIR=node_modules/.cache/phase3 npm run test:countries
 * The baseline directory contains stable-index.html and stable-seo-manifest.json
 * captured BEFORE implementation. It is ignored scratch space, not a fixture to
 * regenerate from a changed homepage. No requests to production are made here.
 *
 * Each page is mounted in an isolated Node/jsdom process, using the FULL built
 * HTML shell (not an empty head). This catches duplicate fallback canonicals and
 * metadata that an empty-DOM Helmet test would miss. No network is required.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { JSDOM, VirtualConsole } from "jsdom";

const SCRIPT = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(SCRIPT), "..");
const SCRATCH = path.join(ROOT, "node_modules", ".cache", "phase3-verification");
const DOMAIN = "https://saudiersaa.com";
const EXPECTED = {
  "/abortion-pills-saudi-arabia": { code: "SA", name: "السعودية", faqs: 12, phone: "997", localHosts: ["moh.gov.sa", "sfda.gov.sa", "srca.org.sa"] },
  "/abortion-pills-uae": { code: "AE", name: "الإمارات", faqs: 10, phone: "998", localHosts: ["ede.gov.ae", "uaelegislation.gov.ae", "u.ae"] },
  "/abortion-pills-kuwait": { code: "KW", name: "الكويت", faqs: 10, phone: "112", localHosts: ["moh.gov.kw", "e.gov.kw"] },
  "/abortion-pills-bahrain": { code: "BH", name: "البحرين", faqs: 10, phone: "999", localHosts: ["moh.gov.bh", "nhra.bh", "bahrain.bh"] },
};
const normal = (text) => String(text ?? "").replace(/\s+/g, " ").trim();
const sha = (value) => crypto.createHash("sha256").update(value).digest("hex");
const read = (file) => fs.readFileSync(path.resolve(ROOT, file), "utf8");
const onHost = (url, hosts) => hosts.some((host) => new URL(url).hostname === host || new URL(url).hostname.endsWith(`.${host}`));

async function renderWorker(htmlFile, pathname, navigation = []) {
  const html = fs.readFileSync(htmlFile, "utf8");
  const modules = [...html.matchAll(/<script\b[^>]*type="module"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!modules.length) throw new Error("No inlined production module found; build first.");
  fs.mkdirSync(SCRATCH, { recursive: true });
  const modulePath = path.join(SCRATCH, `${sha(html).slice(0, 16)}.mjs`);
  if (!fs.existsSync(modulePath)) fs.writeFileSync(modulePath, modules.join("\n"));
  const errors = [];
  const console = new VirtualConsole();
  console.on("jsdomError", (error) => {
    // jsdom is not a visual CSS engine; ignore only its modern-CSS parser limit.
    if (error.type !== "css-parsing") errors.push(error.message);
  });
  const dom = new JSDOM(html.replace(/<script\b[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g, ""), {
    url: DOMAIN + pathname,
    pretendToBeVisual: true,
    runScripts: "outside-only",
    virtualConsole: console,
  });
  const { window } = dom;
  for (const name of [
    "window", "document", "navigator", "location", "history", "localStorage", "sessionStorage",
    "HTMLElement", "HTMLInputElement", "HTMLAnchorElement", "Element", "Node", "DocumentFragment",
    "Text", "Comment", "Event", "CustomEvent", "EventTarget", "MutationObserver", "DOMParser",
    "Image", "URL", "URLSearchParams",
  ]) {
    if (window[name] !== undefined) Object.defineProperty(globalThis, name, { value: window[name], configurable: true, writable: true });
  }
  globalThis.getComputedStyle = window.getComputedStyle.bind(window);
  globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  window.scrollTo = () => {};
  window.fetch = globalThis.fetch = () => Promise.reject(new TypeError("network disabled in country verification"));
  async function waitForRender(route) {
    let previous = "";
    let stable = 0;
    const deadline = Date.now() + 15000;
    while (Date.now() < deadline) {
      const current = window.document.getElementById("root")?.innerHTML ?? "";
      if (current.length > 1000 && current === previous && window.document.querySelector("h1")) stable++;
      else stable = 0;
      if (stable >= 3) return;
      previous = current;
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    throw new Error(`Render did not settle: ${route}`);
  }
  await import(pathToFileURL(modulePath).href);
  await waitForRender(pathname);
  const initialHtml = dom.serialize();
  const snapshots = [];
  for (const route of navigation) {
    window.history.pushState({}, "", route);
    window.dispatchEvent(new window.PopStateEvent("popstate"));
    await waitForRender(route);
    snapshots.push({ path: route, html: dom.serialize() });
  }
  const result = { html: initialHtml, errors, navigation: snapshots };
  // Read everything before close; all async work is discarded with this worker.
  await new Promise((resolve, reject) => {
    process.stdout.write(`PHASE3_RENDER=${JSON.stringify(result)}\n`, (error) => error ? reject(error) : resolve());
  });
  window.close();
}

if (process.argv[2] === "--render") {
  try {
    await renderWorker(process.argv[3], process.argv[4], JSON.parse(process.argv[5] ?? "[]"));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

const failures = [];
let checks = 0;
function check(label, condition, detail = "") {
  checks++;
  if (!condition) failures.push(label);
  console.log(`[${condition ? "PASS" : "FAIL"}] ${label}${detail ? ` — ${detail}` : ""}`);
}
function render(pathname, file = path.join(ROOT, "dist", "index.html"), navigation = []) {
  const worker = spawnSync(process.execPath, [SCRIPT, "--render", file, pathname, JSON.stringify(navigation)], {
    cwd: ROOT, encoding: "utf8", timeout: 30000, maxBuffer: 8 * 1024 * 1024,
  });
  const payload = worker.stdout?.split("\n").find((line) => line.startsWith("PHASE3_RENDER="));
  if (worker.status !== 0 || !payload) throw new Error(`${pathname}: ${worker.error?.message ?? worker.stderr ?? "render failed"}`);
  const result = JSON.parse(payload.slice("PHASE3_RENDER=".length));
  const dom = new JSDOM(result.html, { url: DOMAIN + pathname, virtualConsole: new VirtualConsole() });
  return { dom, doc: dom.window.document, errors: result.errors, navigation: result.navigation };
}
function jsonLd(doc) {
  const records = [];
  const add = (value) => {
    if (Array.isArray(value)) value.forEach(add);
    else if (value && typeof value === "object") {
      if (value["@graph"]) add(value["@graph"]);
      records.push(value);
    }
  };
  for (const node of doc.querySelectorAll('script[type="application/ld+json"]')) add(JSON.parse(node.textContent));
  return records;
}
function bodyText(page) {
  return normal([
    ...page.blocks,
    ...page.sections.flatMap((section) => section.blocks),
  ].map((block) => [block.text, ...(block.items ?? [])].filter(Boolean).join(" ")).join(" ") + " " + page.faqs.map((faq) => `${faq.q} ${faq.a}`).join(" "));
}
function shingles(text, size = 7) {
  // Normalize country names as well: a name-swapped template must still fail.
  const words = text.replace(/السعودية|الإمارات|الكويت|البحرين/g, "البلد").replace(/[\u064B-\u065F\u0670]/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  return new Set(words.slice(0, -size + 1).map((_, i) => words.slice(i, i + size).join(" ")));
}

const manifest = JSON.parse(read("dist/seo-manifest.json"));
const pages = manifest.countryCornerstones ?? [];
const sitemap = [...read("public/sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const redirects = JSON.parse(read("content/redirects.json"));
const edge = JSON.parse(read("vercel.json"));
const knownPaths = new Set([...manifest.routes.map((row) => row.path), ...manifest.articles.map((row) => row.path)]);
const redirectSources = new Set(redirects.rules.map((rule) => rule.source));
const approvedHosts = ["who.int", "acog.org", "nhs.uk", "medlineplus.gov", "accessdata.fda.gov", ...Object.values(EXPECTED).flatMap((item) => item.localHosts)];
const bodyStrings = [];
const allFaqQuestions = [];
const linkedMedicalPaths = new Set();
const pageResults = [];

check("Exactly four country cornerstone records", pages.length === 4 && Object.keys(EXPECTED).every((p) => pages.some((page) => page.path === p)));
check("Generated and public sitemaps agree", read("dist/sitemap.xml") === read("public/sitemap.xml"));
check("Sitemap has no duplicate URLs", sitemap.length === new Set(sitemap).size);
check("Country paths are registered as cornerstones", Object.keys(EXPECTED).every((route) => read("src/data/site.ts").includes(`"${route}"`)));

for (const page of pages) {
  const expected = EXPECTED[page.path];
  if (!expected) { check(`Unexpected country path ${page.path}`, false); continue; }
  console.log(`\n${page.path}`);
  const { doc, dom, errors } = render(page.path);
  const article = doc.querySelector(`[data-country-cornerstone="${expected.code}"]`);
  check(`${expected.code}: actual route renders without runtime errors`, !!article && errors.length === 0, errors.join("; "));
  if (!article) { dom.window.close(); continue; }
  const textClone = article.cloneNode(true);
  textClone.querySelectorAll("script").forEach((node) => node.remove());
  const visible = normal(textClone.textContent);
  const canonicals = [...doc.querySelectorAll('link[rel="canonical"]')];
  check(`${expected.code}: one self-canonical in FULL HTML shell`, canonicals.length === 1 && canonicals[0].getAttribute("href") === DOMAIN + page.path, canonicals.map((node) => node.getAttribute("href")).join(", "));
  const descriptions = [...doc.querySelectorAll('meta[name="description"]')];
  check(`${expected.code}: unique title/description, no fallback description`, doc.querySelectorAll("title").length === 1 && doc.title.startsWith(page.metaTitle) && descriptions.length === 1 && descriptions[0].content === page.metaDescription);
  const robots = [...doc.querySelectorAll('meta[name="robots"]')];
  check(`${expected.code}: one index/follow robots tag`, robots.length === 1 && robots[0].content === "index,follow,max-image-preview:large");
  const ogUrls = [...doc.querySelectorAll('meta[property="og:url"]')];
  check(`${expected.code}: one self-referencing Open Graph URL`, ogUrls.length === 1 && ogUrls[0].content === DOMAIN + page.path);
  check(`${expected.code}: exactly one H1 with both concepts`, doc.querySelectorAll("h1").length === 1 && normal(doc.querySelector("h1").textContent) === page.h1 && page.h1.includes("أدوية إجهاض الحمل") && page.h1.includes("حبوب سايتوتك") && page.h1.includes(expected.name));
  const answer = normal(article.querySelector("[data-direct-answer] .article-prose")?.textContent);
  const intended = [`أدوية إجهاض الحمل في ${expected.name}`, `حبوب سايتوتك في ${expected.name}`];
  check(`${expected.code}: both exact primary intents in direct answer`, intended.every((keyword) => answer.includes(keyword)) && JSON.stringify(page.primaryKeywords) === JSON.stringify(intended));
  check(`${expected.code}: direct answer before main sections`, !!article.querySelector("[data-direct-answer]") && !!article.querySelector("[data-country-section]") && Boolean(article.querySelector("[data-direct-answer]").compareDocumentPosition(article.querySelector("[data-country-section]")) & 4));
  check(`${expected.code}: section content is actually visible`, page.sections.every((section) => {
    const rendered = article.querySelector(`#${section.id}`);
    return rendered && normal(rendered.querySelector("h2")?.textContent) === section.heading && section.blocks.every((block) => [block.text, ...(block.items ?? [])].filter(Boolean).every((text) => normal(rendered.textContent).includes(normal(text))));
  }));
  check(`${expected.code}: local emergency number`, page.emergency.phone === expected.phone && normal(article.querySelector("[data-country-emergency]")?.textContent).includes(expected.phone));
  const arabic = visible.replace(/[\u064B-\u065F\u0670]/g, "");
  const medicalConcepts = [/سايتوتك/, /ميزوبروستول/, /المعدة|القرح/, /فقدان الحمل|الإجهاض التلقائي/, /الحمل خارج الرحم/, /حساسية/, /النزيف|النزف/, /مجهول|مغشوش|جودة/];
  check(`${expected.code}: medical coverage and ectopic warning`, medicalConcepts.every((concept) => concept.test(arabic)) && /لا يعالج|ليس علاجا/.test(arabic));
  check(`${expected.code}: non-commercial, no doses or administration instructions`, !/(?:wa\.me|api\.whatsapp|ميكروغرام|ميكروجرام|مليغرام|\bmcg\b|\bmg\b|تحت اللسان|بين الخد|عن طريق الفم|عن طريق المهبل|أدخلي|تناولي\s+\d|سعر\s*[:\d]|اشتر[يِ]\s|اطلبي الآن)/i.test(visible) && !article.querySelector('a[href^="tel:"]'));
  check(`${expected.code}: no city keyword blocks`, !/(?<!\p{L})(?:الرياض|جدة|مكة|الدمام|دبي|أبوظبي|الشارقة|المحرق|حولي)(?!\p{L})/u.test(visible));
  check(`${expected.code}: exactly one sitemap entry and indexable manifest route`, sitemap.filter((url) => url === DOMAIN + page.path).length === 1 && manifest.routes.some((route) => route.path === page.path && route.canonical === DOMAIN + page.path && route.expectedRobots === "index,follow,max-image-preview:large"));
  check(`${expected.code}: no redirect intercept`, !redirectSources.has(page.path) && !(edge.redirects ?? []).some((rule) => !rule.has && decodeURIComponent(rule.source) === page.path));

  const refs = page.references ?? [];
  const usedReferenceIds = [...new Set([...page.introSources, page.emergency.source, ...page.sections.flatMap((section) => section.sources), ...page.faqs.flatMap((faq) => faq.sources)])];
  check(`${expected.code}: all citations resolve to authoritative sources`, refs.length === usedReferenceIds.length && refs.every((ref) => ref?.url?.startsWith("https://") && onHost(ref.url, approvedHosts)) && usedReferenceIds.every((id) => refs.some((ref) => ref?.id === id)));
  check(`${expected.code}: local official sources present`, refs.filter((ref) => ref && onHost(ref.url, expected.localHosts)).length >= 2);
  check(`${expected.code}: citations displayed alongside every section/FAQ`, article.querySelectorAll("[data-country-section] [data-source-notes]").length === page.sections.length && article.querySelectorAll("[data-country-faq] [data-source-notes]").length === page.faqs.length && page.sections.every((section) => section.sources.length > 0) && page.faqs.every((faq) => faq.sources.length > 0));

  const faqs = [...article.querySelectorAll("[data-country-faq]")].map((node) => ({ q: normal(node.querySelector("h3")?.textContent), a: normal(node.querySelector("[data-faq-answer]")?.textContent) }));
  check(`${expected.code}: ${expected.faqs} visible unique FAQs`, faqs.length === expected.faqs && faqs.length >= 8 && faqs.length <= 12 && new Set(faqs.map((faq) => faq.q)).size === faqs.length);
  const data = jsonLd(doc);
  const faqData = data.filter((row) => row["@type"] === "FAQPage");
  check(`${expected.code}: FAQ schema exactly matches visible questions/answers`, faqData.length === 1 && JSON.stringify(faqData[0].mainEntity.map((row) => ({ q: normal(row.name), a: normal(row.acceptedAnswer.text) }))) === JSON.stringify(faqs) && JSON.stringify(faqs) === JSON.stringify(page.faqs.map((faq) => ({ q: normal(faq.q), a: normal(faq.a) }))));
  const webPage = data.filter((row) => ["WebPage", "MedicalWebPage"].includes(row["@type"]));
  check(`${expected.code}: WebPage schema matches visible metadata`, webPage.length === 1 && webPage[0].url === DOMAIN + page.path && webPage[0].name === page.h1 && webPage[0].description === page.metaDescription && webPage[0].dateModified === page.updatedAt && !!article.querySelector(`time[datetime="${page.updatedAt}"]`));
  const breadcrumbs = data.filter((row) => row["@type"] === "BreadcrumbList");
  const visibleCrumbs = [...article.querySelectorAll('nav[aria-label="مسار التنقل"] li')].map((node) => normal(node.textContent).replace(/^\/\s*/, ""));
  check(`${expected.code}: breadcrumb schema matches visible trail`, breadcrumbs.length === 1 && JSON.stringify(breadcrumbs[0].itemListElement.map((row) => row.name)) === JSON.stringify(visibleCrumbs) && JSON.stringify(breadcrumbs[0].itemListElement.map((row) => row.item)) === JSON.stringify([DOMAIN + "/", DOMAIN + "/topics", DOMAIN + page.path]));
  check(`${expected.code}: no commercial/fake review structured data`, !/"@type"\s*:\s*"(?:Drug|Product|Offer|Review|AggregateRating|Physician)"/.test(JSON.stringify(data)));

  const anchors = [...article.querySelectorAll("a[href]")];
  const broken = anchors.flatMap((anchor) => {
    const raw = anchor.getAttribute("href");
    if (raw.startsWith("#")) return doc.getElementById(raw.slice(1)) ? [] : [raw];
    const target = new URL(raw, DOMAIN + page.path);
    if (target.origin !== DOMAIN) return onHost(target.href, approvedHosts) ? [] : [raw];
    if (target.pathname.startsWith("/blog/") && !target.pathname.startsWith("/blog/cluster/")) linkedMedicalPaths.add(target.pathname);
    return knownPaths.has(target.pathname) && !redirectSources.has(target.pathname) ? [] : [raw];
  });
  check(`${expected.code}: all internal links/anchors resolve; external links non-commercial`, broken.length === 0, broken.join(", "));
  check(`${expected.code}: contextual medical links are rendered`, page.sections.flatMap((section) => section.links ?? []).every((link) => anchors.some((node) => node.getAttribute("href") === link.to && normal(node.textContent) === link.label)));
  const text = bodyText(page);
  bodyStrings.push({ code: expected.code, text });
  allFaqQuestions.push(...faqs.map((faq) => faq.q));
  pageResults.push({ path: page.path, title: doc.title, h1: page.h1, faqCount: faqs.length, editorialWords: text.split(/\s+/).length, contextualLinks: [...new Set(page.sections.flatMap((section) => (section.links ?? []).map((link) => link.to)))], referenceCount: refs.length });
  dom.window.close();
}

console.log("\nUNIQUENESS AND DISCOVERY");
for (const field of ["metaTitle", "h1", "metaDescription"]) check(`Unique ${field} across countries`, new Set(pages.map((page) => page[field])).size === 4);
check("Every country FAQ question is individually authored", new Set(allFaqQuestions).size === allFaqQuestions.length);
const overlaps = [];
for (let i = 0; i < bodyStrings.length; i++) for (let j = i + 1; j < bodyStrings.length; j++) {
  const a = shingles(bodyStrings[i].text);
  const b = shingles(bodyStrings[j].text);
  const overlap = [...a].filter((item) => b.has(item)).length / Math.min(a.size, b.size);
  overlaps.push({ pair: `${bodyStrings[i].code}/${bodyStrings[j].code}`, sharedSevenWordShingles: +(overlap * 100).toFixed(2) });
  check(`Not a name-swapped near-duplicate: ${bodyStrings[i].code}/${bodyStrings[j].code}`, overlap < 0.2, `${(overlap * 100).toFixed(2)}% shared 7-word sequences (country names normalized)`);
}

for (const pathname of ["/topics", "/sitemap", "/blog/cluster/ma-huwa-saytotek", "/blog/cluster/alaman-walthahdhirat", "/blog/cluster/alhaml-walsehha-alenjabiyya", "/blog/cytotec-uses"]) {
  const { dom, doc } = render(pathname);
  const hrefs = new Set([...doc.querySelectorAll("main a[href]")].map((node) => node.getAttribute("href")));
  check(`All four cornerstones discoverable from ${pathname}`, Object.keys(EXPECTED).every((route) => hrefs.has(route)));
  dom.window.close();
}
for (const pathname of linkedMedicalPaths) {
  const { dom, doc, errors } = render(pathname);
  const h1 = normal(doc.querySelector("h1")?.textContent);
  check(`Linked medical article renders: ${pathname}`, errors.length === 0 && h1.length > 0 && !/غير موجود|لم نعثر|404/.test(h1));
  dom.window.close();
}

console.log("\nCMS INTERNAL-LINK GRAPH");
// Exercise the real TypeScript helper without a dev server or a new dependency.
// site.ts is a data-only module with type-only imports; the one runtime import
// in internalLinks.ts is replaced with its transpiled, in-memory module URL.
const ts = (await import("typescript")).default;
const moduleUrl = (code) => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const transpile = (file) => ts.transpileModule(read(file), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const siteUrl = moduleUrl(transpile("src/data/site.ts"));
const graphCode = transpile("src/utils/internalLinks.ts").replace('"../data/site"', JSON.stringify(siteUrl));
const { buildLinkGraph } = await import(moduleUrl(graphCode));
const cmsGraph = buildLinkGraph(manifest.articles);
check("CMS recognizes the new country resource links", !cmsGraph.brokenLinks.some((link) => EXPECTED[link.to]));
for (const route of Object.keys(EXPECTED)) check(`CMS incoming link recorded for ${route}`, cmsGraph.incoming.get(route)?.includes("cytotec-uses"));
const invalidGraph = buildLinkGraph([{ ...manifest.articles[0], related: [], internalLinks: [], cornerstones: [], resourceLinks: [{ to: "/abortion-pills-not-a-country", label: "invalid fixture" }] }]);
check("CMS still rejects an unknown country-like path", invalidGraph.brokenLinks.some((link) => link.to === "/abortion-pills-not-a-country"));

console.log("\nCLIENT-SIDE NAVIGATION (NO DOCUMENT RELOAD)");
const transitions = render("/", undefined, [...Object.keys(EXPECTED), "/safety", "/", "/abortion-pills-uae", "/"]);
check("Client-side transitions have no runtime errors", transitions.errors.length === 0, transitions.errors.join("; "));
for (const [index, snapshot] of transitions.navigation.entries()) {
  const dom = new JSDOM(snapshot.html, { virtualConsole: new VirtualConsole() });
  const doc = dom.window.document;
  const canonicals = [...doc.querySelectorAll('link[rel="canonical"]')];
  if (EXPECTED[snapshot.path]) {
    check(`SPA transition ${index + 1}: one canonical/title/description at ${snapshot.path}`,
      canonicals.length === 1 && canonicals[0].getAttribute("href") === DOMAIN + snapshot.path &&
      doc.querySelectorAll("title").length === 1 && doc.querySelectorAll('meta[name="description"]').length === 1);
  } else {
    check(`SPA transition ${index + 1}: existing shell restored at ${snapshot.path}`,
      !doc.querySelector("[data-country-cornerstone]") && canonicals.some((node) => node.getAttribute("href") === DOMAIN + "/") &&
      canonicals.some((node) => node.getAttribute("href") === DOMAIN + snapshot.path));
    if (snapshot.path === "/") check(`SPA transition ${index + 1}: homepage markup still unchanged`,
      doc.getElementById("root").isEqualNode(transitions.doc.getElementById("root")));
  }
  dom.window.close();
}
transitions.dom.window.close();

const baseRef = process.env.PHASE3_BASE_REF;
const baselineDir = process.env.PHASE3_BASELINE_DIR && path.resolve(ROOT, process.env.PHASE3_BASELINE_DIR);
if (baseRef) {
  console.log(`\nSOURCE/REDIRECT REGRESSIONS AGAINST ${baseRef}`);
  const protectedFiles = [
    "src/pages/Home.tsx", "src/index.css", "src/components/Header.tsx", "src/components/Footer.tsx",
    "src/components/Layout.tsx", "src/components/Seo.tsx", "src/components/ContentBlocks.tsx",
    "src/components/PageHero.tsx", "src/pages/StaticPage.tsx", "src/pages/ArticlePage.tsx",
    "src/data/media.ts", "index.html", "vite.config.ts", "package-lock.json",
    "vercel.json", "content/redirects.json", "scripts/emitRedirects.mjs", "public/robots.txt", "docs/url-baseline.txt",
  ];
  for (const file of protectedFiles) {
    const original = execFileSync("git", ["show", `${baseRef}:${file}`], { cwd: ROOT });
    check(`Unchanged: ${file}`, original.equals(fs.readFileSync(path.join(ROOT, file))));
  }
  const originalArticle = JSON.parse(execFileSync("git", ["show", `${baseRef}:content/published/cytotec-uses.json`], { cwd: ROOT, encoding: "utf8" }));
  const currentArticle = JSON.parse(read("content/published/cytotec-uses.json"));
  delete originalArticle.resourceLinks;
  delete currentArticle.resourceLinks;
  check("Existing Cytotec article unchanged except relevant resource links", JSON.stringify(originalArticle) === JSON.stringify(currentArticle));
  const originalPages = execFileSync("git", ["show", `${baseRef}:src/data/pages.ts`], { cwd: ROOT, encoding: "utf8" });
  check("Existing static-page content unchanged", read("src/data/pages.ts").replace('import { countryCornerstones } from "./countryCornerstones";\n', "").replace("  ...countryCornerstones,\n", "") === originalPages);
}
if (baselineDir) {
  console.log("\nBUILT HOMEPAGE / EXISTING ROUTE REGRESSIONS");
  const baselineHtml = path.join(baselineDir, "stable-index.html");
  const oldManifest = JSON.parse(fs.readFileSync(path.join(baselineDir, "stable-seo-manifest.json"), "utf8"));
  const priorPaths = new Set([...oldManifest.routes.map((r) => r.path), ...oldManifest.articles.map((a) => a.path)]);
  check("No existing route was removed", [...priorPaths].every((route) => knownPaths.has(route)));
  check("Exactly four public routes added", [...knownPaths].filter((route) => !priorPaths.has(route)).length === 4);
  for (const pathname of ["/", "/what-is-cytotec", "/safety", "/service-areas", "/contact", "/blog/cluster/sehhat-almarah"]) {
    const before = render(pathname, baselineHtml);
    const after = render(pathname);
    check(`Unchanged rendered markup: ${pathname}`, before.doc.getElementById("root").innerHTML === after.doc.getElementById("root").innerHTML);
    before.dom.window.close();
    after.dom.window.close();
  }
  const styles = (html) => [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
  const beforeCss = styles(fs.readFileSync(baselineHtml, "utf8"));
  const afterCss = styles(read("dist/index.html"));
  // Added classes may enlarge a utility stylesheet. Existing declarations must
  // remain byte-identical; no visual redesign or existing-rule rewrite allowed.
  const leafRules = (css) => [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter((match) => !match[1].trim().startsWith("@"));
  const newRules = new Set(leafRules(afterCss).map((match) => match[0]));
  const lostRules = leafRules(beforeCss).filter((match) => !newRules.has(match[0]));
  check("Existing built CSS rules unchanged", lostRules.length === 0, `${lostRules.length} removed/rewritten rules; identical stylesheet: ${beforeCss === afterCss}`);
}
if (!baseRef || !baselineDir) console.log("\nNOTE: Set PHASE3_BASE_REF and PHASE3_BASELINE_DIR for optional stable-main source + rendered-homepage regression checks.");

fs.mkdirSync(SCRATCH, { recursive: true });
fs.writeFileSync(path.join(SCRATCH, "results.json"), JSON.stringify({ checks, failures, pages: pageResults, overlaps, linkedMedicalPagesChecked: linkedMedicalPaths.size, sourceBaseline: baseRef ?? null, builtBaseline: baselineDir ?? null }, null, 2) + "\n");
console.log(`\nCOUNTRY CORNERSTONE VERIFICATION: ${failures.length ? "FAIL" : "PASS"} — ${checks} checks, ${failures.length} failures`);
if (failures.length) console.error(failures.join("\n"));
process.exit(failures.length ? 1 : 0);
