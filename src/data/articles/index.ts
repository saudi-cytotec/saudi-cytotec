import type { Article } from "../../types";
import { cluster01 } from "./cluster01";
import { cluster02 } from "./cluster02";
import { cluster03 } from "./cluster03";
import { cluster04 } from "./cluster04";
import { cluster05 } from "./cluster05";
import { cluster06 } from "./cluster06";
import { cluster07 } from "./cluster07";
import { cluster08 } from "./cluster08";
import { cluster09 } from "./cluster09";
import { cluster10 } from "./cluster10";

export const articles: Article[] = [
  ...cluster01,
  ...cluster02,
  ...cluster03,
  ...cluster04,
  ...cluster05,
  ...cluster06,
  ...cluster07,
  ...cluster08,
  ...cluster09,
  ...cluster10,
];

const bySlug = new Map(articles.map((article) => [article.slug, article]));

export function getArticle(slug: string) {
  return bySlug.get(slug);
}

export function relatedArticles(article: Article, all: Article[]) {
  const picked = article.related
    .map((slug) => bySlug.get(slug) ?? all.find((item) => item.slug === slug))
    .filter((item): item is Article => Boolean(item));
  if (picked.length >= 3) return picked.slice(0, 3);
  const extras = all.filter(
    (item) => item.cluster === article.cluster && item.slug !== article.slug && !picked.some((p) => p.slug === item.slug),
  );
  return [...picked, ...extras].slice(0, 3);
}
