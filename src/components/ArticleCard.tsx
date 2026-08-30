import { Link } from "react-router-dom";
import type { Article } from "../types";
import { getCluster } from "../utils/content";

export function ArticleCard({ article }: { article: Article }) {
  const cluster = getCluster(article.cluster);
  const image = article.image || cluster.image || "/images/og-default.jpg";
  const alt = article.imageAlt || article.title;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/blog/${article.slug}`} className="block aspect-[16/9] overflow-hidden bg-brand-soft" aria-hidden="true" tabIndex={-1}>
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tracking-wide text-sage">{cluster.title}</p>
        <h3 className="mt-2 text-lg font-bold leading-8 text-teal-deep">
          <Link to={`/blog/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-7 text-ink-soft">{article.excerpt}</p>
        <Link to={`/blog/${article.slug}`} className="mt-4 text-sm font-semibold text-brand hover:text-accent">
          اقرأ المقال
        </Link>
      </div>
      <span className="sr-only">{alt}</span>
    </article>
  );
}
