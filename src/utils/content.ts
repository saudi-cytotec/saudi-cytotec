import { clusters } from "../data/site";
import type { Article, Cluster, ClusterId, ContentBlock } from "../types";

/**
 * Fallback used when an article carries a cluster id that is not registered in
 * `clusters` (e.g. a legacy CMS/localStorage overlay row, or a published JSON
 * whose cluster was renamed/removed). `getCluster` must never return undefined:
 * ArticleCard and ArticlePage dereference `.title`/`.shortTitle`/`.slug` on the
 * result, and an undefined value throws during render, which unmounts the whole
 * React tree and leaves `/blog` (and article pages) as an empty page.
 *
 * The fallback keeps the page alive without touching the cluster registry, so
 * the real catalog (counts, chips, navigation) is completely unchanged.
 */
const FALLBACK_CLUSTER: Cluster = {
  id: "geographic",
  slug: "general-information",
  title: "معلومات عامة",
  shortTitle: "عام",
  description: "محتوى توعوي عام غير مصنف ضمن المحاور المحددة حالياً.",
};

export function getCluster(id: ClusterId): Cluster {
  return clusters.find((c) => c.id === id) ?? FALLBACK_CLUSTER;
}

export function clusterPath(cluster: Cluster | ClusterId): string {
  const item = typeof cluster === "string" ? getCluster(cluster) : cluster;
  return `/blog/cluster/${item.slug}`;
}

export function articlePath(slug: string): string {
  return `/blog/${slug}`;
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

export function makeArticle(
  article: Omit<Article, "publishedAt" | "updatedAt"> & Partial<Article>,
): Article {
  return {
    publishedAt: "2026-01-20",
    updatedAt: "2026-03-18",
    // Do NOT inject a default image. The article only has an image when an
    // editor (or the article spec) explicitly selects one; otherwise the UI
    // renders a clean no-image state; SEO metadata independently uses the
    // approved global social-share fallback when no custom OG image exists.
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
