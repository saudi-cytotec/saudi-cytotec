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
  IconAward,
  IconBaby,
  IconBook,
  IconCross,
  IconHeartPulse,
  IconLandmark,
  IconLock,
  IconMapPin,
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
  HOME_FAQS,
  HOME_FEATURED_SLUGS,
  HOME_REFERENCE_IDS,
  HOME_SEO,
  HOME_TOC,
  HOME_TOPIC_SECTIONS,
} from "../data/home";
import { SITE, clusters } from "../data/site";
import type { Article } from "../types";

const HERO_BANNER_SRC = "/images/Bannerrr.png";
const HERO_BANNER_ALT = "سعودي إرساء - منصة سعودية موثوقة للتوعية بصحة المرأة";

const SA = HEALTH_LINES.find((c) => c.code === "sa");
const SA_MOH = SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value ?? "937";
const SA_EMS = SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value ?? "997";

const HERO_TRUST = [
  { Icon: IconShieldCheck, label: "محتوى موثوق" },
  { Icon: IconStethoscope, label: "توعية طبية" },
  { Icon: IconLock, label: "بدون بيع أدوية" },
  { Icon: IconBook, label: "مصادر معتمدة" },
];

const FEATURES = [
  { Icon: IconBook, color: "text-brand", soft: "bg-brand-soft", title: "دليل شامل", text: "دليل توعوي حول صحة المرأة والحمل والخصوبة" },
  { Icon: IconLock, color: "text-brand", soft: "bg-brand-soft", title: "بدون بيع", text: "لا نبيع أدوية ولا نوسط للحصول عليها إطلاقاً" },
  { Icon: IconAward, color: "text-accent", soft: "bg-accent-soft", title: "مصادر معتمدة", text: "نعتمد على وزارة الصحة، SFDA، FDA، WHO والمراجع الطبية" },
  { Icon: IconStethoscope, color: "text-brand", soft: "bg-brand-soft", title: "وضوح طبي", text: "نفرّق بين التعليم العام والاستشارة الفردية لدى طبيب مرخص" },
  { Icon: IconShieldCheck, color: "text-brand", soft: "bg-brand-soft", title: "أمان أولاً", text: "كل مسار يربط بالمخاطر والطوارئ والقنوات الرسمية" },
];

/** Presentation-only icon/hue per educational section (content lives in data/home.ts). */
const SECTION_META: Record<string, { Icon: typeof IconPill; color: string; soft: string }> = {
  definition: { Icon: IconPill, color: "text-sky", soft: "bg-sky-soft" },
  "medical-uses": { Icon: IconStethoscope, color: "text-brand", soft: "bg-brand-soft" },
  safety: { Icon: IconShieldAlert, color: "text-warn", soft: "bg-warn-soft" },
  "side-effects": { Icon: IconHeartPulse, color: "text-accent", soft: "bg-accent-soft" },
  pregnancy: { Icon: IconBaby, color: "text-[#2f9e63]", soft: "bg-[#e9f7ef]" },
  "womens-health": { Icon: IconVenus, color: "text-accent", soft: "bg-accent-soft" },
  emergency: { Icon: IconSiren, color: "text-clay", soft: "bg-[#fdeceb]" },
  sources: { Icon: IconLandmark, color: "text-sky", soft: "bg-sky-soft" },
  "saudi-care": { Icon: IconMapPin, color: "text-brand", soft: "bg-brand-soft" },
};

const QUICK_ANSWER = [
  "سايتوتك اسم تجاري، والمادة الفعالة فيه ميزوبروستول، وهي مركّب مقيّد تنظيمياً يُصرف بوصفة وإشراف طبي.",
  "الاستخدامات الطبية تُقرَّر بحسب الحالة والنشرة الرسمية، والاستخدامات التوليدية تبقى داخل المستشفى.",
  "الأمان الدوائي يعني تقييم الموانع والتداخلات واحتمال الحمل، لا الاعتماد على تجربة أو منشور.",
  "هذا الموقع تعليمي فقط: لا يبيع أدوية، ولا يقدّم جرعات أو تعليمات استخدام أو طرق شراء.",
];

