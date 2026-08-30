import { Link, useParams } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { ArticleCard } from "../components/ArticleCard";
import { clusterMeta } from "../components/CategoryCard";
import { CareReferral } from "../components/CareReferral";
import { IconArrowLeft } from "../components/icons";
import { PageHero } from "../components/PageHero";
import { Seo } from "../components/Seo";
import { clusters } from "../data/site";
import { clusterPath } from "../utils/content";

export function ClusterPage() {
  const { slug } = useParams();
  const { articles } = useCatalog();
  const cluster = clusters.find((item) => item.slug === slug);
  if (!cluster) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-extrabold text-brand-deep">المجموعة غير موجودة</h1>
        <Link to="/blog" className="mt-6 inline-block font-bold text-brand hover:text-accent">
          العودة إلى المقالات
        </Link>
      </div>
    );
  }
  const list = articles.filter((article) => article.cluster === cluster.id);
  const { Icon, color, soft } = clusterMeta(cluster.id);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <Seo title={cluster.title} description={cluster.description} path={clusterPath(cluster)} />
      <PageHero
        crumbs={[
          { name: "المقالات", path: "/blog" },
          { name: cluster.title, path: clusterPath(cluster) },
        ]}
        title={cluster.title}
        description={cluster.description}
      >
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full ${soft} ${color}`}>
              <Icon className="h-4 w-4" />
            </span>
            {list.length} مقالاً تعليمياً
          </span>
        </div>
      </PageHero>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      <CareReferral />
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-brand transition hover:text-accent">
        كل المقالات
        <IconArrowLeft className="h-4 w-4" />
      </Link>
    </div>
  );
}
