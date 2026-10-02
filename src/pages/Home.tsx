import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { Wordmark } from "../components/Logo";
import { LOGO_SRC } from "../components/Logo";
import {
  IconArrowLeft,
  IconBook,
  IconCross,
  IconHeartPulse,
  IconPill,
  IconShieldCheck,
  IconStethoscope,
  IconVenus,
} from "../components/icons";
import { JsonLd, Seo } from "../components/Seo";
import { WhatsAppIcon } from "../components/WhatsAppContact";
import { HEALTH_LINES } from "../data/contact";
import { WHATSAPP_NUMBER_RAW, WHATSAPP_URL } from "../data/conversion";
import { HOME_SEO } from "../data/home";
import { SITE } from "../data/site";

const HERO_BANNER_SRC = "/images/adwiyat-ijhad-alhaml-saudi-arabia-cytotec-misoprostol.webp";
const HERO_BANNER_ALT = "أدوية إجهاض الحمل — سايتوتك وميزوبروستول 200 ومعلومات طبية موثوقة";
const HERO_TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const HomeDeferredSections = lazy(() => import("./HomeDeferredSections"));

const SA = HEALTH_LINES.find((c) => c.code === "sa");
const SA_MOH = SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value ?? "937";
const SA_EMS = SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value ?? "997";

const HERO_TRUST = [
  { Icon: IconPill, label: "دواء بوصفة" },
  { Icon: IconShieldCheck, label: "امتثال نظامي" },
  { Icon: IconBook, label: "مصادر رسمية" },
  { Icon: IconStethoscope, label: "إشراف طبي" },
];

function HeroBrandPanel() {
  const [missing, setMissing] = useState(false);
  return (
    <div className="relative">
      <HexBadge className="absolute -top-6 -start-5 hidden text-white/80 lg:grid" Icon={IconVenus} />
      <HexBadge className="absolute top-10 -end-6 hidden text-white/80 lg:grid" Icon={IconCross} />
      <HexBadge className="absolute -bottom-8 start-10 hidden text-white/80 lg:grid" Icon={IconHeartPulse} />

      <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-deep p-8 shadow-[0_28px_60px_-24px_rgb(10_74_51/0.55)] ring-1 ring-white/10 sm:p-10">
        <span className="hero-decor-blur pointer-events-none absolute -top-16 -start-16 h-56 w-56 rounded-full bg-sky/25 blur-3xl" aria-hidden="true" />
        <span className="hero-decor-blur pointer-events-none absolute -bottom-20 -end-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex min-h-[16rem] items-center justify-center sm:min-h-[19rem]">
          {missing ? (
            <Wordmark tone="light" className="text-center" />
          ) : (
            <>
              <div className="sm:hidden">
                <Wordmark tone="light" className="text-center" />
              </div>
              <picture>
                <source media="(min-width: 640px)" srcSet={HERO_BANNER_SRC} />
                <img
                  src={HERO_TRANSPARENT_PIXEL}
                  alt=""
                  width={1732}
                  height={908}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  aria-hidden="true"
                  className="hidden max-h-[17rem] w-auto object-contain drop-shadow-[0_18px_35px_rgb(0_0_0/0.45)] sm:block sm:max-h-[20rem]"
                  onError={() => setMissing(true)}
                />
              </picture>
            </>
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
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#f2faf6] via-[#e6f4ec] to-[#d5ebde] ring-1 ring-line/60">
        <div className="hero-decor-blur pointer-events-none absolute -top-24 -end-24 h-80 w-80 rounded-full bg-sky/10 blur-3xl" aria-hidden="true" />
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
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#16a34a] px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_-12px_rgb(22_163_74/0.7)] transition hover:bg-[#15803d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2"
                aria-label={`تواصل معنا عبر واتساب ${WHATSAPP_NUMBER_RAW}`}
              >
                <WhatsAppIcon className="h-5 w-5" />
                استفسري عبر واتساب
                <span dir="ltr" className="hidden font-mono text-xs font-bold sm:inline">{WHATSAPP_NUMBER_RAW}</span>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white/80 px-6 py-3.5 text-sm font-bold text-brand transition hover:border-brand/50 hover:bg-white"
              >
                تواصلي مع فريق الموقع
                <IconArrowLeft className="h-4.5 w-4.5" />
              </Link>
              <Link
                to="/what-is-cytotec"
                className="inline-flex items-center rounded-full border border-brand/25 bg-white/70 px-6 py-3.5 text-sm font-bold text-brand transition hover:border-brand/50 hover:bg-white"
              >
                دليل سايتوتك والمعلومات الطبية
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

      <Suspense fallback={null}>
        <HomeDeferredSections />
      </Suspense>
    </div>
  );
}
