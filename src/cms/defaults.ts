import { articles } from "../data/articles";
import { SITE } from "../data/site";
import type { ContentMapItem, ManagedArticle, SearchIntent, SiteSettings } from "../types";
import { contentMap } from "./registrySource";

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

// NOTE: no generated test draft is seeded into the CMS. AI generation is only
// possible when an administrator explicitly clicks "توليد المسودة" in the
// generator screen, and the result is always an editable DRAFT — never
// auto-published.

export const defaultSettings: SiteSettings = {
  name: SITE.name,
  domain: SITE.domain,
  email: SITE.email,
  description: SITE.description,
  indexPublic: true,
};

export function seedContentMap(): ContentMapItem[] {
  // The 100-topic map committed in content/map.json is the source of truth.
  // Local (uncommitted) edits in the admin overlay these rows in storage.
  return [...contentMap];
}
