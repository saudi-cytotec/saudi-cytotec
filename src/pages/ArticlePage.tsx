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
import { ArticleWhatsAppBanner } from "../components/WhatsAppContact";
import { LOGO_SRC } from "../components/Logo";
import type { ManagedArticle } from "../types";
import { NotFound } from "./NotFound";

function labelForTarget(path: string, articles: { slug: string; title: string }[]) {
  if (path.startsWith("/blog/")) return articles.find((item) => item.slug === path.slice(6))?.title ?? "مقال مرتبط";
  if (!path.startsWith("/")) return articles.find((item) => item.slug === path)?.title ?? "مقال مرتبط";
  const staticPage = staticPages.find((item) => item.path === path);
  if (staticPage) return staticPage.title;
  if (path === "/service-areas") return "المناطق والمدن";
  if (path === "/topics") return "محاور المحتوى";
  const cluster = clusters.find((item) => `/blog/cluster/${item.slug}` === path);
  return cluster?.shortTitle ?? "صفحة مرتبطة";
}

export function ArticlePage() {
  const { slug } = useParams();
  const { articles, managed } = useCatalog();
  const article = articles.find((item) => item.slug === slug);
  const managedArticle = managed.find((item) => item.slug === slug) as ManagedArticle | undefined;
  if (!article) return <NotFound />;

  const cluster = getCluster(article.cluster);
  const related = pickRelated(article, articles.filter((item) => !item.noindex));
  const clusterArticles = articles.filter((item) => item.cluster === article.cluster);
  const indexInCluster = clusterArticles.findIndex((item) => item.slug === article.slug);
  const previous = indexInCluster > 0 ? clusterArticles[indexInCluster - 1] : null;
  const next = indexInCluster >= 0 && indexInCluster < clusterArticles.length - 1 ? clusterArticles[indexInCluster + 1] : null;

  const seoTitle = managedArticle?.seoTitle || article.metaTitle;
  const seoDescription = managedArticle?.metaDescription || article.metaDescription;
  const keywordMeta = managedArticle ? [managedArticle.primaryKeyword, ...managedArticle.secondaryKeywords].filter(Boolean).join(", ") : article.title;
  const ogImage = article.ogImage || article.bannerImage || article.image || "";
  const bannerSrc = article.bannerImage || article.image || "";
  const bannerAlt = article.bannerImageAlt || article.imageAlt || article.title;
  const canonical = managedArticle?.canonical?.startsWith(SITE.domain)
    ? managedArticle.canonical
    : `${SITE.domain}/blog/${article.slug}`;
  const noindex = managedArticle?.noindex === true || article.noindex === true;
  const resourceLinks = managedArticle?.resourceLinks ?? [];
  const isSaudiHubShadow = article.slug === "cytotec-in-saudi-arabia";

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={`/blog/${article.slug}`}
        type="article"
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        image={ogImage}
        ogTitle={managedArticle?.ogTitle}
        ogDescription={managedArticle?.ogDescription}
        canonical={canonical}
        keywords={keywordMeta}
        noindex={noindex}
      />
      {!noindex ? (
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": ["Article", "MedicalWebPage"],
              headline: article.h1,
              author: { "@type": "Organization", name: SITE.name, url: SITE.domain },
              publisher: {
                "@type": "Organization",
                name: SITE.name,
                url: SITE.domain,
                logo: { "@type": "ImageObject", url: `${SITE.domain}${LOGO_SRC}` },
              },
              description: seoDescription,
              datePublished: article.publishedAt,
              dateModified: article.updatedAt,
              inLanguage: "ar",
              mainEntityOfPage: canonical,
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
      ) : null}
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
          {article.imageAlt ? <figcaption className="px-4 py-2.5 text-xs text-ink-soft">{article.imageAlt}</figcaption> : null}
        </figure>
      ) : null}

      <ArticleWhatsAppBanner />

      <div className="mt-6 max-w-3xl">
        <DisclaimerBanner />
      </div>
      {isSaudiHubShadow ? (
        <section className="mt-6 max-w-3xl rounded-3xl border border-brand/20 bg-brand-soft p-5">
          <p className="text-xs font-bold text-brand">تنبيه هيكلي</p>
          <h2 className="mt-1 text-xl font-bold text-brand-deep">الصفحة السعودية الرئيسية لهذا الموضوع أصبحت هنا</h2>
          <p className="mt-2 text-sm leading-7 text-ink-soft">
            للحفاظ على مسار واحد واضح وغير مكرر، تعتمد بنية الموقع الآن على صفحة <strong>سايتوتك في السعودية</strong>
            ضمن <strong>المناطق والمدن</strong> بوصفها المركز الأساسي، بينما تبقى هذه الصفحة مرجعاً انتقالياً لمن يصل إليها
            عبر رابط قديم.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link to="/service-areas" className="rounded-full bg-accent px-5 py-2.5 font-bold text-white transition hover:brightness-110">
              الانتقال إلى الصفحة الرئيسية
            </Link>
            <Link to="/faq" className="rounded-full border border-line bg-paper px-5 py-2.5 font-semibold text-brand-deep hover:bg-cream">
              أسئلة شائعة
            </Link>
          </div>
        </section>
      ) : null}
      <div className="mt-10">
        <ContentBlocks blocks={article.blocks} />
      </div>

      {resourceLinks.length ? (
        <section className="mt-12 rounded-3xl border border-line bg-paper p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-teal-deep">{isSaudiHubShadow ? "الصفحة الرئيسية وروابط المدن" : "روابط مرتبطة مفيدة"}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-soft">
            {isSaudiHubShadow
              ? "إذا وصلتِ إلى هذا الرابط مباشرة، فابدئي من الصفحة السعودية الرئيسية ثم انتقلي إلى المدينة الأقرب لسؤالك أو إلى صفحات الأمان والطوارئ والمراجع."
              : "الروابط التالية تساعدك على الانتقال بين الصفحة السعودية الرئيسية، والدليل الجغرافي، والموضوعات المرتبطة بسؤالك."}
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {resourceLinks.map((item) => (
              <Link key={item.to} to={item.to} className="rounded-2xl bg-cream p-4 hover:bg-brand-soft">
                <h3 className="font-bold text-brand-deep">{item.label}</h3>
                {item.description ? <p className="mt-2 text-sm leading-7 text-ink-soft">{item.description}</p> : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

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
          المناطق والمدن
        </Link>
      </div>

      {(previous || next) ? (
        <nav className="mt-8 grid gap-3 md:grid-cols-2" aria-label="المقال السابق والتالي داخل المحور">
          {previous ? (
            <Link to={`/blog/${previous.slug}`} className="rounded-2xl border border-line bg-paper p-4 text-sm hover:bg-cream">
              السابق في المحور: <strong>{previous.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/blog/${next.slug}`} className="rounded-2xl border border-line bg-paper p-4 text-sm hover:bg-cream">
              التالي في المحور: <strong>{next.title}</strong>
            </Link>
          ) : null}
        </nav>
      ) : null}

      <section className="mt-14">
        <h2 className="mb-5 text-2xl font-bold text-teal-deep">مقالات ذات صلة</h2>
        <RelatedArticles articles={related} />
      </section>
    </article>
  );
}
