import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { reportBodyDepth, runGenerationPipeline } from "../cms/generationPipeline";
import { useCatalog } from "../cms/CatalogContext";
import { TEST_REPORT_LINE, testArticleReport } from "../cms/testArticle";
import { Seo } from "../components/Seo";
import { referenceList } from "../data/references";
import { clusters } from "../data/site";
import type { ArticleType, ClusterId, ContentMapItem, ManagedArticle, SearchIntent } from "../types";
import { MIN_BODY_WORDS, bodyWordCount } from "../utils/bodyWordCount";
import { isValidShortSlug, suggestSlug } from "../utils/slug";
import { validateArticle } from "../utils/validation";
import { generateRequest, loginRequest, logoutRequest, publishRequest, sessionCheck } from "./api";
import { applyTopicDefaults, blocksFromGenerated, emptyArticle, type GeneratorInput } from "./articleFactory";

const nav = [
  { to: "/admin", label: "نظرة عامة", end: true },
  { to: "/admin/articles", label: "المقالات" },
  { to: "/admin/articles/new", label: "إنشاء مقال" },
  { to: "/admin/drafts", label: "المسودات" },
  { to: "/admin/published", label: "المنشور" },
  { to: "/admin/clusters", label: "التصنيفات" },
  { to: "/admin/images", label: "الصور" },
  { to: "/admin/seo", label: "إدارة SEO" },
  { to: "/admin/map", label: "خريطة المحتوى" },
  { to: "/admin/generate", label: "مولّد الذكاء" },
  { to: "/admin/references", label: "المراجع" },
  { to: "/admin/links", label: "الروابط الداخلية" },
  { to: "/admin/settings", label: "إعدادات الموقع" },
];

