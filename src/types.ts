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
  faqs?: { q: string; a: string }[];
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
