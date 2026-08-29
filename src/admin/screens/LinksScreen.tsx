import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../cms/CatalogContext";
import { buildLinkGraph } from "../../utils/internalLinks";
import { Badge, EmptyState, Section, Td, Th } from "../ui";

export function LinksScreen() {
  const { managed } = useCatalog();
  const graph = useMemo(() => buildLinkGraph(managed), [managed]);
  const [view, setView] = useState<"table" | "orphans" | "broken">("table");

  const published = managed.filter((a) => a.status === "published");

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-brand-deep">محرك الروابط الداخلية</h1>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setView("table")} className={`rounded-full px-4 py-2 text-sm ${view === "table" ? "bg-brand text-white" : "border border-line bg-paper"}`}>
          جدول الروابط
        </button>
        <button type="button" onClick={() => setView("orphans")} className={`rounded-full px-4 py-2 text-sm ${view === "orphans" ? "bg-brand text-white" : "border border-line bg-paper"}`}>
          مقالات معزولة ({graph.orphans.length})
        </button>
        <button type="button" onClick={() => setView("broken")} className={`rounded-full px-4 py-2 text-sm ${view === "broken" ? "bg-brand text-white" : "border border-line bg-paper"}`}>
          روابط مكسورة ({graph.brokenLinks.length})
        </button>
      </div>

      {view === "table" ? (
        <div className="overflow-x-auto rounded-3xl border border-line bg-paper">
          <table className="w-full text-sm">
            <thead className="bg-cream">
              <tr>
                <Th>المقال</Th>
                <Th>صادر</Th>
                <Th>وارد</Th>
                <Th>مقترحات</Th>
              </tr>
            </thead>
            <tbody>
              {published.map((article) => {
                const stats = graph.stats.get(article.slug);
                return (
                  <tr key={article.id} className="border-t border-line align-top">
                    <Td>
                      <Link to={`/admin/articles/${article.id}`} className="font-semibold text-brand hover:underline">
                        {article.title}
                      </Link>
                      <span className="block font-mono text-[10px] text-ink-soft" dir="ltr">/{article.slug}</span>
                    </Td>
                    <Td>{stats?.outgoing ?? 0}</Td>
                    <Td>
                      {stats?.incoming ?? 0}
                      {!stats?.incoming ? <Badge tone="warn">معزول</Badge> : null}
                    </Td>
                    <Td className="font-mono text-[10px]">
                      {stats?.suggestions.slice(0, 3).map((s) => (
                        <span key={s} className="block" dir="ltr">{s}</span>
                      ))}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!published.length ? <EmptyState text="لا توجد مقالات منشورة." /> : null}
        </div>
      ) : null}

      {view === "orphans" ? (
        <Section title="مقالات معزولة (بلا روابط واردة)">
          <ul className="space-y-2 text-sm">
            {graph.orphans.map((article) => (
              <li key={article.id} className="flex items-center justify-between rounded-2xl border border-line px-3 py-2">
                <Link to={`/admin/articles/${article.id}`} className="font-semibold text-brand hover:underline">{article.title}</Link>
                <span className="text-xs text-ink-soft">
                  اربطيها من مقال ذي صلة في نفس المجموعة أو من ركنها: {article.cornerstones[0]}
                </span>
              </li>
            ))}
          </ul>
          {!graph.orphans.length ? <EmptyState text="لا توجد مقالات معزولة." /> : null}
        </Section>
      ) : null}

      {view === "broken" ? (
        <Section title="روابط داخلية تشير إلى أهداف غير موجودة">
          <ul className="space-y-2 text-sm">
            {graph.brokenLinks.map((broken, index) => (
              <li key={index} className="flex items-center justify-between rounded-2xl border border-line px-3 py-2">
                <span>
                  <strong>{broken.from}</strong> ← يشير إلى
                </span>
                <span className="font-mono text-xs text-clay" dir="ltr">{broken.to}</span>
              </li>
            ))}
          </ul>
          {!graph.brokenLinks.length ? <EmptyState text="لا توجد روابط مكسورة." /> : null}
        </Section>
      ) : null}

      <p className="text-xs leading-6 text-ink-soft">
        المحرك يقرأ الروابط المصرح بها (related / internalLinks / cornerstones) من المقالات المنشورة. الروابط السياقية داخل المتن تُكتب يدوياً في المحرر لتظل طبيعية — لا إدراج تلقائي عشوائي.
      </p>
    </div>
  );
}
