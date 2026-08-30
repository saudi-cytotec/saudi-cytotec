import { Link } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CareReferral } from "../components/CareReferral";
import { ContactCta } from "../components/ContactCta";
import { ReferencesList } from "../components/ReferencesList";
import { JsonLd, Seo } from "../components/Seo";
import { priorityCityLinks, serviceAreaLinks, serviceRegions } from "../data/serviceAreas";
import { SITE } from "../data/site";

const faqItems = [
  {
    q: "هل تعني صفحة سايتوتك في السعودية أن الموقع يبيع الدواء أو يوفّره؟",
    a: "لا. هذه الصفحات تعليمية فقط. هي تشرح معنى البحث طبياً، وعلامات الخطر، ومتى تجب مراجعة منشأة صحية مرخصة داخل السعودية، ولا تعرض بيعاً أو توصيلاً أو وسطاء.",
  },
  {
    q: "لماذا توجد صفحات مدن إذا كانت المعلومات الطبية الأساسية واحدة؟",
    a: "لأن الفروق المفيدة هنا ليست في الجرعة أو التشخيص، بل في سياق الوصول للرعاية: السفر، الزحام، المحافظات القريبة، والمسافة إلى الطوارئ. لذلك صُممت الصفحات لإضافة قيمة محلية حقيقية لا لتكرار النص نفسه مع تبديل اسم المدينة.",
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

export function ServiceAreas() {
  const { articles } = useCatalog();
  const cityArticles = priorityCityLinks
    .map((city) => ({ city, article: articles.find((item) => item.slug === city.articleSlug) }))
    .filter((item): item is { city: (typeof priorityCityLinks)[number]; article: (typeof articles)[number] } => Boolean(item.article));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo
        title="سايتوتك في السعودية"
        description="دليل سعودي معلوماتي عن سايتوتك وميزوبروستول يربط المدن ذات الأولوية بعلامات الخطر، الأمان الدوائي، ومتى تجب مراجعة الرعاية المرخصة داخل السعودية."
        path="/service-areas"
        keywords="سايتوتك في السعودية, معلومات سايتوتك في السعودية, معلومات عن ميزوبروستول, سايتوتك في مكة المكرمة, معلومات سايتوتك في المدينة المنورة"
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
              "صفحة مركزية تربط معلومات سايتوتك في السعودية بصفحات مدن تعليمية، مع شرح الأمان وعلامات الخطر ومتى تجب مراجعة الرعاية المرخصة.",
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
      <Breadcrumbs items={[{ name: "سايتوتك في السعودية", path: "/service-areas" }]} />

      <section className="mt-5 rounded-[2rem] border border-line bg-paper p-7 shadow-sm">
        <p className="text-sm font-bold text-accent">المحور الجغرافي الرئيسي</p>
        <h1 className="mt-2 max-w-4xl text-4xl font-bold leading-[1.35] text-teal-deep">سايتوتك في السعودية: مركز معلومات جغرافي وتعليمي</h1>
        <p className="mt-4 max-w-4xl leading-8 text-ink-soft">
          هذه الصفحة هي المركز الجغرافي الرئيسي لموضوع <strong>سايتوتك في السعودية</strong>. الغرض منها ليس البيع أو
          الإحالة التجارية، بل مساعدة القارئة على فهم ما يعنيه هذا البحث طبياً داخل المملكة: ما هو ميزوبروستول؟ ما التحذيرات
          الأساسية؟ متى تصبح الأعراض طارئة؟ وكيف تختلف قيمة الصفحة المحلية بين مكة وبريدة وتبوك من زاوية الوصول إلى الرعاية
          المرخصة لا من زاوية ادعاء التوفر.
        </p>
        <p className="mt-4 max-w-4xl leading-8 text-ink-soft">
          المعلومات الطبية العامة عن ميزوبروستول لا تتبدل بتبدل المدينة، لكن ما قد يختلف هو الزحام، السفر، المسافة، أو كون
          السائلة زائرة أو قادمة من محافظة مجاورة. لذلك بُنيت الصفحات المحلية هنا لتضيف سياقاً صحياً عملياً وتربطك بالمراجع
          الرسمية وبعلامات الخطر وبصفحات الأمان والطوارئ، من دون جرعات منزلية أو وعود تجارية.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {serviceAreaLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full border border-line bg-cream px-4 py-2 text-sm font-semibold text-brand-deep hover:bg-brand-soft"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-line bg-paper p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-teal-deep">ماذا يعني البحث عن سايتوتك في السعودية طبياً؟</h2>
          <div className="mt-4 space-y-4 text-sm leading-8 text-ink-soft">
            <p>
              في السياق الطبي، اسم سايتوتك يحيل غالباً إلى مستحضر مرتبط بمادة <strong>ميزوبروستول</strong>. فهم الاسم وحده لا
              يكفي، لأن التقييم الطبي يعتمد على سبب البحث، والحمل المحتمل، وطبيعة الأعراض، والتداخلات الدوائية، وسلسلة التوريد
              النظامية داخل المملكة. لهذا تكرّر صفحاتنا فكرة واحدة بوضوح: المعلومة العامة مفيدة، لكن القرار الفردي يحتاج جهة
              مرخصة يمكنها التقييم والمتابعة.
            </p>
            <p>
              كما أن المراجع الدولية لا تلغي التنظيم المحلي. في السعودية تُراجع قضايا الدواء ضمن إطار الهيئة العامة للغذاء
              والدواء ووزارة الصحة والمنشآت المرخصة. وعندما تبحث القارئة عن معلومات سايتوتك في السعودية فهي تحتاج إلى محتوى
              يربط هذه الحقيقة التنظيمية بعلامات الخطر والمراجعة السريعة، لا إلى صفحة تكرر الاسم وتدفعها إلى قناة خاصة.
            </p>
            <ul className="list-disc space-y-2 pr-5">
              <li>الدواء لا يُفهم من اسمه التجاري وحده، بل من مادته الفعالة واستطبابه وتحذيراته.</li>
              <li>الصفحات المحلية هنا تشرح الوصول الآمن للرعاية، لا تعليمات استخدام منزلي.</li>
              <li>الزحام أو السفر أو البعد الجغرافي قد يغيّر قرار التوجه للطوارئ بسرعة، لا حقيقة الدواء الطبية.</li>
            </ul>
          </div>
        </article>

        <article className="rounded-3xl border border-line bg-paper p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-teal-deep">علامات لا تنتظر</h2>
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

      <section className="mt-10 rounded-3xl border border-line bg-paper p-6 shadow-sm">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-teal-deep">المدن ذات الأولوية</h2>
          <p className="mt-3 leading-8 text-ink-soft">
            صُممت الصفحات التالية لتغطي المدن ذات الأولوية المطلوبة داخل السعودية بمحتوى معلوماتي مختلف فعلاً، مع ربط كل صفحة
            بصفحات الأمان والطوارئ والمراجع الطبية وبالعودة إلى هذا المركز السعودي.
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
                        <div>
                          <h4 className="font-bold text-teal-deep">{city.keyword}</h4>
                          <p className="mt-1 text-sm leading-7 text-ink-soft">{city.blurb}</p>
                          <p className="mt-2 text-xs leading-6 text-ink-soft">{city.accessNote}</p>
                        </div>
                        {article ? (
                          <Link
                            to={`/blog/${article.slug}`}
                            className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-white hover:brightness-110"
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

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {topicLinks.map((item) => (
          <Link key={item.to} to={item.to} className="rounded-3xl border border-line bg-paper p-5 shadow-sm hover:bg-cream">
            <h2 className="text-lg font-bold text-teal-deep">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-ink-soft">{item.text}</p>
          </Link>
        ))}
      </section>

      <section className="mt-10 rounded-3xl border border-line bg-paper p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-teal-deep">أسئلة شائعة حول سايتوتك في السعودية</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {faqItems.map((item) => (
            <article key={item.q} className="rounded-2xl bg-cream p-4">
              <h3 className="font-bold text-brand-deep">{item.q}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-line bg-paper p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-teal-deep">ابدئي من الصفحة الأقرب لسؤالك</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { to: "/what-is-cytotec", title: "ما هو سايتوتك؟", text: "لفهم الاسم التجاري والمادة الفعالة قبل أي قراءة محلية." },
            { to: "/safety", title: "الأمان والتحذيرات", text: "لشرح التحذيرات الأساسية ومخاطر المصادر غير الموثوقة." },
            { to: "/when-to-see-doctor", title: "متى تجب مراجعة الطبيب", text: "لتمييز الأعراض التي تحتاج تقييماً عاجلاً أو طوارئ." },
            { to: "/faq", title: "الأسئلة الشائعة", text: "للإجابات المختصرة والروابط السريعة إلى الصفحات المرتبطة." },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="rounded-2xl bg-cream p-4 hover:bg-brand-soft">
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
