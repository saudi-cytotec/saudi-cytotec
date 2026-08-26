import { articles } from "../data/articles";
import { SITE } from "../data/site";
import type { ContentMapItem, ManagedArticle, SearchIntent, SiteSettings } from "../types";
import { testArticle } from "./testArticle";

function intentFor(cluster: ManagedArticle["cluster"]): SearchIntent {
  if (cluster === "emergency") return "informational";
  if (cluster === "faq") return "informational";
  return "informational";
}

export function staticToManaged(article: (typeof articles)[number]): ManagedArticle {
  return {
    ...article,
    id: `static-${article.slug}`,
    status: "published",
    primaryKeyword: article.slug.replace(/-/g, " "),
    secondaryKeywords: article.related.slice(0, 3).map((item) => item.replace(/-/g, " ")),
    searchIntent: intentFor(article.cluster),
    articleType: article.cluster === "faq" ? "faq" : article.cluster === "safety" ? "safety" : "cluster",
    seoTitle: article.metaTitle,
    ogTitle: article.metaTitle,
    ogDescription: article.metaDescription,
    canonical: `${SITE.domain}/blog/${article.slug}`,
    description: article.excerpt,
    slugLocked: true,
    source: "static",
    internalLinks: [...article.related, ...article.cornerstones],
    hasDisclaimer: true,
  };
}

export const staticManaged: ManagedArticle[] = articles.map(staticToManaged);

export const generatedDrafts: ManagedArticle[] = [testArticle];

export const defaultSettings: SiteSettings = {
  name: SITE.name,
  domain: SITE.domain,
  email: SITE.email,
  description: SITE.description,
  defaultOgImage: "/images/og-default.jpg",
  indexPublic: true,
};

export function seedContentMap(): ContentMapItem[] {
  return staticManaged.map((article) => ({
    id: `map-${article.slug}`,
    title: article.title,
    primaryKeyword: article.primaryKeyword,
    secondaryKeywords: article.secondaryKeywords,
    searchIntent: article.searchIntent,
    cluster: article.cluster,
    articleType: article.articleType,
    proposedSlug: article.slug,
    internalLinks: article.internalLinks,
    status: "published",
  }));
}
