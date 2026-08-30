import { Link, useParams } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { ArticleCard } from "../components/ArticleCard";
import { clusterMeta } from "../components/CategoryCard";
import { CareReferral } from "../components/CareReferral";
import { IconArrowLeft } from "../components/icons";
import { PageHero } from "../components/PageHero";
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
        <h1 className="font-display text-3xl font-extrabold text-brand-deep">المجموعة غير موجودة</h1>
        <Link to="/blog" className="mt-6 inline-block font-bold text-brand hover:text-accent">
          العودة إلى المقالات
        </Link>
      </div>
    );
  }

  const list = articles.filter((article) => article.cluster === cluster.id && !article.noindex);
  const questions = faqGroups.flatMap((group) => group.items).filter((item) =>
    item.links.some((link) => link.to === clusterPath(cluster) || list.some((article) => link.to === `/blog/${article.slug}` || link.to === article.slug)),
  ).slice(0, 3);
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
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20">
            <span className={`grid h-6 w-6 place-items-center rounded-full ${soft} ${color}`}>
              <Icon className="h-4 w-4" />
            </span>
            {list.length} مقالاً تعليمياً
          </span>
        </div>
      </PageHero>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link to="/topics" className="rounded-full border border-line bg-paper px-4 py-2 font-semibold text-brand hover:bg-cream">كل المحاور</Link>
        <Link to="/faq" className="rounded-full border border-line bg-paper px-4 py-2 font-semibold text-brand hover:bg-cream">أسئلة شائعة</Link>
        <Link to="/service-areas" className="rounded-full border border-line bg-paper px-4 py-2 font-semibold text-brand hover:bg-cream">سايتوتك في السعودية</Link>
        <Link to="/service-areas" className="rounded-full border border-line bg-paper px-4 py-2 font-semibold text-brand hover:bg-cream">المناطق والمدن</Link>
        <Link to="/medical-sources" className="rounded-full border border-line bg-paper px-4 py-2 font-semibold text-brand hover:bg-cream">المراجع الطبية</Link>
      </div>

      {questions.length ? (
        <section className="card-premium p-5">
          <h2 className="font-display text-xl font-extrabold text-brand-deep">أسئلة شائعة داخل هذا المحور</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {questions.map((item) => (
              <Link key={item.q} to="/faq" className="rounded-2xl bg-cream p-4 text-sm font-semibold leading-7 text-brand-deep hover:bg-brand-soft">
                {item.q}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

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
