import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CareReferral } from "../components/CareReferral";
import { ContentBlocks } from "../components/ContentBlocks";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { Seo } from "../components/Seo";
import type { StaticPage as StaticPageType } from "../types";

export function StaticPage({ page }: { page: StaticPageType }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title={page.metaTitle} description={page.metaDescription} path={page.path} image={page.image} />
      <Breadcrumbs items={[{ name: page.title, path: page.path }]} />
      <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.35] text-teal-deep">{page.h1}</h1>
      {page.image ? (
        <figure className="mt-6 max-w-4xl overflow-hidden rounded-3xl border border-line bg-brand-soft shadow-sm">
          <img
            src={page.image}
            alt={page.imageAlt || page.title}
            width={1200}
            height={675}
            loading="eager"
            decoding="async"
            className="aspect-[16/9] w-full object-cover"
          />
          {page.imageAlt ? <figcaption className="px-4 py-2 text-xs text-ink-soft">{page.imageAlt}</figcaption> : null}
        </figure>
      ) : null}
      <div className="mt-6 max-w-3xl">
        <DisclaimerBanner />
      </div>
      <div className="mt-8 max-w-3xl">
        <ContentBlocks blocks={page.blocks} />
      </div>
      <div className="max-w-3xl">
        <CareReferral />
      </div>
      <Link to="/blog" className="mt-6 inline-block text-sm font-semibold text-teal">
        تصفحي المقالات المرتبطة
      </Link>
    </div>
  );
}
