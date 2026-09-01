import { Link } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { CareReferral } from "../components/CareReferral";
import { ContactCta } from "../components/ContactCta";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { PageHero } from "../components/PageHero";
import { ReferencesList } from "../components/ReferencesList";
import { JsonLd, Seo } from "../components/Seo";
import { geoGuideLinks, priorityCityLinks, serviceAreaLinks, serviceRegions } from "../data/serviceAreas";
import { SITE } from "../data/site";

const faqItems = [
  {
    q: "هل تعني صفحة سايتوتك في السعودية أن الموقع يبيع الدواء أو يوفّره؟",
    a: "لا. هذه الصفحة تعليمية فقط. تشرح معنى البحث طبياً، وعلامات الخطر، ومتى تجب مراجعة منشأة صحية مرخصة داخل السعودية، ولا تعرض بيعاً أو توصيلاً أو وسطاء.",
  },
  {
    q: "لماذا توجد صفحات مدن إذا كانت المعلومات الطبية الأساسية واحدة؟",
    a: "لأن الفروق المفيدة هنا ليست في الجرعة أو التشخيص، بل في سياق الوصول إلى الرعاية: الزحام، السفر، المحافظات القريبة، والمسافة إلى الطوارئ. لذلك صُممت الصفحات لإضافة قيمة محلية حقيقية لا لتكرار النص نفسه مع تبديل اسم المدينة.",
  },
  {
    q: "ما الفرق بين 937 و997 داخل السعودية؟",
    a: "937 للاستفسارات الصحية العامة والإرشاد إلى المسار المناسب عندما لا توجد حالة إسعافية مباشرة، أما 997 فهو للإسعاف والحالات الطارئة مثل النزيف الشديد أو الإغماء أو الألم الحاد أو ضيق التنفس.",
  },
];

const topicLinks = [
  {
    to: "/blog/cluster/alaman-walthahdhirat",
    title: "محور الأمان والتحذيرات",
    text: "لفهم تحذير الحمل، مخاطر المصدر غير الموثوق، وحدود الاستخدام الذاتي.",
  },
  {
    to: "/blog/cluster/mata-murajaa-altabeeb",
    title: "محور الطوارئ ومراجعة الطبيب",
    text: "للتفريق بين العرض المزعج والعلامة التي تحتاج عيادة أو طوارئ فوراً.",
  },
  {
    to: "/blog/cluster/aladilla-walmasader",
    title: "محور المصادر والتنظيم",
    text: "للرجوع إلى النشرات الرسمية والمراجع التنظيمية وكيفية التحقق من المعلومة.",
  },
];

const warningSigns = [
  "نزيف شديد أو متزايد بسرعة.",
  "إغماء أو دوخة شديدة أو عدم القدرة على الوقوف.",
  "ألم بطني حاد، خاصة مع حمل معروف أو محتمل.",
  "حمى مرتفعة مستمرة أو قشعريرة مع تدهور عام.",
  "ضيق تنفس أو ألم صدر أو تورم في الوجه.",
];

const entryLinks = [
  {
    to: "/what-is-cytotec",
    title: "ما هو سايتوتك؟",
    text: "لفهم الاسم التجاري والمادة الفعالة قبل أي قراءة محلية.",
  },
  {
    to: "/misoprostol",
    title: "معلومات عن ميزوبروستول",
    text: "لفهم المادة الفعالة والسياق الطبي العام بعيداً عن لغة البيع.",
  },
  {
    to: "/safety",
    title: "الأمان والتحذيرات",
    text: "لشرح التحذيرات الأساسية ومخاطر المصادر غير الموثوقة.",
  },
  {
    to: "/when-to-see-doctor",
    title: "متى تجب مراجعة الطبيب",
    text: "لتمييز الأعراض التي تحتاج تقييماً عاجلاً أو طوارئ.",
  },
  {
    to: "/faq",
    title: "الأسئلة الشائعة",
    text: "للإجابات المختصرة والروابط السريعة إلى الصفحات المرتبطة.",
  },
  {
    to: "/medical-sources",
    title: "المراجع الطبية",
    text: "للوصول إلى النشرات والهيئات والمصادر العامة الموثوقة.",
  },
];

