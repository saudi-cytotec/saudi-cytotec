/**
 * UI render test (testing only): mounts the REAL admin React screens using
 * Vite's SSR module loader (so import.meta.glob resolves exactly like the app),
 * runs effects, and asserts:
 *
 *   - the removed SEO GATEKEEPER is gone: no score, no "ready to publish"
 *     verdict, and above all no disabled publish button,
 *   - the editing controls + full workflow remain,
 *   - the pre-publish status panel (PASS / WARNING / ERROR) is present, since
 *     status reporting is required — what is forbidden is BLOCKING on SEO
 *     quality, not reporting it.
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
globalThis.fetch = async () => ({ ok: false, status: 501, json: async () => ({}) });
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
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
const { SeoScreen } = await vite.ssrLoadModule("/src/admin/screens/SeoScreen.tsx");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function renderAt(path, element) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(
      React.createElement(
        CatalogProvider,
        null,
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, { path: "/admin/articles/new", element }),
            React.createElement(Route, { path: "/admin/seo", element }),
          ),
        ),
      ),
    );
    await sleep(120);
  });
  const html = container.innerHTML;
  const publishBtnDisabled = [...container.querySelectorAll("button")]
    .filter((b) => b.textContent.trim() === "نشر")
    .some((b) => b.hasAttribute("disabled"));
  root.unmount();
  container.remove();
  return { html, publishBtnDisabled };
}

// Hallmarks of the removed SEO gatekeeper. The PASS/WARNING/ERROR verdict is
// deliberately NOT in this list: reporting status is required by the spec; the
// gatekeeper was the hard publish block, which is asserted absent below.
const FORBIDDEN = ["مساعد SEO", "العمق المقترح", "جاهزة للنشر", "تحذيرات SEO", "أخطاء تقنية", "SEO score"];
const REQUIRED_EDITOR = [
  // content
  "العنوان", "H1", "الرابط (slug)", "الكلمة المفتاحية الأساسية", "الكلمات المفتاحية الثانوية",
  "جسم المقال", "أسئلة متكررة", "المراجع",
  // seo
  "عنوان SEO", "الوصف التعريفي", "الرابط القانوني", "noindex", "nofollow", "sitemap",
  // media (all optional)
  "الصورة البارزة", "صورة البطاقة", "صورة المشاركة الاجتماعية", "النص البديل (ALT)", "رفع صورة", "بدون صورة",
  // medical metadata
  "المراجع الطبي", "تاريخ آخر مراجعة طبية", "إخلاء المسؤولية الطبية",
  // workflow
  "حالة ما قبل النشر", "حفظ مسودة", "إرسال للمراجعة", "نشر", "معاينة",
];

let failures = 0;
function check(name, cond) {
  console.log(`${cond ? "PASS" : "FAIL"} — ${name}`);
  if (!cond) failures++;
}

const editor = await renderAt("/admin/articles/new", React.createElement(EditorScreen, { mode: "create" }));
const editorHtml = editor.html;
console.log("\n--- EDITOR SCREEN ---");
check("editor rendered (not stuck loading)", !editorHtml.includes("جاري تحميل المقال"));
for (const term of FORBIDDEN) check(`editor does NOT show "${term}"`, !editorHtml.includes(term));
for (const term of REQUIRED_EDITOR) check(`editor keeps field/control "${term}"`, editorHtml.includes(term));
check("publish button is NOT disabled by validation gate", !editor.publishBtnDisabled);
check("pre-publish status panel is rendered (PASS/WARNING/ERROR)", editorHtml.includes("حالة ما قبل النشر"));
check(
  "warnings are declared non-blocking in the UI copy",
  editorHtml.includes("لا تمنع النشر") || editorHtml.includes("التحذيرات إرشادية"),
);

const seo = await renderAt("/admin/seo", React.createElement(SeoScreen, null));
const seoHtml = seo.html;
console.log("\n--- SEO SCREEN ---");
for (const term of FORBIDDEN) check(`seo screen does NOT show "${term}"`, !seoHtml.includes(term));
check("seo screen keeps editable field reference tab", seoHtml.includes("حقول SEO للمقالات"));

await vite.close();
console.log(`\n${failures === 0 ? "ALL UI CHECKS PASSED" : failures + " UI CHECK(S) FAILED"}`);
process.exit(failures === 0 ? 0 : 1);
