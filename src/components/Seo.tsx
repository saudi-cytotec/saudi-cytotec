import { Helmet } from "react-helmet-async";
import { SITE } from "../data/site";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  /**
   * Explicitly selected social-sharing / featured image. OMIT (or pass empty
   * string) when no real image exists — og:image / twitter:image will NOT be
   * emitted, and Twitter will fall back to a text summary card automatically.
   * No default placeholder image is ever injected.
   */
  image?: string;
  /** Optional Open Graph title override (falls back to title). */
  ogTitle?: string;
  /** Optional Open Graph description override (falls back to description). */
  ogDescription?: string;
  /** Explicit canonical override (defaults to the page's own URL). */
  canonical?: string;
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
  image,
  ogTitle,
  ogDescription,
  canonical,
  type = "website",
  publishedAt,
  updatedAt,
  noindex = false,
  keywords,
}: SeoProps) {
  const selfUrl = `${SITE.domain}${path === "/" ? "/" : path}`;
  const url = canonical || selfUrl;
  // Treat empty / whitespace-only strings as "no image selected".
  const realImage = image && image.trim() ? image.trim() : "";
  const imageUrl = realImage ? (realImage.startsWith("http") ? realImage : `${SITE.domain}${realImage}`) : "";
  const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  const socialTitle = ogTitle && ogTitle.includes(SITE.name) ? ogTitle : ogTitle ? `${ogTitle} | ${SITE.name}` : fullTitle;
  const socialDescription = ogDescription || description;
  return (
    <Helmet>
      <html lang="ar" dir="rtl" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large"} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:site_name" content={SITE.name} />
      {/* og:image / twitter:image: ONLY when a real image was explicitly selected. */}
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
      {imageUrl ? <meta name="twitter:card" content="summary_large_image" /> : <meta name="twitter:card" content="summary" />}
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={socialDescription} />
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}
      {publishedAt ? <meta property="article:published_time" content={publishedAt} /> : null}
      {updatedAt ? <meta property="article:modified_time" content={updatedAt} /> : null}
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
