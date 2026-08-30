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
  | "evidence"
  | "geographic";

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

export interface ResourceLink {
  to: string;
  label: string;
  description?: string;
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
  /**
   * Card / featured-thumbnail image (also the hero when no bannerImage).
   * Empty string means NO image has been selected — the UI must not invent
   * a default. Keep controls available so editors can still assign one.
   */
  image?: string;
  imageAlt?: string;
  /** Optional large hero/banner shown at the top of the public page. */
  bannerImage?: string;
  bannerImageAlt?: string;
  /** Open Graph / social-sharing image. Only emitted when explicitly set. */
  ogImage?: string;
  related: string[];
  cornerstones: string[];
  references: string[];
  blocks: ContentBlock[];
  faqs?: ArticleFaq[];
  resourceLinks?: ResourceLink[];
  noindex?: boolean;
}

export interface Cluster {
  id: ClusterId;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
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

export type ArticleStatus = "draft" | "review" | "published" | "archived";
// NOTE: the legacy "scheduled" status from earlier builds is deliberately not
// part of this union anymore. Nothing in the system schedules or promotes
// articles: publishing is exclusively an explicit administrator action. Any
// old stored row with status "scheduled" is treated as a draft by the catalog.
export type SearchIntent = "informational" | "navigational" | "commercial" | "transactional" | "commercial investigation" | "local" | "medical safety" | "FAQ";
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
  /** Editorial author byline; empty = platform editorial team. */
  author?: string;
}

/** Editorial workflow states for the 100-topic content map. */
export type MapStatus = "IDEA" | "RESEARCH" | "OUTLINE" | "DRAFT" | "REVIEW" | "READY" | "PUBLISHED" | "UPDATED";

export type MapPriority = "P0" | "P1" | "P2" | "P3";

export interface ContentMapItem {
  /** Stable topic id, e.g. "C-015". */
  id: string;
  /** Strategy cluster letter, e.g. "C" (Ectopic pregnancy). */
  cluster: string;
  topic: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  /** SA | AE | KW | BH | GCC | neutral */
  country: string;
  /** Real local-intent notes (e.g. "SA screening pathway"); never doorway pages. */
  cityRelevance: string[];
  priority: MapPriority;
  /** Live URL when published; proposed URL when planned. */
  targetUrl: string;
  /** Parent / pillar article or hub path. */
  parent: string;
  related: string[];
  /** Deliberate links this topic should carry when drafted. */
  internalLinks: string[];
  /** Real FAQ angles to answer on-page or in the FAQ hub. */
  faqOpportunities: string[];
  /** Reference ids or official source labels to use during drafting. */
  relevantReferences: string[];
  /** Appropriate next step; never a forced sales CTA. */
  cta: string;
  status: MapStatus;
  notes?: string;
}

export interface RedirectRule {
  source: string;
  destination: string | null;
  statusCode: 301 | 410;
  isRegex?: boolean;
  reason: string;
  createdAt: string;
}

export interface RedirectRegistry {
  version: number;
  updatedAt: string;
  wwwToApex: boolean;
  rules: RedirectRule[];
}

export interface CompetitorGap {
  keyword: string;
  competitor: string;
  competitorUrl: string;
  searchIntent: string;
  contentQuality: string;
  missingInformation: string;
  ourOpportunity: string;
  priority: string;
}

export interface NotFoundEntry {
  path: string;
  firstSeen: string;
  lastSeen: string;
  count: number;
  handled: boolean;
  handledBy?: string;
}

export interface SiteSettings {
  name: string;
  domain: string;
  email: string;
  description: string;
  indexPublic: boolean;
}


