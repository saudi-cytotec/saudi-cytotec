import { SITE } from "../data/site";
import type { ArticleType, ClusterId, ContentBlock, ManagedArticle, SearchIntent } from "../types";

export function emptyArticle(partial?: Partial<ManagedArticle>): ManagedArticle {
  // A new article starts with NO slug: the administrator (or the primary
  // keyword suggestion) must choose one. Defaulting to a real existing slug
  // risked publishing over an unrelated article.
  const slug = partial?.slug || "";
  return {
    id: partial?.id ?? `cms-${Date.now()}`,
    slug,
    title: "",
    h1: "",
    metaTitle: "",
    metaDescription: "",
    cluster: "definition",
    excerpt: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    // New articles start with NO image — editor must explicitly select one.
    image: "",
    imageAlt: "",
    thumbnail: "",
    thumbnailAlt: "",
    bannerImage: "",
    bannerImageAlt: "",
    ogImage: "",
    related: [],
    cornerstones: ["/medical-disclaimer", "/safety"],
    references: ["fdaLabel", "sfda"],
    blocks: [],
    faqs: [],
    status: "draft",
    primaryKeyword: "",
    secondaryKeywords: [],
    searchIntent: "informational",
    articleType: "explainer",
    seoTitle: "",
    ogTitle: "",
    ogDescription: "",
    canonical: `${SITE.domain}/blog/${slug}`,
    description: "",
    slugLocked: false,
    source: "cms",
    internalLinks: [],
    hasDisclaimer: false,
    medicalReviewer: "",
    lastReviewedAt: "",
    nofollow: false,
    excludeFromSitemap: false,
    ...partial,
  };
}

/**
 * Fill derived defaults without ever overwriting a deliberate editor choice.
 *
 * The slug is NEVER re-derived here. It is only ever set explicitly: by the
 * administrator typing in the slug field, or by the primary-keyword field
 * proposing one while the slug is still empty. Re-deriving it on every patch
 * silently rewrote a hand-authored URL (and could publish to the wrong path),
 * so this function now treats the slug as owned by the editor.
 */
export function applyTopicDefaults(article: ManagedArticle): ManagedArticle {
  const slug = article.slug;
  return {
    ...article,
    slug,
    seoTitle: article.seoTitle || article.title.slice(0, 70),
    metaTitle: article.metaTitle || article.title,
    ogTitle: article.ogTitle || article.metaTitle || article.title,
    ogDescription: article.ogDescription || article.metaDescription,
    canonical:
      article.noindex === true && article.canonical && /^https?:\/\/[^/]+\/.+/.test(article.canonical)
        ? article.canonical
        : `${SITE.domain}/blog/${slug}`,
    description: article.description || article.excerpt,
    // Preserve the editor's chosen images verbatim. NEVER auto-assign a
    // cluster/default/generated image — absence of an image is a valid state
    // (no card thumbnail, no featured/banner figure; SEO metadata uses the
    // global social-share fallback independently).
    image: article.image || "",
    imageAlt: article.imageAlt || "",
    thumbnail: article.thumbnail || "",
    thumbnailAlt: article.thumbnailAlt || "",
    bannerImage: article.bannerImage || "",
    bannerImageAlt: article.bannerImageAlt || "",
    ogImage: article.ogImage || "",
  };
}

export interface GeneratorInput {
  topic: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  cluster: ClusterId;
  searchIntent: SearchIntent;
  articleType: ArticleType;
  proposedSlug: string;
  seoTitle: string;
  metaDescription: string;
  internalLinks: string;
  references: string;
}

export function blocksFromGenerated(raw: unknown): ContentBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const row = item as ContentBlock;
      if (!row || !row.type) return null;
      return row;
    })
    .filter((item): item is ContentBlock => Boolean(item));
}
