import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { ArticleCard } from "../components/ArticleCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ConsultCTA } from "../components/ConsultCTA";
import { Seo } from "../components/Seo";

export function SearchPage() {
  const { articles } = useCatalog();
  const [params] = useSearchParams();
  const q = params.get("q")?.trim() ?? "";
  const results = useMemo(() => {
    if (!q) return [];
    return articles.filter((article) => `${article.title} ${article.h1} ${article.excerpt}`.includes(q));
  }, [q, articles]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title="البحث" description="البحث في المقالات التعليمية." path="/search" noindex />
      <Breadcrumbs items={[{ name: "بحث", path: "/search" }]} />
      <h1 className="mt-5 text-4xl font-bold text-teal-deep">نتائج البحث</h1>
      <p className="mt-3 text-ink-soft">{q ? `العبارة: ${q}` : "ابدئي البحث من الحقل في رأس الصفحة."}</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {results.length ? (
          results.map((article) => <ArticleCard key={article.slug} article={article} />)
        ) : (
          <div className="col-span-full rounded-3xl border border-dashed border-line bg-paper px-6 py-12 text-center text-ink-soft">
            {q ? "لا توجد نتائج مطابقة." : "ابدئي البحث من الحقل في رأس الصفحة."}
          </div>
        )}
      </div>
      <ConsultCTA />
    </div>
  );
}
