import { useState } from "react";
import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { CategoryCard } from "../components/CategoryCard";
import { ContactCta } from "../components/ContactCta";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { CareReferral } from "../components/CareReferral";
import { ReferencesList } from "../components/ReferencesList";
import { Wordmark } from "../components/Logo";
import { LOGO_SRC } from "../components/Logo";
import {
  IconArrowLeft,
  IconBook,
  IconCross,
  IconHeartPulse,
  IconHelp,
  IconLandmark,
  IconPill,
  IconShieldAlert,
  IconShieldCheck,
  IconSiren,
  IconStethoscope,
  IconVenus,
} from "../components/icons";
import { JsonLd, Seo } from "../components/Seo";
import { useCatalog } from "../cms/CatalogContext";
import { HEALTH_LINES } from "../data/contact";
import {
  HOME_CORE_PAGES,
  HOME_CYTOTEC_INTRO,
  HOME_FAQS,
  HOME_FEATURED_SLUGS,
  HOME_QUICK_FACTS,
  HOME_REFERENCE_IDS,
  HOME_SEO,
  HOME_SERVICES,
  HOME_SUPPORT_PAGES,
  HOME_VALUE,
  type HomeService,
} from "../data/home";
import { SITE, clusters } from "../data/site";
import type { Article } from "../types";

const HERO_BANNER_SRC = "/images/Bannerrr.png";
const HERO_BANNER_ALT = "سعودي إرساء - منصة سعودية للخدمات والمعلومات الدوائية لصحة المرأة";

const SA = HEALTH_LINES.find((c) => c.code === "sa");
const SA_MOH = SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value ?? "937";
const SA_EMS = SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value ?? "997";

const HERO_TRUST = [
  { Icon: IconPill, label: "دواء بوصفة" },
  { Icon: IconShieldCheck, label: "امتثال نظامي" },
  { Icon: IconBook, label: "مصادر رسمية" },
  { Icon: IconStethoscope, label: "إشراف طبي" },
];

/** Icon + hue per service key (presentation only; copy lives in data/home.ts). */
const SERVICE_META: Record<HomeService["key"], { Icon: typeof IconPill; color: string }> = {
  information: { Icon: IconBook, color: "text-sky" },
  prescription: { Icon: IconShieldCheck, color: "text-brand" },
  dispensing: { Icon: IconLandmark, color: "text-brand" },
  safety: { Icon: IconShieldAlert, color: "text-warn" },
  contact: { Icon: IconHelp, color: "text-accent" },
};

/** Red flags shown in a compact safety box (no dosing, no self-treatment steps). */
const EMERGENCY_SIGNS = [
  "نزيف غزير أو متزايد بسرعة.",
  "إغماء أو دوخة شديدة أو عدم القدرة على الوقوف.",
  "ألم بطني حاد مفاجئ، خاصة مع حمل معروف أو محتمل.",
  "حمى مرتفعة مستمرة أو قشعريرة مع تدهور عام.",
  "ضيق تنفس أو ألم صدر أو تورم في الوجه.",
];

const SECTION_HEADING = "font-display text-2xl font-extrabold text-brand-deep sm:text-[1.8rem]";