const SECTION_HEADING =
  "font-display text-2xl font-extrabold text-brand-deep sm:text-[1.8rem]";

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
    .slice(0, 6);

  const [h1Primary, h1Secondary] = HOME_SEO.h1.split(" | ");

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 md:space-y-16 md:py-10">
      <Seo
        title={HOME_SEO.title}
        description={HOME_SEO.description}
        path="/"
        absoluteTitle
      />
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
              { "@type": "Thing", name: "الأمان الدوائي" },
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
            inLanguage: SITE.locale,
            description: SITE.description,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE.domain}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
          {
            // The homepage is the root of the trail, so the breadcrumb list has
            // a single item. No invented hierarchy is added.
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE.domain}/` },
            ],
          },
        ]}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#f2f8fe] via-[#e7f0fc] to-[#d9e8f9] ring-1 ring-line/60">
        <div className="pointer-events-none absolute -top-24 -end-24 h-80 w-80 rounded-full bg-sky/10 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-10 px-6 pb-20 pt-10 sm:px-10 sm:pt-14 lg:grid-cols-2 lg:gap-8 lg:px-12">
          <div>
            <p className="inline-flex items-center rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-bold text-brand ring-1 ring-line/70">
              منصة توعوية سعودية · تعليم طبي عام
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
              دليل توعوي موثوق يشرح ما هو سايتوتك وعلاقته بمادة ميزوبروستول، وحدود الاستخدامات الطبية، ومعنى الأمان
              الدوائي ضمن رعاية صحية نظامية. يقدّم المحتوى معلومات تعليمية عن الحمل المبكر والصحة الإنجابية وحمل
              المرأة السعودية، مع توضيح واضح لمتى تكون المراجعة الطبية عاجلة — بدون بيع، وبدون وصفات، وبدون تعليمات
              استخدام.
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
                to="/what-is-cytotec"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_-12px_rgb(22_53_107/0.7)] transition hover:bg-brand-deep"
              >
                ابدئي من تعريف سايتوتك
                <IconArrowLeft className="h-4.5 w-4.5" />
              </Link>
              <Link
                to="/safety"
                className="inline-flex items-center rounded-full border border-brand/25 bg-white/60 px-6 py-3.5 text-sm font-bold text-brand transition hover:border-brand/50 hover:bg-white"
              >
                الأمان والتحذيرات
              </Link>
              <Link
                to="/topics"
                className="inline-flex items-center rounded-full px-4 py-3.5 text-sm font-bold text-brand-deep underline decoration-accent/50 underline-offset-4 transition hover:text-accent"
              >
                محاور المحتوى
              </Link>
            </div>

            <p className="mt-6 max-w-xl rounded-2xl border border-line/70 bg-white/60 px-4 py-2.5 text-xs leading-6 text-ink-soft backdrop-blur-sm">
              للحالات العاجلة: الإسعاف <span dir="ltr" className="font-mono font-bold text-brand-deep">{SA_EMS}</span> في
              السعودية · مركز وزارة الصحة <span dir="ltr" className="font-mono font-bold text-brand-deep">{SA_MOH}</span>.
              هذا الموقع تعليمي فقط ولا يقدّم استشارة فردية ولا يصرف أدوية.
            </p>
          </div>

          <HeroBrandPanel />
        </div>
        <HeroWaves />
      </section>

      {/* ── QUICK ANSWER + ON-PAGE NAVIGATION ────────────────────────────── */}
      <section aria-labelledby="quick-answer-heading" className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card-premium p-6 md:p-7">
          <h2 id="quick-answer-heading" className="font-display text-xl font-extrabold text-brand-deep sm:text-2xl">
            سايتوتك في السعودية باختصار
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-8 text-ink-soft">
            {QUICK_ANSWER.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-brand-deep">
            للتعريف المفصّل:
            <Link to="/what-is-cytotec" className="text-brand underline underline-offset-4 hover:text-accent">
              ما هو سايتوتك؟
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/misoprostol" className="text-brand underline underline-offset-4 hover:text-accent">
              ميزوبروستول
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/medical-uses" className="text-brand underline underline-offset-4 hover:text-accent">
              الاستخدامات الطبية
            </Link>
          </p>
        </div>

        <nav aria-label="محتويات الصفحة" className="card-premium p-6 md:p-7">
          <h2 className="font-display text-xl font-extrabold text-brand-deep">في هذه الصفحة</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {HOME_TOC.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex rounded-full border border-line bg-cream px-3.5 py-1.5 text-xs font-semibold text-brand-deep transition hover:border-brand/40 hover:bg-brand-soft"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <DisclaimerBanner />

      {/* ── TRUST STRIP + OFFICIAL CHANNELS ──────────────────────────────── */}
      <section className="space-y-5">
        <div className="text-center">
          <h2 className={SECTION_HEADING}>لماذا يمكن الاعتماد على هذا المحتوى؟</h2>
          <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
        </div>
        <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_24rem]">
          <div className="card-premium grid grid-cols-2 divide-line p-2 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
            {FEATURES.map(({ Icon, color, soft, title, text }) => (
              <div key={title} className="flex flex-col items-center gap-2.5 px-4 py-6 text-center">
                <span className={`grid place-items-center rounded-2xl ${soft} ${color}`} style={{ width: "3.25rem", height: "3.25rem" }}>
                  <Icon className="h-6.5 w-6.5" />
                </span>
                <h3 className="font-display text-[15px] font-bold text-brand-deep">{title}</h3>
                <p className="text-xs leading-6 text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
          <div className="card-premium p-5">
            <h3 className="font-display text-lg font-extrabold text-brand-deep">القنوات الرسمية للرعاية</h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-cream p-4">
                <p className="text-xs font-bold text-brand-deep">مركز اتصال وزارة الصحة</p>
                <p className="mt-1 font-mono text-xl font-bold text-brand" dir="ltr">{SA_MOH}</p>
                <p className="mt-1 text-xs text-ink-soft">استفسارات صحية عامة وتوجيه للمسار المناسب</p>
              </div>
              <div className="rounded-2xl bg-accent-soft p-4">
                <p className="text-xs font-bold text-accent">الإسعاف والطوارئ</p>
                <p className="mt-1 font-mono text-xl font-bold text-accent" dir="ltr">{SA_EMS}</p>
                <p className="mt-1 text-xs text-ink-soft">نزيف شديد، إغماء، ألم حاد، حمى مرتفعة</p>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-6 text-ink-soft">
              هذا الموقع لا يبيع أدوية ولا يقدم وصفات. للملاحظات التحريرية: info@saudiersaa.com
            </p>
          </div>
        </div>
      </section>

      {/* ── EDUCATIONAL SECTIONS ─────────────────────────────────────────── */}
      <section aria-label="الدليل التعليمي: من التعريف إلى الرعاية" className="space-y-5">
        <p className="mx-auto max-w-3xl text-center text-sm leading-7 text-ink-soft">
          تسعة محاور تغطي ما تحتاجين فهمه قبل أي قرار: التعريف، الاستخدامات الطبية، الأمان، الآثار الجانبية، الحمل
          المبكر، صحة المرأة، الطوارئ، المصادر، ثم مسار الرعاية الرسمي في السعودية.
        </p>
        <div className="grid gap-5 lg:grid-cols-2">
          {HOME_TOPIC_SECTIONS.map((section) => {
            const meta = SECTION_META[section.id] ?? SECTION_META.definition;
            const { Icon, color, soft } = meta;
            return (
              <article key={section.id} id={section.id} className="card-premium scroll-mt-32 p-6 md:p-7">
                <div className="flex items-start gap-3">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${soft} ${color}`}>
                    <Icon className="h-5.5 w-5.5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-accent">{section.eyebrow}</p>
                    <h2 className="mt-1 font-display text-xl font-extrabold leading-8 text-brand-deep sm:text-[1.35rem]">
                      {section.title}
                    </h2>
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-sm leading-8 text-ink-soft">
                  {section.paragraphs.map((text) => (
                    <p key={text.slice(0, 24)}>{text}</p>
                  ))}
                </div>

                {section.bullets ? (
                  <ul className="mt-4 space-y-2.5 text-sm leading-7 text-ink-soft">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.callout ? (
                  <p className="mt-4 rounded-2xl border-r-4 border-clay bg-accent-soft px-4 py-3 text-sm leading-8 text-ink">
                    {section.callout}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Link
                    to={section.primary.to}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-deep"
                  >
                    {section.primary.label}
                    <IconArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                  {section.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="rounded-full border border-line bg-cream px-3.5 py-2 text-xs font-semibold text-brand-deep transition hover:border-brand/40 hover:bg-brand-soft"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── CORE PAGES (internal link hub) ───────────────────────────────── */}
      <section id="core-pages" aria-labelledby="core-pages-heading" className="card-premium scroll-mt-32 p-6 md:p-7">
        <h2 id="core-pages-heading" className={SECTION_HEADING}>الصفحات الأساسية في الموقع</h2>
        <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
        <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-soft">
          روابط مباشرة إلى الأقسام التي تجيب عن أسئلة محددة. كل صفحة تشرح حدودها بوضوح وتربط بخطوة تالية مفيدة.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_CORE_PAGES.map((page) => (
            <Link
              key={page.to}
              to={page.to}
              className="group flex flex-col rounded-2xl border border-line bg-cream/60 p-4 transition hover:border-brand/40 hover:bg-brand-soft/70"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-brand-deep transition group-hover:text-brand">
                <IconArrowLeft className="h-4 w-4 text-accent" />
                {page.label}
              </span>
              <span className="mt-1 text-xs leading-6 text-ink-soft">{page.note}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-32">
        <div className="mb-6">
          <h2 id="faq-heading" className={SECTION_HEADING}>أسئلة يتكرر طرحها</h2>
          <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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
            تصفّحي صفحة الأسئلة الشائعة الكاملة
          </Link>
        </p>
      </section>

      {/* ── ARTICLES ─────────────────────────────────────────────────────── */}
      <section id="latest" className="scroll-mt-32 space-y-10">
        <div>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className={SECTION_HEADING}>مقالات مختارة للبدء</h2>
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
              <h2 className={SECTION_HEADING}>أحدث المقالات والتحديثات</h2>
              <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
                أحدث ما أضفناه أو حدّثناه من محتوى تعليمي موثق، مرتّب من الأحدث إلى الأقدم.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* ── CLUSTERS ─────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-8 text-center">
          <h2 className={SECTION_HEADING}>تصفحي المقالات حسب المحور</h2>
          <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
            محتوى تعليمي مصنف حسب المحور الطبي. معلومات سايتوتك وميزوبروستول موجودة ضمن محور التوعية الدوائية، وموحّدة
            لكل مناطق المملكة دون صفحات مدن مكررة.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {clusters.map((cluster) => (
            <CategoryCard key={cluster.id} cluster={cluster} count={publicArticles.filter((a) => a.cluster === cluster.id).length} />
          ))}
        </div>
      </section>

      {/* ── SOURCES + CARE ───────────────────────────────────────────────── */}
      <ReferencesList ids={[...HOME_REFERENCE_IDS]} />

      <CareReferral />
      <ContactCta topic="سايتوتك وصحة المرأة في السعودية" />
    </div>
  );
}
