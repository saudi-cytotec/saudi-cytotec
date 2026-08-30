import { useParams } from "react-router-dom";
import { useCatalog } from "../../cms/CatalogContext";
import { Badge } from "../ui";

export function PreviewScreen() {
  const { id } = useParams();
  const { managed } = useCatalog();
  const article = managed.find((item) => item.id === id);
  if (!article) return <p>لا توجد معاينة.</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="rounded-3xl border border-line bg-paper p-8">
        <div className="flex items-center gap-2 text-sm">
          <Badge tone="info">معاينة تحريرية</Badge>
        </div>
        <h1 className="mt-2 text-4xl font-bold leading-[1.35] text-brand-deep">{article.h1 || article.title}</h1>
        <p className="mt-4 text-lg leading-9 text-ink-soft">{article.excerpt}</p>
        <div className="article-prose mt-8">
          {article.blocks.map((b, i) =>
            b.type === "h2" ? (
              <h2 key={i}>{b.text}</h2>
            ) : b.type === "h3" ? (
              <h3 key={i}>{b.text}</h3>
            ) : b.type === "ul" ? (
              <ul key={i}>
                {(b.items ?? []).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            ) : b.type === "callout" ? (
              <p key={i} className="rounded-2xl bg-accent-soft p-3">{b.text}</p>
            ) : (
              <p key={i}>{b.text}</p>
            ),
          )}
        </div>
        {article.faqs?.length ? (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-brand-deep">أسئلة متكررة</h2>
            <div className="mt-4 space-y-4">
              {article.faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-line bg-cream p-4">
                  <h3 className="font-bold">{item.q}</h3>
                  <p className="mt-2 leading-8">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
      <div>
        <h2 className="text-lg font-bold text-brand-deep">تفاصيل SEO</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li><strong>Title:</strong> {article.metaTitle}</li>
          <li><strong>SEO title:</strong> {article.seoTitle} ({article.seoTitle.length})</li>
          <li><strong>Meta:</strong> {article.metaDescription.slice(0, 80)}… ({article.metaDescription.length})</li>
          <li><strong>Slug:</strong> <span dir="ltr">/{article.slug}</span></li>
          <li><strong>Canonical:</strong> <span dir="ltr" className="break-all text-xs">{article.canonical}</span></li>
          <li><strong>المراجع:</strong> {article.references.join("، ") || "—"}</li>
        </ul>
      </div>
    </div>
  );
}
