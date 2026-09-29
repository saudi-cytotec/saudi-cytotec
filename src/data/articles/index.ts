import type { Article } from "../../types";

/**
 * Clean slate: the legacy article library was retired.
 * New editorial content will be added only after the public architecture
 * and indexability baseline is clean.
 */
export const articles: Article[] = [];

const bySlug = new Map<string, Article>();

export function getArticle(slug: string) {
  return bySlug.get(slug);
}

export function relatedArticles(_article: Article, _all: Article[]) {
  return [];
}
