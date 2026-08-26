import { Link } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Seo } from "../components/Seo";
import { staticPages } from "../data/pages";
import { clusters } from "../data/site";

export function SitemapPage() {
  const { articles } = useCatalog();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Seo title="خريطة الموقع" description="قائمة صفحات الموقع التعليمية والمقالات والمجموعات." path="/sitemap" />
      <Breadcrumbs items={[{ name: "خريطة الموقع", path: "/sitemap" }]} />
      <h1 className="mt-5 text-4xl font-bold text-teal-deep">خريطة الموقع</h1>
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-teal">الصفحات الأساسية</h2>
        <ul className="mt-3 columns-1 gap-6 sm:columns-2">
          {staticPages.map((page) => (
            <li key={page.path} className="mb-2">
              <Link to={page.path} className="text-teal hover:underline">
                {page.title}
              </Link>
            </li>
          ))}
          <li className="mb-2">
            <Link to="/blog" className="text-teal hover:underline">
              المقالات
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/contact" className="text-teal hover:underline">
              اتصل بنا
            </Link>
          </li>
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-teal">مجموعات المحتوى</h2>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {clusters.map((cluster) => (
            <li key={cluster.id}>
              <Link to={`/blog/cluster/${cluster.slug}`} className="text-teal hover:underline">
                {cluster.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-teal">المقالات</h2>
        <ul className="mt-3 columns-1 gap-8 md:columns-2">
          {articles.map((article) => (
            <li key={article.slug} className="mb-2 break-inside-avoid">
              <Link to={`/blog/${article.slug}`} className="text-sm leading-7 text-teal hover:underline">
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
