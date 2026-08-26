import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ContentBlocks } from "../components/ContentBlocks";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { ReferencesList } from "../components/ReferencesList";
import { RelatedArticles } from "../components/RelatedArticles";
import { JsonLd, Seo } from "../components/Seo";
import { articles, getArticle, relatedArticles } from "../data/articles";
import { pathLabels } from "../data/labels";
import { SITE } from "../data/site";
import { clusterPath, getCluster, readingMinutes } from "../utils/content";

export function ArticlePage() {
  const { slug } = useParams();
  const article = slug ? getArticle(slug) : undefined;
  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Seo title="المقال غير موجود" description="تعذر العثور على المقال المطلوب." path="/blog" noindex />
        <h1 className="text-3xl font-bold text-teal-deep">المقال غير موجود</h1>
        <p className="mt-3 text-ink-soft">تحقق من الرابط أو عودي إلى فهرس المقالات.</p>
        <Link to="/blog" className="mt-6 inline-block rounded-full bg-teal px-5 py-2 text-white">
          تصفح المقالات
        </Link>
      </div>
    );
  }

  const cluster = getCluster(article.cluster);
  const related = relatedArticles(article, articles);
  const url = `${SITE.domain}/blog/${article.slug}`;

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <Seo
        title={article.metaTitle}
        description={article.metaDescription}
        path={`/blog/${article.slug}`}
        image={article.image}
        type="article"
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.h1,
          description: article.metaDescription,
          inLanguage: "ar",
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          image: `${SITE.domain}${article.image}`,
          mainEntityOfPage: url,
          author: { "@type": "Organization", name: SITE.name, url: SITE.domain },
          publisher: {
            "@type": "Organization",
            name: SITE.name,
            logo: { "@type": "ImageObject", url: `${SITE.domain}/images/logo.png` },
          },
        }}
      />
      <Breadcrumbs
        items={[
          { name: "المقالات", path: "/blog" },
          { name: cluster.shortTitle, path: clusterPath(cluster) },
          { name: article.title, path: `/blog/${article.slug}` },
        ]}
      />
      <header className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold text-sage">{cluster.title}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-teal-deep sm:text-4xl">{article.h1}</h1>
          <p className="mt-4 text-lg leading-9 text-ink-soft">{article.excerpt}</p>
          <p className="mt-4 text-sm text-ink-soft">
            نُشر في {article.publishedAt} · آخر تحديث {article.updatedAt} · قراءة تقريبية {readingMinutes(article)} دقائق
          </p>
        </div>
        <img src={article.image} alt={article.imageAlt} className="h-72 w-full rounded-3xl object-cover" />
      </header>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-8">
          <DisclaimerBanner />
          <ContentBlocks blocks={article.blocks} />
          {article.faqs?.length ? (
            <section>
              <h2 className="text-2xl font-bold text-teal-deep">أسئلة مرتبطة بهذا الموضوع</h2>
              <div className="mt-4 space-y-3">
                {article.faqs.map((item) => (
                  <details key={item.q} className="rounded-2xl border border-line bg-paper px-4 py-3">
                    <summary className="cursor-pointer font-semibold text-teal-deep">{item.q}</summary>
                    <p className="mt-2 leading-8 text-ink-soft">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
          <ReferencesList ids={article.references} />
        </div>
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-line bg-paper p-5">
            <h2 className="font-bold text-teal-deep">صفحات ركيزة</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {article.cornerstones.map((path) => (
                <li key={path}>
                  <Link to={path} className="text-teal hover:underline">
                    {pathLabels[path] ?? path}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-[#f8ece6] p-5 text-sm leading-8">
            إذا ظهرت أعراض حادة مثل نزيف غزير أو إغماء أو حمى مرتفعة، اطلبي رعاية طارئة فوراً.
          </div>
        </aside>
      </div>
      <section className="mt-14">
        <h2 className="mb-5 text-2xl font-bold text-teal-deep">مقالات ذات صلة</h2>
        <RelatedArticles articles={related} />
      </section>
    </article>
  );
}
