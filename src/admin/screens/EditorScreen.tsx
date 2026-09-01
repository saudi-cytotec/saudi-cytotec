import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCatalog } from "../../cms/CatalogContext";
import { mediaLibrary, type MediaItem } from "../../data/media";
import { referenceList } from "../../data/references";
import { clusters } from "../../data/site";
import type { ArticleFaq, ArticleStatus, ClusterId, ManagedArticle } from "../../types";
import { bodyWordCount } from "../../utils/bodyWordCount";
import { buildLinkGraph } from "../../utils/internalLinks";
import { suggestSlug } from "../../utils/slug";
import { checkArticleIntegrity, prePublishReport } from "../../utils/validation";
import { applyTopicDefaults, emptyArticle } from "../articleFactory";
import { publishRequest, unpublishRequest, uploadImageRequest } from "../api";
import { Badge, Field, inputClass, Section } from "../ui";

function serializeBlocks(article: ManagedArticle) {
  return article.blocks
    .map((b) => {
      if (b.type === "h2") return `## ${b.text}`;
      if (b.type === "h3") return `### ${b.text}`;
      if (b.type === "ul") return (b.items ?? []).map((i) => `- ${i}`).join("\n");
      if (b.type === "callout") return `> ${b.text}`;
      return b.text ?? "";
    })
    .join("\n\n");
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

/** Turn an API error payload into a precise, human message for the admin. */
function describeFailure(data: Record<string, unknown> | undefined, status: number): string {
  const error = typeof data?.error === "string" ? data.error : "";
  const remedy = typeof data?.remedy === "string" ? data.remedy : "";
  const code = typeof data?.code === "string" ? data.code : "";
  const detail = typeof data?.detail === "string" ? data.detail : "";
  if (status === 401) {
    return "انتهت جلسة الدخول — سجّلي الدخول مرة أخرى ثم أعيدي المحاولة. (AUTH_REQUIRED)";
  }
  const parts = [error || `فشل الطلب (HTTP ${status}).`];
  if (remedy) parts.push(remedy);
  if (detail) parts.push(`تفاصيل GitHub: ${detail}`);
  if (code) parts.push(`رمز: ${code}`);
  return parts.join(" — ");
}

export function EditorScreen({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { managed, upsertArticle, removeArticle, ready } = useCatalog();
  const existing = managed.find((item) => item.id === id);
  const [article, setArticle] = useState<ManagedArticle>(() => existing ?? emptyArticle());
  useEffect(() => {
    if (mode === "edit" && existing) setArticle(existing);
  }, [mode, existing]);

  const others = managed.filter((item) => item.id !== article.id);
  const integrity = useMemo(
    () => checkArticleIntegrity(article, others.map((item) => item.slug)),
    [article, others],
  );
  const report = useMemo(() => prePublishReport(article, integrity), [article, integrity]);
  const graph = useMemo(() => buildLinkGraph(managed), [managed]);
  const stats = graph.stats.get(article.slug);

  const [publishNote, setPublishNote] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [secondaryText, setSecondaryText] = useState(() => article.secondaryKeywords.join(", "));
  const [linksText, setLinksText] = useState(() => article.internalLinks.join(", "));

  /** Images uploaded during this editing session (available immediately). */
  const [sessionMedia, setSessionMedia] = useState<MediaItem[]>([]);
  const library = useMemo(() => {
    const seen = new Set(mediaLibrary.map((m) => m.file));
    return [...mediaLibrary, ...sessionMedia.filter((m) => !seen.has(m.file))];
  }, [sessionMedia]);

  function patch(next: Partial<ManagedArticle>) {
    setArticle((current) => applyTopicDefaults({ ...current, ...next, updatedAt: new Date().toISOString().slice(0, 10) }));
  }

  async function save(status?: ArticleStatus) {
    setPublishNote(null);
    setPublishError(null);
    const next = { ...article, status: status ?? article.status };

    // Only a technically broken record is refused (no working URL, no title,
    // no H1, empty body, duplicate slug). This is DATA INTEGRITY — never an
    // SEO / word-count / FAQ / image quality gate.
    if (status === "published" && !integrity.ok) {
      setPublishError("تعذر النشر — أخطاء بيانات تمنع إنشاء صفحة صالحة: " + integrity.problems.map((p) => p.message).join(" · "));
      return;
    }
    if (status === "published" && next.source === "cms") {
      next.slugLocked = true;
    }

    // Publishing is ALWAYS an explicit administrator action. There is no
    // scheduled / cron / automatic publish path anywhere in the system.
    if (status === "published") {
      setBusy(true);
      const res = await publishRequest(next);
      setBusy(false);
      if (!res.ok) {
        // NEVER report success for a local-only save. The article stays a
        // draft and the admin sees exactly what failed.
        setPublishError(describeFailure(res.data as Record<string, unknown>, res.status));
        setPublishNote("لم يُنشر المقال. التعديلات محفوظة محلياً كمسودة ويمكن إعادة المحاولة بعد معالجة السبب أعلاه.");
        upsertArticle({ ...next, status: "draft" });
        setArticle({ ...next, status: "draft" });
        return;
      }
      const data = res.data as { note?: string; commit?: string; url?: string };
      setPublishNote(
        [
          data.note || "تم النشر إلى المستودع.",
          data.commit ? `commit: ${String(data.commit).slice(0, 7)}` : "",
          data.url ? `الرابط: ${data.url}` : "",
        ]
          .filter(Boolean)
          .join(" · "),
      );
      upsertArticle({ ...next, status: "published" });
      setArticle({ ...next, status: "published" });
      if (mode === "create") navigate(`/admin/articles/${next.id}`);
      return;
    }

    upsertArticle(next);
    setArticle(next);
    setPublishNote(
      status === "review"
        ? "أُرسل المقال للمراجعة وحُفظ. لن يظهر على الموقع العام حتى النشر."
        : "حُفظت المسودة. ستجدينها كما هي عند إعادة فتح المحرر.",
    );
    if (mode === "create") navigate(`/admin/articles/${next.id}`);
  }

  async function unpublish() {
    setPublishNote(null);
    setPublishError(null);
    setBusy(true);
    const res = await unpublishRequest(article.slug);
    setBusy(false);
    if (!res.ok) {
      setPublishError(describeFailure(res.data as Record<string, unknown>, res.status));
      return;
    }
    const data = res.data as { note?: string; commit?: string };
    setPublishNote(
      (data.note || "أُلغي النشر.") + (data.commit ? ` · commit: ${String(data.commit).slice(0, 7)}` : ""),
    );
    upsertArticle({ ...article, status: "draft" });
    setArticle({ ...article, status: "draft" });
  }

  if (!ready) return <p>جاري تحميل المقال...</p>;
  if (mode === "edit" && !existing) return <p>المقال غير موجود.</p>;

  const words = bodyWordCount(article.blocks);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-brand-deep">{mode === "create" ? "إنشاء مقال" : "تحرير مقال"}</h1>
          <div className="flex gap-2 text-xs">
            <Badge tone={article.status === "published" ? "ok" : "warn"}>{article.status}</Badge>
            <Badge tone="neutral">{article.source === "static" ? "أصل الموقع (محمي)" : "محتوى اللوحة"}</Badge>
            <Badge tone="neutral">{words} كلمة</Badge>
          </div>
        </div>

        {/* ─────────────────────────────── 1. المحتوى ─────────────────────── */}
        <Section title="١. المحتوى" hint="العنوان وH1 والرابط والكلمات المفتاحية والتصنيف ومتن المقال.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="العنوان" hint="عنوان المقال المستخدم في القوائم والبطاقات.">
              <input className={inputClass()} value={article.title} onChange={(e) => patch({ title: e.target.value, h1: article.h1 || e.target.value })} />
            </Field>
            <Field label="H1" hint="العنوان الرئيسي داخل الصفحة.">
              <input className={inputClass()} value={article.h1} onChange={(e) => patch({ h1: e.target.value })} />
            </Field>
            <Field label="الكلمة المفتاحية الأساسية">
              <input
                className={inputClass()}
                value={article.primaryKeyword}
                onChange={(e) =>
                  patch({
                    primaryKeyword: e.target.value,
                    // Propose a slug only while the article has none — never
                    // overwrite a slug the administrator already chose.
                    slug: article.slugLocked || article.slug ? article.slug : suggestSlug(e.target.value),
                  })
                }
              />
            </Field>
            <Field label="الكلمات المفتاحية الثانوية" hint="افصلي بفواصل — للتحليل فقط ولا تُحشى في النص. اختيارية ولا تمنع النشر.">
              <input
                className={inputClass()}
                value={secondaryText}
                onChange={(e) => {
                  setSecondaryText(e.target.value);
                  patch({ secondaryKeywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) });
                }}
              />
            </Field>
            <Field label="الرابط (slug)" hint={article.slugLocked ? "مقفل بعد النشر حفاظاً على SEO." : "حروف إنجليزية صغيرة وأرقام وشرطات."}>
              <input
                dir="ltr"
                disabled={article.slugLocked}
                className={inputClass()}
                value={article.slug}
                onChange={(e) => patch({ slug: e.target.value.toLowerCase() })}
              />
            </Field>
            <Field label="المجموعة (التصنيف / Cluster)">
              <select className={inputClass()} value={article.cluster} onChange={(e) => patch({ cluster: e.target.value as ClusterId })}>
                {clusters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="الملخص (Excerpt)">
              <textarea className={inputClass()} rows={2} value={article.excerpt} onChange={(e) => patch({ excerpt: e.target.value, description: e.target.value })} />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="جسم المقال" hint={"الصيغة: ## لعنوان H2 · ### لـ H3 · > لتنبيه · - لقائمة نقطية · سطر فارغ للفصل."}>
              <textarea
                className={`${inputClass()} min-h-96 font-article leading-8`}
                value={serializeBlocks(article)}
                onChange={(e) =>
                  patch({
                    blocks: parseBlocks(e.target.value),
                    hasDisclaimer: /إخلاء|استشارة طبية|لا يُعد/.test(e.target.value) || article.hasDisclaimer,
                  })
                }
              />
            </Field>
          </div>
        </Section>

        {/* ─────────────────────────────── 2. SEO ─────────────────────────── */}
        <Section title="٢. SEO" hint="عنوان الوصف والكانونيكال والفهرسة. لا شيء هنا يمنع النشر.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="عنوان SEO" hint="يظهر في نتائج البحث — يُنصح بـ12 إلى 70 حرفاً (توصية فقط).">
              <input className={inputClass()} value={article.seoTitle} onChange={(e) => patch({ seoTitle: e.target.value, metaTitle: e.target.value })} />
            </Field>
            <Field label="الكلمة المفتاحية المستهدفة (Focus keyword)">
              <input className={inputClass()} value={article.primaryKeyword} onChange={(e) => patch({ primaryKeyword: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="الوصف التعريفي (Meta description)" hint="يُنصح بـ70 إلى 170 حرفاً (توصية فقط).">
              <textarea className={inputClass()} rows={2} value={article.metaDescription} onChange={(e) => patch({ metaDescription: e.target.value, ogDescription: article.ogDescription || e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="الرابط القانوني (Canonical URL)" hint="اتركيه على الرابط الذاتي (الافتراضي). غيّريه فقط عند دمج المحتوى عمداً في رابط آخر.">
              <input dir="ltr" className={inputClass()} value={article.canonical} onChange={(e) => patch({ canonical: e.target.value })} placeholder={`https://saudiersaa.com/blog/${article.slug}`} />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <label className="flex items-center gap-2 rounded-2xl border border-line px-3 py-2">
              <input type="checkbox" checked={article.noindex !== true} onChange={(e) => patch({ noindex: !e.target.checked })} />
              قابل للفهرسة (index) — إلغاء التحديد يضيف noindex
            </label>
            <label className="flex items-center gap-2 rounded-2xl border border-line px-3 py-2">
              <input type="checkbox" checked={article.nofollow !== true} onChange={(e) => patch({ nofollow: !e.target.checked })} />
              تتبّع الروابط (follow) — إلغاء التحديد يضيف nofollow
            </label>
            <label className="flex items-center gap-2 rounded-2xl border border-line px-3 py-2">
              <input type="checkbox" checked={article.excludeFromSitemap !== true} onChange={(e) => patch({ excludeFromSitemap: !e.target.checked })} />
              تضمين في خريطة الموقع (sitemap) عند النشر
            </label>
          </div>
          <div className="mt-4 rounded-2xl bg-cream p-3 text-xs leading-6 text-ink-soft">
            <p className="font-bold text-brand-deep">مسار التنقل (Breadcrumbs) وبيانات Schema</p>
            <p className="mt-1">
              يُبنى تلقائياً من التصنيف والرابط: المقالات ← {clusters.find((c) => c.id === article.cluster)?.shortTitle ?? "—"} ←{" "}
              {article.title || "عنوان المقال"}. تُصدَر بيانات JSON-LD من نوع Article + MedicalWebPage، و FAQPage عند وجود أسئلة شائعة،
              و BreadcrumbList لمسار التنقل.
            </p>
          </div>
        </Section>

        {/* ────────────────────── 3. الصور والوسائط ───────────────────────── */}
        <Section
          title="٣. الصور والوسائط"
          hint="كل الحقول اختيارية. لا تُسنَد أي صورة تلقائياً: إن لم تختاري صورة، لن تظهر أي صورة خاصة بالمقال، ولن يُصدَر أي بديل افتراضي."
        >
          <div className="space-y-5">
            <ImageField
              label="الصورة البارزة (Featured)"
              hint="تظهر أعلى صفحة المقال عند اختيارها فقط. بدون اختيار: لا صورة إطلاقاً."
              library={library}
              value={article.image || ""}
              altValue={article.imageAlt || ""}
              onPick={(file, alt) => patch({ image: file, imageAlt: file ? article.imageAlt || alt : "" })}
              onAlt={(alt) => patch({ imageAlt: alt })}
              onUploaded={(item) => setSessionMedia((c) => [...c, item])}
            />
            <ImageField
              label="صورة البطاقة (Thumbnail)"
              hint="تظهر في قوائم وبطاقات المقالات عند اختيارها فقط. بدون اختيار: بطاقة نصية بالكامل."
              library={library}
              value={article.thumbnail || ""}
              altValue={article.thumbnailAlt || ""}
              onPick={(file, alt) => patch({ thumbnail: file, thumbnailAlt: file ? article.thumbnailAlt || alt : "" })}
              onAlt={(alt) => patch({ thumbnailAlt: alt })}
              onUploaded={(item) => setSessionMedia((c) => [...c, item])}
            />
            <ImageField
              label="صورة البانر أعلى المقال (Banner / Hero)"
              hint="اختيارية — إن اختيرت فهي التي تظهر أعلى المقال بدلاً من الصورة البارزة."
              library={library}
              value={article.bannerImage || ""}
              altValue={article.bannerImageAlt || ""}
              onPick={(file, alt) => patch({ bannerImage: file, bannerImageAlt: file ? article.bannerImageAlt || alt : "" })}
              onAlt={(alt) => patch({ bannerImageAlt: alt })}
              onUploaded={(item) => setSessionMedia((c) => [...c, item])}
            />
          </div>
        </Section>

        {/* ─────────── 4. المراجع والمعلومات الطبية ───────────────────────── */}
        <Section title="٤. المراجع والمعلومات الطبية" hint="كل مرجع يجب أن يكون مصدراً حقيقياً يمكن التحقق منه. لا تُنسب جهة لمعلومة لا يدعمها مصدرها.">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="المؤلف / هيئة التحرير" hint="لا يُنسب المقال لطبيب إلا بمراجعة حقيقية موثقة.">
              <input className={inputClass()} value={article.author ?? ""} onChange={(e) => patch({ author: e.target.value })} />
            </Field>
            <Field label="المراجع الطبي" hint="اسم المراجع الطبي الحقيقي — يُترك فارغاً إن لم تتم مراجعة طبية.">
              <input className={inputClass()} value={article.medicalReviewer ?? ""} onChange={(e) => patch({ medicalReviewer: e.target.value })} />
            </Field>
            <Field label="تاريخ آخر مراجعة طبية">
              <input type="date" className={inputClass()} value={article.lastReviewedAt ?? ""} onChange={(e) => patch({ lastReviewedAt: e.target.value })} />
            </Field>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {referenceList.map((ref) => (
              <label key={ref.id} className="flex items-start gap-2 rounded-2xl border border-line p-2 text-sm">
                <input
                  type="checkbox"
                  checked={article.references.includes(ref.id)}
                  onChange={(e) =>
                    patch({
                      references: e.target.checked ? [...article.references, ref.id] : article.references.filter((r) => r !== ref.id),
                    })
                  }
                />
                <span>
                  <strong className="block">{ref.source}</strong>
                  <span className="text-xs text-ink-soft">{ref.title}</span>
                  <span className="block truncate font-mono text-[10px] text-ink-soft" dir="ltr">{ref.url}</span>
                </span>
              </label>
            ))}
          </div>

          <label className="mt-4 flex items-center gap-2 rounded-2xl border border-line px-3 py-2 text-sm">
            <input type="checkbox" checked={article.hasDisclaimer} onChange={(e) => patch({ hasDisclaimer: e.target.checked })} />
            إخلاء المسؤولية الطبية داخل المقال (يُعرض إخلاء عام على كل مقال في جميع الأحوال)
          </label>
        </Section>

        {/* ───────────────── 5. الأسئلة الشائعة ───────────────────────────── */}
        <Section
          title="٥. أسئلة متكررة (الأسئلة الشائعة)"
          hint="اختيارية تماماً — غيابها لا يمنع النشر. وجودها يضيف FAQPage schema."
          action={
            <button
              type="button"
              className="rounded-full border border-line px-3 py-1.5 text-sm"
              onClick={() => patch({ faqs: [...(article.faqs ?? []), { q: "", a: "" }] })}
            >
              إضافة سؤال
            </button>
          }
        >
          <div className="space-y-3">
            {(article.faqs ?? []).map((faq: ArticleFaq, index: number) => (
              <div key={index} className="grid gap-2 rounded-2xl border border-line p-3 md:grid-cols-[1fr_2fr_auto]">
                <input className={inputClass()} placeholder="السؤال" value={faq.q} onChange={(e) => patch({ faqs: article.faqs?.map((f, i) => (i === index ? { ...f, q: e.target.value } : f)) })} />
                <textarea className={inputClass()} rows={2} placeholder="الإجابة" value={faq.a} onChange={(e) => patch({ faqs: article.faqs?.map((f, i) => (i === index ? { ...f, a: e.target.value } : f)) })} />
                <button
                  type="button"
                  className="self-start rounded-full border border-clay px-2 py-1 text-xs text-clay"
                  onClick={() => patch({ faqs: article.faqs?.filter((_, i) => i !== index) })}
                >
                  حذف
                </button>
              </div>
            ))}
            {!article.faqs?.length ? <p className="text-xs text-ink-soft">لا توجد أسئلة — إضافتها اختيارية.</p> : null}
          </div>
        </Section>

        {/* ───────────────── 6. الروابط الداخلية ──────────────────────────── */}
        <Section title="٦. الروابط الداخلية" hint="روابط سياقية ذات صلة حقيقية فقط — بدون حشو أو روابط كلمات مفتاحية تلقائية.">
          <input
            className={inputClass()}
            dir="ltr"
            value={linksText}
            onChange={(e) => {
              setLinksText(e.target.value);
              patch({ internalLinks: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) });
            }}
            placeholder="/blog/slug-1, /safety, /when-to-see-doctor"
          />
          {stats?.suggestions.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-ink-soft">مقترحات (تُضاف يدوياً فقط):</span>
              {stats.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="rounded-full border border-line px-2 py-0.5 text-xs hover:bg-brand-soft"
                  onClick={() => patch({ internalLinks: [...new Set([...article.internalLinks, s])] })}
                >
                  + {s}
                </button>
              ))}
            </div>
          ) : null}
          {stats?.brokenTargets.length ? (
            <p className="mt-3 text-xs text-clay">روابط تشير إلى صفحات غير موجودة: {stats.brokenTargets.join("، ")}</p>
          ) : null}

          <div className="mt-5">
            <p className="mb-2 text-sm font-bold text-brand-deep">مقالات ذات صلة (روابط المجموعة)</p>
            <RelatedPicker
              article={article}
              all={managed.filter((item) => item.slug !== article.slug)}
              onToggle={(slug) =>
                patch({
                  related: article.related.includes(slug)
                    ? article.related.filter((s) => s !== slug)
                    : [...article.related, slug],
                })
              }
            />
          </div>
        </Section>

        {/* ───────────────── 7. المشاركة الاجتماعية ───────────────────────── */}
        <Section
          title="٧. المشاركة الاجتماعية"
          hint="عنوان ووصف وصورة المشاركة على واتساب وتويتر وفيسبوك. إن لم تُختَر صورة مشاركة، لن يُصدَر أي og:image أو twitter:image — ولا صورة افتراضية بديلة."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="عنوان المشاركة (OG title)" hint="افتراضياً عنوان SEO.">
              <input className={inputClass()} value={article.ogTitle} onChange={(e) => patch({ ogTitle: e.target.value })} placeholder={article.metaTitle || article.title} />
            </Field>
            <Field label="وصف المشاركة (OG description)">
              <input className={inputClass()} value={article.ogDescription} onChange={(e) => patch({ ogDescription: e.target.value })} placeholder={article.metaDescription} />
            </Field>
          </div>
          <div className="mt-4">
            <ImageField
              label="صورة المشاركة الاجتماعية (OG image)"
              hint="تُستخدم حرفياً كـ og:image و twitter:image. بدون اختيار: لا تُصدَر أي صورة مشاركة إطلاقاً."
              library={library}
              value={article.ogImage || ""}
              altValue=""
              hideAlt
              onPick={(file) => patch({ ogImage: file })}
              onAlt={() => {}}
              onUploaded={(item) => setSessionMedia((c) => [...c, item])}
            />
          </div>
          <div className="mt-3 rounded-2xl bg-cream p-3 text-xs leading-6 text-ink-soft" dir="ltr">
            <p dir="rtl" className="font-bold text-brand-deep">معاينة وسوم المشاركة</p>
            <p>og:title = {article.ogTitle || article.metaTitle || article.title || "—"}</p>
            <p>og:image = {article.ogImage || "(لا يُصدَر)"}</p>
            <p>twitter:image = {article.ogImage || "(لا يُصدَر)"}</p>
            <p>twitter:card = {article.ogImage ? "summary_large_image" : "summary"}</p>
          </div>
        </Section>

        {/* ───────────────── 8. سير النشر ─────────────────────────────────── */}
        <Section title="٨. سير النشر" hint="النشر إجراء إداري صريح: لا جدولة، ولا نشر تلقائي، ولا نشر في الخلفية.">
          <PrePublishStatus report={report} />

          <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
            <button type="button" onClick={() => save("draft")} className="rounded-full border border-line px-4 py-2 text-sm">
              حفظ مسودة
            </button>
            <Link to={`/admin/preview/${article.id}`} className="rounded-full border border-line px-4 py-2 text-sm">
              معاينة
            </Link>
            <button type="button" onClick={() => save("review")} className="rounded-full border border-line px-4 py-2 text-sm">
              إرسال للمراجعة
            </button>
            {article.status === "published" ? (
              <button type="button" disabled={busy} onClick={unpublish} className="rounded-full border border-clay px-4 py-2 text-sm text-clay">
                {busy ? "جارٍ..." : "إلغاء النشر"}
              </button>
            ) : null}
            {article.status !== "archived" ? (
              <button
                type="button"
                onClick={() => {
                  const archived: ManagedArticle = { ...article, status: "archived" };
                  upsertArticle(archived);
                  setArticle(archived);
                  setPublishNote("أُرشف المقال: لم يعد معروضاً على الموقع العام. يمكنك إعادة نشره لاحقاً.");
                }}
                className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft"
              >
                أرشفة
              </button>
            ) : (
              <button type="button" onClick={() => save("draft")} className="rounded-full border border-brand px-4 py-2 text-sm text-brand">
                إلغاء الأرشفة
              </button>
            )}
            <div className="ms-auto flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => save("published")}
                className="rounded-full bg-brand px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "جارٍ النشر..." : "نشر"}
              </button>
            </div>
            {article.source === "cms" ? (
              <button
                type="button"
                className="rounded-full border border-clay px-4 py-2 text-sm text-clay"
                onClick={() => {
                  removeArticle(article.id);
                  navigate("/admin/articles");
                }}
              >
                حذف
              </button>
            ) : null}
          </div>
          {publishError ? <p role="alert" className="mt-3 rounded-2xl bg-accent-soft p-3 text-sm leading-7 text-clay">{publishError}</p> : null}
          {publishNote ? <p role="status" className="mt-3 rounded-2xl bg-brand-soft p-3 text-sm leading-7 text-brand-deep">{publishNote}</p> : null}
        </Section>
      </div>
    </div>
  );
}

/* ── Pre-publish status: PASS / WARNING / ERROR (only ERROR blocks) ─────── */
function PrePublishStatus({ report }: { report: ReturnType<typeof prePublishReport> }) {
  const tone = report.verdict === "PASS" ? "ok" : report.verdict === "WARNING" ? "warn" : "bad";
  return (
    <div className="rounded-2xl border border-line p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-brand-deep">حالة ما قبل النشر</p>
        <Badge tone={tone}>{report.verdict}</Badge>
      </div>
      {report.errors.length ? (
        <ul className="mt-3 space-y-1 text-sm text-clay">
          {report.errors.map((item) => (
            <li key={item.id}>⛔ {item.message}</li>
          ))}
        </ul>
      ) : null}
      {report.warnings.length ? (
        <ul className="mt-3 space-y-1 text-sm text-ink-soft">
          {report.warnings.map((item) => (
            <li key={item.id}>⚠️ {item.message}</li>
          ))}
        </ul>
      ) : null}
      <p className="mt-3 text-xs leading-6 text-ink-soft">
        التحذيرات إرشادية فقط ولا تمنع النشر إطلاقاً (طول المقال، جودة SEO، الكلمات الثانوية، الأسئلة الشائعة، الصور،
        عدد العناوين). يمنع النشر فقط خطأ تقني حقيقي في البيانات أو فشل في الكتابة إلى المستودع.
      </p>
    </div>
  );
}

/* ── Image control: pick an approved/uploaded asset, upload, or none ────── */
function ImageField({
  label,
  hint,
  library,
  value,
  altValue,
  onPick,
  onAlt,
  onUploaded,
  hideAlt = false,
}: {
  label: string;
  hint?: string;
  library: MediaItem[];
  value: string;
  altValue: string;
  onPick: (file: string, alt: string) => void;
  onAlt: (alt: string) => void;
  onUploaded: (item: MediaItem) => void;
  hideAlt?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ACCEPT = "image/jpeg,image/png,image/webp";
  const MAX = 5 * 1024 * 1024;

  async function upload(file: File) {
    setError(null);
    setNote(null);
    if (!/\.(jpe?g|png|webp)$/i.test(file.name)) {
      setError("صيغة غير مدعومة. المسموح: JPG، JPEG، PNG، WEBP.");
      return;
    }
    if (file.size > MAX) {
      setError(`حجم الملف ${(file.size / 1048576).toFixed(1)}MB — الحد الأقصى 5MB.`);
      return;
    }
    setBusy(true);
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
      reader.onerror = () => reject(new Error("read"));
      reader.readAsDataURL(file);
    }).catch(() => "");
    if (!base64) {
      setBusy(false);
      setError("تعذر قراءة الملف من الجهاز.");
      return;
    }
    const res = await uploadImageRequest(file.name, base64, altValue);
    setBusy(false);
    if (!res.ok || !res.data.url) {
      setError(describeFailure(res.data as Record<string, unknown>, res.status));
      return;
    }
    const item: MediaItem = {
      file: res.data.url,
      alt: altValue || "",
      width: res.data.width ?? 0,
      height: res.data.height ?? 0,
      role: "صورة مرفوعة من لوحة التحكم",
      uploaded: true,
    };
    onUploaded(item);
    // The uploaded image is selected immediately — but only because the admin
    // performed this explicit upload action for THIS field.
    onPick(res.data.url, altValue || "");
    setNote(`${res.data.note ?? "رُفعت الصورة."} (${res.data.url})`);
  }

  return (
    <div className="rounded-2xl border border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-brand-deep">{label}</p>
        <>
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.currentTarget.value = "";
              if (file) void upload(file);
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="rounded-full bg-brand px-3 py-1.5 text-xs text-white disabled:opacity-60"
          >
            {busy ? "جارٍ الرفع..." : "رفع صورة"}
          </button>
        </>
      </div>
      {hint ? <p className="mt-1 text-xs leading-6 text-ink-soft">{hint}</p> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {/* Explicit "no image" state — absence of an image is always valid. */}
        <button
          type="button"
          className={`rounded-xl border px-3 py-4 text-xs ${!value ? "border-brand ring-2 ring-brand/30" : "border-line"}`}
          onClick={() => onPick("", "")}
        >
          بدون صورة
        </button>
        {library.map((item) => {
          const active = value === item.file;
          return (
            <button
              key={item.file}
              type="button"
              title={item.alt || item.file}
              className={`w-24 overflow-hidden rounded-xl border p-1 text-[10px] ${active ? "border-brand ring-2 ring-brand/30" : "border-line"}`}
              onClick={() => onPick(item.file, item.alt)}
            >
              <img src={item.file} alt={item.alt} loading="lazy" className="h-14 w-full rounded-lg object-cover" />
              <span className="mt-1 block truncate font-mono text-[9px]" dir="ltr">
                {item.file.replace(/^\/(images|media)\//, "")}
              </span>
            </button>
          );
        })}
      </div>

      {value ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span dir="ltr" className="rounded-full bg-cream px-3 py-1 font-mono text-xs">{value}</span>
          <button type="button" onClick={() => onPick("", "")} className="rounded-full border border-clay px-3 py-1 text-xs text-clay">
            إزالة الصورة
          </button>
        </div>
      ) : (
        <p className="mt-3 text-xs text-ink-soft">لم تُحدَّد صورة — لن تظهر أي صورة، ولن يُستبدل ذلك بصورة افتراضية.</p>
      )}

      <p className="mt-2 text-[11px] leading-5 text-ink-soft">
        الصيغ المقبولة للرفع: JPG · JPEG · PNG · WEBP (حتى 5MB). تُلتزم الصورة في المستودع فتبقى بعد التحديث وتسجيل الخروج
        وإعادة النشر.
      </p>

      {!hideAlt ? (
        <div className="mt-2">
          <label className="text-xs font-semibold text-ink-soft">النص البديل (ALT) — يُعرض كما كتبتِه تماماً</label>
          <input className={`${inputClass()} mt-1`} value={altValue} onChange={(e) => onAlt(e.target.value)} placeholder="وصف دقيق ومختصر لمحتوى الصورة" />
        </div>
      ) : null}

      {error ? <p role="alert" className="mt-2 rounded-xl bg-accent-soft p-2 text-xs leading-6 text-clay">{error}</p> : null}
      {note ? <p role="status" className="mt-2 rounded-xl bg-brand-soft p-2 text-xs leading-6 text-brand-deep">{note}</p> : null}
    </div>
  );
}

/* ── Related-articles multi-select (internal linking) ───────────────────── */
function RelatedPicker({
  article,
  all,
  onToggle,
}: {
  article: ManagedArticle;
  all: ManagedArticle[];
  onToggle: (slug: string) => void;
}) {
  const [q, setQ] = useState("");
  const slugSet = new Set(all.map((a) => a.slug));
  const selected = article.related.filter((s) => !slugSet.has(s));
  const rows = all
    .filter((a) => (q ? a.title.includes(q) || a.slug.includes(q) : true))
    .slice(0, 40);
  return (
    <div>
      <input
        className={inputClass()}
        placeholder="ابحثي عن مقال لإضافته كرابط داخلي..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {selected.length ? (
        <p className="mt-2 text-xs text-clay">قيم محفوظة لا تطابق مقالاً حالياً: {selected.join("، ")}</p>
      ) : null}
      <div className="mt-3 grid max-h-64 gap-1 overflow-y-auto rounded-2xl border border-line p-2 sm:grid-cols-2">
        {rows.map((item) => {
          const checked = article.related.includes(item.slug);
          return (
            <label key={item.id} className="flex items-start gap-2 rounded-xl px-2 py-1 text-sm hover:bg-cream">
              <input type="checkbox" checked={checked} onChange={() => onToggle(item.slug)} />
              <span className="min-w-0">
                <span className="block truncate">{item.title}</span>
                <span className="block truncate font-mono text-[10px] text-ink-soft" dir="ltr">
                  /blog/{item.slug} · {item.status}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ink-soft">{article.related.length} مقال مرتبط محدد.</p>
    </div>
  );
}
