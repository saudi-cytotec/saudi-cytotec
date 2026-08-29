import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { CategoryCard } from "../components/CategoryCard";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { JsonLd, Seo } from "../components/Seo";
import { useCatalog } from "../cms/CatalogContext";
import { HEALTH_LINES } from "../data/contact";

import { SITE, clusters } from "../data/site";

const SA = HEALTH_LINES.find((c) => c.code === "sa");
const SA_MOH = SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value ?? "937";
const SA_EMS = SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value ?? "997";

export function Home() {
  const { articles } = useCatalog();
  const featured = articles.slice(0, 3);
  const latest = articles.slice(3, 9);

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 py-10">
      <Seo
        title="صحة المرأة والحمل: معلومات طبية موثّقة بالعربية"
        description={SITE.description}
        path="/"
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: SITE.name,
            url: SITE.domain,
            inLanguage: "ar",
            description: SITE.description,
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.domain },
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE.name,
            url: SITE.domain,
            logo: `${SITE.domain}/images/logo.png`,
            contactPoint: [
              {
                "@type": "ContactPoint",
                contactType: "editorial",
                email: "info@saudiersaa.com",
                availableLanguage: ["ar"],
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE.name,
            url: SITE.domain,
            inLanguage: "ar",
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE.domain}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />
      <section className="overflow-hidden rounded-[2rem] border border-line bg-paper shadow-sm">
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="p-8 md:p-12">
            <p className="text-sm font-semibold text-accent">محتوى تعليمي عربي موثّق بالمراجع</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.35] text-brand-deep md:text-5xl">
              صحة المرأة والحمل: معلومات طبية موثّقة بالعربية
            </h1>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-9 text-ink-soft">
              منصة تعليمية عربية للصحة الإنجابية وصحة المرأة: مقالات موثّقة بالمراجع تشرح الحمل
              خارج الرحم، تكيس المبايض، الخصوبة، سلامة الأدوية أثناء الحمل، والطوارئ النسائية — بلغة
              واضحة، وبلا تشخيص أو وصف دوائي.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/blog" className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110">
                تصفّحي المقالات
              </Link>
              <Link to="/what-is-cytotec" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white">
                ابدئي من الأساسيات
              </Link>
              <Link to="/medical-sources" className="rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-semibold">
                المصادر الطبية
              </Link>
            </div>
            <p className="mt-4 text-xs leading-6 text-ink-soft">
              للحالات العاجلة: الإسعاف <span dir="ltr" className="font-mono font-bold">{SA_EMS}</span> في السعودية ·
              مركز وزارة الصحة <span dir="ltr" className="font-mono font-bold">{SA_MOH}</span>. هذا الموقع لا يقدّم
              استشارة فردية ولا يصرف أدوية.
            </p>
          </div>
          <div className="relative min-h-72 bg-brand-soft">
            <img
              src="/images/hero-doctor.jpg"
              alt="طبيبة سعودية بحجاب في عيادة صحة المرأة"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <DisclaimerBanner />

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-teal-deep">صفحات أساسية</h2>
          <p className="mt-2 text-ink-soft">ابدئي من الركائز قبل المقالات التفصيلية.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {(
            [
              ["/what-is-cytotec", "ما هو سايتوتك؟", "تعريف تعليمي للاسم التجاري والمادة الفعالة."],
              ["/medical-uses", "الاستخدامات الطبية", "الاستطبابات والإشراف السريري وحدود الاستخدام."],
              ["/safety", "الأمان والتحذيرات", "تحذير الحمل والتنظيم ومصادر الدواء غير الموثوقة."],
              ["/when-to-see-doctor", "متى تراجعين الطبيب", "علامات تستدعي عيادة أو طوارئ دون تأخير."],
            ] as const
          ).map(([to, title, text]) => (
            <Link key={to} to={to} className="rounded-3xl border border-line bg-paper p-5 hover:bg-cream">
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
  );
}
