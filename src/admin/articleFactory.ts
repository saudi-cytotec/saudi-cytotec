import { SITE } from "../data/site";
import type { ArticleType, ClusterId, ContentBlock, ManagedArticle, SearchIntent } from "../types";
import { defaultImage } from "../utils/content";
import { suggestSlug } from "../utils/slug";

export function emptyArticle(partial?: Partial<ManagedArticle>): ManagedArticle {
  const slug = partial?.slug || "cytotec-safety";
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
    image: defaultImage("definition"),
    imageAlt: "عنصر بصري تعليمي صغير",
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
    ...partial,
  };
}

export function applyTopicDefaults(article: ManagedArticle): ManagedArticle {
  const slug = article.slugLocked ? article.slug : suggestSlug(article.primaryKeyword || article.title) || article.slug;
  return {
    ...article,
    slug,
    seoTitle: article.seoTitle || article.title.slice(0, 70),
    metaTitle: article.metaTitle || article.title,
    ogTitle: article.ogTitle || article.metaTitle || article.title,
    ogDescription: article.ogDescription || article.metaDescription,
    canonical:
      article.canonical && /^https?:\/\/[^/]+\/.+/.test(article.canonical)
        ? article.canonical
        : `${SITE.domain}/blog/${slug}`,
    description: article.description || article.excerpt,
    // Preserve the editor's chosen images. Only fall back to the cluster
    // default when no image has ever been set — otherwise a saved featured /
    // banner / OG image would be silently wiped on every keystroke.
    image: article.image || defaultImage(article.cluster),
    imageAlt: article.imageAlt || "",
    // Banner/OG are optional overrides; when blank the public page falls back
    // to the featured image, so leave them empty rather than forcing a value.
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
