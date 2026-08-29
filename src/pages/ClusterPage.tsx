import { Link, useParams } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { ArticleCard } from "../components/ArticleCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CareReferral } from "../components/CareReferral";
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
        <h1 className="text-3xl font-bold text-teal-deep">المجموعة غير موجودة</h1>
        <Link to="/blog" className="mt-6 inline-block text-teal">
          العودة إلى المقالات
        </Link>
      </div>
    );
  }
  const list = articles.filter((article) => article.cluster === cluster.id);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title={cluster.title} description={cluster.description} path={clusterPath(cluster)} />
      <Breadcrumbs
        items={[
          { name: "المقالات", path: "/blog" },
          { name: cluster.title, path: clusterPath(cluster) },
        ]}
      />
      <h1 className="mt-5 text-4xl font-bold text-teal-deep">{cluster.title}</h1>
      <p className="mt-3 max-w-3xl leading-8 text-ink-soft">{cluster.description}</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      <CareReferral />
    </div>
  );
}