export function AdminApp() {
  const [auth, setAuth] = useState<"loading" | "in" | "out">("loading");
  const [user, setUser] = useState("");

  useEffect(() => {
    sessionCheck()
      .then((res) => {
        setAuth(res.ok && res.data.authenticated ? "in" : "out");
        setUser(res.data.user ?? "");
      })
      .catch(() => setAuth("out"));
  }, []);

  if (auth === "loading") {
    return <div className="grid min-h-screen place-items-center bg-[#f4f1ea] text-teal-deep">جاري التحقق من الجلسة...</div>;
  }
  if (auth === "out") return <LoginScreen onSuccess={(name) => { setUser(name); setAuth("in"); }} />;

  return (
    <div className="min-h-screen bg-[#f3f0e8] text-ink" dir="rtl">
      <Seo title="لوحة التحرير" description="لوحة إدارة المحتوى التعليمي" path="/admin" noindex />
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-l border-line bg-teal-deep text-cream">
          <div className="px-5 py-6">
            <p className="text-xs text-sand">منصة النشر الطبي</p>
            <strong className="mt-1 block text-lg">سعودي إرساء · التحرير</strong>
          </div>
          <nav className="grid gap-1 px-3 pb-8">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm ${isActive ? "bg-white/15 text-white" : "text-sand hover:bg-white/10"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div>
          <header className="flex items-center justify-between border-b border-line bg-paper px-6 py-4">
            <div>
              <p className="text-sm text-ink-soft">مرحباً {user || "المحرر"}</p>
              <p className="text-xs text-ink-soft">عدّ الكلمات يتم على متن المقال فقط</p>
            </div>
            <div className="flex gap-2">
              <Link to="/" className="rounded-full border border-line px-3 py-1.5 text-sm">الموقع العام</Link>
              <button type="button" className="rounded-full bg-teal px-3 py-1.5 text-sm text-white" onClick={async () => { await logoutRequest(); setAuth("out"); }}>خروج</button>
            </div>
          </header>
          <div className="p-6">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="articles" element={<ArticlesScreen filter="all" />} />
              <Route path="articles/new" element={<EditorScreen mode="create" />} />
              <Route path="articles/:id" element={<EditorScreen mode="edit" />} />
              <Route path="preview/:id" element={<PreviewScreen />} />
              <Route path="drafts" element={<ArticlesScreen filter="draft" />} />
              <Route path="published" element={<ArticlesScreen filter="published" />} />
              <Route path="clusters" element={<ClustersScreen />} />
              <Route path="images" element={<ImagesScreen />} />
              <Route path="seo" element={<SeoScreen />} />
              <Route path="map" element={<MapScreen />} />
              <Route path="generate" element={<GeneratorScreen />} />
              <Route path="references" element={<ReferencesScreen />} />
              <Route path="links" element={<LinksScreen />} />
              <Route path="settings" element={<SettingsScreen />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onSuccess }: { onSuccess: (user: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="grid min-h-screen place-items-center bg-[#efe8d8] px-4" dir="rtl">
      <Seo title="دخول التحرير" description="دخول لوحة التحرير" path="/admin" noindex />
      <form
        className="w-full max-w-md rounded-[2rem] border border-line bg-paper p-8 shadow-xl"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            const res = await loginRequest(username, password);
            if (res.ok && res.data.authenticated) { onSuccess(username); return; }
            setError(res.data.error || "تعذر تسجيل الدخول.");
          } catch {
            setError("تعذر الاتصال بواجهة المصادقة.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="text-sm font-semibold text-sage">لوحة تحرير محمية</p>
        <h1 className="mt-2 text-3xl font-bold text-teal-deep">دخول المشرف</h1>
        <label className="mt-6 block text-sm font-semibold">اسم المستخدم<input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full rounded-2xl border border-line px-4 py-2" /></label>
        <label className="mt-4 block text-sm font-semibold">كلمة المرور<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-2xl border border-line px-4 py-2" /></label>
        {error ? <p className="mt-4 rounded-2xl bg-[#f8ece6] px-3 py-2 text-sm text-clay">{error}</p> : null}
        <button disabled={busy} className="mt-6 w-full rounded-full bg-teal py-2.5 text-white disabled:opacity-60">{busy ? "جاري التحقق..." : "دخول"}</button>
      </form>
    </div>
  );
}

function Card({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-3xl border border-line bg-paper p-5">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-2 text-3xl font-bold text-teal-deep">{value}</p>
      {hint ? <p className="mt-2 text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}

function Overview() {
  const { managed, map, articles } = useCatalog();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-teal-deep">نظرة عامة</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card label="منشور للعامة" value={articles.length} />
        <Card label="مسودات" value={managed.filter((a) => a.status === "draft").length} />
        <Card label="بانتظار المراجعة" value={managed.filter((a) => a.status === "review").length} />
        <Card label="خريطة المحتوى" value={map.length} />
      </div>
      <div className="rounded-3xl border border-line bg-paper p-6">
        <h2 className="text-xl font-bold">اختبار المولّد</h2>
        <p className="mt-2 text-sm leading-8 text-ink-soft">
          مقال واحد: «{testArticleReport.topic}» — Word count: {testArticleReport.wordCount} · فقرات {testArticleReport.paragraphs} · H2 {testArticleReport.h2} · H3 {testArticleReport.h3} · توسيعات {testArticleReport.expansions} · التحقق {testArticleReport.validationPassed ? "نجح" : "فشل"} · النشر {testArticleReport.publishAllowed ? "مسموح بعد المراجعة" : "ممنوع"}
        </p>
        <p className="sr-only" data-test-wc={testArticleReport.wordCount} data-test-p={testArticleReport.paragraphs} data-test-h2={testArticleReport.h2} data-test-h3={testArticleReport.h3} data-test-x={testArticleReport.expansions} data-test-ok={String(testArticleReport.validationPassed)}>{TEST_REPORT_LINE}</p>
      </div>
    </div>
  );
}

function ArticlesScreen({ filter }: { filter: "all" | "draft" | "published" }) {
  const { managed, removeArticle } = useCatalog();
  const [q, setQ] = useState("");
  const rows = managed.filter((item) => {
    if (filter === "draft") return item.status === "draft" || item.status === "review";
    if (filter === "published") return item.status === "published";
    return true;
  }).filter((item) => `${item.title} ${item.slug}`.includes(q));
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold text-teal-deep">{filter === "draft" ? "المسودات" : filter === "published" ? "المقالات المنشورة" : "كل المقالات"}</h1>
        <Link to="/admin/articles/new" className="rounded-full bg-teal px-4 py-2 text-sm text-white">مقال جديد</Link>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث بالعنوان أو الرابط" className="mt-4 max-w-md rounded-full border border-line bg-paper px-4 py-2" />
      <div className="mt-5 overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-cream text-right">
            <tr><th className="px-4 py-3">العنوان</th><th className="px-4 py-3">الرابط</th><th className="px-4 py-3">الحالة</th><th className="px-4 py-3">كلمات المتن</th><th className="px-4 py-3">المصدر</th><th className="px-4 py-3">إجراء</th></tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-4 py-3"><Link to={`/admin/articles/${item.id}`} className="font-semibold text-teal hover:underline">{item.title || "بدون عنوان"}</Link></td>
                <td className="px-4 py-3 font-mono text-xs" dir="ltr">/{item.slug}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className={`px-4 py-3 ${bodyWordCount(item.blocks) >= 2000 ? "text-sage" : "text-clay"}`}>{bodyWordCount(item.blocks)}</td>
                <td className="px-4 py-3">{item.source === "static" ? "أصل الموقع" : "لوحة"}</td>
                <td className="px-4 py-3">
                  {item.source === "cms" ? (
                    <button type="button" className="text-clay" onClick={() => removeArticle(item.id)}>حذف</button>
                  ) : (
                    <span className="text-ink-soft">محمي</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{label}<div className="mt-1 font-normal">{children}</div></label>;
}
function inputClass() {
  return "w-full rounded-2xl border border-line bg-white px-3 py-2 text-sm";
}

function EditorScreen({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { managed, upsertArticle, removeArticle, ready } = useCatalog();
  const existing = managed.find((item) => item.id === id);
  const [article, setArticle] = useState<ManagedArticle>(() => existing ?? emptyArticle());
  useEffect(() => { if (mode === "edit" && existing) setArticle(existing); }, [mode, existing]);
  const others = managed.filter((item) => item.id !== article.id);
  const validation = validateArticle(article, others.map((item) => item.slug), others.map((item) => item.title));
  function patch(next: Partial<ManagedArticle>) {
    setArticle((current) => applyTopicDefaults({ ...current, ...next, updatedAt: new Date().toISOString().slice(0, 10) }));
  }
  const [publishNote, setPublishNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(status?: ManagedArticle["status"]) {
    const next = { ...article, status: status ?? article.status };
    // Only a technically broken page is refused. Word count, SEO length and
    // reference count are advisory and never block publishing.
    if (status === "published" && !validation.ok) {
      setPublishNote("لا يمكن النشر: " + validation.items.filter((i) => i.blocking && !i.ok).map((i) => i.detail).join(" · "));
      return;
    }
    if (status === "published") {
      if (next.source === "cms") next.slugLocked = true;
      setBusy(true);
      setPublishNote(null);
      const res = await publishRequest(next);
      setBusy(false);
      if (!res.ok) {
        const msg = res.data?.error || res.data?.blocker || "تعذر النشر.";
        // A missing token is an infrastructure gap, not a lost article: the
        // edit is still saved locally and can be published once configured.
        setPublishNote(`${msg} — حُفظ المقال محلياً ويمكن إعادة محاولة النشر.`);
      } else {
        setPublishNote(
          res.data?.scheduled
            ? `تمت الجدولة لتاريخ ${res.data.publishAt}.`
            : "تم النشر إلى المستودع. ستظهر الصفحة بعد اكتمال إعادة النشر.",
        );
      }
    }
    upsertArticle(next);
    setArticle(next);
    if (mode === "create") navigate(`/admin/articles/${next.id}`);
  }
  if (!ready) return <p>جاري تحميل المقال...</p>;
  if (mode === "edit" && !existing) return <p>المقال غير موجود.</p>;
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-teal-deep">{mode === "create" ? "إنشاء مقال" : "تحرير مقال"}</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="العنوان"><input className={inputClass()} value={article.title} onChange={(e) => patch({ title: e.target.value, h1: article.h1 || e.target.value })} /></Field>
          <Field label="H1"><input className={inputClass()} value={article.h1} onChange={(e) => patch({ h1: e.target.value })} /></Field>
          <Field label="الكلمة المفتاحية الأساسية"><input className={inputClass()} value={article.primaryKeyword} onChange={(e) => patch({ primaryKeyword: e.target.value, slug: article.slugLocked ? article.slug : suggestSlug(e.target.value) })} /></Field>
          <Field label="الرابط الإنجليزي القصير"><input dir="ltr" disabled={article.slugLocked} className={inputClass()} value={article.slug} onChange={(e) => patch({ slug: e.target.value.toLowerCase() })} /></Field>
          <Field label="عنوان SEO"><input className={inputClass()} value={article.seoTitle} onChange={(e) => patch({ seoTitle: e.target.value, metaTitle: e.target.value })} /></Field>
          <Field label="المجموعة">
            <select className={inputClass()} value={article.cluster} onChange={(e) => patch({ cluster: e.target.value as ClusterId })}>
              {clusters.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </Field>
        </div>
        <Field label="الوصف التعريفي"><textarea className={inputClass()} rows={3} value={article.metaDescription} onChange={(e) => patch({ metaDescription: e.target.value, ogDescription: e.target.value })} /></Field>
        <Field label="الملخص"><textarea className={inputClass()} rows={3} value={article.excerpt} onChange={(e) => patch({ excerpt: e.target.value, description: e.target.value })} /></Field>
        <Field label="جسم المقال">
          <textarea className={`${inputClass()} min-h-80 font-article`} value={serializeBlocks(article)} onChange={(e) => patch({ blocks: parseBlocks(e.target.value), hasDisclaimer: /إخلاء|استشارة طبية/.test(e.target.value) })} />
        </Field>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => save("draft")} className="rounded-full border border-line px-4 py-2 text-sm">حفظ مسودة</button>
          <button
            type="button"
            onClick={() => {
              const expanded = reportBodyDepth(article.blocks, { topic: article.title || article.h1, primaryKeyword: article.primaryKeyword, cluster: article.cluster });
              patch({ blocks: expanded.blocks, hasDisclaimer: true, status: "draft" });
            }}
            className="rounded-full border border-line px-4 py-2 text-sm"
            title="يعرض عمق المتن الحالي. لا يضيف حشواً تلقائياً."
          >
            فحص عمق المتن
          </button>
          <button type="button" onClick={() => save("review")} className="rounded-full border border-line px-4 py-2 text-sm">إرسال للمراجعة</button>
          <button type="button" disabled={!validation.ok || busy} onClick={() => save("published")} className="rounded-full bg-teal px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? "جارٍ النشر..." : "نشر"}</button>
          <Link to={`/admin/preview/${article.id}`} className="rounded-full border border-line px-4 py-2 text-sm">معاينة</Link>
          {article.source === "cms" ? (
            <button type="button" className="rounded-full border border-clay px-4 py-2 text-sm text-clay" onClick={() => { removeArticle(article.id); navigate("/admin/articles"); }}>حذف</button>
          ) : null}
        </div>
      </div>
      <div className="space-y-4">
        {publishNote ? (
          <p role="status" className="rounded-2xl border border-line bg-brand-soft p-3 text-sm leading-7 text-brand-deep">
            {publishNote}
          </p>
        ) : null}
        <ValidationPanel article={article} />
      </div>
    </div>
  );
}

function serializeBlocks(article: ManagedArticle) {
  return article.blocks.map((b) => {
    if (b.type === "h2") return `## ${b.text}`;
    if (b.type === "h3") return `### ${b.text}`;
    if (b.type === "ul") return (b.items ?? []).map((i) => `- ${i}`).join("\n");
    if (b.type === "callout") return `> ${b.text}`;
    return b.text ?? "";
  }).join("\n\n");
}

function parseBlocks(text: string): ManagedArticle["blocks"] {
  return text.split(/\n\n+/).map((chunk) => {
    if (chunk.startsWith("## ")) return { type: "h2" as const, text: chunk.replace(/^## /, "") };
    if (chunk.startsWith("### ")) return { type: "h3" as const, text: chunk.replace(/^### /, "") };
    if (chunk.startsWith("> ")) return { type: "callout" as const, text: chunk.replace(/^> /, ""), tone: "warning" as const };
    if (chunk.trim().startsWith("- ")) return { type: "ul" as const, items: chunk.split("\n").map((l) => l.replace(/^- /, "").trim()).filter(Boolean) };
    return { type: "p" as const, text: chunk };
  });
}

function ValidationPanel({ article }: { article: ManagedArticle }) {
  const { managed } = useCatalog();
  const others = managed.filter((item) => item.id !== article.id);
  const result = validateArticle(article, others.map((i) => i.slug), others.map((i) => i.title));
  const slug = isValidShortSlug(article.slug);
  const words = bodyWordCount(article.blocks);
  return (
    <aside className="h-fit rounded-3xl border border-line bg-paper p-5">
      <h2 className="text-lg font-bold text-teal-deep">التحقق قبل النشر</h2>
      <p className={`mt-3 text-2xl font-bold ${words >= 2000 ? "text-sage" : "text-clay"}`}>Word count: {words}</p>
      <p className="text-xs text-ink-soft">المتن فقط — بدون عنوان أو وصف أو إخلاء أو أسئلة أو تنقل</p>
      {result.missingWords > 0 ? (
        <p className="text-sm text-clay">
          أقل من العمق المقترح ({MIN_BODY_WORDS} كلمة) بـ {result.missingWords} كلمة — يُنصح بالتوسيع، ولا يمنع النشر.
        </p>
      ) : null}
      <p className="mt-2 text-xs text-ink-soft">{slug.reason}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {result.items.map((item) => (
          <li key={item.id} className={item.ok ? "text-sage" : "text-clay"}>
            {item.ok ? "✓" : "✕"} {item.label}
            <span className="block text-xs text-ink-soft">{item.detail}</span>
          </li>
        ))}
      </ul>
      {!result.ok
        ? <p className="mt-4 text-sm font-semibold text-clay">النشر محظور حتى إصلاح الأخطاء التقنية فقط (لا يشمل عمق المقال).</p>
        : <p className="mt-4 text-sm font-semibold text-sage">جاهز للنشر بعد المراجعة — عمق المقال لا يمنع النشر.</p>}
    </aside>
  );
}

function PreviewScreen() {
  const { id } = useParams();
  const { managed, upsertArticle } = useCatalog();
  const article = managed.find((item) => item.id === id);
  if (!article) return <p>لا توجد معاينة.</p>;
  const others = managed.filter((item) => item.id !== article.id);
  const result = validateArticle(article, others.map((i) => i.slug), others.map((i) => i.title));
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="rounded-3xl border border-line bg-paper p-8">
        <p className="text-sm text-sage">معاينة تحريرية</p>
        <h1 className="mt-2 text-4xl font-bold text-teal-deep">{article.h1 || article.title}</h1>
        <div className="article-prose mt-8">
          {article.blocks.map((b, i) =>
            b.type === "h2" ? <h2 key={i}>{b.text}</h2>
            : b.type === "h3" ? <h3 key={i}>{b.text}</h3>
            : b.type === "ul" ? <ul key={i}>{(b.items ?? []).map((x) => <li key={x}>{x}</li>)}</ul>
            : <p key={i}>{b.text}</p>,
          )}
        </div>
      </div>
      <div>
        <ValidationPanel article={article} />
        <button type="button" disabled={!result.ok} className="mt-4 w-full rounded-full bg-teal py-2 text-white disabled:opacity-50" onClick={() => upsertArticle({ ...article, status: "published", slugLocked: true })}>اعتماد ونشر</button>
      </div>
    </div>
  );
}

function ImagesScreen() {
  const rows = [
    { file: "/images/hero-doctor.jpg", name: "hero-doctor.jpg", desc: "بانر الرئيسية فقط — صورة الطبيبة السعودية بجانب سرير الفحص." },
    { file: "/images/whatsapp-consult.jpg", name: "whatsapp-consult.jpg", desc: "صورة الاستشارة تظهر في المقالات والصفحات الداخلية فقط، قابلة للضغط لفتح واتساب." },
    { file: "/images/article-mark.svg", name: "article-mark.svg", desc: "علامة تصميم صغيرة موحّدة للمقالات عند الحاجة، وليست صورة رئيسية لكل مقال." },
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-deep">إدارة الصور</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-soft">
        ثلاث صور فقط في المكتبة. لا تُنشأ صور رئيسية كبيرة لكل مقال، ولا تُخلط أدوار الصور.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {rows.map((row) => (
          <div key={row.name} className="rounded-3xl border border-line bg-paper p-4">
            <div className="h-40 overflow-hidden rounded-2xl bg-cream">
              <img src={row.file} alt="" className="h-full w-full object-cover" />
            </div>
            <p className="mt-3 font-semibold text-teal-deep">{row.name}</p>
            <p className="mt-1 text-xs leading-6 text-ink-soft">{row.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClustersScreen() {
  const { articles } = useCatalog();
  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-deep">التصنيفات / المجموعات العشر</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {clusters.map((c) => (
          <div key={c.id} className="rounded-3xl border border-line bg-paper p-5">
            <h2 className="font-bold text-teal-deep">{c.title}</h2>
            <p className="mt-2 text-sm leading-7 text-ink-soft">{c.description}</p>
            <p className="mt-3 text-xs">{articles.filter((a) => a.cluster === c.id).length} مقال منشور</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeoScreen() {
  const { managed } = useCatalog();
  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-deep">إدارة SEO</h1>
      <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-cream"><tr><th className="px-3 py-2">المقال</th><th className="px-3 py-2">SEO</th><th className="px-3 py-2">وصف</th><th className="px-3 py-2">رابط</th></tr></thead>
          <tbody>
            {managed.slice(0, 25).map((a) => (
              <tr key={a.id} className="border-t border-line">
                <td className="px-3 py-2">{a.title}</td>
                <td className="px-3 py-2">{a.seoTitle.length}</td>
                <td className="px-3 py-2">{a.metaDescription.length}</td>
                <td className="px-3 py-2 font-mono text-xs" dir="ltr">{a.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MapScreen() {
  const { map, upsertMapItem } = useCatalog();
  const [draft, setDraft] = useState<Partial<ContentMapItem>>({ title: "", primaryKeyword: "", proposedSlug: "", cluster: "definition", searchIntent: "informational", articleType: "explainer", status: "planned" });
  const conflicts = useMemo(() => {
    const slugs = new Map<string, number>();
    const titles = new Map<string, number>();
    const keys = new Map<string, number>();
    for (const item of map) {
      slugs.set(item.proposedSlug, (slugs.get(item.proposedSlug) ?? 0) + 1);
      titles.set(item.title.trim(), (titles.get(item.title.trim()) ?? 0) + 1);
      keys.set(item.primaryKeyword.trim(), (keys.get(item.primaryKeyword.trim()) ?? 0) + 1);
    }
    return map.filter((item) => (slugs.get(item.proposedSlug) ?? 0) > 1 || (titles.get(item.title.trim()) ?? 0) > 1 || (keys.get(item.primaryKeyword.trim()) ?? 0) > 1);
  }, [map]);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-teal-deep">خريطة محتوى 100 مقال</h1>
      <form className="grid gap-3 rounded-3xl border border-line bg-paper p-5 md:grid-cols-2" onSubmit={(e) => {
        e.preventDefault();
        if (!draft.title || !draft.primaryKeyword) return;
        upsertMapItem({
          id: `map-${Date.now()}`,
          title: draft.title,
          primaryKeyword: draft.primaryKeyword,
          secondaryKeywords: [],
          searchIntent: (draft.searchIntent ?? "informational") as SearchIntent,
          cluster: (draft.cluster ?? "definition") as ClusterId,
          articleType: (draft.articleType ?? "explainer") as ArticleType,
          proposedSlug: draft.proposedSlug || suggestSlug(draft.primaryKeyword),
          internalLinks: [],
          status: "planned",
        });
        setDraft({ title: "", primaryKeyword: "", proposedSlug: "", cluster: "definition", searchIntent: "informational", articleType: "explainer", status: "planned" });
      }}>
        <input className={inputClass()} placeholder="عنوان مخطط" value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        <input className={inputClass()} placeholder="كلمة مفتاحية" value={draft.primaryKeyword ?? ""} onChange={(e) => setDraft({ ...draft, primaryKeyword: e.target.value, proposedSlug: suggestSlug(e.target.value) })} />
        <button className="rounded-full bg-teal px-4 py-2 text-sm text-white md:col-span-2">إضافة إلى الخريطة</button>
      </form>
      <p className={conflicts.length ? "text-clay" : "text-sage"}>{conflicts.length ? `تعارضات: ${conflicts.length}` : "لا يوجد تكرار ظاهر."}</p>
    </div>
  );
}

function GeneratorScreen() {
  const { upsertArticle, managed } = useCatalog();
  const navigate = useNavigate();
  const [form, setForm] = useState<GeneratorInput>({
    topic: "ما هو سايتوتك؟ الاستخدامات الطبية والتحذيرات",
    primaryKeyword: "سايتوتك",
    secondaryKeywords: "ميزوبروستول, تحذيرات, استخدامات طبية",
    cluster: "definition",
    searchIntent: "informational",
    articleType: "explainer",
    proposedSlug: "cytotec-uses-warnings",
    seoTitle: "ما هو سايتوتك؟ الاستخدامات الطبية والتحذيرات",
    metaDescription: "مقال تعليمي مطوّل عن سايتوتك وميزوبروستول: التعريف والاستخدامات تحت الإشراف والتحذيرات ومتى تجب مراجعة الطبيب.",
    internalLinks: "/what-is-cytotec, /safety, /when-to-see-doctor",
    references: "fdaLabel, sfda, medlinePlus",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<ManagedArticle | null>(null);
  const [pipelineNote, setPipelineNote] = useState("");

  async function run() {
    setBusy(true);
    setError("");
    setPipelineNote("");
    const slug = form.proposedSlug || suggestSlug(form.primaryKeyword || form.topic);
    let incoming = emptyArticle({
      title: form.topic,
      h1: form.topic,
      excerpt: form.metaDescription,
      metaDescription: form.metaDescription,
      seoTitle: form.seoTitle || form.topic.slice(0, 70),
      primaryKeyword: form.primaryKeyword,
      secondaryKeywords: form.secondaryKeywords.split(",").map((s) => s.trim()).filter(Boolean),
      cluster: form.cluster,
      searchIntent: form.searchIntent,
      articleType: form.articleType,
      slug,
      references: form.references.split(",").map((s) => s.trim()).filter(Boolean),
      status: "draft",
    });
    try {
      const res = await generateRequest({ ...form, proposedSlug: slug });
      if (res.ok && res.data.article) {
        const generated = res.data.article;
        incoming = applyTopicDefaults(emptyArticle({
          ...incoming,
          title: String(generated.title ?? form.topic),
          h1: String(generated.h1 ?? form.topic),
          excerpt: String(generated.excerpt ?? form.metaDescription),
          blocks: blocksFromGenerated(generated.blocks),
          faqs: Array.isArray(generated.faqs) ? generated.faqs as { q: string; a: string }[] : [],
        }));
      }
    } catch {
      setPipelineNote("واجهة OpenAI غير متاحة هنا. اكتمل التوليد عبر خط الأنابيب البرمجي مع العدّ والتوسيع.");
    }
    const enforced = incoming.blocks.length
      ? reportBodyDepth(incoming.blocks, { topic: form.topic, primaryKeyword: form.primaryKeyword, cluster: form.cluster })
      : runGenerationPipeline({ topic: form.topic, primaryKeyword: form.primaryKeyword, cluster: form.cluster });
    const article = applyTopicDefaults({ ...incoming, blocks: enforced.blocks, hasDisclaimer: true, status: "draft" });
    if (!enforced.ok) {
      setError(enforced.error || "فشل التوليد — لا يوجد محتوى كافٍ في المتن. جرّبي مرة أخرى.");
      setDraft(article);
      return setBusy(false);
    }
    setDraft(article);
    upsertArticle(article);
    setPipelineNote(
      `اكتمل التوليد. Word count: ${enforced.wordCount}` +
        (enforced.missingWords > 0 ? ` — أقل من العمق المقترح (${MIN_BODY_WORDS}) ولا يمنع النشر.` : "")
    );
    setBusy(false);
  }

  const validation = draft
    ? validateArticle(draft, managed.filter((i) => i.id !== draft.id).map((i) => i.slug), managed.filter((i) => i.id !== draft.id).map((i) => i.title))
    : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div>
        <h1 className="text-3xl font-bold text-teal-deep">مولّد المقالات</h1>
        <p className="mt-2 text-sm leading-7 text-ink-soft">بعد كل توليد يُحسب متن المقال فقط. العمق المقترح 2000 كلمة؛ إن نقص يُعرض تنبيه تحريري ولا يمنع النشر.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Field label="موضوع المقال"><input className={inputClass()} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} /></Field>
          <Field label="الكلمة الأساسية"><input className={inputClass()} value={form.primaryKeyword} onChange={(e) => setForm({ ...form, primaryKeyword: e.target.value, proposedSlug: suggestSlug(e.target.value) })} /></Field>
          <Field label="الرابط المقترح"><input dir="ltr" className={inputClass()} value={form.proposedSlug} onChange={(e) => setForm({ ...form, proposedSlug: e.target.value })} /></Field>
          <Field label="المجموعة">
            <select className={inputClass()} value={form.cluster} onChange={(e) => setForm({ ...form, cluster: e.target.value as ClusterId })}>
              {clusters.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </Field>
        </div>
        {error ? <p className="mt-4 rounded-2xl bg-[#f8ece6] p-3 text-sm text-clay">{error}</p> : null}
        {pipelineNote ? <p className="mt-4 rounded-2xl bg-[#eef5f0] p-3 text-sm">{pipelineNote}</p> : null}
        <button type="button" disabled={busy || !form.topic} onClick={run} className="mt-5 rounded-full bg-teal px-5 py-2 text-white disabled:opacity-50">{busy ? "جاري التوليد والتوسيع..." : "توليد مقال طويل"}</button>
        {draft && validation?.ok ? (
          <p className="mt-4 text-sm">مسودة صالحة بنيوياً. <button type="button" className="text-teal underline" onClick={() => navigate(`/admin/articles/${draft.id}`)}>افتحي المحرر</button></p>
        ) : null}
      </div>
      {draft ? <ValidationPanel article={draft} /> : <aside className="rounded-3xl border border-dashed border-line bg-paper p-5 text-sm leading-7 text-ink-soft">بعد التوليد يظهر عدد كلمات المتن الحقيقي هنا.</aside>}
    </div>
  );
}

function ReferencesScreen() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-deep">المراجع المعتمدة</h1>
      <ul className="mt-6 space-y-3">
        {referenceList.map((ref) => (
          <li key={ref.id} className="rounded-2xl border border-line bg-paper p-4">
            <p className="font-semibold">{ref.source}</p>
            <a className="text-sm text-teal" href={ref.url} target="_blank" rel="noreferrer">{ref.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LinksScreen() {
  const { managed } = useCatalog();
  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-deep">الروابط الداخلية</h1>
      <div className="mt-6 space-y-3">
        {managed.slice(0, 20).map((a) => (
          <div key={a.id} className="rounded-2xl border border-line bg-paper p-4 text-sm">
            <strong>{a.title}</strong>
            <p className="mt-1 text-ink-soft">{a.internalLinks.join(" · ") || a.related.join(" · ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen() {
  const { settings, setSettings } = useCatalog();
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-3xl font-bold text-teal-deep">إعدادات الموقع</h1>
      <Field label="اسم الموقع"><input className={inputClass()} value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} /></Field>
      <Field label="النطاق"><input className={inputClass()} value={settings.domain} onChange={(e) => setSettings({ ...settings, domain: e.target.value })} /></Field>
    </div>
  );
}
