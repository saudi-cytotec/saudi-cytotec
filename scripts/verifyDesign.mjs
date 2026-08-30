/**
 * verifyDesign — post-build visual-structure verification (jsdom).
 *
 * Complements verifyRendered (SEO/indexability) by asserting that the BUILT
 * bundle renders the approved navy/red design system: top navy bar, white
 * branded header with the exact logo slot, RTL nav, red consultation CTA,
 * light hero, credibility features, LIGHT WhatsApp card, category cards,
 * article cards with images, navy footer.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

process.on("uncaughtException", (err) => {
  console.error("\n[design] uncaught exception:", err && err.message);
  process.exit(1);
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_HTML = path.join(ROOT, "dist", "index.html");

const html = fs.readFileSync(DIST_HTML, "utf8");
const chunks = [...html.matchAll(/<script type="module"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).filter((c) => c.trim().length > 0);
const bundlePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "saudiersaa-design-")), "bundle.mjs");
fs.writeFileSync(bundlePath, chunks.join("\n"));

const DOMAIN = "https://saudiersaa.com";

function pathToFileUrlSafe(file) {
  return "file://" + file.split(path.sep).join("/");
}

async function waitFor(fn, ms = 20000) {
  const start = Date.now();
  for (;;) {
    try {
      if (fn()) return true;
    } catch {
      // keep polling
    }
    if (Date.now() - start > ms) return false;
    await new Promise((r) => setTimeout(r, 150));
  }
}

async function renderAt(pathname) {
  const dom = new JSDOM(`<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>`, {
    url: DOMAIN + pathname,
    pretendToBeVisual: true,
    runScripts: "outside-only",
  });
  const { window } = dom;
  const setGlobal = (name, value) => {
    try {
      globalThis[name] = value;
    } catch {
      Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
    }
  };
  const globals = [
    "window", "document", "navigator", "location", "history",
    "localStorage", "sessionStorage",
    "HTMLElement", "HTMLInputElement", "HTMLAnchorElement", "Element", "Node",
    "DocumentFragment", "Text", "Comment",
    "Event", "CustomEvent", "EventTarget", "MutationObserver",
    "DOMParser", "MessageChannel", "URL", "URLSearchParams",
    "getComputedStyle", "Image",
  ];
  for (const name of globals) {
    if (window[name] !== undefined) setGlobal(name, window[name]);
  }
  setGlobal("getComputedStyle", window.getComputedStyle.bind(window));
  setGlobal("requestAnimationFrame", (cb) => setTimeout(cb, 16));
  setGlobal("cancelAnimationFrame", (id) => clearTimeout(id));
  window.fetch = () => Promise.reject(new TypeError("network disabled in verification harness"));
  global.fetch = window.fetch;

  await import(pathToFileUrlSafe(bundlePath) + "?u=" + encodeURIComponent(pathname));
  await waitFor(() => {
    const root = window.document.getElementById("root");
    return root && root.innerHTML.length > 200;
  });
  return window.document;
}

const failures = [];
function check(label, ok, detail = "") {
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures.push(label);
}

/* ---------------- CSS palette check ---------------- */
console.log("CSS TOKENS (built bundle)");
check("navy brand token present", html.includes("#0b2545"));
check("red/pink accent token present", html.includes("#d81f3c"));
check("legacy teal removed from tokens", !html.includes("#0f5d56"));
check("display font (Cairo) loaded", html.includes("Cairo"));

