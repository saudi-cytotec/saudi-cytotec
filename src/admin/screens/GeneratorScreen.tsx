import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCatalog } from "../../cms/CatalogContext";
import { runGenerationPipeline } from "../../cms/generationPipeline";
import { competitorGaps, contentMap } from "../../cms/registrySource";
import { clusters } from "../../data/site";
import type { ClusterId, ManagedArticle, SearchIntent } from "../../types";
import { suggestSlug } from "../../utils/slug";
import { generateRequest } from "../api";
import { applyTopicDefaults, blocksFromGenerated, emptyArticle } from "../articleFactory";
import { Badge, Field, Section, inputClass } from "../ui";

type Stage = "research" | "outline" | "draft";

interface ResearchResult {
  searchIntent: SearchIntent;
  audience: string;
  angle: string;
  keywords: string[];
  questions: string[];
  gaps: string[];
  source: "openai" | "local";
}

interface OutlineResult {
  h1: string;
  seoTitle: string;
  metaDescription: string;
  sections: { heading: string; level: 2 | 3; purpose: string }[];
  faqSeeds: string[];
  internalLinks: string[];
  source: "openai" | "local";
}

export function GeneratorScreen() {
  const { upsertArticle, managed } = useCatalog();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    topic: "الحمل خارج الرحم: العلامات المبكرة ومتى تكون الحالة طارئة",
    primaryKeyword: "أعراض الحمل خارج الرحم",
    cluster: "emergency" as ClusterId,
    country: "SA",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [research, setResearch] = useState<ResearchResult | null>(null);
  const [outline, setOutline] = useState<OutlineResult | null>(null);
  const [draftArticle, setDraftArticle] = useState<ManagedArticle | null>(null);
  const [draftNote, setDraftNote] = useState<string | null>(null);

  const liveSlugs = useMemo(() => new Set(managed.map((a) => a.slug)), [managed]);

  const clusterLabel = clusters.find((c) => c.id === form.cluster)?.title ?? form.cluster;

  async function runStage(stage: Stage) {
    setBusy(true);
    setError(null);
    try {
      const res = await generateRequest({
        stage,
        topic: form.topic,
        primaryKeyword: form.primaryKeyword,
        cluster: form.cluster,
        country: form.country,
        existingSlugs: [...liveSlugs],
      });
      if (res.ok && res.data) {
        if (stage === "research" && res.data.research) {
          const r = res.data.research as Record<string, unknown>;
          setResearch({
            searchIntent: (r.searchIntent as SearchIntent) ?? "informational",
            audience: String(r.audience ?? ""),
            angle: String(r.angle ?? ""),
            keywords: Array.isArray(r.keywords) ? r.keywords.map(String) : [],
            questions: Array.isArray(r.questions) ? r.questions.map(String) : [],
            gaps: Array.isArray(r.gaps) ? r.gaps.map(String) : [],
            source: "openai",
          });
        } else if (stage === "outline" && res.data.outline) {
          const o = res.data.outline as Record<string, unknown>;
          setOutline({
            h1: String(o.h1 ?? form.topic),
            seoTitle: String(o.seoTitle ?? form.topic.slice(0, 70)),
            metaDescription: String(o.metaDescription ?? ""),
            sections: Array.isArray(o.sections) ? o.sections.map((s) => ({ heading: String(s?.heading ?? ""), level: s?.level === 3 ? 3 : 2, purpose: String(s?.purpose ?? "") })) : [],
            faqSeeds: Array.isArray(o.faqSeeds) ? o.faqSeeds.map(String) : [],
            internalLinks: Array.isArray(o.internalLinks) ? o.internalLinks.map(String) : [],
            source: "openai",
          });
        } else if (stage === "draft" && res.data.article) {
          applyGenerated(res.data.article as Record<string, unknown>);
        }
      } else {
        runLocalFallback(stage);
      }
    } catch {
      runLocalFallback(stage);
    } finally {
      setBusy(false);
    }
  }

  function runLocalFallback(stage: Stage) {
    // Local editorial fallback: uses the committed competitor matrix and the
    // content map so the workflow remains useful without OPENAI_API_KEY.
    if (stage === "research") {
      const related = competitorGaps.filter((gap) => gap.keyword.includes(form.primaryKeyword.slice(0, 4)) || form.primaryKeyword.includes(gap.keyword.slice(0, 4)));
      const mapRow = contentMap.find((row) => row.primaryKeyword === form.primaryKeyword || row.primaryKeyword.includes(form.primaryKeyword.slice(0, 6)));
      setResearch({
        searchIntent: "informational",
        audience: "نساء في السعودية والخليج يبحثن عن معلومة طبية موثقة بالعربية",
        angle: mapRow
          ? `موضوع ${mapRow.id} (${mapRow.priority}) في مجموعة ${mapRow.cluster}: يغطي "${mapRow.primaryKeyword}" — القصد ${mapRow.searchIntent}.`
          : "مقال تعليمي يشرح الموضوع ويفصل بين العلامة المبكرة والحالة الطارئة، ويوجه للرعاية المرخصة.",
        keywords: [form.primaryKeyword, ...(mapRow?.secondaryKeywords ?? [])].slice(0, 6),
        questions: ["ما الأعراض المبكرة؟", "متى تكون الحالة طارئة؟", "ماذا أقول للطبيب؟", "أين أجد المصادر الرسمية؟"],
        gaps: related.length
          ? related.map((gap) => `${gap.keyword}: المنافسون لا يقدمون ${gap.missingInformation} — فرصتنا ${gap.ourOpportunity}`)
          : ["لا توجد بيانات مصفوفة منافسين مطابقة لهذه الكلمة — ابدئي من الفجوة الأقرب في تبويب المنافسين."],
        source: "local",
      });
    } else if (stage === "outline") {
      setOutline({
        h1: form.topic,
        seoTitle: form.topic.slice(0, 70),
        metaDescription: `مقال تعليمي موثق عن ${form.primaryKeyword}: التعريف، الأعراض، متى تكون الحالة طارئة، ومتى تجب مراجعة الطبيب.`,
        sections: [
          { heading: "ماذا يعني هذا المصطلح طبياً", level: 2, purpose: "تعريف واضح من مصادر موثقة" },
          { heading: "العلامات الشائعة التي يجب معرفتها", level: 2, purpose: "الأعراض في سياقها" },
          { heading: "متى تكون الحالة طارئة", level: 2, purpose: "فصل العلامة المبكرة عن الخطر" },
          { heading: "ماذا يحدث عند مراجعة الطبيب", level: 2, purpose: "تهيئة القارئة للمسار المرخص" },
          { heading: "مصادر لمزيد من القراءة", level: 2, purpose: "مراجع رسمية قابلة للتحقق" },
        ],
        faqSeeds: ["هل هذه الأعراض تستدعي الطوارئ؟", "ما الفحوصات المتوقعة؟", "متى أعود للطبيب مرة أخرى؟"],
        internalLinks: ["/when-to-see-doctor", "/medical-sources", "/medical-disclaimer"],
        source: "local",
      });
    } else {
      const slug = suggestSlug(form.primaryKeyword) || "topic-draft";
      const pipeline = runGenerationPipeline({ topic: form.topic, primaryKeyword: form.primaryKeyword, cluster: form.cluster });
      const article = applyTopicDefaults(
        emptyArticle({
          slug,
          title: form.topic,
          h1: outline?.h1 ?? form.topic,
          excerpt: outline?.metaDescription ?? "",
          metaDescription: outline?.metaDescription ?? "",
          seoTitle: outline?.seoTitle ?? form.topic.slice(0, 70),
          primaryKeyword: form.primaryKeyword,
          secondaryKeywords: research?.keywords ?? [],
          cluster: form.cluster,
          searchIntent: research?.searchIntent ?? "informational",
          blocks: pipeline.blocks,
          faqs: (outline?.faqSeeds ?? []).map((q) => ({ q, a: "أجيب عن هذا السؤال أثناء المراجعة التحريرية." })),
          internalLinks: outline?.internalLinks ?? ["/when-to-see-doctor", "/medical-disclaimer"],
          references: ["fdaLabel", "sfda", "medlinePlus"],
          hasDisclaimer: true,
          status: "draft",
        }),
      );
      setDraftArticle(article);
      upsertArticle(article);
      setDraftNote(
        `اكتملت المسودة (${pipeline.wordCount} كلمة في المتن). افتحيها في المحرر للتحرير والمراجعة قبل النشر اليدوي.`,
      );
    }
  }

  function applyGenerated(generated: Record<string, unknown>) {
    const slug = suggestSlug(form.primaryKeyword) || "topic-draft";
    const article = applyTopicDefaults(
      emptyArticle({
        slug,
        title: String(generated.title ?? form.topic),
        h1: String(generated.h1 ?? form.topic),
        excerpt: String(generated.excerpt ?? ""),
        metaDescription: String(generated.metaDescription ?? ""),
        seoTitle: String(generated.seoTitle ?? form.topic.slice(0, 70)),
        primaryKeyword: form.primaryKeyword,
        secondaryKeywords: research?.keywords ?? [],
        cluster: form.cluster,
        searchIntent: research?.searchIntent ?? "informational",
        blocks: blocksFromGenerated(generated.blocks),
        faqs: Array.isArray(generated.faqs) ? (generated.faqs as { q: string; a: string }[]) : [],
        internalLinks: Array.isArray(generated.internalLinks) ? generated.internalLinks.map(String) : [],
        references: ["fdaLabel", "sfda"],
        hasDisclaimer: true,
        status: "draft",
      }),
    );
    setDraftArticle(article);
    upsertArticle(article);
    setDraftNote("اكتملت المسودة عبر OpenAI. راجعيها في المحرر قبل أي نشر.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <h1 className="text-3xl font-bold text-brand-deep">مولّد المقالات — سير العمل التحريري</h1>
        <p className="max-w-3xl text-sm leading-7 text-ink-soft">
          المسار: الكلمة والقصد ← بحث المنافسين والفجوات ← الهيكل ← المسودة ← SEO والروابط والمراجع ← المراجعة النهائية في المحرر. لا نشر آلي: كل مقال يمر بمراجعة بشرية في المحرر قبل الزر الأخضر.
        </p>

        <Section title="المدخلات">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="موضوع المقال">
              <input className={inputClass()} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
            </Field>
            <Field label="الكلمة الأساسية">
              <input className={inputClass()} value={form.primaryKeyword} onChange={(e) => setForm({ ...form, primaryKeyword: e.target.value })} />
            </Field>
            <Field label="المجموعة">
              <select className={inputClass()} value={form.cluster} onChange={(e) => setForm({ ...form, cluster: e.target.value as ClusterId })}>
                {clusters.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </Field>
            <Field label="سياق الدولة (لا تُنسب قوانين دولة لدولة أخرى)">
              <select className={inputClass()} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                <option value="SA">السعودية</option>
                <option value="AE">الإمارات</option>
                <option value="KW">الكويت</option>
                <option value="BH">البحرين</option>
                <option value="">خليجي عام</option>
              </select>
            </Field>
          </div>
        </Section>

        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy || !form.topic} onClick={() => runStage("research")} className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-50">
            1 · البحث والقصد {research ? "✓" : ""}
          </button>
          <button type="button" disabled={busy || !form.topic} onClick={() => runStage("outline")} className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-50">
            2 · الهيكل {outline ? "✓" : ""}
          </button>
          <button type="button" disabled={busy || !form.topic} onClick={() => runStage("draft")} className="rounded-full bg-brand px-4 py-2 text-sm text-white disabled:opacity-50">
            {busy ? "جارٍ التوليد..." : "3 · توليد المسودة"}
          </button>
        </div>
        {error ? <p className="rounded-2xl bg-accent-soft p-3 text-sm text-clay">{error}</p> : null}
        {draftNote ? <p role="status" className="rounded-2xl bg-brand-soft p-3 text-sm text-brand-deep">{draftNote}</p> : null}
        {draftArticle ? (
          <button type="button" onClick={() => navigate(`/admin/articles/${draftArticle.id}`)} className="rounded-full bg-brand px-5 py-2 text-sm text-white">
            4 · فتح المسودة في المحرر (المراجعة النهائية)
          </button>
        ) : null}
      </div>

      <aside className="h-fit space-y-4">
        {research ? (
          <div className="rounded-3xl border border-line bg-paper p-5 text-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-brand-deep">البحث والقصد</h2>
              <Badge tone={research.source === "openai" ? "ok" : "info"}>{research.source === "openai" ? "OpenAI" : "محلي (مصفوفة المنافسين)"}</Badge>
            </div>
            <p className="mt-2 text-xs text-ink-soft">المجموعة: {clusterLabel}</p>
            <dl className="mt-3 space-y-2">
              <dt className="text-xs text-ink-soft">القصد البحثي</dt>
              <dd className="font-semibold">{research.searchIntent}</dd>
              <dt className="text-xs text-ink-soft">الجمهور</dt>
              <dd className="leading-6">{research.audience}</dd>
              <dt className="text-xs text-ink-soft">زاوية التغطية</dt>
              <dd className="leading-6">{research.angle}</dd>
              {research.keywords.length ? (
                <>
                  <dt className="text-xs text-ink-soft">كلمات ثانوية</dt>
                  <dd className="flex flex-wrap gap-1">{research.keywords.map((k) => <span key={k} className="rounded-full bg-cream px-2 py-0.5 text-xs">{k}</span>)}</dd>
                </>
              ) : null}
              {research.gaps.length ? (
                <>
                  <dt className="text-xs text-ink-soft">فجوات المنافسين</dt>
                  <dd>
                    <ul className="list-disc space-y-1 pr-5 text-xs leading-5">{research.gaps.map((g) => <li key={g}>{g}</li>)}</ul>
                  </dd>
                </>
              ) : null}
            </dl>
          </div>
        ) : null}

        {outline ? (
          <div className="rounded-3xl border border-line bg-paper p-5 text-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-brand-deep">الهيكل</h2>
              <Badge tone={outline.source === "openai" ? "ok" : "info"}>{outline.source === "openai" ? "OpenAI" : "محلي"}</Badge>
            </div>
            <p className="mt-2 font-semibold">{outline.h1}</p>
            <p className="mt-1 text-xs text-ink-soft">{outline.seoTitle} · {outline.metaDescription}</p>
            <ol className="mt-3 space-y-2">
              {outline.sections.map((section) => (
                <li key={section.heading} className="rounded-2xl border border-line p-2">
                  <strong className="text-xs">{section.level === 3 ? "H3" : "H2"} · {section.heading}</strong>
                  <span className="block text-xs text-ink-soft">{section.purpose}</span>
                </li>
              ))}
            </ol>
            {outline.internalLinks.length ? (
              <p className="mt-2 font-mono text-[10px] text-ink-soft" dir="ltr">{outline.internalLinks.join(" · ")}</p>
            ) : null}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
