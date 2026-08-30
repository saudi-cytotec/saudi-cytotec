import { Link, useParams } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ContentBlocks } from "../components/ContentBlocks";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { ReferencesList } from "../components/ReferencesList";
import { RelatedArticles } from "../components/RelatedArticles";
import { JsonLd, Seo } from "../components/Seo";
import { SITE } from "../data/site";
import { relatedArticles as pickRelated } from "../data/articles";
import { clusterPath, getCluster, readingMinutes } from "../utils/content";
import { CareReferral } from "../components/CareReferral";
import { LOGO_SRC } from "../components/Logo";
import { NotFound } from "./NotFound";

export function ArticlePage() {
  const { slug } = useParams();
  const { articles } = useCatalog();
  const article = articles.find((item) => item.slug === slug);
  if (!article) return <NotFound />;
  const cluster = getCluster(article.cluster);
  const related = pickRelated(article, articles);

  // Effective images: explicit OG → featured → banner → cluster default.
  const managed = article as typeof article & {
    ogTitle?: string;
    ogDescription?: string;
    canonical?: string;
  };
  const ogImage = article.ogImage || article.image || cluster.image || "/images/og-default.jpg";
  const bannerSrc = article.bannerImage || article.image || "";
  const bannerAlt = article.bannerImageAlt || article.imageAlt || article.title;
  // A committed CMS article may carry its own canonical; only use it when it
  // points at our own domain, otherwise keep the self-canonical.
  const canonical =
    managed.canonical && managed.canonical.startsWith(SITE.domain)
      ? managed.canonical
      : undefined;

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <Seo
        title={article.metaTitle}
        description={article.metaDescription}
        path={`/blog/${article.slug}`}
        type="article"
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        image={ogImage}
        ogTitle={managed.ogTitle}
        ogDescription={managed.ogDescription}
        canonical={canonical}
        keywords={(article as { primaryKeyword?: string }).primaryKeyword || article.title}
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
              logo: { "@type": "ImageObject", url: `${SITE.domain}${LOGO_SRC}` },
            },
            description: article.metaDescription,
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
      <div className="mt-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-sky-soft px-3.5 py-1.5 text-xs font-bold text-brand">
          {cluster.title}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-[1.4] text-brand-deep sm:text-4xl">
          {article.h1}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-9 text-ink-soft">{article.excerpt}</p>
        <p className="mt-3 text-sm text-ink-soft">
          نُشر في {article.publishedAt} · آخر تحديث {article.updatedAt} · قراءة تقريبية {readingMinutes(article)} دقائق
        </p>
      </div>

      {bannerSrc ? (
        <figure className="card-premium mt-7 max-w-4xl overflow-hidden">
          <img
            src={bannerSrc}
            alt={bannerAlt}
            width={1200}
            height={article.bannerImage ? 675 : 900}
            loading="eager"
            decoding="async"
            className="aspect-[16/9] w-full object-cover"
          />
          {article.imageAlt ? (
            <figcaption className="px-4 py-2.5 text-xs text-ink-soft">{article.imageAlt}</figcaption>
          ) : null}
        </figure>
      ) : null}

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
        {article.cornerstones.map((path) => (
          <Link key={path} to={path} className="rounded-full border border-line px-3 py-1 hover:bg-paper">
            صفحة مرتبطة
          </Link>
        ))}
      </div>
      <section className="mt-14">
        <h2 className="mb-5 text-2xl font-bold text-teal-deep">مقالات ذات صلة</h2>
        <RelatedArticles articles={related} />
      </section>
    </article>
  );
}
