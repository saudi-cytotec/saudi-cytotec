import { Link } from "react-router-dom";
import type { Article } from "../types";
import { getCluster } from "../utils/content";
import { IconArrowLeft } from "./icons";

/**
 * Lightweight article card — title, excerpt, category, metadata.
 *
 * Articles have no article-specific image. This card never renders an <img>,
 * never leaves an empty image box, and never preloads a thumbnail.
 */
export function ArticleCard({ article }: { article: Article }) {
  const cluster = getCluster(article.cluster);

  return (
    <article className="card-premium group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgb(11_37_69/0.28)]">
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold text-sky">{cluster.title}</p>
        <h3 className="mt-2 font-display text-[1.08rem] font-bold leading-8 text-brand-deep">
          <Link to={`/blog/${article.slug}`} className="transition group-hover:text-brand">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-7 text-ink-soft line-clamp-3">{article.excerpt}</p>
        <Link
          to={`/blog/${article.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-accent transition hover:text-accent-deep"
        >
          اقرأ المقال
          <IconArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
