import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { ArticleCard } from "../components/ArticleCard";
import { CareReferral } from "../components/CareReferral";
import { IconSearch } from "../components/icons";
import { PageHero } from "../components/PageHero";
import { Seo } from "../components/Seo";

export function SearchPage() {
  const { articles } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [input, setInput] = useState(params.get("q") ?? "");
  const q = params.get("q")?.trim() ?? "";
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!q) return [];
    return articles.filter((article) => `${article.title} ${article.h1} ${article.excerpt}`.includes(q));
  }, [q, articles]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <Seo title="البحث" description="البحث في المقالات التعليمية." path="/search" noindex />
      <PageHero
        crumbs={[{ name: "بحث", path: "/search" }]}
        title="بحث في المقالات"
        description="اكتبي كلمة أو عبارة وسنبحث لكِ في عناوين ومُلخصات كل المقالات التعليمية."
      >
        <form
          className="mt-6 flex max-w-2xl gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const value = input.trim();
            if (value) {
              navigate(`/search?q=${encodeURIComponent(value)}`);
              setParams({ q: value });
            }
          }}
        >
          <label className="relative flex-1">
            <span className="sr-only">بحث في المقالات</span>
            <IconSearch className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="مثال: آثار جانبية، الحمل، متى أراجع الطبيب..."
              className="w-full rounded-full border border-line bg-white py-3 pe-4 ps-11 text-sm shadow-lg outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <button type="submit" className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-deep">
            بحث
          </button>
        </form>
      </PageHero>

      <div>
        <p className="mb-5 text-sm text-ink-soft">
          {q ? (
            <>
              نتائج البحث عن: <strong className="text-brand-deep">«{q}»</strong> — {results.length} {results.length === 1 ? "مقال" : results.length === 2 ? "مقالان" : "مقالات"}
            </>
          ) : (
            "ابدئي البحث من الحقل أعلاه أو من أيقونة البحث في رأس الصفحة."
          )}
        </p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.length ? (
            results.map((article) => <ArticleCard key={article.slug} article={article} />)
          ) : (
            <div className="card-premium col-span-full px-6 py-14 text-center text-ink-soft">
              <p className="font-display text-lg font-bold text-brand-deep">{q ? "لا توجد نتائج مطابقة" : "لا يوجد بحث بعد"}</p>
              <p className="mt-2 text-sm">جرّبي كلمة أعم أو تصفحي الفئات من صفحة المقالات.</p>
            </div>
          )}
        </div>
      </div>

      <CareReferral />
    </div>
  );
}
