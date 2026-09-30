import { Link } from "react-router-dom";
import { CareReferral } from "../components/CareReferral";
import { ContentBlocks } from "../components/ContentBlocks";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { IconArrowLeft } from "../components/icons";
import { PageHero } from "../components/PageHero";
import { JsonLd, Seo } from "../components/Seo";
import { SITE } from "../data/site";
import type { StaticPage as StaticPageType } from "../types";

export function StaticPage({ page }: { page: StaticPageType }) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <Seo title={page.metaTitle} description={page.metaDescription} path={page.path} image={page.image} />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.h1,
            url: `${SITE.domain}${page.path}`,
            inLanguage: SITE.locale,
            description: page.metaDescription,
            isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.domain },
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.domain },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE.domain}/` },
              { "@type": "ListItem", position: 2, name: page.h1, item: `${SITE.domain}${page.path}` },
            ],
          },
        ]}
      />
      <PageHero crumbs={[{ name: page.title, path: page.path }]} title={page.h1} />
      <div className="max-w-3xl">
        <DisclaimerBanner />
      </div>
      <div className="max-w-3xl">
        <ContentBlocks blocks={page.blocks} />
      </div>
      <div className="max-w-3xl">
        <CareReferral />
      </div>
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-deep"
      >
        تصفحي المقالات المرتبطة
        <IconArrowLeft className="h-4 w-4" />
      </Link>
    </div>
  );
}
