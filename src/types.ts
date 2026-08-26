export type ClusterId =
  | "definition"
  | "uses"
  | "safety"
  | "side-effects"
  | "pregnancy"
  | "womens-health"
  | "faq"
  | "interactions"
  | "emergency"
  | "evidence";

export interface Reference {
  id: string;
  title: string;
  source: string;
  url: string;
  note?: string;
}

export interface ContentBlock {
  type: "p" | "h2" | "h3" | "ul" | "callout";
  text?: string;
  items?: string[];
  tone?: "info" | "warning" | "emergency";
}

export interface ArticleFaq {
  q: string;
  a: string;
}

export interface Article {
  slug: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  cluster: ClusterId;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
  imageAlt: string;
  related: string[];
  cornerstones: string[];
  references: string[];
  blocks: ContentBlock[];
  faqs?: ArticleFaq[];
}

export interface Cluster {
  id: ClusterId;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  image: string;
}

export interface StaticPage {
  path: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  image?: string;
  imageAlt?: string;
  blocks: ContentBlock[];
}

export interface NavItem {
  to: string;
  label: string;
}

export type ArticleStatus = "draft" | "review" | "published";
export type SearchIntent = "informational" | "navigational" | "commercial" | "transactional";
export type ArticleType =
  | "pillar"
  | "cluster"
  | "faq"
  | "safety"
  | "explainer"
  | "comparison";

export interface ManagedArticle extends Article {
  id: string;
  status: ArticleStatus;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  articleType: ArticleType;
  seoTitle: string;
  ogTitle: string;
  ogDescription: string;
  canonical: string;
  description: string;
  slugLocked: boolean;
  source: "static" | "cms";
  internalLinks: string[];
  hasDisclaimer: boolean;
}

export interface ContentMapItem {
  id: string;
  title: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  cluster: ClusterId;
  articleType: ArticleType;
  proposedSlug: string;
  internalLinks: string[];
  status: "planned" | "draft" | "review" | "published" | "conflict";
  notes?: string;
}

export interface SiteSettings {
  name: string;
  domain: string;
  email: string;
  description: string;
  defaultOgImage: string;
  indexPublic: boolean;
}

export interface ValidationItem {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
  blocking: boolean;
}

export interface ValidationResult {
  ok: boolean;
  wordCount: number;
  missingWords: number;
  items: ValidationItem[];
}
