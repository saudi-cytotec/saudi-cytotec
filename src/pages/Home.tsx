import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { CategoryCard } from "../components/CategoryCard";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { JsonLd, Seo } from "../components/Seo";
import { WhatsAppContactCard } from "../components/WhatsAppContact";
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
        image="/images/hero.jpg"
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
      {/* ── Hero: approved clinic banner, full-bleed, teal overlay, gold CTA ── */}
      <section className="relative overflow-hidden rounded-[2rem] shadow-lg">
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="استقبال عيادة سعودية هادئة بتصميم عربي تراثي وألوان خضراء طبية"
            width={2000}
            height={1125}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
            loading="eager"
          />
          {/* Deep-teal scrim guarantees text contrast on any viewport */}
          <div className="absolute inset-0 bg-gradient-to-l from-brand-deep/95 via-brand-deep/80 to-brand-deep/45" />
        </div>

        <div className="relative px-7 py-14 md:px-14 md:py-20 lg:py-24">
          <div className="max-w-2xl text-white">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-white/10 px-3 py-1 text-xs font-semibold text-accent-soft backdrop-blur-sm sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              محتوى تعليمي عربي موثّق بالمراجع
            </p>
            <h1 className="mt-5 text-3xl font-bold leading-[1.4] text-white sm:text-4xl md:text-5xl md:leading-[1.3]">
              صحة المرأة والحمل:
              <span className="block text-accent">معلومات طبية موثّقة بالعربية</span>
            </h1>
            <p className="mt-5 max-w-xl text-[1rem] leading-8 text-white/90 md:text-[1.08rem] md:leading-9">
              منصة تعليمية عربية للصحة الإنجابية وصحة المرأة: مقالات موثّقة بالمراجع تشرح الحمل
              خارج الرحم، تكيس المبايض، الخصوبة، سلامة الأدوية أثناء الحمل، والطوارئ النسائية — بلغة
              واضحة، وبلا تشخيص أو وصف دوائي.
            </p>

            {/* Clear CTA hierarchy: primary gold → secondary teal-outline → tertiary ghost */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/blog"
                className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-brand-deep shadow-lg transition hover:brightness-105 md:text-base"
              >
                تصفّحي المقالات
              </Link>
              <Link
                to="/what-is-cytotec"
                className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/40 backdrop-blur-sm transition hover:bg-white/20 md:text-base"
              >
                ابدئي من الأساسيات
              </Link>
              <Link
                to="/medical-sources"
                className="rounded-full px-5 py-3 text-sm font-semibold text-white/90 underline decoration-accent underline-offset-4 hover:text-accent"
              >
                المصادر الطبية
              </Link>
            </div>

            <p className="mt-6 max-w-xl rounded-2xl border border-white/15 bg-brand-deep/40 px-4 py-3 text-xs leading-6 text-white/85">
              للحالات العاجلة: الإسعاف <span dir="ltr" className="font-mono font-bold">{SA_EMS}</span> في السعودية ·
              مركز وزارة الصحة <span dir="ltr" className="font-mono font-bold">{SA_MOH}</span>. هذا الموقع لا يقدّم
              استشارة فردية ولا يصرف أدوية.
            </p>
          </div>
        </div>
      </section>

      <DisclaimerBanner />

      {/* Neutral medical-information contact channel (informational only) */}
      <WhatsAppContactCard />

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
