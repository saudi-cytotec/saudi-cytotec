import { Link } from "react-router-dom";
import type { Article } from "../types";
import { getCluster } from "../utils/content";
import { IconArrowLeft } from "./icons";

/**
 * Premium article card.
 * Image precedence (per CMS requirement): the article's OWN selected image
 * (featured → banner → cluster) always wins; the site default is used only as
 * the final fallback when NO image has been selected at all.
 */
export function ArticleCard({ article }: { article: Article }) {
  const cluster = getCluster(article.cluster);
  const image = article.image || cluster.image || "/images/og-default.jpg";
  const alt = article.imageAlt || article.title;

  return (
    <article className="card-premium group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgb(11_37_69/0.28)]">
      <Link
        to={`/blog/${article.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-brand-soft"
        aria-hidden="true"
        tabIndex={-1}
      >
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute start-3 top-3 rounded-full bg-brand-deep/90 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
          {cluster.shortTitle}
        </span>
      </Link>
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
      <span className="sr-only">{alt}</span>
    </article>
  );
}
