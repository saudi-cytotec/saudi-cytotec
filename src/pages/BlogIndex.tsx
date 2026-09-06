import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { ArticleCard } from "../components/ArticleCard";
import { CareReferral } from "../components/CareReferral";
import { IconArrowLeft, IconSearch } from "../components/icons";
import { PageHero } from "../components/PageHero";
import { Seo } from "../components/Seo";
import { clusters } from "../data/site";

export function BlogIndex() {
  const { articles } = useCatalog();
  const [q, setQ] = useState("");
  const [activeCluster, setActiveCluster] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = articles;
    if (activeCluster !== "all") list = list.filter((a) => a.cluster === activeCluster);
    const value = q.trim();
    if (value) list = list.filter((article) => `${article.title} ${article.excerpt} ${article.h1}`.includes(value));
    return list;
  }, [q, activeCluster, articles]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <Seo
        title="المقالات التعليمية"
        description="فهرس المقالات التعليمية عن سايتوتك وميزوبروستول وصحة المرأة والتحذيرات الطبية والمصادر."
        path="/blog"
      />
      <PageHero
        crumbs={[{ name: "المقالات", path: "/blog" }]}
        title="المقالات التعليمية"
        description="مقالات مستقلة تغطي أسئلة بحثية مختلفة. المقالات للتعليم العام، ولا تتضمن تعليمات علاج فردية أو مسارات شراء."
      />

      {/* Category chips — quick hub-and-spoke discovery */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCluster("all")}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            activeCluster === "all" ? "bg-brand text-white" : "bg-white text-brand-deep ring-1 ring-line hover:bg-brand-soft"
          }`}
        >
          الكل ({articles.filter((article) => !article.noindex).length})
        </button>
        {clusters.map((cluster) => {
          const count = articles.filter((a) => a.cluster === cluster.id).length;
          const active = activeCluster === cluster.id;
          return (
            <button
              key={cluster.id}
              type="button"
              onClick={() => setActiveCluster(active ? "all" : cluster.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                active ? "bg-brand text-white" : "bg-white text-brand-deep ring-1 ring-line hover:bg-brand-soft"
              }`}
            >
              {cluster.shortTitle} ({count})
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="relative w-full max-w-md">
          <span className="sr-only">صفِّي المقالات</span>
          <IconSearch className="pointer-events-none absolute start-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-soft" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="اكتبي كلمة من العنوان أو الملخص..."
            className="w-full rounded-full border border-line bg-white py-2.5 pe-4 ps-10 text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <p className="text-sm text-ink-soft">{filtered.length} مقالاً</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length ? (
          filtered.map((article) => <ArticleCard key={article.slug} article={article} />)
        ) : (
          <div className="card-premium col-span-full px-6 py-14 text-center text-ink-soft">
            <p className="font-display text-lg font-bold text-brand-deep">لا توجد مقالات مطابقة</p>
            <p className="mt-2 text-sm">جرّبي كلمة أعم مثل «أمان» أو «حمل»، أو غيّري الفئة.</p>
          </div>
        )}
      </div>

      <CareReferral />
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-brand transition hover:text-accent">
        العودة إلى الرئيسية
        <IconArrowLeft className="h-4 w-4" />
      </Link>
    </div>
  );
}
