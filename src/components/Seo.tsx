import { Helmet } from "react-helmet-async";
import { SITE } from "../data/site";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
  noindex?: boolean;
  keywords?: string;
}

export function Seo({
  title,
  description,
  path,
  image = "/images/og-default.jpg",
  type = "website",
  publishedAt,
  updatedAt,
  noindex = false,
  keywords,
}: SeoProps) {
  const url = `${SITE.domain}${path === "/" ? "/" : path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE.domain}${image}`;
  const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  return (
    <Helmet>
      <html lang="ar" dir="rtl" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large"} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:site_name" content={SITE.name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {publishedAt ? <meta property="article:published_time" content={publishedAt} /> : null}
      {updatedAt ? <meta property="article:modified_time" content={updatedAt} /> : null}
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
