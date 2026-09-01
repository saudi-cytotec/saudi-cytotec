import { useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../cms/CatalogContext";
import { bodyWordCount } from "../../utils/bodyWordCount";
import { EmptyState, StatusBadge, Td, Th } from "../ui";

export type ArticleFilter = "all" | "draft" | "review" | "published";

const FILTER_TITLES: Record<ArticleFilter, string> = {
  all: "كل المقالات",
  draft: "المسودات",
  review: "قيد المراجعة",
  published: "المقالات المنشورة",
};

export function ArticlesScreen({ filter }: { filter: ArticleFilter }) {
  const { managed, removeArticle } = useCatalog();
  const [q, setQ] = useState("");
  const rows = managed
    .filter((item) => {
      if (filter === "draft") return item.status === "draft";
      if (filter === "review") return item.status === "review";
      if (filter === "published") return item.status === "published";
      return true;
    })
    .filter((item) => `${item.title} ${item.slug} ${item.primaryKeyword}`.includes(q));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold text-brand-deep">{FILTER_TITLES[filter]}</h1>
        <Link to="/admin/articles/new" className="rounded-full bg-brand px-4 py-2 text-sm text-white">
          مقال جديد
        </Link>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="بحث بالعنوان أو الرابط أو الكلمة المفتاحية"
        className="mt-4 max-w-md w-full rounded-full border border-line bg-paper px-4 py-2 text-sm"
      />
      <div className="mt-5 overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-cream">
            <tr>
              <Th>العنوان</Th>
              <Th>الرابط</Th>
              <Th>الحالة</Th>
              <Th>كلمات المتن</Th>
              <Th>الكلمة الأساسية</Th>
              <Th>المصدر</Th>
              <Th>إجراء</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <Td>
                  <Link to={`/admin/articles/${item.id}`} className="font-semibold text-brand hover:underline">
                    {item.title || "بدون عنوان"}
                  </Link>
                </Td>
                <Td className="font-mono text-xs" >
                  <span dir="ltr">/{item.slug}</span>
                </Td>
                <Td><StatusBadge status={item.status} /></Td>
                <Td>{bodyWordCount(item.blocks)}</Td>
                <Td>{item.primaryKeyword || "—"}</Td>
                <Td>{item.source === "static" ? "أصل الموقع" : "لوحة"}</Td>
                <Td>
                  {item.source === "cms" ? (
                    <button type="button" className="text-clay" onClick={() => removeArticle(item.id)}>
                      حذف
                    </button>
                  ) : (
                    <span className="text-ink-soft">محمي</span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? <EmptyState text="لا توجد مقالات مطابقة." /> : null}
      </div>
    </div>
  );
}
