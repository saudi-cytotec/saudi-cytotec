import type { ManagedArticle } from "../types";
import { articles as staticArticles } from "./articles";
import { staticManaged } from "../cms/defaults";
import { committedArticles } from "../cms/contentSource";

const managedBySlug = new Map(staticManaged.map((article) => [article.slug, article]));
for (const article of committedArticles) {
  const base = managedBySlug.get(article.slug);
  managedBySlug.set(article.slug, base ? { ...article, id: base.id } : article);
}

export const publicManagedArticles: ManagedArticle[] = [...managedBySlug.values()].filter(
  (article) => String(article.status).toLowerCase() === "published",
);

export const publicArticles = publicManagedArticles;
