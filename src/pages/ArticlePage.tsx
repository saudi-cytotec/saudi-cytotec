import { Link, useParams } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ContentBlocks } from "../components/ContentBlocks";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { ReferencesList } from "../components/ReferencesList";
import { RelatedArticles } from "../components/RelatedArticles";
import { JsonLd, Seo } from "../components/Seo";
import { staticPages } from "../data/pages";
import { clusters, SITE } from "../data/site";
import { relatedArticles as pickRelated } from "../data/articles";
import { clusterPath, getCluster, readingMinutes } from "../utils/content";
import { CareReferral } from "../components/CareReferral";
import { NotFound } from "./NotFound";

function labelForTarget(path: string, articles: { slug: string; title: string }[]) {
  if (path.startsWith("/blog/")) return articles.find((item) => item.slug === path.slice(6))?.title ?? "مقال مرتبط";
  if (!path.startsWith("/")) return articles.find((item) => item.slug === path)?.title ?? "مقال مرتبط";
  const staticPage = staticPages.find((item) => item.path === path);
  if (staticPage) return staticPage.title;
  if (path === "/service-areas") return "سايتوتك في السعودية";
  if (path === "/topics") return "محاور المحتوى";
  const cluster = clusters.find((item) => `/blog/cluster/${item.slug}` === path);
  return cluster?.shortTitle ?? "صفحة مرتبطة";
}

export function ArticlePage() {
  const { slug } = useParams();
  const { articles, managed } = useCatalog();
  const article = articles.find((item) => item.slug === slug);
  const managedArticle = managed.find((item) => item.slug === slug);
  if (!article) return <NotFound />;
  const cluster = getCluster(article.cluster);
  const related = pickRelated(article, articles);
  const clusterArticles = articles.filter((item) => item.cluster === article.cluster);
  const indexInCluster = clusterArticles.findIndex((item) => item.slug === article.slug);
  const previous = indexInCluster > 0 ? clusterArticles[indexInCluster - 1] : null;
  const next = indexInCluster >= 0 && indexInCluster < clusterArticles.length - 1 ? clusterArticles[indexInCluster + 1] : null;

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <Seo
        title={managedArticle?.seoTitle || article.metaTitle}
        description={managedArticle?.metaDescription || article.metaDescription}
        path={`/blog/${article.slug}`}
        type="article"
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        image={article.image}
        keywords={managedArticle ? [managedArticle.primaryKeyword, ...managedArticle.secondaryKeywords].filter(Boolean).join(", ") : article.title}
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            // Article is the type Google can surface as a rich result;
            // MedicalWebPage alone has no rich-result treatment. Both describe
            // the same node truthfully. Drug/Product/Offer/Review/AggregateRating
            // are deliberately never emitted: this site sells nothing and
            // publishes no ratings.
            "@type": ["Article", "MedicalWebPage"],
            headline: article.h1,
            author: { "@type": "Organization", name: SITE.name, url: SITE.domain },
            publisher: {
              "@type": "Organization",
              name: SITE.name,
              url: SITE.domain,
              logo: { "@type": "ImageObject", url: `${SITE.domain}/images/logo.png` },
            },
            description: managedArticle?.metaDescription || article.metaDescription,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            inLanguage: "ar",
            mainEntityOfPage: `${SITE.domain}/blog/${article.slug}`,
          },
          ...(article.faqs?.length
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: article.faqs.map((item) => ({
                    "@type": "Question",
                    name: item.q,
                    acceptedAnswer: { "@type": "Answer", text: item.a },
                  })),
                },
              ]
            : []),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "المقالات", path: "/blog" },
          { name: cluster.shortTitle, path: clusterPath(cluster) },
          { name: article.title, path: `/blog/${article.slug}` },
        ]}
      />
      <p className="mt-6 text-sm font-semibold text-sage">{cluster.title}</p>
      <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-[1.35] text-teal-deep">{article.h1}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-9 text-ink-soft">{article.excerpt}</p>
      <p className="mt-3 text-sm text-ink-soft">
        نُشر في {article.publishedAt} · آخر تحديث {article.updatedAt} · قراءة تقريبية {readingMinutes(article)} دقائق
      </p>
      <div className="mt-6 max-w-3xl">
        <DisclaimerBanner />
      </div>
      <div className="mt-10">
        <ContentBlocks blocks={article.blocks} />
      </div>
      {article.faqs?.length ? (
        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold text-teal-deep">أسئلة متكررة</h2>
          <div className="mt-4 space-y-4">
            {article.faqs.map((item) => (
              <div key={item.q} className="rounded-2xl border border-line bg-paper p-4">
                <h3 className="font-bold text-teal">{item.q}</h3>
                <p className="mt-2 leading-8">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <div className="mt-12 max-w-3xl">
        <CareReferral />
      </div>
      <ReferencesList ids={article.references} />
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link to={clusterPath(cluster)} className="rounded-full border border-line bg-paper px-3 py-1 font-semibold text-teal hover:bg-cream">
          المزيد في محور {cluster.shortTitle}
        </Link>
        {article.cornerstones.map((path) => (
          <Link key={path} to={path} className="rounded-full border border-line px-3 py-1 hover:bg-paper">
            {labelForTarget(path, articles)}
          </Link>
        ))}
        <Link to="/faq" className="rounded-full border border-line px-3 py-1 hover:bg-paper">
          أسئلة شائعة مرتبطة
        </Link>
        <Link to="/service-areas" className="rounded-full border border-line px-3 py-1 hover:bg-paper">
          سايتوتك في السعودية
        </Link>
      </div>
      {(previous || next) ? (
        <nav className="mt-8 grid gap-3 md:grid-cols-2" aria-label="المقال السابق والتالي داخل المحور">
          {previous ? <Link to={`/blog/${previous.slug}`} className="rounded-2xl border border-line bg-paper p-4 text-sm hover:bg-cream">السابق في المحور: <strong>{previous.title}</strong></Link> : <span />}
          {next ? <Link to={`/blog/${next.slug}`} className="rounded-2xl border border-line bg-paper p-4 text-sm hover:bg-cream">التالي في المحور: <strong>{next.title}</strong></Link> : null}
        </nav>
      ) : null}
      <section className="mt-14">
        <h2 className="mb-5 text-2xl font-bold text-teal-deep">مقالات ذات صلة</h2>
        <RelatedArticles articles={related} />
      </section>
    </article>
  );
}
