import { clusters } from "../data/site";
import type { Article, Cluster, ClusterId, ContentBlock } from "../types";

export function getCluster(id: ClusterId): Cluster {
  return clusters.find((c) => c.id === id)!;
}

export function clusterPath(cluster: Cluster | ClusterId): string {
  const item = typeof cluster === "string" ? getCluster(cluster) : cluster;
  return `/blog/cluster/${item.slug}`;
}

export function articlePath(slug: string): string {
  return `/blog/${slug}`;
}

export function defaultImage(cluster: ClusterId): string {
  const map: Record<ClusterId, string> = {
    definition: "/images/sources.jpg",
    uses: "/images/og-default.jpg",
    safety: "/images/safety.jpg",
    "side-effects": "/images/safety.jpg",
    pregnancy: "/images/womens-health.jpg",
    "womens-health": "/images/womens-health.jpg",
    faq: "/images/sources.jpg",
    interactions: "/images/safety.jpg",
    emergency: "/images/emergency.jpg",
    evidence: "/images/sources.jpg",
  };
  return map[cluster];
}

export function wordCount(article: Article): number {
  const text = article.blocks
    .map((b) => [b.text, ...(b.items ?? [])].filter(Boolean).join(" "))
    .join(" ");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(article: Article): number {
  return Math.max(6, Math.round(wordCount(article) / 180));
}

export function makeArticle(
  article: Omit<Article, "image" | "publishedAt" | "updatedAt"> &
    Partial<Pick<Article, "image" | "publishedAt" | "updatedAt">>,
): Article {
  return {
    publishedAt: "2026-01-20",
    updatedAt: "2026-03-18",
    image: article.image ?? defaultImage(article.cluster),
    ...article,
  };
}

export function p(text: string): ContentBlock {
  return { type: "p", text };
}
export function h2(text: string): ContentBlock {
  return { type: "h2", text };
}
export function h3(text: string): ContentBlock {
  return { type: "h3", text };
}
export function ul(items: string[]): ContentBlock {
  return { type: "ul", items };
}
export function warn(text: string): ContentBlock {
  return { type: "callout", text, tone: "warning" };
}
export function info(text: string): ContentBlock {
  return { type: "callout", text, tone: "info" };
}
export function emergency(text: string): ContentBlock {
  return { type: "callout", text, tone: "emergency" };
}