/* ---------------- Home ---------------- */
console.log("\nHOME PAGE — DESIGN STRUCTURE");
{
  const doc = await renderAt("/");
  const text = doc.body.textContent;
  const q = (sel) => [...doc.querySelectorAll(sel)];

  check("top navy bar present", q('header .bg-brand-deep').length > 0);
  check("top bar shows WhatsApp number", text.includes("+966 53 815 9747"));
  check("top bar consultation label", text.includes("للاستشارة الطبية عبر واتساب"));
  check("verified-content label", text.includes("محتوى طبي موثّق"));

  // Logo slot: exact file reference, or wordmark fallback while file pending
  const logoImg = q('img[src="/images/saudiersaa-logo.png"]').length;
  const wordmark = /saudi/.test(doc.querySelector("header a")?.textContent ?? "");
  check("logo slot wired to exact file (img or fallback wordmark)", logoImg > 0 || wordmark, logoImg ? "img present" : "wordmark fallback");

  for (const label of ["الرئيسية", "المقالات", "ما هو سايتوتك؟", "الأسئلة الشائعة", "عن سايتوتك", "الصحة النسائية", "تواصل معنا"]) {
    check(`nav item: ${label}`, text.includes(label));
  }
  check("red consultation CTA in header", q('header a.bg-accent').some((el) => el.textContent.includes("استشارة طبية خاصة")));
  check("search control in header", doc.querySelector('header [aria-label*="بحث"]') !== null);

  // Hero
  const h1 = doc.querySelector("h1")?.textContent ?? "";
  check("hero H1: مدونة سايتوتك التوعوية", h1.includes("مدونة سايتوتك التوعوية"));
  check("hero H1 line 2: في السعودية", h1.includes("في السعودية"));
  check("hero CTA: قراءة المقالات", text.includes("قراءة المقالات"));
  for (const t of ["محتوى موثوق", "معلومات طبية دقيقة", "خصوصية تامة", "مصادر معتمدة"]) {
    check(`hero trust: ${t}`, text.includes(t));
  }

  // Credibility features
  for (const t of ["دليل شامل", "خصوصيتك أولاً", "مصادر معتمدة", "إشراف طبي"]) {
    check(`feature: ${t}`, text.includes(t));
  }

  // Light premium WhatsApp card (must NOT be the old dark brand block)
  const waSection = q("section[aria-labelledby='info-contact-heading']").pop();
  check("WhatsApp card present", !!waSection);
  check("WhatsApp card is LIGHT (card-premium, white)", !!waSection && waSection.className.includes("card-premium"));
  check("WhatsApp card CTA: تواصل عبر واتساب", !!waSection && waSection.textContent.includes("تواصل عبر واتساب"));
  check("WhatsApp compliance note kept", !!waSection && waSection.textContent.includes("قناة معلومات عامة وإرشاد تعليمي فقط"));

  // Categories
  check("category section heading", text.includes("تصفح المقالات حسب الفئة"));
  const catLinks = q('a[href^="/blog/cluster/"]');
  check("category cards (10 clusters)", catLinks.length >= 10, `${catLinks.length} links`);
  check("category count pills", text.includes("مقالاً") || text.includes("مقالات"));

  // Article cards with images
  const cards = q("article");
  const cardImgs = q("article img");
  check("article cards rendered", cards.length >= 9, `${cards.length} cards`);
  check("article cards have images", cardImgs.length >= 9, `${cardImgs.length} imgs`);

  // Footer
  const footer = doc.querySelector("footer");
  check("footer present", !!footer);
  check("footer is navy (bg-brand-deep)", !!footer && footer.className.includes("bg-brand-deep"));
  check("footer emergency numbers", !!footer && footer.textContent.includes("997") && footer.textContent.includes("937"));
}

/* ---------------- Internal pages share the design language ---------------- */
console.log("\nINTERNAL PAGES — SHARED DESIGN LANGUAGE");
{
  const doc = await renderAt("/blog");
  check("/blog navy page hero", doc.querySelector("section.bg-gradient-to-bl") !== null);
  check("/blog category chips", doc.body.textContent.includes("الكل ("));

  const doc2 = await renderAt("/blog/cytotec-definition");
  const imgs = [...doc2.querySelectorAll("figure img")].map((i) => i.getAttribute("src"));
  check("article page hero/featured image renders", imgs.length > 0, imgs[0] ?? "none");
  check("article H1 styled (display font class)", doc2.querySelector("h1")?.className.includes("font-display") === true);

  const doc3 = await renderAt("/contact");
  check("/contact light WhatsApp card", doc3.querySelector("section[aria-labelledby='info-contact-heading']")?.className.includes("card-premium") === true);
  check("/contact navy hero", doc3.querySelector("section.bg-gradient-to-bl") !== null);
}

console.log(failures.length ? `\nDESIGN VERIFICATION: FAIL — ${failures.length} failed: ${failures.join(" | ")}` : "\nDESIGN VERIFICATION: PASS — all checks green");
process.exit(failures.length ? 1 : 0);
