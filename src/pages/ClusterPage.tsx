import { Link, useParams } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { ArticleCard } from "../components/ArticleCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CareReferral } from "../components/CareReferral";
import { Seo } from "../components/Seo";
import { faqGroups } from "../data/faqs";
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
  const questions = faqGroups.flatMap((group) => group.items).filter((item) =>
    item.links.some((link) => link.to === clusterPath(cluster) || list.some((article) => link.to === `/blog/${article.slug}` || link.to === article.slug)),
  ).slice(0, 3);
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
      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link to="/topics" className="rounded-full border border-line bg-paper px-4 py-2 font-semibold text-teal hover:bg-cream">كل المحاور</Link>
        <Link to="/faq" className="rounded-full border border-line bg-paper px-4 py-2 font-semibold text-teal hover:bg-cream">أسئلة شائعة</Link>
        <Link to="/service-areas" className="rounded-full border border-line bg-paper px-4 py-2 font-semibold text-teal hover:bg-cream">المناطق والمدن</Link>
        <Link to="/medical-sources" className="rounded-full border border-line bg-paper px-4 py-2 font-semibold text-teal hover:bg-cream">المراجع الطبية</Link>
      </div>
      {questions.length ? (
        <section className="mt-8 rounded-3xl border border-line bg-paper p-5">
          <h2 className="text-xl font-bold text-teal-deep">أسئلة شائعة داخل هذا المحور</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {questions.map((item) => (
              <Link key={item.q} to="/faq" className="rounded-2xl bg-cream p-4 text-sm font-semibold leading-7 text-brand-deep hover:bg-brand-soft">{item.q}</Link>
            ))}
          </div>
        </section>
      ) : null}
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      <CareReferral />
    </div>
  );
}
