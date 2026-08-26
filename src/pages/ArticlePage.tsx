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
import { ConsultCTA } from "../components/ConsultCTA";
import { NotFound } from "./NotFound";

export function ArticlePage() {
  const { slug } = useParams();
  const { articles } = useCatalog();
  const article = articles.find((item) => item.slug === slug);
  if (!article) return <NotFound />;
  const cluster = getCluster(article.cluster);
  const related = pickRelated(article, articles);

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <Seo
        title={article.metaTitle}
        description={article.metaDescription}
        path={`/blog/${article.slug}`}
        type="article"
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        image="/images/og-default.jpg"
        keywords={article.title}
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            headline: article.h1,
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
        <ConsultCTA />
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
