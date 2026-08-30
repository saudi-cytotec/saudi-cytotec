import { useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../cms/CatalogContext";
import { competitorGaps, geoCoverage } from "../../cms/registrySource";
import { Badge, EmptyState, Td, Th } from "../ui";

type Tab = "articles" | "competitors" | "geo" | "pr";

export function SeoScreen() {
  const [tab, setTab] = useState<Tab>("articles");
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-brand-deep">إدارة SEO</h1>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["articles", "حقول SEO للمقالات"],
            ["competitors", "مصفوفة المنافسين"],
            ["geo", "التغطية الجغرافية"],
            ["pr", "الروابط والعلاقات الرقمية"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-2 text-sm ${tab === key ? "bg-brand text-white" : "border border-line bg-paper"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "articles" ? <ArticlesTab /> : null}
      {tab === "competitors" ? <CompetitorsTab /> : null}
      {tab === "geo" ? <GeoTab /> : null}
      {tab === "pr" ? <PrTab /> : null}
    </div>
  );
}

/**
 * A plain reference list of the SEO fields for each article. This is an editing
 * aid, not a scoring/validation panel: no ERROR / WARNING / PASS, no SEO score,
 * nothing that judges or gates publishing. Click through to edit any field.
 */
function ArticlesTab() {
  const { managed } = useCatalog();

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-cream">
            <tr>
              <Th>المقال</Th>
              <Th>SEO title</Th>
              <Th>Meta description</Th>
              <Th>الكلمة الأساسية</Th>
            </tr>
          </thead>
          <tbody>
            {managed.map((article) => (
              <tr key={article.id} className="border-t border-line">
                <Td>
                  <Link to={`/admin/articles/${article.id}`} className="font-semibold text-brand hover:underline">
                    {article.title || "بدون عنوان"}
                  </Link>
                </Td>
                <Td className="max-w-xs truncate">{article.seoTitle || "—"}</Td>
                <Td className="max-w-md truncate">{article.metaDescription || "—"}</Td>
                <Td>{article.primaryKeyword || "—"}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs leading-6 text-ink-soft">
        هذه قائمة مرجعية لحقول SEO يمكن تحريرها من المحرر — ليست نظام تقييم ولا بوابة نشر. عمليات الفحص التقني للموقع (canonical، schema، robots، sitemap) تُشغّل من <span dir="ltr">scripts/auditSeo.mjs</span> وتُكتب نتائجها في <span dir="ltr">docs/seo-audit.md</span>.
      </p>
    </div>
  );
}

function CompetitorsTab() {
  return (
    <div className="space-y-4">
      <p className="max-w-3xl text-sm leading-7 text-ink-soft">
        مصفوفة الفجوات مقابل المنافسين المدروسين (taxiporteu.com، femseha.com، sehaher.com، ومواقع البيع). المصدر: <span dir="ltr">content/competitors.json</span> · التقرير الكامل: <span dir="ltr">docs/competitor-research.md</span>.
      </p>
      <div className="overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-cream">
            <tr>
              <Th>الكلمة</Th>
              <Th>المنافس</Th>
              <Th>القصد</Th>
              <Th>جودة محتواه</Th>
              <Th>ما ينقصه</Th>
              <Th>فرصتنا</Th>
              <Th>الأولوية</Th>
            </tr>
          </thead>
          <tbody>
            {competitorGaps.map((gap) => (
              <tr key={gap.keyword} className="border-t border-line align-top">
                <Td className="font-semibold">{gap.keyword}</Td>
                <Td>
                  {gap.competitor}
                  {gap.competitorUrl ? (
                    <a className="block text-xs text-brand underline" href={gap.competitorUrl} target="_blank" rel="noreferrer">
                      الرابط
                    </a>
                  ) : null}
                </Td>
                <Td>{gap.searchIntent}</Td>
                <Td className="text-xs leading-5">{gap.contentQuality}</Td>
                <Td className="text-xs leading-5">{gap.missingInformation}</Td>
                <Td className="text-xs leading-5">{gap.ourOpportunity}</Td>
                <Td><Badge tone={gap.priority === "P0" ? "bad" : "warn"}>{gap.priority}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </table>
        {!competitorGaps.length ? <EmptyState text="لا توجد بيانات مصفوفة." /> : null}
      </div>
    </div>
  );
}

function GeoTab() {
  return (
    <div className="space-y-4">
      <p className="max-w-3xl text-sm leading-7 text-ink-soft">{geoCoverage.policy}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {geoCoverage.countries.map((country) => (
          <div key={country.code} className="rounded-3xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-brand-deep">{country.name}</h3>
              <Badge tone={country.priority === "PRIMARY" ? "ok" : "info"}>{country.priority === "PRIMARY" ? "أولوية" : "ثانوية"}</Badge>
            </div>
            <dl className="mt-3 grid gap-1 text-sm">
              <dt className="text-xs text-ink-soft">الجهة التنظيمية</dt>
              <dd>{country.regulator}</dd>
              <dt className="text-xs text-ink-soft">الخط الصحي / الطوارئ</dt>
              <dd>{country.healthLine} / {country.emergency}</dd>
            </dl>
            <p className="mt-2 text-xs leading-6 text-ink-soft">{country.note}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-line bg-paper p-5">
        <h3 className="font-bold text-brand-deep">قرارات المدن (لا صفحات مدن)</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {geoCoverage.cities.map((city) => (
            <span key={`${city.country}-${city.city}`} className="rounded-full bg-cream px-3 py-1 text-xs">
              {city.city} <span className="text-ink-soft">· {city.hasPage ? "صفحة" : "ضمن المحتوى"}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrTab() {
  return (
    <div className="max-w-3xl space-y-4 text-sm leading-8">
      <p>
        البنية الكاملة في <span dir="ltr">docs/backlink-strategy.md</span>. الخلاصة: الموقع يكسب الروابط بكونه <strong>المرجع العربي الموثّق للسلامة الدوائية وصحة المرأة في الخليج</strong> — لا بالتواصل الجماعي ولا بشراء الروابط.
      </p>
      <ul className="list-disc space-y-2 pr-6">
        <li>الأصول الرابحة للروابط: مجموعة الحمل خارج الرحم (P0)، دعم قرار «متى أذهب للطوارئ»، شارحات SFDA، أدلة محو الأمية الطبية.</li>
        <li>الأهداف التحريرية: صفحات موارد الصحة العامة والجامعات، الإعلام الصحي العربي، برامج صحة المرأة غير الربحية.</li>
        <li>قواعد صارمة: لا شراء روابط، لا PBN، لا تبادل، لا ادعاءات مصطنعة، لا حملات anchor نصية متطابقة.</li>
        <li>خريطة 301 القديمة (content/redirects.json) تحفظ أي equity راكمه النطاق عبر أجياله السابقة.</li>
      </ul>
    </div>
  );
}
