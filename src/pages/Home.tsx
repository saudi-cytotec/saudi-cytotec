import { useState } from "react";
import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { CategoryCard } from "../components/CategoryCard";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { Wordmark } from "../components/Logo";
import {
  IconArrowLeft,
  IconAward,
  IconBook,
  IconCross,
  IconHeartPulse,
  IconLock,
  IconShieldCheck,
  IconStethoscope,
  IconVenus,
} from "../components/icons";
import { JsonLd, Seo } from "../components/Seo";
import { WhatsAppContactCard } from "../components/WhatsAppContact";
import { useCatalog } from "../cms/CatalogContext";
import { HEALTH_LINES } from "../data/contact";
import { LOGO_SRC } from "../components/Logo";
import { SITE, clusters } from "../data/site";

/** Homepage hero banner — the EXACT approved asset (public/images/Bannerrr.png). */
const HERO_BANNER_SRC = "/images/Bannerrr.png";
const HERO_BANNER_ALT = "بانر سعودي إرساء — معلومات طبية موثوقة عن صحة المرأة في السعودية";

const SA = HEALTH_LINES.find((c) => c.code === "sa");
const SA_MOH = SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value ?? "937";
const SA_EMS = SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value ?? "997";

const HERO_TRUST = [
  { Icon: IconShieldCheck, label: "محتوى موثوق" },
  { Icon: IconStethoscope, label: "معلومات طبية دقيقة" },
  { Icon: IconLock, label: "خصوصية تامة" },
  { Icon: IconBook, label: "مصادر معتمدة" },
];

const FEATURES = [
  { Icon: IconBook, color: "text-brand", soft: "bg-brand-soft", title: "دليل شامل", text: "دليل كامل حول سايتوتك والصحة النسائية" },
  { Icon: IconLock, color: "text-brand", soft: "bg-brand-soft", title: "خصوصيتك أولاً", text: "قنوات تواصل للمعلومات العامة فقط وليست للبيع أو التشخيص" },
  { Icon: IconAward, color: "text-accent", soft: "bg-accent-soft", title: "مصادر معتمدة", text: "نعتمد على النشرات والهيئات الصحية والمراجع الطبية" },
  { Icon: IconStethoscope, color: "text-brand", soft: "bg-brand-soft", title: "وضوح طبي", text: "نفرّق بين التعليم العام والاستشارة الفردية لدى طبيب مرخص" },
  { Icon: IconShieldCheck, color: "text-brand", soft: "bg-brand-soft", title: "أمان أولاً", text: "كل مسار يربط بالمخاطر والطوارئ قبل أي خطوة تواصل" },
];

const CORNERSTONES = [
  { to: "/topics", title: "محاور المحتوى", text: "بوابة تربط المجموعات والـ 100 موضوع." },
  { to: "/what-is-cytotec", title: "ما هو سايتوتك؟", text: "تعريف تعليمي للاسم التجاري والمادة الفعالة." },
  { to: "/medical-uses", title: "الاستخدامات الطبية", text: "الاستطبابات والإشراف السريري وحدود الاستخدام." },
  { to: "/safety", title: "الأمان والتحذيرات", text: "تحذير الحمل والتنظيم ومصادر الدواء غير الموثوقة." },
  { to: "/side-effects", title: "الآثار الجانبية", text: "التمييز بين العرض الشائع والعلامة الطارئة." },
  { to: "/when-to-see-doctor", title: "متى تراجعين الطبيب", text: "علامات تستدعي عيادة أو طوارئ دون تأخير." },
  { to: "/faq", title: "الأسئلة الشائعة", text: "إجابات حسب القصد وروابط لمقالات أعمق." },
  { to: "/service-areas", title: "المناطق والمدن", text: "تنظيم جغرافي مسؤول بلا صفحات مدينة رقيقة." },
];

