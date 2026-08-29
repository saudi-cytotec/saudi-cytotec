import { useMemo, useState } from "react";
import { useCatalog } from "../cms/CatalogContext";
import { ArticleCard } from "../components/ArticleCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CategoryCard } from "../components/CategoryCard";
import { CareReferral } from "../components/CareReferral";
import { Seo } from "../components/Seo";
import { clusters } from "../data/site";

export function BlogIndex() {
  const { articles } = useCatalog();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const value = q.trim();
    if (!value) return articles;
    return articles.filter((article) => `${article.title} ${article.excerpt} ${article.h1}`.includes(value));
  }, [q, articles]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo
        title="المقالات التعليمية"
        description="فهرس المقالات التعليمية عن سايتوتك وميزوبروستول وصحة المرأة والتحذيرات الطبية والمصادر."
        path="/blog"
      />
      <Breadcrumbs items={[{ name: "المقالات", path: "/blog" }]} />
      <h1 className="mt-5 text-4xl font-bold text-teal-deep">المقالات التعليمية</h1>
      <p className="mt-3 max-w-3xl leading-8 text-ink-soft">
        مقالات مستقلة تغطي أسئلة بحثية مختلفة. المقالات للتعليم العام، ولا تتضمن تعليمات علاج فردية أو مسارات شراء.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {clusters.map((cluster) => (
          <CategoryCard
            key={cluster.id}
            cluster={cluster}
            count={articles.filter((article) => article.cluster === cluster.id).length}
          />
        ))}
      </div>
      <div className="mt-10">
        <label className="mb-2 block text-sm font-semibold" htmlFor="blog-filter">
          صفِّي المقالات
        </label>
        <input
          id="blog-filter"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="اكتبي كلمة من العنوان أو الملخص"
          className="w-full max-w-md rounded-full border border-line bg-paper px-4 py-2"
        />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length ? (
          filtered.map((article) => <ArticleCard key={article.slug} article={article} />)
        ) : (
          <div className="col-span-full rounded-3xl border border-dashed border-line bg-paper px-6 py-12 text-center text-ink-soft">
            لا توجد مقالات مطابقة لعبارة البحث. جرّبي كلمة أعم مثل «أمان» أو «حمل».
          </div>
        )}
      </div>
      <CareReferral />
    </div>
  );
}
