import { Link } from "react-router-dom";
import { getCluster } from "../utils/content";
import type { Article } from "../types";

export function ArticleCard({ article }: { article: Article }) {
  const cluster = getCluster(article.cluster);
  return (
    <article className="group overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_8px_30px_rgba(15,76,92,0.04)]">
      <Link to={`/blog/${article.slug}`} className="block">
        <img src={article.image} alt={article.imageAlt} className="h-44 w-full object-cover" loading="lazy" />
      </Link>
      <div className="space-y-3 p-5">
        <p className="text-xs font-semibold text-sage">{cluster.title}</p>
        <h3 className="text-lg font-bold leading-8 text-teal-deep">
          <Link to={`/blog/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </h3>
        <p className="text-sm leading-7 text-ink-soft">{article.excerpt}</p>
        <Link to={`/blog/${article.slug}`} className="inline-flex text-sm font-semibold text-teal">
          اقرأ المقال
        </Link>
      </div>
    </article>
  );
}
