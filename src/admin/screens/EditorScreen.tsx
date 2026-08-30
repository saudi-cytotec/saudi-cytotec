import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCatalog } from "../../cms/CatalogContext";
import { mediaLibrary } from "../../data/media";
import { referenceList } from "../../data/references";
import { clusters } from "../../data/site";
import type { ArticleFaq, ArticleStatus, ClusterId, ManagedArticle } from "../../types";
import { buildLinkGraph } from "../../utils/internalLinks";
import { suggestSlug } from "../../utils/slug";
import { checkArticleIntegrity } from "../../utils/validation";
import { applyTopicDefaults, emptyArticle } from "../articleFactory";
import { publishRequest, unpublishRequest } from "../api";
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
  const graph = useMemo(() => buildLinkGraph(managed), [managed]);
  const stats = graph.stats.get(article.slug);

  const [publishNote, setPublishNote] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [secondaryText, setSecondaryText] = useState(() => article.secondaryKeywords.join(", "));
  const [linksText, setLinksText] = useState(() => article.internalLinks.join(", "));

  function patch(next: Partial<ManagedArticle>) {
    setArticle((current) => applyTopicDefaults({ ...current, ...next, updatedAt: new Date().toISOString().slice(0, 10) }));
  }

  async function save(status?: ArticleStatus, schedule = false) {
    setPublishNote(null);
    setPublishError(null);
    const next = { ...article, status: status ?? article.status, ...(schedule && scheduleDate ? { publishAt: scheduleDate } : {}) };
    // Only a technically broken record is refused (no working URL, no title, or
    // empty body). This is data integrity, NOT SEO/content-quality validation.
    if ((status === "published" || schedule) && !integrity.ok) {
      setPublishError("تعذر الحفظ: " + integrity.problems.map((p) => p.message).join(" · "));
      return;
    }
    if ((status === "published" || (status === "scheduled" && schedule)) && next.source === "cms") {
      next.slugLocked = true;
    }
    if (status === "published" || schedule) {
      setBusy(true);
      const res = await publishRequest(next, schedule);
      setBusy(false);
      if (!res.ok) {
        const msg = res.data?.error || res.data?.blocker || "تعذر النشر.";
        setPublishNote(`${msg} — حُفظ المقال محلياً ويمكن إعادة المحاولة.`);
        upsertArticle({ ...next, status: schedule ? "scheduled" : "draft" });
        setArticle({ ...next, status: schedule ? "scheduled" : "draft" });
        return;
      }
      setPublishNote(res.data?.note || (res.data?.scheduled ? "تمت الجدولة." : "تم النشر إلى المستودع."));
      upsertArticle({ ...next, status: schedule ? "scheduled" : "published" });
      setArticle({ ...next, status: schedule ? "scheduled" : "published" });
      if (!schedule && mode === "create") navigate(`/admin/articles/${next.id}`);
      return;
    }
    upsertArticle(next);
    setArticle(next);
    if (mode === "create") navigate(`/admin/articles/${next.id}`);
  }

  async function unpublish() {
    setPublishNote(null);
    setPublishError(null);
    setBusy(true);
    const res = await unpublishRequest(article.slug);
    setBusy(false);
    if (!res.ok) {
      setPublishNote(`${res.data?.error || "تعذر إلغاء النشر."}`);
      return;
    }
    setPublishNote("تم إلغاء النشر. ستُزال الصفحة في النشر التالي.");
    upsertArticle({ ...article, status: "draft" });
  }

  if (!ready) return <p>جاري تحميل المقال...</p>;
  if (mode === "edit" && !existing) return <p>المقال غير موجود.</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-brand-deep">{mode === "create" ? "إنشاء مقال" : "تحرير مقال"}</h1>
          <div className="flex gap-2 text-xs">
            <Badge tone={article.status === "published" ? "ok" : article.status === "scheduled" ? "info" : "warn"}>{article.status}</Badge>
            <Badge tone="neutral">{article.source === "static" ? "أصل الموقع (محمي)" : "محتوى اللوحة"}</Badge>
          </div>
        </div>

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
              onChange={(e) => patch({ primaryKeyword: e.target.value, slug: article.slugLocked ? article.slug : suggestSlug(e.target.value) })}
            />
          </Field>
          <Field label="الكلمات المفتاحية الثانوية" hint="افصلي بفواصل — تظهر في التحليل فقط ولا تُحشى في النص.">
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
          <Field label="عنوان SEO" hint="يظهر في نتائج البحث — 12 إلى 70 حرفاً.">
            <input className={inputClass()} value={article.seoTitle} onChange={(e) => patch({ seoTitle: e.target.value, metaTitle: e.target.value })} />
          </Field>
          <Field label="المجموعة (التصنيف)">
            <select className={inputClass()} value={article.cluster} onChange={(e) => patch({ cluster: e.target.value as ClusterId })}>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="المؤلف / هيئة التحرير" hint="لا يُنسب المقال لطبيب إلا بمراجعة حقيقية موثقة.">
            <input className={inputClass()} value={article.author ?? ""} onChange={(e) => patch({ author: e.target.value })} />
          </Field>
        </div>

        <Field label="الوصف التعريفي (Meta description)" hint="70 إلى 170 حرفاً.">
          <textarea className={inputClass()} rows={2} value={article.metaDescription} onChange={(e) => patch({ metaDescription: e.target.value, ogDescription: e.target.value })} />
        </Field>

        <Field label="الملخص (Excerpt)">
          <textarea className={inputClass()} rows={2} value={article.excerpt} onChange={(e) => patch({ excerpt: e.target.value, description: e.target.value })} />
        </Field>

        <Section title="SEO والمشاركة الاجتماعية" hint="عنوان ووصف المشاركة يُستخدمان في Open Graph وتويتر. الكانونيال يُترك للحقل التلقائي إلا لدمج صفحتين.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="عنوان المشاركة (OG title)" hint="يُستخدم عند المشاركة — افتراضياً عنوان SEO.">
              <input className={inputClass()} value={article.ogTitle} onChange={(e) => patch({ ogTitle: e.target.value })} placeholder={article.metaTitle || article.title} />
            </Field>
            <Field label="وصف المشاركة (OG description)">
              <input className={inputClass()} value={article.ogDescription} onChange={(e) => patch({ ogDescription: e.target.value })} placeholder={article.metaDescription} />
            </Field>
          </div>
          <Field label="الرابط القانوني (Canonical URL)" hint="اتركه فارغاً للكانونيكال التلقائي الذاتي. عدّله فقط عند دمج المحتوى في رابط آخر.">
            <input dir="ltr" className={inputClass()} value={article.canonical} onChange={(e) => patch({ canonical: e.target.value })} placeholder={`https://saudiersaa.com/blog/${article.slug}`} />
          </Field>
        </Section>

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

        <Section title="أسئلة متكررة (FAQ)" action={
          <button
            type="button"
            className="rounded-full border border-line px-3 py-1.5 text-sm"
            onClick={() => patch({ faqs: [...(article.faqs ?? []), { q: "", a: "" }] })}
          >
            إضافة سؤال
          </button>
        }>
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
            {!article.faqs?.length ? <p className="text-xs text-ink-soft">لا توجد أسئلة — أضيفيها ليحصل المقال على FAQ schema.</p> : null}
          </div>
        </Section>

        <Section title="المراجع" hint="كل مرجع يجب أن يكون مصدراً حقيقياً يمكن التحقق منه.">
          <div className="grid gap-2 md:grid-cols-2">
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
                </span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="الروابط الداخلية" hint="روابط سياقية مفيدة فقط — ذات صلة حقيقية، بدون حشو.">
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
              <span className="text-xs text-ink-soft">مقترحات من المحرك:</span>
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
        </Section>

        <Section
          title="الصور والمشاركة"
          hint="كل حقل مستقل وينعكس فعلياً على الصفحة العامة: الصورة البارزة في البطاقات، البانر أعلى المقال، وصورة المشاركة على الشبكات."
        >
          <div className="space-y-5">
            <ImageField
              label="الصورة البارزة (Featured / thumbnail)"
              hint="اختيارية — إن تُركت فارغة لن تظهر أي صورة في البطاقات أو أعلى المقال ولن تُصدر أي og:image."
              value={article.image || ""}
              altValue={article.imageAlt || ""}
              onPick={(file, alt) => patch({ image: file, imageAlt: article.imageAlt || alt })}
              onUrl={(url) => patch({ image: url })}
              onAlt={(alt) => patch({ imageAlt: alt })}
            />
            <ImageField
              label="صورة البانر / البطل أعلى المقال (Banner / Hero)"
              hint="اختيارية — إن تُركت فارغة تُستخدم الصورة البارزة. يُنصح بنسبة 16:9."
              value={article.bannerImage || ""}
              altValue={article.bannerImageAlt || ""}
              onPick={(file, alt) => patch({ bannerImage: file, bannerImageAlt: article.bannerImageAlt || alt })}
              onUrl={(url) => patch({ bannerImage: url })}
              onAlt={(alt) => patch({ bannerImageAlt: alt })}
            />
            <ImageField
              label="صورة المشاركة الاجتماعية (OG image)"
              hint="تظهر عند مشاركة الرابط على واتساب وتويتر وفيسبوك. إن تُركت فارغة (ولم تُحدّد صورة بارزة) لن تُصدر أي og:image/twitter:image."
              value={article.ogImage || ""}
              altValue=""
              hideAlt
              onPick={(file) => patch({ ogImage: file })}
              onUrl={(url) => patch({ ogImage: url })}
              onAlt={() => {}}
            />
          </div>
        </Section>

        <Section
          title="مقالات ذات صلة"
          hint="تظهر في قسم «مقالات ذات صلة» أسفل المقال — روابط داخلية حقيقية لمحتوى منشور."
        >
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
        </Section>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-2xl border border-line px-3 py-2 text-sm">
            <input type="checkbox" checked={article.hasDisclaimer} onChange={(e) => patch({ hasDisclaimer: e.target.checked })} />
            إخلاء المسؤولية الطبية داخل المقال
          </label>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line pt-4">
          <button type="button" onClick={() => save("draft")} className="rounded-full border border-line px-4 py-2 text-sm">
            حفظ مسودة
          </button>
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
            <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="rounded-full border border-line px-3 py-2 text-sm" />
            <button
              type="button"
              disabled={!scheduleDate || busy}
              onClick={() => save("scheduled", true)}
              className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-50"
            >
              {busy ? "جارٍ..." : "جدولة النشر"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => save("published")}
              className="rounded-full bg-brand px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "جارٍ النشر..." : "نشر"}
            </button>
          </div>
          <Link to={`/admin/preview/${article.id}`} className="rounded-full border border-line px-4 py-2 text-sm">
            معاينة
          </Link>
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
        {publishError ? <p role="alert" className="rounded-2xl bg-accent-soft p-3 text-sm text-clay">{publishError}</p> : null}
        {publishNote ? <p role="status" className="rounded-2xl bg-brand-soft p-3 text-sm leading-7 text-brand-deep">{publishNote}</p> : null}
      </div>
    </div>
  );
}

