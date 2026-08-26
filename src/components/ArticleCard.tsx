import { Link } from "react-router-dom";
import type { Article } from "../types";
import { getCluster } from "../utils/content";

export function ArticleCard({ article }: { article: Article }) {
  const cluster = getCluster(article.cluster);
  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-paper p-5 shadow-sm">
      <p className="text-xs font-semibold tracking-wide text-sage">{cluster.title}</p>
      <h3 className="mt-2 text-lg font-bold leading-8 text-teal-deep">
        <Link to={`/blog/${article.slug}`} className="hover:underline">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-7 text-ink-soft">{article.excerpt}</p>
      <Link to={`/blog/${article.slug}`} className="mt-4 text-sm font-semibold text-teal">
        اقرأ المقال
      </Link>
    </article>
  );
}
