import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "../../cms/CatalogContext";
import { Badge, Card, EmptyState, Section } from "../ui";

export function SitemapScreen() {
  const { managed, map } = useCatalog();
  const [sitemapUrls, setSitemapUrls] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/sitemap.xml", { cache: "no-store" })
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((xml) => {
        const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
        setSitemapUrls(urls);
      })
      .catch((err) => setError(String(err?.message ?? err)));
  }, []);

  const expected = useMemo(() => {
    const published = managed.filter((a) => a.status === "published");
    return {
      homepage: "https://saudiersaa.com/",
      articles: published.map((a) => `https://saudiersaa.com/blog/${a.slug}`),
      count: published.length,
    };
  }, [managed]);

  const missingFromSitemap = useMemo(() => {
    if (!sitemapUrls) return [];
    const set = new Set(sitemapUrls);
    return expected.articles.filter((url) => !set.has(url));
  }, [sitemapUrls, expected]);

  const inSitemapButNotPublished = useMemo(() => {
    if (!sitemapUrls) return [];
    const set = new Set(expected.articles);
    return sitemapUrls.filter((url) => url.includes("/blog/") && !set.has(url));
  }, [sitemapUrls, expected]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-brand-deep">حالة خريطة الموقع (Sitemap)</h1>
      <p className="max-w-3xl text-sm leading-7 text-ink-soft">
        تُبنى <span dir="ltr">sitemap.xml</span> تلقائياً مع كل build من المحتوى القابل للتوجيه الفعلي: الصفحات الثابتة، صفحات المجموعات، المقالات الأصلية، وكل ملف ملتزم في <span dir="ltr">content/published/</span> — وتستبعد /admin و/api و/search والمقالات المجدولة غير المنشورة. نشر مقال = دخوله للخريطة بدون خطوة يدوية.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card label="روابط في الخريطة المنشورة" value={sitemapUrls?.length ?? "—"} />
        <Card label="مقالات منشورة متوقعة" value={expected.count} />
        <Card label="مواضيع في خريطة المحتوى" value={map.length} />
      </div>

      {error ? (
        <p className="rounded-2xl bg-accent-soft p-3 text-sm text-clay">تعذر جلب الخريطة من الخادم المنشور: {error} — سيظهر الفحص بعد النشر.</p>
      ) : null}

      {sitemapUrls ? (
        <>
          <Section title="مقالات منشورة مفقودة من الخريطة (يجب أن تكون صفراً)">
            {missingFromSitemap.length ? (
              <ul className="space-y-1 font-mono text-xs text-clay" dir="ltr">
                {missingFromSitemap.map((url) => (
                  <li key={url}>{url}</li>
                ))}
              </ul>
            ) : (
              <Badge tone="ok">PASS — كل المقالات المنشورة موجودة في الخريطة</Badge>
            )}
          </Section>

          <Section title="روابط مدونة في الخريطة غير منشورة في الكتالوج (قديمة أو خارجية)">
            {inSitemapButNotPublished.length ? (
              <ul className="space-y-1 font-mono text-xs" dir="ltr">
                {inSitemapButNotPublished.map((url) => (
                  <li key={url}>{url}</li>
                ))}
              </ul>
            ) : (
              <EmptyState text="لا توجد روابط يتيمة." />
            )}
          </Section>

          <Section title="آخر 15 رابطاً في الخريطة">
            <ul className="space-y-1 font-mono text-xs" dir="ltr">
              {sitemapUrls.slice(-15).map((url) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noreferrer" className="text-brand underline">{url}</a>
                </li>
              ))}
            </ul>
          </Section>
        </>
      ) : null}
    </div>
  );
}
