/**
 * UI FLOW test (testing only): drives the REAL EditorScreen through
 * create -> edit -> save draft -> publish, and verifies:
 *   - a minimal-but-valid article (no SEO title/meta/keyword, no FAQ, no image,
 *     tiny body) PUBLISHES with no content-quality gate, and
 *   - a technically broken article (empty title) is refused by the integrity
 *     guard with a plain data-integrity message (not an SEO verdict).
 * The publish network call is stubbed to observe what the component sends.
 */
import { JSDOM } from "jsdom";
import { createServer } from "vite";

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  url: "http://localhost/admin/articles/new",
  pretendToBeVisual: true,
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.localStorage = dom.window.localStorage;
if (!globalThis.navigator) Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });

let lastPublishBody = null;
let publishCalls = 0;
globalThis.fetch = async (url, init) => {
  if (String(url).includes("/api/publish")) {
    publishCalls++;
    lastPublishBody = init && init.body ? JSON.parse(init.body) : null;
    return { ok: true, status: 200, json: async () => ({ ok: true, slug: lastPublishBody?.article?.slug, note: "published", url: `/blog/${lastPublishBody?.article?.slug}` }) };
  }
  return { ok: false, status: 501, json: async () => ({}) };
};
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const check = (name, cond) => { console.log(`${cond ? "PASS" : "FAIL"} — ${name}`); if (!cond) failures++; };

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
await act(async () => {
  root.render(
    React.createElement(CatalogProvider, null,
      React.createElement(MemoryRouter, { initialEntries: ["/admin/articles/new"] },
        React.createElement(Routes, null,
          React.createElement(Route, { path: "/admin/articles/new", element: React.createElement(EditorScreen, { mode: "create" }) }),
          React.createElement(Route, { path: "/admin/articles/:id", element: React.createElement(EditorScreen, { mode: "edit" }) }),
        ),
      ),
    ),
  );
  await sleep(120);
});

function setInput(el, value) {
  const proto = el.tagName === "TEXTAREA" ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
  setter.call(el, value);
  el.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
}

function findByLabel(labelText) {
  const labels = [...container.querySelectorAll("label")];
  const label = labels.find((l) => l.textContent.includes(labelText));
  if (!label) return null;
  return label.querySelector("input, textarea");
}

function findButton(text) {
  return [...container.querySelectorAll("button")].find((b) => b.textContent.trim() === text);
}

// --- Fill only the bare minimum: title + body. Leave SEO title, meta,
//     keyword, FAQ, references, image, ALT all empty. ---
await act(async () => {
  setInput(findByLabel("العنوان"), "مقال قصير للاختبار");
  await sleep(10);
});
await act(async () => {
  const bodyArea = [...container.querySelectorAll("textarea")].find((t) => t.value !== undefined && t.closest("label")?.textContent.includes("جسم المقال"));
  setInput(bodyArea, "فقرة قصيرة جداً بلا أي تحسين SEO أو FAQ أو صورة.");
  await sleep(10);
});

// slug is auto-suggested from primary keyword; primary keyword is empty, so set
// a slug manually via the slug field to make a valid URL.
await act(async () => {
  const slugInput = findByLabel("الرابط (slug)");
  setInput(slugInput, "short-flow-test");
  await sleep(10);
});

// Save draft first (workflow: create -> edit -> save draft)
await act(async () => { findButton("حفظ مسودة").click(); await sleep(60); });
check("save draft did not trigger a publish network call", publishCalls === 0);

// Now PUBLISH the minimal article
await act(async () => { findButton("نشر").click(); await sleep(120); });
check("minimal article (no manual SEO/FAQ/image/short body) reached publish API", publishCalls === 1);
check("published with NO manually-entered meta description (not blocked)", lastPublishBody?.article?.metaDescription === "");
check("published with NO primary keyword (not blocked)", (lastPublishBody?.article?.primaryKeyword ?? "") === "");
check("published with NO FAQ (not blocked)", (lastPublishBody?.article?.faqs?.length ?? 0) === 0);
check("published payload has the body block", Array.isArray(lastPublishBody?.article?.blocks) && lastPublishBody.article.blocks.length >= 1);
const errAfterGood = [...container.querySelectorAll('[role="alert"]')].map((n) => n.textContent).join(" ");
check("no publish-error shown for the valid minimal article", errAfterGood.trim() === "");

// --- Now break it: clear the title and try to publish -> integrity refusal ---
await act(async () => { setInput(findByLabel("العنوان"), ""); await sleep(10); });
const beforeBreak = publishCalls;
await act(async () => { findButton("نشر").click(); await sleep(80); });
check("empty-title article did NOT reach publish API (integrity guard)", publishCalls === beforeBreak);
const alertText = [...container.querySelectorAll('[role="alert"]')].map((n) => n.textContent).join(" ");
check("integrity message shown for broken record", alertText.includes("تعذر الحفظ"));
check("refusal is data-integrity, NOT an SEO verdict", !/SEO|ERROR|WARNING|العمق|كلمة/.test(alertText));

root.unmount();
await vite.close();
console.log(`\n${failures === 0 ? "ALL FLOW CHECKS PASSED" : failures + " FLOW CHECK(S) FAILED"}`);
process.exit(failures === 0 ? 0 : 1);
