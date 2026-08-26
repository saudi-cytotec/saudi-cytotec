import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Seo } from "../components/Seo";
import { articles } from "../data/articles";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const results = useMemo(() => {
    const value = q.trim();
    if (!value) return [];
    return articles.filter((article) =>
      `${article.title} ${article.h1} ${article.excerpt} ${article.metaDescription}`.includes(value),
    );
  }, [q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title={`نتائج البحث: ${q || "الكل"}`} description="بحث داخلي في المقالات التعليمية." path="/search" noindex />
      <Breadcrumbs items={[{ name: "بحث", path: "/search" }]} />
      <h1 className="mt-5 text-4xl font-bold text-teal-deep">نتائج البحث</h1>
      <p className="mt-3 text-ink-soft">{q ? `العبارة: ${q}` : "اكتبي كلمة في صندوق البحث أعلى الصفحة."}</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {results.length ? (
          results.map((article) => <ArticleCard key={article.slug} article={article} />)
        ) : (
          <div className="col-span-full rounded-3xl border border-dashed border-line bg-paper px-6 py-12 text-center text-ink-soft">
            {q ? "لا توجد نتائج مطابقة." : "ابدئي البحث من الحقل في رأس الصفحة."}
          </div>
        )}
      </div>
    </div>
  );
}
