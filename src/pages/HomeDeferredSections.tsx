import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { CategoryCard } from "../components/CategoryCard";
import { ContactCta } from "../components/ContactCta";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { CareReferral } from "../components/CareReferral";
import { HomeNationalDirectory } from "../components/HomeNationalDirectory";
import { ReferencesList } from "../components/ReferencesList";
import {
  IconArrowLeft,
  IconBook,
  IconHelp,
  IconLandmark,
  IconShieldAlert,
  IconShieldCheck,
  IconSiren,
  IconPill,
} from "../components/icons";
import { WhatsAppIcon } from "../components/WhatsAppContact";
import type { ArticleSummary } from "../data/articleIndex";
import { publicArticleIndex } from "../data/articleIndex";
import { HEALTH_LINES } from "../data/contact";
import { WHATSAPP_NUMBER_RAW, WHATSAPP_URL } from "../data/conversion";
import {
  HOME_CORE_PAGES,
  HOME_CYTOTEC_INTRO,
  HOME_FAQS,
  HOME_FEATURED_SLUGS,
  HOME_QUICK_FACTS,
  HOME_REFERENCE_IDS,
  HOME_SERVICES,
  HOME_SUPPORT_PAGES,
  HOME_VALUE,
  type HomeService,
} from "../data/home";
import { clusters } from "../data/site";

const publicArticles = publicArticleIndex.filter((article) => !article.noindex);

const curated = HOME_FEATURED_SLUGS
  .map((slug) => publicArticles.find((article) => article.slug === slug))
  .filter((article): article is ArticleSummary => Boolean(article));

const featured = curated.length ? curated : publicArticles.slice(0, 3);
const featuredSlugs = new Set(featured.map((article) => article.slug));
const latest = [...publicArticles]
  .sort((a, b) => `${b.updatedAt}|${b.publishedAt}`.localeCompare(`${a.updatedAt}|${a.publishedAt}`))
  .filter((article) => !featuredSlugs.has(article.slug))
  .slice(0, 3);

const SA = HEALTH_LINES.find((c) => c.code === "sa");
const SA_MOH = SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value ?? "937";
const SA_EMS = SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value ?? "997";

const SERVICE_META: Record<HomeService["key"], { Icon: typeof IconPill; color: string }> = {
  information: { Icon: IconBook, color: "text-sky" },
  prescription: { Icon: IconShieldCheck, color: "text-brand" },
  dispensing: { Icon: IconLandmark, color: "text-brand" },
  safety: { Icon: IconShieldAlert, color: "text-warn" },
  contact: { Icon: IconHelp, color: "text-accent" },
};

const EMERGENCY_SIGNS = [
  "نزيف غزير أو متزايد بسرعة.",
  "إغماء أو دوخة شديدة أو عدم القدرة على الوقوف.",
  "ألم بطني حاد مفاجئ، خاصة مع حمل معروف أو محتمل.",
  "حمى مرتفعة مستمرة أو قشعريرة مع تدهور عام.",
  "ضيق تنفس أو ألم صدر أو تورم في الوجه.",
];

const SECTION_HEADING = "font-display text-2xl font-extrabold text-brand-deep sm:text-[1.8rem]";

export default function HomeDeferredSections() {
  return (
    <>
      {/* ── 2. شريط الخدمات السريع ──────────────────────────────────────── */}
      <section aria-label="الخدمات السريعة" className="defer-render rounded-[1.75rem] bg-brand-deep p-4 shadow-[0_20px_45px_-25px_rgb(10_74_51/0.7)] sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/what-is-cytotec" className="group rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/10 transition hover:bg-white/15">
            <span className="text-xs font-bold text-white/70">دليل دوائي</span>
            <span className="mt-1 block font-display text-base font-extrabold">سايتوتك في السعودية</span>
            <span className="mt-2 block text-xs leading-5 text-white/75">تعريف ومعلومات وتحذيرات موثوقة</span>
          </Link>
          <Link to="/misoprostol" className="group rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/10 transition hover:bg-white/15">
            <span className="text-xs font-bold text-white/70">المادة الفعالة</span>
            <span className="mt-1 block font-display text-base font-extrabold">ميزوبروستول</span>
            <span className="mt-2 block text-xs leading-5 text-white/75">الاستخدامات الطبية وإرشادات الأمان</span>
          </Link>
          <Link to="/safety" className="group rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/10 transition hover:bg-white/15">
            <span className="text-xs font-bold text-white/70">الأمان</span>
            <span className="mt-1 block font-display text-base font-extrabold">السلامة والتحذيرات</span>
            <span className="mt-2 block text-xs leading-5 text-white/75">متى تحتاجين إلى رعاية طبية</span>
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group rounded-2xl bg-[#16a34a] p-4 text-white shadow-lg transition hover:bg-[#15803d]">
            <span className="flex items-center gap-2 text-xs font-bold text-white/85"><WhatsAppIcon className="h-4 w-4" /> تواصل مباشر</span>
            <span className="mt-1 block font-display text-base font-extrabold">استفسري عبر واتساب</span>
            <span dir="ltr" className="mt-2 block text-xs font-mono font-bold text-white/90">{WHATSAPP_NUMBER_RAW}</span>
          </a>
        </div>
      </section>


      {/* ── 2. سايتوتك في السعودية ───────────────────────────────────────── */}
      <section className="defer-render grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" aria-labelledby="cytotec-section">
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
          <h2 className="font-display text-lg font-extrabold text-brand-deep">خدماتنا ومعلوماتنا الدوائية</h2>
          <p className="mt-1.5 text-xs leading-6 text-ink-soft">
            دليل دوائي منظم، صفحات مرجعية، معلومات أمان، مسار رعاية نظامي، ومصادر رسمية — مع قناة تواصل واضحة
            للاستفسارات العامة. لا نعرض أسعاراً أو مخزوناً أو وعود توصيل غير موثقة.
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

      <div className="defer-render"><DisclaimerBanner /></div>

      {/* ── 4. صفحات الدعم عن سايتوتك وميزوبروستول ───────────────────────── */}
      <section className="defer-render" aria-labelledby="support-pages-heading">
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
      <section className="defer-render" aria-labelledby="why-us-heading">
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
      <section className="defer-render grid gap-6 lg:grid-cols-2">
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
      <section className="defer-render space-y-10" aria-labelledby="articles-heading">
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
      <section className="defer-render" aria-labelledby="faq-heading">
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
      <section className="defer-render card-premium p-6" aria-labelledby="core-pages-heading">
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
      <section className="defer-render">
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

      <div className="defer-render"><HomeNationalDirectory /></div>

      <div className="defer-render"><ReferencesList ids={[...HOME_REFERENCE_IDS]} /></div>

      <div className="defer-render"><CareReferral /></div>
      <div className="defer-render"><ContactCta topic="سايتوتك والمعلومات الدوائية في السعودية" /></div>

    </>
  );
}
