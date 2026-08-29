import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../cms/CatalogContext";
import { competitorGaps, geoCoverage } from "../../cms/registrySource";
import { validateArticle } from "../../utils/validation";
import { Badge, EmptyState, Td, Th } from "../ui";

type Tab = "audit" | "competitors" | "geo" | "pr";

export function SeoScreen() {
  const [tab, setTab] = useState<Tab>("audit");
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-brand-deep">إدارة SEO</h1>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["audit", "تدقيق الموقع"],
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
      {tab === "audit" ? <AuditTab /> : null}
      {tab === "competitors" ? <CompetitorsTab /> : null}
      {tab === "geo" ? <GeoTab /> : null}
      {tab === "pr" ? <PrTab /> : null}
    </div>
  );
}

function AuditTab() {
  const { managed } = useCatalog();
  const rows = useMemo(() => {
    return managed.map((article) => {
      const others = managed.filter((i) => i.id !== article.id);
      const result = validateArticle(article, others.map((i) => i.slug), others.map((i) => i.title));
      const errors = result.items.filter((i) => i.blocking && !i.ok).length;
      const warnings = result.items.filter((i) => !i.blocking && !i.ok).length;
      return {
        article,
        errors,
        warnings,
        seoTitleLen: article.seoTitle.length,
        metaLen: article.metaDescription.length,
      };
    });
  }, [managed]);
  const withErrors = rows.filter((row) => row.errors > 0);
  const withWarnings = rows.filter((row) => row.warnings > 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-line bg-paper p-5">
          <p className="text-sm text-ink-soft">مقالات بأخطاء تقنية مانعة</p>
          <p className={`mt-1 text-3xl font-bold ${withErrors.length ? "text-clay" : "text-sage"}`}>{withErrors.length}</p>
        </div>
        <div className="rounded-3xl border border-line bg-paper p-5">
          <p className="text-sm text-ink-soft">مقالات بتحذيرات SEO</p>
          <p className={`mt-1 text-3xl font-bold ${withWarnings.length ? "text-clay" : "text-sage"}`}>{withWarnings.length}</p>
        </div>
        <div className="rounded-3xl border border-line bg-paper p-5">
          <p className="text-sm text-ink-soft">مقالات سليمة تماماً</p>
          <p className="mt-1 text-3xl font-bold text-sage">{rows.length - withErrors.length - withWarnings.length}</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-cream">
            <tr>
              <Th>المقال</Th>
              <Th>SEO title</Th>
              <Th>Meta</Th>
              <Th>الحالة</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ article, errors, warnings, seoTitleLen, metaLen }) => (
              <tr key={article.id} className="border-t border-line">
                <Td>
                  <Link to={`/admin/articles/${article.id}`} className="font-semibold text-brand hover:underline">
                    {article.title || "بدون عنوان"}
                  </Link>
                </Td>
                <Td className={seoTitleLen >= 12 && seoTitleLen <= 70 ? "text-sage" : "text-clay"}>{seoTitleLen}</Td>
                <Td className={metaLen >= 70 && metaLen <= 170 ? "text-sage" : "text-clay"}>{metaLen}</Td>
                <Td>
                  {errors ? <Badge tone="bad">ERROR ×{errors}</Badge> : warnings ? <Badge tone="warn">WARNING ×{warnings}</Badge> : <Badge tone="ok">PASS</Badge>}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs leading-6 text-ink-soft">
        ملاحظة: المقالات الأصلية (source=static) معروضة للمراقبة؛ تحريرها متاح في المحرر. عمليات الفحص الكاملة للموقع (canonical، schema، robots، sitemap) تُشغّل من <span dir="ltr">scripts/auditSeo.mjs</span> وتُكتب نتائجها في <span dir="ltr">docs/seo-audit.md</span>.
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
