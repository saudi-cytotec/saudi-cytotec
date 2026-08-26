import { ArticleCard } from "./ArticleCard";
import type { Article } from "../types";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-paper px-5 py-8 text-center text-ink-soft">
        لا توجد مقالات مرتبطة إضافية في هذه المجموعة حالياً.
      </div>
    );
  }
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