/* ── Reusable image control: media-library picker + custom URL + alt ─────── */
function ImageField({
  label,
  hint,
  value,
  altValue,
  onPick,
  onUrl,
  onAlt,
  hideAlt = false,
}: {
  label: string;
  hint?: string;
  value: string;
  altValue: string;
  onPick: (file: string, alt: string) => void;
  onUrl: (url: string) => void;
  onAlt: (alt: string) => void;
  hideAlt?: boolean;
}) {
  const [url, setUrl] = useState("");
  const isExternal = (v: string) => /^https?:\/\//.test(v);
  return (
    <div className="rounded-2xl border border-line p-4">
      <p className="text-sm font-bold text-brand-deep">{label}</p>
      {hint ? <p className="mt-1 text-xs leading-6 text-ink-soft">{hint}</p> : null}

      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
        {mediaLibrary.map((item) => {
          const active = value === item.file;
          return (
            <button
              key={item.file}
              type="button"
              title={item.alt}
              className={`overflow-hidden rounded-xl border p-1 text-[10px] ${active ? "border-brand ring-2 ring-brand/30" : "border-line"}`}
              onClick={() => onPick(item.file, item.alt)}
            >
              <img src={item.file} alt={item.alt} loading="lazy" className="h-14 w-full rounded-lg object-cover" />
              <span className="mt-1 block truncate font-mono text-[9px]" dir="ltr">
                {item.file.replace("/images/", "").slice(0, 14)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          dir="ltr"
          value={value}
          onChange={(e) => onUrl(e.target.value)}
          placeholder="/images/... أو رفع سابق أو رابط https"
          className={`${inputClass()} flex-1 font-mono text-xs`}
        />
        {value && !isExternal(value) ? (
          <img src={value} alt={altValue || label} className="h-10 w-16 rounded-lg border border-line object-cover" loading="lazy" />
        ) : null}
        {value ? (
          <button type="button" onClick={() => onUrl("")} className="rounded-full border border-clay px-3 py-1 text-xs text-clay">
            مسح
          </button>
        ) : null}
      </div>
      <p className="mt-1 text-[11px] text-ink-soft">
        أو الصقي رابط صورة رُفعت:{" "}
        <input
          dir="ltr"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => url.trim() && onUrl(url.trim())}
          placeholder="https://…  أو  /images/uploads/x.jpg"
          className="ms-1 w-56 rounded-full border border-line px-2 py-0.5 font-mono text-[11px]"
        />
      </p>

      {!hideAlt ? (
        <div className="mt-2">
          <label className="text-xs font-semibold text-ink-soft">النص البديل (ALT) — وصف للصورة لقارئات الشاشة وSEO</label>
          <input className={`${inputClass()} mt-1`} value={altValue} onChange={(e) => onAlt(e.target.value)} placeholder="وصف دقيق ومختصر لمحتوى الصورة" />
        </div>
      ) : null}
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
  // Keep currently-selected values even if they point at a slug not in the list.
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