export function ServiceAreas() {
  const { articles } = useCatalog();
  const cityArticles = priorityCityLinks
    .map((city) => ({ city, article: articles.find((item) => item.slug === city.articleSlug) }))
    .filter((item): item is { city: (typeof priorityCityLinks)[number]; article: (typeof articles)[number] } => Boolean(item.article));
  const geoGuides = geoGuideLinks
    .map((guide) => ({ guide, article: articles.find((item) => item.slug === guide.slug) }))
    .filter((item): item is { guide: (typeof geoGuideLinks)[number]; article: (typeof articles)[number] } => Boolean(item.article));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <Seo
        title="سايتوتك في السعودية"
        description="المركز التعليمي الرئيسي لموضوع سايتوتك في السعودية: معلومات عن ميزوبروستول، التحذيرات، علامات الخطر، وصفحات المدن ذات الأولوية داخل المملكة."
        path="/service-areas"
        keywords="سايتوتك في السعودية, معلومات سايتوتك في السعودية, معلومات عن ميزوبروستول, سايتوتك في مكة المكرمة, سايتوتك في المدينة المنورة, سايتوتك في الدمام"
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": ["CollectionPage", "MedicalWebPage"],
            name: "سايتوتك في السعودية",
            url: `${SITE.domain}/service-areas`,
            inLanguage: "ar-SA",
            description:
              "صفحة سعودية مركزية تربط معلومات سايتوتك في السعودية بصفحات مدن تعليمية، مع شرح الأمان وعلامات الخطر ومتى تجب مراجعة الرعاية المرخصة.",
            about: priorityCityLinks.map((city) => ({ "@type": "City", name: city.name })),
            hasPart: cityArticles.map(({ city, article }) => ({
              "@type": "Article",
              headline: city.keyword,
              url: `${SITE.domain}/blog/${article.slug}`,
              description: city.blurb,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          },
        ]}
      />

      <PageHero
        crumbs={[{ name: "سايتوتك في السعودية", path: "/service-areas" }]}
        title="سايتوتك في السعودية: المركز التعليمي الجغرافي"
        description="هذه هي الصفحة السعودية الرئيسية للموضوع. تجمع معلومات عامة عن ميزوبروستول، التحذيرات الطبية الأساسية، ومتى تكون المراجعة عاجلة، ثم تربطك بصفحات المدن ذات الأولوية داخل المملكة دون بيع أو وعود تجارية."
      >
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          {serviceAreaLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/20"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </PageHero>

      <div className="max-w-3xl">
        <DisclaimerBanner />
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="card-premium p-6">
          <h2 className="font-display text-2xl font-extrabold text-brand-deep">ماذا يعني البحث عن سايتوتك في السعودية طبياً؟</h2>
          <div className="mt-4 space-y-4 text-sm leading-8 text-ink-soft">
            <p>
              في السياق الطبي، اسم سايتوتك يحيل غالباً إلى مستحضر مرتبط بمادة <strong>ميزوبروستول</strong>. فهم الاسم وحده لا
              يكفي، لأن التقييم الطبي يعتمد على سبب السؤال، والحمل المحتمل، وطبيعة الأعراض، والتداخلات الدوائية، وسلسلة التوريد
              النظامية داخل المملكة. لهذا تكرر هذه الصفحة فكرة واحدة بوضوح: المعلومة العامة مفيدة، لكن القرار الفردي يحتاج جهة
              مرخصة يمكنها التقييم والمتابعة.
            </p>
            <p>
              معلومات سايتوتك في السعودية لا تتغير من مدينة إلى أخرى من حيث الحقائق الطبية الأساسية، لكن الذي قد يختلف هو
              الزحام، أو السفر، أو المسافة، أو كون السائلة زائرة أو قادمة من محافظة مجاورة. لذلك بُنيت الصفحات المحلية هنا
              لتضيف سياقاً صحياً عملياً وتربطك بالمراجع الرسمية وبعلامات الخطر وبصفحات الأمان والطوارئ، من دون جرعات منزلية أو
              وعود تجارية.
            </p>
            <ul className="list-disc space-y-2 pr-5">
              <li>الدواء لا يُفهم من اسمه التجاري وحده، بل من مادته الفعالة واستطبابه وتحذيراته.</li>
              <li>الصفحات المحلية هنا تشرح الوصول الآمن إلى الرعاية، لا تعليمات استخدام منزلي.</li>
              <li>الزحام أو السفر أو البعد الجغرافي قد يغيّر قرار التوجه إلى الطوارئ بسرعة، لا حقيقة الدواء الطبية.</li>
            </ul>
          </div>
        </article>

        <article className="card-premium p-6">
          <h2 className="font-display text-2xl font-extrabold text-brand-deep">علامات لا تنتظر</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-ink-soft">
            {warningSigns.map((item) => (
              <li key={item} className="rounded-2xl bg-cream p-3">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-7 text-ink-soft">
            للاستفسارات الصحية العامة داخل السعودية استخدمي <span dir="ltr" className="font-mono font-bold">937</span>، أما
            الحالات الإسعافية فاستخدمي <span dir="ltr" className="font-mono font-bold">997</span> أو توجهي إلى الطوارئ فوراً.
          </p>
        </article>
      </section>

      <section id="cities" className="card-premium p-6">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-extrabold text-brand-deep">المدن ذات الأولوية في السعودية</h2>
          <p className="mt-3 leading-8 text-ink-soft">
            الصفحات التالية تغطي المدن ذات الأولوية المطلوبة داخل السعودية بمحتوى معلوماتي مختلف فعلاً، مع ربط كل صفحة بصفحات
            الأمان والطوارئ والمراجع الطبية وبالعودة إلى هذا المركز السعودي.
          </p>
        </div>
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {serviceRegions.map((region) => (
            <article key={region.id} className="rounded-3xl border border-line bg-cream/50 p-5">
              <h3 className="text-xl font-bold text-brand-deep">{region.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{region.description}</p>
              <div className="mt-5 grid gap-3">
                {region.cities.map((city) => {
                  const article = articles.find((item) => item.slug === city.articleSlug);
                  return (
                    <div key={city.articleSlug} className="rounded-2xl border border-line bg-paper p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="max-w-2xl">
                          <h4 className="font-bold text-brand-deep">{city.keyword}</h4>
                          <p className="mt-1 text-sm leading-7 text-ink-soft">{city.blurb}</p>
                          <p className="mt-2 text-xs leading-6 text-ink-soft">{city.accessNote}</p>
                        </div>
                        {article ? (
                          <Link
                            to={`/blog/${article.slug}`}
                            className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
                          >
                            اقرئي الصفحة
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card-premium p-6">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-extrabold text-brand-deep">أدلة المناطق والمقالات المساندة</h2>
          <p className="mt-3 leading-8 text-ink-soft">
            إلى جانب صفحات المدن، يضم هذا المحور دليلاً محورياً واحداً وأربعة أدلة للمناطق الكبرى وثلاث مقالات مساندة عن
            الأسئلة الجغرافية والسلامة والتحقق من المعلومة. كلها تعليمية ولا تتضمن بيعاً أو وساطة.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {geoGuides.map(({ guide, article }) => (
            <Link
              key={guide.slug}
              to={`/blog/${guide.slug}`}
              className="rounded-2xl border border-line bg-cream/50 p-4 transition hover:bg-brand-soft"
            >
              <h3 className="font-bold text-brand-deep">{article?.title ?? guide.label}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{guide.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {topicLinks.map((item) => (
          <Link key={item.to} to={item.to} className="card-premium p-5 transition hover:bg-cream">
            <h2 className="text-lg font-bold text-brand-deep">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-ink-soft">{item.text}</p>
          </Link>
        ))}
      </section>

      <section className="card-premium p-6">
        <h2 className="font-display text-2xl font-extrabold text-brand-deep">أسئلة شائعة حول سايتوتك في السعودية</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {faqItems.map((item) => (
            <article key={item.q} className="rounded-2xl bg-cream p-4">
              <h3 className="font-bold text-brand-deep">{item.q}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card-premium p-6">
        <h2 className="font-display text-2xl font-extrabold text-brand-deep">ابدئي من الصفحة الأقرب لسؤالك</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entryLinks.map((item) => (
            <Link key={item.to} to={item.to} className="rounded-2xl bg-cream p-4 transition hover:bg-brand-soft">
              <h3 className="font-bold text-brand-deep">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{item.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <ReferencesList ids={["sfda", "moh", "fdaLabel", "dailyMed", "medlinePlus"]} />
      <CareReferral />
      <ContactCta topic="سؤال عن سايتوتك في السعودية أو صفحة مدينة" />
    </div>
  );
}