/** Hero banner panel: the EXACT approved homepage banner (Bannerrr.png) on a dark premium card. */
function HeroBrandPanel() {
  const [missing, setMissing] = useState(false);
  return (
    <div className="relative">
      {/* Floating hexagon badges (decorative, approved reference motif) */}
      <HexBadge className="absolute -top-6 -start-5 hidden text-white/80 lg:grid" Icon={IconVenus} />
      <HexBadge className="absolute top-10 -end-6 hidden text-white/80 lg:grid" Icon={IconCross} />
      <HexBadge className="absolute -bottom-8 start-10 hidden text-white/80 lg:grid" Icon={IconHeartPulse} />

      <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-deep p-8 shadow-[0_28px_60px_-24px_rgb(11_37_69/0.55)] ring-1 ring-white/10 sm:p-10">
        {/* soft glow */}
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

/** Decorative wave bands along the hero bottom edge (white / red / navy). */
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
  const featured = articles.slice(0, 3);
  const latest = articles.slice(3, 9);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 md:space-y-16 md:py-10">
      <Seo
        title="صحة المرأة والحمل: معلومات طبية موثّقة بالعربية"
        description={SITE.description}
        path="/"
        image="/images/Bannerrr.png"
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
            logo: `${SITE.domain}${LOGO_SRC}`,
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

      {/* ── Hero: light premium panel, approved reference layout ───────── */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#f2f8fe] via-[#e7f0fc] to-[#d9e8f9] ring-1 ring-line/60">
        <div className="pointer-events-none absolute -top-24 -end-24 h-80 w-80 rounded-full bg-sky/10 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-10 px-6 pb-20 pt-10 sm:px-10 sm:pt-14 lg:grid-cols-2 lg:gap-8 lg:px-12">
          {/* Copy (start / right in RTL) */}
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.35] text-brand-deep sm:text-[2.9rem] sm:leading-[1.3]">
              مدونة سايتوتك التوعوية
              <span className="mt-1 block text-accent">في السعودية</span>
            </h1>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-9 text-ink-soft">
              معلومات طبية دقيقة وموثوقة حول سايتوتك (ميزوبروستول) ودوره في الصحة النسائية، بأعلى معايير
              الخصوصية والمصداقية — محتوى تعليمي عام لا يغني عن استشارة الطبيب المرخص.
            </p>

            {/* Trust row */}
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
                to="/topics"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_-12px_rgb(22_53_107/0.7)] transition hover:bg-brand-deep"
              >
                محاور المحتوى
                <IconArrowLeft className="h-4.5 w-4.5" />
              </Link>
              <Link
                to="/what-is-cytotec"
                className="inline-flex items-center rounded-full border border-brand/25 bg-white/60 px-6 py-3.5 text-sm font-bold text-brand transition hover:border-brand/50 hover:bg-white"
              >
                ابدئي من الأساسيات
              </Link>
            </div>

            <p className="mt-6 max-w-xl rounded-2xl border border-line/70 bg-white/60 px-4 py-2.5 text-xs leading-6 text-ink-soft backdrop-blur-sm">
              للحالات العاجلة: الإسعاف <span dir="ltr" className="font-mono font-bold text-brand-deep">{SA_EMS}</span> في
              السعودية · مركز وزارة الصحة{" "}
              <span dir="ltr" className="font-mono font-bold text-brand-deep">{SA_MOH}</span>. هذا الموقع لا يقدّم
              استشارة فردية ولا يصرف أدوية.
            </p>
          </div>

          {/* Brand panel (end / left in RTL) — the exact approved homepage banner */}
          <HeroBrandPanel />
        </div>
        <HeroWaves />
      </section>

      <DisclaimerBanner />

      {/* ── Credibility features + light premium WhatsApp card ─────────── */}
      <section className="grid items-stretch gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="card-premium grid grid-cols-2 divide-line p-2 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {FEATURES.map(({ Icon, color, soft, title, text }) => (
            <div key={title} className="flex flex-col items-center gap-2.5 px-4 py-6 text-center">
              <span className={`grid h-13 w-13 place-items-center rounded-2xl ${soft} ${color}`} style={{ width: "3.25rem", height: "3.25rem" }}>
                <Icon className="h-6.5 w-6.5" />
              </span>
              <h3 className="font-display text-[15px] font-bold text-brand-deep">{title}</h3>
              <p className="text-xs leading-6 text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
        <WhatsAppContactCard compact />
      </section>

      {/* ── Categories ─────────────────────────────────────────────────── */}
      <section>
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-extrabold text-brand-deep sm:text-[1.8rem]">
            تصفح المقالات حسب الفئة
          </h2>
          <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {clusters.map((cluster) => (
            <CategoryCard
              key={cluster.id}
              cluster={cluster}
              count={articles.filter((a) => a.cluster === cluster.id).length}
            />
          ))}
        </div>
      </section>

      {/* ── Featured articles ──────────────────────────────────────────── */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-brand-deep">مقالات مختارة</h2>
            <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
          </div>
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-bold text-brand transition hover:text-accent">
            كل المقالات
            <IconArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* ── Cornerstone pages (compact strip) ──────────────────────────── */}
      <section className="card-premium p-2">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {CORNERSTONES.map(({ to, title, text }) => (
            <Link key={to} to={to} className="group flex items-start gap-3 rounded-2xl p-4 transition hover:bg-brand-soft/60">
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand ring-1 ring-line transition group-hover:bg-brand group-hover:text-white">
                <IconArrowLeft className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-brand-deep transition group-hover:text-brand">{title}</span>
                <span className="mt-1 block text-xs leading-6 text-ink-soft">{text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── More reading ───────────────────────────────────────────────── */}
      <section>
        <div className="mb-6">
          <h2 className="font-display text-2xl font-extrabold text-brand-deep">قراءات إضافية</h2>
          <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