function HeroBrandPanel() {
  const [missing, setMissing] = useState(false);
  return (
    <div className="relative">
      <HexBadge className="absolute -top-6 -start-5 hidden text-white/80 lg:grid" Icon={IconVenus} />
      <HexBadge className="absolute top-10 -end-6 hidden text-white/80 lg:grid" Icon={IconCross} />
      <HexBadge className="absolute -bottom-8 start-10 hidden text-white/80 lg:grid" Icon={IconHeartPulse} />

      <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-deep p-8 shadow-[0_28px_60px_-24px_rgb(11_37_69/0.55)] ring-1 ring-white/10 sm:p-10">
        <span className="pointer-events-none absolute -top-16 -start-16 h-56 w-56 rounded-full bg-sky/25 blur-3xl" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-20 -end-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex min-h-[16rem] items-center justify-center sm:min-h-[19rem]">
          {missing ? (
            <Wordmark tone="light" className="text-center" />
          ) : (
            <img
              src={HERO_BANNER_SRC}
              alt={HERO_BANNER_ALT}
              width={1536}
              height={1024}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="max-h-[17rem] w-auto object-contain drop-shadow-[0_18px_35px_rgb(0_0_0/0.45)] sm:max-h-[20rem]"
              onError={() => setMissing(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function HexBadge({ className = "", Icon }: { className?: string; Icon: typeof IconVenus }) {
  return (
    <span className={`grid h-16 w-16 place-items-center rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm ${className}`} aria-hidden="true">
      <Icon className="h-7 w-7" />
    </span>
  );
}

function HeroWaves() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-14 w-full sm:h-20"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 70 C 240 20 480 110 760 70 C 1040 30 1240 95 1440 55 L1440 120 L0 120 Z" fill="var(--color-paper)" />
      <path d="M0 84 C 260 44 520 116 780 84 C 1060 52 1260 104 1440 74 L1440 96 C 1220 122 1000 74 720 104 C 440 134 220 92 0 112 Z" fill="var(--color-accent)" opacity="0.9" />
      <path d="M0 100 C 300 70 600 122 900 100 C 1140 82 1300 108 1440 92 L1440 120 L0 120 Z" fill="var(--color-brand-deep)" />
    </svg>
  );
}

export function Home() {
  const { articles } = useCatalog();
  const publicArticles = articles.filter((article) => !article.noindex);

  const curated = HOME_FEATURED_SLUGS
    .map((slug) => publicArticles.find((article) => article.slug === slug))
    .filter((article): article is Article => Boolean(article));
  const featured = curated.length ? curated : publicArticles.slice(0, 3);
  const featuredSlugs = new Set(featured.map((article) => article.slug));

  // Newest first; ties keep the editorial catalog order (stable sort).
  const latest = [...publicArticles]
    .sort((a, b) => `${b.updatedAt}|${b.publishedAt}`.localeCompare(`${a.updatedAt}|${a.publishedAt}`))
    .filter((article) => !featuredSlugs.has(article.slug))
    .slice(0, 3);

  const [h1Primary, h1Secondary] = HOME_SEO.h1.split(" | ");

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 md:space-y-16 md:py-10">
      <Seo title={HOME_SEO.title} description={HOME_SEO.description} path="/" absoluteTitle />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: HOME_SEO.h1,
            url: `${SITE.domain}/`,
            inLanguage: SITE.locale,
            description: HOME_SEO.description,
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.domain },
            isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.domain },
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: `${SITE.domain}${HERO_BANNER_SRC}`,
              caption: HERO_BANNER_ALT,
            },
            about: [
              { "@type": "MedicalCondition", name: "صحة المرأة" },
              { "@type": "MedicalCondition", name: "الحمل المبكر" },
              { "@type": "MedicalCondition", name: "تكيس المبايض" },
              { "@type": "MedicalCondition", name: "الخصوبة" },
            ],
            mentions: [
              { "@type": "Thing", name: "سايتوتك" },
              { "@type": "Thing", name: "ميزوبروستول" },
              { "@type": "Thing", name: "الوصفة الطبية" },
              { "@type": "Thing", name: "الأمان الدوائي" },
              { "@type": "Thing", name: "الهيئة العامة للغذاء والدواء" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE.name,
            url: SITE.domain,
            logo: `${SITE.domain}${LOGO_SRC}`,
            description: SITE.description,
            contactPoint: [
              {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: SITE.email,
                availableLanguage: ["ar"],
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE.name,
            url: SITE.domain,
            inLanguage: SITE.locale,
            description: SITE.description,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE.domain}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
          {
            // The homepage is the root of the trail: a single-item list, no
            // invented hierarchy.
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE.domain}/` }],
          },
        ]}
      />

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#f2f8fe] via-[#e7f0fc] to-[#d9e8f9] ring-1 ring-line/60">
        <div className="pointer-events-none absolute -top-24 -end-24 h-80 w-80 rounded-full bg-sky/10 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-10 px-6 pb-20 pt-10 sm:px-10 sm:pt-14 lg:grid-cols-2 lg:gap-8 lg:px-12">
          <div>
            <p className="inline-flex items-center rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-bold text-brand ring-1 ring-line/70">
              خدمات ومعلومات دوائية · المملكة العربية السعودية
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.35] text-brand-deep sm:text-[2.7rem] sm:leading-[1.3]">
              {h1Primary}
              {h1Secondary ? (
                <>
                  {" "}
                  <span className="mt-1 block text-accent sm:mt-0 sm:inline">| {h1Secondary}</span>
                </>
              ) : null}
            </h1>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-9 text-ink-soft">
              منصة سعودية للخدمات والمعلومات الدوائية المرتبطة بصحة المرأة. هنا تجدين دليلاً موثّقاً عن دواء سايتوتك
              ومادته الفعالة ميزوبروستول، وشروط الصرف بالوصفة الطبية، وقنوات الرعاية النظامية في المملكة — مع استفسارات
              مباشرة عبر قناة التواصل.
            </p>

            <ul className="mt-7 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {HERO_TRUST.map(({ Icon, label }) => (
                <li key={label} className="flex flex-col items-center gap-2 rounded-2xl bg-white/70 px-2 py-3 text-center ring-1 ring-line/70 backdrop-blur-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-brand ring-1 ring-line">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-bold leading-5 text-brand-deep sm:text-xs">{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_-12px_rgb(216_31_60/0.7)] transition hover:bg-accent-deep"
              >
                تواصلي معنا للاستفسار
                <IconArrowLeft className="h-4.5 w-4.5" />
              </Link>
              <Link
                to="/what-is-cytotec"
                className="inline-flex items-center rounded-full border border-brand/25 bg-white/70 px-6 py-3.5 text-sm font-bold text-brand transition hover:border-brand/50 hover:bg-white"
              >
                ما هو سايتوتك؟ (المعلومات الطبية)
              </Link>
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-brand-deep">
              <Link to="/service-areas" className="underline decoration-brand/30 underline-offset-4 transition hover:text-accent">
                مناطق الخدمة والقنوات الرسمية
              </Link>
              <Link to="/blog" className="underline decoration-brand/30 underline-offset-4 transition hover:text-accent">
                المقالات الدوائية
              </Link>
            </p>

            <p className="mt-5 max-w-xl rounded-2xl border border-line/70 bg-white/60 px-4 py-2.5 text-xs leading-6 text-ink-soft backdrop-blur-sm">
              الأدوية الخاضعة للتنظيم تُصرف بوصفة طبية عبر الصيدليات المرخّصة وفق أنظمة الهيئة العامة للغذاء والدواء
              ووزارة الصحة. للحالات العاجلة: الإسعاف{" "}
              <span dir="ltr" className="font-mono font-bold text-brand-deep">{SA_EMS}</span> · مركز وزارة الصحة{" "}
              <span dir="ltr" className="font-mono font-bold text-brand-deep">{SA_MOH}</span>.
            </p>
          </div>

          <HeroBrandPanel />
        </div>
        <HeroWaves />
      </section>

      {/* ── 2. سايتوتك في السعودية ───────────────────────────────────────── */}
      <section aria-labelledby="cytotec-section" className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card-premium scroll-mt-32 p-6 md:p-7">
          <p className="text-[11px] font-bold uppercase tracking-wide text-accent">المنتج الدوائي</p>
          <h2 id="cytotec-section" className={SECTION_HEADING}>سايتوتك في السعودية</h2>
          <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
          <div className="mt-4 space-y-3 text-sm leading-8 text-ink-soft">
            {HOME_CYTOTEC_INTRO.map((text) => (
              <p key={text.slice(0, 24)}>{text}</p>
            ))}
          </div>
          <ul className="mt-5 space-y-2.5 text-sm leading-7 text-ink-soft">
            {HOME_QUICK_FACTS.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link
              to="/medical-uses"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-deep"
            >
              الاستخدامات الطبية والإطار النظامي
              <IconArrowLeft className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/misoprostol"
              className="rounded-full border border-line bg-cream px-3.5 py-2 text-xs font-semibold text-brand-deep transition hover:border-brand/40 hover:bg-brand-soft"
            >
              المادة الفعالة
            </Link>
          </div>
        </div>

        {/* ── 3. الخدمات الدوائية والصيدلية ──────────────────────────────── */}
        <div className="card-premium p-5">
          <h2 className="font-display text-lg font-extrabold text-brand-deep">الخدمات الدوائية والصيدلية</h2>
          <p className="mt-1.5 text-xs leading-6 text-ink-soft">
            ما يقدّمه الموقع فعلياً: معلومات موثّقة، ومسار نظامي واضح، وقناة تواصل. لا نعرض أسعاراً ولا مخزوناً ولا
            مواعيد توصيل لأنها تحتاج تأكيداً من الجهة المرخّصة.
          </p>
          <div className="mt-4 space-y-3">
            {HOME_SERVICES.map((service) => {
              const { Icon, color } = SERVICE_META[service.key];
              return (
                <Link
                  key={service.title}
                  to={service.to}
                  className="group flex items-start gap-3 rounded-2xl bg-cream p-3.5 transition hover:bg-brand-soft/70"
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-line ${color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-brand-deep transition group-hover:text-brand">{service.title}</span>
                    <span className="mt-1 block text-xs leading-6 text-ink-soft">{service.text}</span>
                    <span className="mt-1.5 inline-block text-[11px] font-bold text-accent">{service.label} ←</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <DisclaimerBanner />

      {/* ── 4. صفحات الدعم عن سايتوتك وميزوبروستول ───────────────────────── */}
      <section aria-labelledby="support-pages-heading">
        <div className="mb-6">
          <h2 id="support-pages-heading" className={SECTION_HEADING}>سايتوتك وميزوبروستول: الصفحات المرجعية</h2>
          <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
          <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-soft">
            هذه الصفحات تشرح الدواء والمادة الفعالة والاستخدامات الطبية والأمان والآثار الجانبية بالتفصيل، وهي مرجعك قبل
            أي استفسار أو زيارة طبية.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {HOME_SUPPORT_PAGES.map((page) => (
            <Link
              key={page.to}
              to={page.to}
              className="group flex flex-col rounded-2xl border border-line bg-cream/60 p-4 transition hover:border-brand/40 hover:bg-brand-soft/70"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-brand-deep transition group-hover:text-brand">
                <IconArrowLeft className="h-4 w-4 shrink-0 text-accent" />
                {page.label}
              </span>
              <span className="mt-1.5 text-xs leading-6 text-ink-soft">{page.note}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 5. لماذا Saudiersaa؟ ────────────────────────────────────────── */}
      <section aria-labelledby="why-us-heading">
        <div className="mb-6 text-center">
          <h2 id="why-us-heading" className={SECTION_HEADING}>لماذا Saudiersaa؟</h2>
          <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {HOME_VALUE.map(({ title, text, to, label }) => (
            <article key={title} className="card-premium flex flex-col p-5">
              <h3 className="font-display text-base font-bold leading-7 text-brand-deep">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-ink-soft">{text}</p>
              <Link to={to} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand transition hover:text-accent">
                {label}
                <IconArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
          <article className="card-premium flex flex-col justify-center gap-3 bg-brand-soft/50 p-5 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-white text-accent ring-1 ring-line">
              <IconSiren className="h-5 w-5" />
            </span>
            <p className="text-sm font-bold text-brand-deep">حالة عاجلة؟</p>
            <p className="text-xs leading-6 text-ink-soft">
              الإسعاف{" "}
              <span dir="ltr" className="font-mono font-bold text-brand-deep">{SA_EMS}</span> · وزارة الصحة{" "}
              <span dir="ltr" className="font-mono font-bold text-brand-deep">{SA_MOH}</span>
            </p>
          </article>
        </div>
      </section>

      {/* ── 6. مناطق الخدمة + الأمان في سطور ────────────────────────────── */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card-premium p-6">
          <h2 className="font-display text-xl font-extrabold text-brand-deep">مناطق الخدمة في المملكة</h2>
          <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
          <p className="mt-3 text-sm leading-8 text-ink-soft">
            نخدم القارئات في جميع مناطق المملكة بمعلومة دوائية موحّدة، لأن التحذيرات وشروط الصرف لا تختلف من مدينة
            لأخرى. ما يختلف هو مسار الوصول إلى الرعاية والصرف المرخّص، وقد جمعنا القنوات الرسمية وطريقة البدء في صفحة
            واحدة بدل صفحات مدن مكررة بلا قيمة إضافية.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/service-areas"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-deep"
            >
              الرعاية والصرف في السعودية
              <IconArrowLeft className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/blog/cluster/mata-murajaa-altabeeb"
              className="rounded-full border border-line bg-cream px-3.5 py-2 text-xs font-semibold text-brand-deep transition hover:border-brand/40 hover:bg-brand-soft"
            >
              متى تكون المراجعة عاجلة؟
            </Link>
          </div>
        </div>

        <div className="card-premium p-6">
          <h2 className="font-display text-xl font-extrabold text-brand-deep">علامات لا تنتظر</h2>
          <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
          <ul className="mt-3 space-y-2.5 text-sm leading-7 text-ink-soft">
            {EMERGENCY_SIGNS.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-6 text-ink-soft">
            الحمل خارج الرحم حالة طارئة محتملة: ألم جانبي مع دوخة أو نزيف يستدعي تقييماً فورياً.{" "}
            <Link to="/when-to-see-doctor" className="font-bold text-brand underline underline-offset-4">
              التفاصيل
            </Link>
          </p>
        </div>
      </section>

      {/* ── 7. المقالات ─────────────────────────────────────────────────── */}
      <section aria-labelledby="articles-heading" className="space-y-10">
        <h2 id="articles-heading" className="sr-only">المقالات الدوائية</h2>
        <div>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h3 className={SECTION_HEADING}>مقالات مختارة للبدء</h3>
              <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
            </div>
            <Link to="/blog" className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-brand transition hover:text-accent">
              كل المقالات
              <IconArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>

        {latest.length ? (
          <div>
            <div className="mb-6">
              <h3 className={SECTION_HEADING}>أحدث المقالات</h3>
              <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* ── 8. FAQ ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="faq-heading">
        <div className="mb-6">
          <h2 id="faq-heading" className={SECTION_HEADING}>أسئلة يتكرر طرحها</h2>
          <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {HOME_FAQS.map((item) => (
            <article key={item.q} className="card-premium p-5">
              <h3 className="font-display text-base font-bold leading-7 text-brand-deep">{item.q}</h3>
              <p className="mt-2 text-sm leading-8 text-ink-soft">{item.a}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand-soft"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 text-center text-sm font-semibold text-brand-deep">
          لديك سؤال آخر؟{" "}
          <Link to="/faq" className="text-brand underline underline-offset-4 hover:text-accent">
            صفحة الأسئلة الشائعة الكاملة
          </Link>
        </p>
      </section>

      {/* ── روابط أساسية (crawl + internal authority) ───────────────────── */}
      <section aria-labelledby="core-pages-heading" className="card-premium p-6">
        <h2 id="core-pages-heading" className="font-display text-lg font-extrabold text-brand-deep">
          روابط سريعة إلى الصفحات الأساسية
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {HOME_CORE_PAGES.map((page) => (
            <li key={page.to}>
              <Link
                to={page.to}
                className="inline-flex rounded-full border border-line bg-cream px-3.5 py-1.5 text-xs font-semibold text-brand-deep transition hover:border-brand/40 hover:bg-brand-soft"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── المحاور + المصادر + الرعاية ─────────────────────────────────── */}
      <section>
        <div className="mb-6 text-center">
          <h2 className={SECTION_HEADING}>تصفحي المقالات حسب المحور</h2>
          <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
            محتوى دوائي وتعليمي مصنّف حسب المحور، موحّد لكل مناطق المملكة دون صفحات مدن مكررة.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {clusters.map((cluster) => (
            <CategoryCard key={cluster.id} cluster={cluster} count={publicArticles.filter((a) => a.cluster === cluster.id).length} />
          ))}
        </div>
      </section>

      <ReferencesList ids={[...HOME_REFERENCE_IDS]} />

      <CareReferral />
      <ContactCta topic="سايتوتك وصحة المرأة في السعودية" />
    </div>
  );
}
