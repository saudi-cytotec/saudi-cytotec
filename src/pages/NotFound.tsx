import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Seo } from "../components/Seo";
import { useCatalog } from "../cms/CatalogContext";
import { clusters } from "../data/site";

/**
 * 404 — a real, useful page, not a redirect to the homepage.
 *
 * Unknown URLs are deliberately NOT blanket-redirected: 301s are reserved for
 * legacy URLs with an equivalent replacement (content/redirects.json). This
 * page offers search, popular articles, categories and the homepage instead,
 * and logs the miss for the CMS 404 Monitor (local only — no visitor network
 * calls).
 */
export function NotFound() {
  const { articles, recordNotFound } = useCatalog();
  const location = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  useEffect(() => {
    recordNotFound(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const popular = [...articles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Seo title="الصفحة غير موجودة" description="تعذر العثور على الصفحة المطلوبة." path="/404" noindex />
      <p className="text-sm font-semibold text-accent">خطأ 404</p>
      <h1 className="mt-2 text-4xl font-bold text-brand-deep">الصفحة غير موجودة</h1>
      <p className="mt-4 leading-8 text-ink-soft">
        ربما تغيّر الرابط أو كُتب بشكل غير صحيح. الروابط القديمة من الإصدارات السابقة للموقع تحوَّل تلقائياً إلى البديل التعليمي المكافئ عند وجوده، وتُزال الصفحات الملغاة بلا بديل.
      </p>

      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const value = q.trim();
          if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
        }}
      >
        <label className="sr-only" htmlFor="nf-search">بحث في المقالات</label>
        <input
          id="nf-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحثي عن موضوع تعليمي..."
          className="w-full rounded-full border border-line bg-paper px-4 py-2.5 text-sm"
        />
        <button type="submit" className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-sm text-white">
          بحث
        </button>
      </form>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link to="/" className="rounded-full bg-brand px-5 py-2 text-sm text-white">الرئيسية</Link>
        <Link to="/blog" className="rounded-full border border-line px-5 py-2 text-sm">كل المقالات</Link>
        <Link to="/sitemap" className="rounded-full border border-line px-5 py-2 text-sm">خريطة الموقع</Link>
        <Link to="/contact" className="rounded-full border border-line px-5 py-2 text-sm">اتصل بنا</Link>
      </div>

      {popular.length ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-brand-deep">مقالات رائجة</h2>
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {popular.map((article) => (
              <li key={article.slug}>
                <Link to={`/blog/${article.slug}`} className="block rounded-2xl border border-line bg-paper p-3 text-sm hover:bg-brand-soft">
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-xl font-bold text-brand-deep">التصنيفات</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {clusters.map((cluster) => (
            <Link key={cluster.id} to={`/blog/cluster/${cluster.slug}`} className="rounded-full border border-line px-3 py-1.5 text-xs">
              {cluster.shortTitle}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
