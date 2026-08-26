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

export function defaultImage(_cluster: ClusterId): string {
  return "/images/og-default.jpg";
}

export function articlePlainText(article: Pick<Article, "blocks" | "faqs" | "h1" | "excerpt" | "title">): string {
  const blockText = article.blocks
    .map((b) => [b.text, ...(b.items ?? [])].filter(Boolean).join(" "))
    .join(" ");
  const faqText = (article.faqs ?? []).map((item) => `${item.q} ${item.a}`).join(" ");
  return `${article.title} ${article.h1} ${article.excerpt} ${blockText} ${faqText}`;
}

export function wordCount(article: Pick<Article, "blocks" | "faqs" | "h1" | "excerpt" | "title">): number {
  return articlePlainText(article).trim().split(/\s+/).filter(Boolean).length;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(article: Article): number {
  return Math.max(6, Math.round(wordCount(article) / 180));
}

export function makeArticle(article: Omit<Article, "publishedAt" | "updatedAt" | "image"> & Partial<Article>): Article {
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
