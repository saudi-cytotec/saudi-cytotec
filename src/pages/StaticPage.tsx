import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ContentBlocks } from "../components/ContentBlocks";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { Seo } from "../components/Seo";
import type { StaticPage as StaticPageType } from "../types";

export function StaticPage({ page }: { page: StaticPageType }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Seo
        title={page.metaTitle}
        description={page.metaDescription}
        path={page.path}
        image={page.image}
      />
      <Breadcrumbs items={[{ name: page.title, path: page.path }]} />
      {page.image ? (
        <img src={page.image} alt={page.imageAlt ?? ""} className="mt-6 h-64 w-full rounded-3xl object-cover" />
      ) : null}
      <h1 className="mt-6 text-4xl font-bold leading-tight text-teal-deep">{page.h1}</h1>
      <div className="mt-6">
        <DisclaimerBanner />
      </div>
      <div className="mt-8">
        <ContentBlocks blocks={page.blocks} />
      </div>
      <div className="mt-10 rounded-3xl bg-paper p-5 text-sm">
        <Link to="/blog" className="font-semibold text-teal">
          تصفحي المقالات المرتبطة
        </Link>
      </div>
    </div>
  );
}
