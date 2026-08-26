import type { Article } from "../types";
import { ArticleCard } from "./ArticleCard";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) {
    return <p className="text-ink-soft">لا توجد مقالات مرتبطة إضافية في هذه المجموعة حالياً.</p>;
  }
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
