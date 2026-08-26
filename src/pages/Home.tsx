import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { CategoryCard } from "../components/CategoryCard";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { JsonLd, Seo } from "../components/Seo";
import { articles } from "../data/articles";
import { clusters, SITE } from "../data/site";

export function Home() {
  const featured = articles.slice(0, 6);
  const latest = articles.slice(6, 12);
  return (
    <div>
      <Seo
        title="سايتوتك في السعودية | معلومات طبية تعليمية عن ميزوبروستول"
        description={SITE.description}
        path="/"
        image="/images/hero.jpg"
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE.name,
            url: SITE.domain,
            inLanguage: "ar",
            description: SITE.description,
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE.name,
            url: SITE.domain,
            logo: `${SITE.domain}/images/logo.png`,
            email: SITE.email,
          },
        ]}
      />
      <section className="relative overflow-hidden">
        <img src="/images/hero.jpg" alt="ردهة عيادة هادئة بضوء الصباح" className="h-[520px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-deep via-teal-deep/55 to-teal-deep/20" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl items-end px-4 pb-14">
          <div className="max-w-3xl text-cream">
            <p className="mb-3 text-sm font-semibold text-sand">منصة تعليمية عربية</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">سايتوتك في السعودية: فهم الدواء قبل أي قرار صحي</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-sand">
              نشرح ما هو سايتوتك (ميزوبروستول)، حدوده الطبية، تحذيرات الأمان، الآثار الجانبية، ومتى تصبح المراجعة الطبية
              ضرورية. الهدف هو الوعي، لا البيع ولا التعليمات الفردية.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/what-is-cytotec" className="rounded-full bg-cream px-5 py-2.5 text-sm font-bold text-teal-deep">
                ابدأ من التعريف
              </Link>
              <Link to="/safety" className="rounded-full border border-cream/40 px-5 py-2.5 text-sm font-bold text-cream">
                اقرأ التحذيرات
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">
        <DisclaimerBanner />

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-teal-deep">صفحات أساسية</h2>
              <p className="mt-2 text-ink-soft">ابدئي من الركائز قبل المقالات التفصيلية.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["/what-is-cytotec", "ما هو سايتوتك؟", "تعريف تعليمي للاسم التجاري والمادة الفعالة."],
              ["/medical-uses", "الاستخدامات الطبية", "الاستطبابات والإشراف السريري وحدود الاستخدام."],
              ["/safety", "الأمان والتحذيرات", "تحذير الحمل والتنظيم ومصادر الدواء غير الموثوقة."],
              ["/when-to-see-doctor", "متى تراجعين الطبيب", "علامات تستدعي عيادة أو طوارئ دون تأخير."],
            ].map(([to, title, text]) => (
              <Link key={to} to={to} className="rounded-3xl border border-line bg-paper p-5 hover:border-sage">
                <h3 className="font-bold text-teal-deep">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-soft">{text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-teal-deep">مجموعات المحتوى</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {clusters.map((cluster) => (
              <CategoryCard
                key={cluster.id}
                cluster={cluster}
                count={articles.filter((a) => a.cluster === cluster.id).length}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-teal-deep">مقالات مختارة</h2>
            <Link to="/blog" className="text-sm font-semibold text-teal">
              كل المقالات
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-teal-deep">قراءات إضافية</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
