import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Seo } from "../components/Seo";
import { IconArrowLeft, IconSearch } from "../components/icons";
import { PageHero } from "../components/PageHero";
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
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <Seo title="الصفحة غير موجودة" description="تعذر العثور على الصفحة المطلوبة." path="/404" noindex />
      <PageHero
        crumbs={[{ name: "404", path: location.pathname }]}
        title="الصفحة غير موجودة"
        description="ربما تغيّر الرابط أو كُتب بشكل غير صحيح. الروابط القديمة من الإصدارات السابقة للموقع تحوَّل تلقائياً إلى البديل التعليمي المكافئ عند وجوده."
      >
        <form
          className="mt-6 flex max-w-xl gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const value = q.trim();
            if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
          }}
        >
          <label className="relative flex-1">
            <span className="sr-only">بحث في المقالات</span>
            <IconSearch className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحثي عن موضوع تعليمي..."
              className="w-full rounded-full border border-line bg-white py-3 pe-4 ps-11 text-sm shadow-lg outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <button type="submit" className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-deep">
            بحث
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-bold text-brand transition hover:bg-brand-soft">
            الرئيسية
            <IconArrowLeft className="h-4 w-4" />
          </Link>
          <Link to="/blog" className="rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/20">
            كل المقالات
          </Link>
          <Link to="/sitemap" className="rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/20">
            خريطة الموقع
          </Link>
          <Link to="/contact" className="rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/20">
            اتصل بنا
          </Link>
        </div>
      </PageHero>

      {popular.length ? (
        <section>
          <h2 className="font-display text-xl font-extrabold text-brand-deep">مقالات رائجة</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {popular.map((article) => (
              <li key={article.slug}>
                <Link
                  to={`/blog/${article.slug}`}
                  className="card-premium block p-4 text-sm font-semibold text-brand-deep transition hover:-translate-y-0.5 hover:text-brand"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="font-display text-xl font-extrabold text-brand-deep">تصفحي الفئات</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {clusters.map((c) => (
            <Link
              key={c.id}
              to={`/blog/cluster/${c.slug}`}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-deep ring-1 ring-line transition hover:bg-brand-soft"
            >
              {c.shortTitle}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
