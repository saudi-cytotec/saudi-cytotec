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
}: SeoProps) {
  const url = `${SITE.domain}${path === "/" ? "/" : path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE.domain}${image}`;
  const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;

  return (
    <Helmet htmlAttributes={{ lang: "ar", dir: "rtl" }}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? "noindex,follow" : "index,follow,max-image-preview:large"} />
      <meta property="og:locale" content="ar_SA" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {publishedAt ? <meta property="article:published_time" content={publishedAt} /> : null}
      {updatedAt ? <meta property="article:modified_time" content={updatedAt} /> : null}
    </Helmet>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
