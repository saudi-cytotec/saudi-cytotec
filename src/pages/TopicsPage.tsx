import { Link } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { mapRegistry } from "../cms/registrySource";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CategoryCard } from "../components/CategoryCard";
import { Seo } from "../components/Seo";
import { clusters } from "../data/site";
import { clusterPath } from "../utils/content";

export function TopicsPage() {
  const { articles } = useCatalog();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title="محاور المحتوى والموضوعات" description="مركز اكتشاف يربط محاور سايتوتك وميزوبروستول، الأمان، الحمل المبكر، صحة المرأة، الأسئلة، الموارد، والمناطق." path="/topics" />
      <Breadcrumbs items={[{ name: "محاور المحتوى", path: "/topics" }]} />
      <h1 className="mt-5 text-4xl font-bold text-teal-deep">محاور المحتوى</h1>
      <p className="mt-3 max-w-3xl leading-8 text-ink-soft">استخدمي هذه الصفحة كبوابة للانتقال من السؤال العام إلى المجموعة المناسبة ثم المقال التفصيلي أو صفحة الأسئلة.</p>

      <section className="mt-8 rounded-3xl border border-line bg-paper p-6">
        <h2 className="text-2xl font-bold text-teal-deep">المحتوى حسب الدولة</h2>
        <p className="mt-2 text-sm leading-7 text-ink-soft">
          أدلة توعوية مخصصة لكل دولة خليجية، تغطي السياق التنظيمي المحلي والمصادر الرسمية للرعاية الصحية.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/abortion-pills-saudi-arabia"
            className="group rounded-2xl border border-line bg-cream/60 p-4 transition hover:border-teal hover:bg-cream"
          >
            <h3 className="font-bold text-brand-deep group-hover:text-teal-deep">🇸🇦 المملكة العربية السعودية</h3>
            <p className="mt-1 text-xs leading-5 text-ink-soft">
              الهيئة العامة للغذاء والدواء ووزارة الصحة
            </p>
            <span className="mt-3 inline-block text-xs font-bold text-teal">
              الدليل السعودي ←
            </span>
          </Link>
          <Link
            to="/abortion-pills-uae"
            className="group rounded-2xl border border-line bg-cream/60 p-4 transition hover:border-teal hover:bg-cream"
          >
            <h3 className="font-bold text-brand-deep group-hover:text-teal-deep">🇦🇪 الإمارات العربية المتحدة</h3>
            <p className="mt-1 text-xs leading-5 text-ink-soft">
              وزارة الصحة ووقاية المجتمع والجهات الصحية المحلية
            </p>
            <span className="mt-3 inline-block text-xs font-bold text-teal">
              دليل الإمارات ←
            </span>
          </Link>
          <Link
            to="/abortion-pills-kuwait"
            className="group rounded-2xl border border-line bg-cream/60 p-4 transition hover:border-teal hover:bg-cream"
          >
            <h3 className="font-bold text-brand-deep group-hover:text-teal-deep">🇰🇼 دولة الكويت</h3>
            <p className="mt-1 text-xs leading-5 text-ink-soft">
              وزارة الصحة — إدارة الرقابة الدوائية والغذائية
            </p>
            <span className="mt-3 inline-block text-xs font-bold text-teal">
              الدليل الكويتي ←
            </span>
          </Link>
          <Link
            to="/abortion-pills-bahrain"
            className="group rounded-2xl border border-line bg-cream/60 p-4 transition hover:border-teal hover:bg-cream"
          >
            <h3 className="font-bold text-brand-deep group-hover:text-teal-deep">🇧🇭 مملكة البحرين</h3>
            <p className="mt-1 text-xs leading-5 text-ink-soft">
              وزارة الصحة والهيئة الوطنية لتنظيم المهن الصحية
            </p>
            <span className="mt-3 inline-block text-xs font-bold text-teal">
              دليل البحرين ←
            </span>
          </Link>
        </div>
      </section>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {clusters.map((cluster) => (
          <CategoryCard key={cluster.id} cluster={cluster} count={articles.filter((a) => a.cluster === cluster.id).length} />
        ))}
      </div>
      <section className="mt-12 rounded-3xl border border-line bg-paper p-6">
        <h2 className="text-2xl font-bold text-teal-deep">خريطة الـ 100 موضوع</h2>
        <p className="mt-2 text-sm leading-7 text-ink-soft">الخريطة ليست 100 مقال عشوائي؛ إنها graph تحريري يحدد القصد والكلمات والروابط والـ FAQ والمراجع وخطوة التقدم لكل موضوع.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {mapRegistry.clusters.map((cluster) => {
            const related = mapRegistry.items.filter((item) => item.cluster === cluster.id).slice(0, 3);
            const siteCluster = clusters.find((item) => item.id === cluster.siteClusterId);
            return (
              <article key={cluster.id} className="rounded-2xl border border-line bg-cream/60 p-4">
                <h3 className="font-bold text-brand-deep">{cluster.id} — {cluster.title}</h3>
                <p className="mt-1 text-xs text-ink-soft">{related.map((item) => item.topic).join("، ")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {siteCluster ? <Link to={clusterPath(siteCluster)} className="text-xs font-bold text-teal">انتقلي إلى المحور</Link> : null}
                  <Link to={cluster.pillar} className="text-xs font-bold text-teal">الصفحة الركيزة</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
