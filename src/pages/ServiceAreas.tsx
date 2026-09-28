import { Link } from "react-router-dom";
import { CareReferral } from "../components/CareReferral";
import { ContactCta } from "../components/ContactCta";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { PageHero } from "../components/PageHero";
import { ReferencesList } from "../components/ReferencesList";
import { JsonLd, Seo } from "../components/Seo";
import { serviceAreaLinks } from "../data/serviceAreas";
import { SITE } from "../data/site";


const saudiCities = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الطائف",
  "تبوك",
  "بريدة",
  "عنيزة",
  "حائل",
  "أبها",
  "خميس مشيط",
  "جازان",
  "نجران",
  "الجبيل",
  "الأحساء",
  "الهفوف",
  "القطيف",
  "صفوى",
];

const faqItems = [
  {
    q: "هل يقدم هذا الموقع أدوية أو يبيعها؟",
    a: "لا. الموقع يقدّم معلومات دوائية موثّقة ويوضّح المسار النظامي للصرف، ولا يتعامل بأي بيع أو توصيل عبر قنوات تواصل خاصة، ولا ينشر أسعاراً أو مخزوناً. أي ادعاء ببيع باسمنا كاذب، والصرف يكون بوصفة طبية عبر صيدلية مرخّصة.",
  },
  {
    q: "ما الفرق بين 937 و997 داخل السعودية؟",
    a: "937 للاستفسارات الصحية العامة والإرشاد إلى المسار المناسب عندما لا توجد حالة إسعافية مباشرة، أما 997 فهو للإسعاف والحالات الطارئة مثل النزيف الشديد أو الإغماء أو الألم الحاد أو ضيق التنفس.",
  },
  {
    q: "هل معلومات الأدوية تختلف من مدينة لأخرى؟",
    a: "لا. الحقائق الدوائية والتحذيرات والتنظيم موحدة على مستوى المملكة. ما قد يختلف هو طريقة الوصول إلى الرعاية المرخصة، لذلك نركز على القنوات الرسمية الموحدة.",
  },
];

const topicLinks = [
  {
    to: "/blog/cluster/alaman-walthahdhirat",
    title: "محور الأمان الدوائي",
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
    to: "/womens-health",
    title: "صحة المرأة",
    text: "محور شامل عن الدورة، الخصوبة، تكيس المبايض، والفحوصات.",
  },
  {
    to: "/early-pregnancy",
    title: "الحمل المبكر",
    text: "معلومات تعليمية عن الحمل المبكر والمتابعة الآمنة.",
  },
  {
    to: "/safety",
    title: "الأمان الدوائي",
    text: "تحذيرات الأدوية والتنظيم السعودي ومخاطر المصادر غير الموثوقة.",
  },
  {
    to: "/what-is-cytotec",
    title: "ما هو سايتوتك؟ (توعوي)",
    text: "تعريف تعليمي للاسم التجاري ضمن التوعية الدوائية فقط.",
  },
  {
    to: "/misoprostol",
    title: "ميزوبروستول (توعوي)",
    text: "معلومات عن المادة الفعالة والتحذيرات الأساسية.",
  },
  {
    to: "/when-to-see-doctor",
    title: "متى تراجعين الطبيب",
    text: "علامات تستدعي عيادة أو طوارئ دون تأخير.",
  },
];

export function ServiceAreas() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <Seo
        title="سايتوتك في السعودية | الرعاية الصحية والصرف النظامي"
        description="دليل سايتوتك في السعودية ومعلومات الرعاية والصرف النظامي: كيف تصلين إلى الجهات الصحية والصيدليات المرخصة، وما دور وزارة الصحة والهيئة العامة للغذاء والدواء، مع معلومات توعوية عن سايتوتك وميزوبروستول."
        path="/service-areas"
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": ["CollectionPage", "MedicalWebPage"],
            name: "الرعاية الصحية للمرأة في السعودية",
            url: `${SITE.domain}/service-areas`,
            inLanguage: "ar-SA",
            description:
              "دليل تعليمي يشرح كيفية الوصول إلى الرعاية الصحية المرخصة للمرأة في السعودية عبر القنوات الرسمية، مع معلومات توعوية عن سلامة الأدوية.",
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.domain },
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
        crumbs={[{ name: "الرعاية في السعودية", path: "/service-areas" }]}
        title="سايتوتك في السعودية: الرعاية والصرف النظامي"
        description="دليل عملي للوصول إلى الرعاية والصرف المرخّص في السعودية عبر القنوات الرسمية، مع معلومات دوائية موثقة عن سايتوتك وميزوبروستول وشروط الصرف بالوصفة الطبية."
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
          <h2 className="font-display text-2xl font-extrabold text-brand-deep">كيف تصلين إلى الرعاية الصحية المرخصة؟</h2>
          <div className="mt-4 space-y-4 text-sm leading-8 text-ink-soft">
            <p>
              في المملكة العربية السعودية، الوصول إلى الرعاية الصحية للمرأة يتم عبر منظومة رسمية تشمل مراكز الرعاية
              الأولية، المستشفيات الحكومية والخاصة المرخصة، والصيدليات المرخصة من الهيئة العامة للغذاء والدواء. وزارة
              الصحة تشرف على الخدمات والتوعية، بينما تشرف الهيئة على تسجيل الأدوية ومراقبة تداولها.
            </p>
            <p>
              يقدّم هذا الموقع معلومات دوائية موثّقة عن صحة المرأة، بما في ذلك دليل عن أدوية مثل سايتوتك وميزوبروستول:
              المادة الفعالة، والاستطباب، والتحذيرات، وشروط الصرف بالوصفة الطبية عبر الصيدليات المرخّصة، دون نشر جرعات أو
              طرق استخدام أو تعليمات لإنهاء الحمل أو طرق شراء. أي قرار علاجي فردي يجب أن يتم عبر جهة صحية مرخصة تقيّم
              وتتابع.
            </p>
            <ul className="list-disc space-y-2 pr-5">
              <li>المعلومة الدوائية تُفهم من نشرتها الرسمية ومادتها الفعالة واستطبابها وتحذيراتها، لا من اسمها التجاري فقط.</li>
              <li>الأدوية الخاضعة للتنظيم تحتاج وصفة وتقييم طبي ولا تُصرف عبر قنوات تواصل خاصة.</li>
              <li>القنوات الرسمية الموحدة (937 و997) تغطي جميع مناطق المملكة بلا استثناء.</li>
              <li>المصادر غير الموثوقة التي تبيع عبر واتساب أو تطبيقات خاصة ليست مصادر طبية.</li>
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
          <p className="mt-3 text-xs leading-6 text-ink-soft">
            لا نتعامل بأي بيع أو تسويق للأدوية عبر قنوات تواصل خاصة، وأي ادعاء بذلك باسمنا كاذب. الصرف يتم بوصفة طبية
            وعبر صيدلية مرخّصة، وبيانات الأسعار والمخزون تُطلب من الجهة المرخّصة مباشرة.
          </p>
        </article>
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
        <h2 className="font-display text-2xl font-extrabold text-brand-deep">أسئلة شائعة حول الرعاية في السعودية</h2>
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
        <h2 className="font-display text-2xl font-extrabold text-brand-deep">ابدئي من المحور الأقرب لسؤالك</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entryLinks.map((item) => (
            <Link key={item.to} to={item.to} className="rounded-2xl bg-cream p-4 transition hover:bg-brand-soft">
              <h3 className="font-bold text-brand-deep">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{item.text}</p>
            </Link>
          ))}
        </div>
      </section>


      <section className="card-premium p-6">
        <h2 className="font-display text-2xl font-extrabold text-brand-deep">سايتوتك في مدن السعودية</h2>
        <p className="mt-3 max-w-4xl text-sm leading-8 text-ink-soft">
          يبحث المستخدمون عن معلومات سايتوتك بأسماء المدن مثل الرياض وجدة والدمام ومكة والمدينة وغيرها.
          هذه الصفحة الوطنية تجمع المعلومات الدوائية والتنظيمية في مكان واحد؛ لا ننشئ صفحات مدن متطابقة ولا ندّعي
          وجود فرع أو مخزون أو خدمة بيع في مدينة بعينها. اختلاف المدينة يغيّر جهة الوصول إلى الرعاية المرخّصة فقط.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {saudiCities.map((city) => (
            <span key={city} className="rounded-full border border-line bg-cream px-3 py-2 text-sm font-semibold text-brand-deep">
              سايتوتك في {city}
            </span>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Link to="/abortion-pills-saudi-arabia" className="rounded-2xl bg-cream p-4 hover:bg-brand-soft">
            <strong className="text-brand-deep">أدوية إجهاض الحمل في السعودية</strong>
            <p className="mt-1 text-sm leading-7 text-ink-soft">الصفحة الوطنية للمصطلح البحثي والمعلومات التوعوية.</p>
          </Link>
          <Link to="/medical-sources" className="rounded-2xl bg-cream p-4 hover:bg-brand-soft">
            <strong className="text-brand-deep">المصادر الطبية</strong>
            <p className="mt-1 text-sm leading-7 text-ink-soft">النشرات والجهات التنظيمية التي نعتمد عليها.</p>
          </Link>
          <Link to="/safety" className="rounded-2xl bg-cream p-4 hover:bg-brand-soft">
            <strong className="text-brand-deep">الأمان والتحذيرات</strong>
            <p className="mt-1 text-sm leading-7 text-ink-soft">معلومات السلامة وحدود المعلومات العامة.</p>
          </Link>
        </div>
      </section>


      <section className="card-premium p-6">
        <h2 className="font-display text-2xl font-extrabold text-brand-deep">أدلة أدوية إجهاض الحمل حسب الدولة</h2>
        <p className="mt-3 max-w-4xl text-sm leading-8 text-ink-soft">
          إذا كان بحثك مرتبطاً بدولة خليجية أخرى، استخدمي الدليل المحلي المناسب. كل صفحة تشرح المعلومات الدوائية
          والسلامة والسياق التنظيمي للدولة، ولا تقدم بيعاً أو جرعات أو خطوات استخدام.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["/abortion-pills-saudi-arabia", "أدوية إجهاض الحمل في السعودية"],
            ["/abortion-pills-uae", "أدوية إجهاض الحمل في الإمارات"],
            ["/abortion-pills-kuwait", "أدوية إجهاض الحمل في الكويت"],
            ["/abortion-pills-bahrain", "أدوية إجهاض الحمل في البحرين"],
            ["/abortion-pills-qatar", "أدوية إجهاض الحمل في قطر"],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="rounded-2xl border border-line bg-cream p-4 font-bold text-brand-deep transition hover:bg-brand-soft">
              {label}
            </Link>
          ))}
        </div>
      </section>

      <ReferencesList ids={["sfda", "moh", "fdaLabel", "dailyMed", "medlinePlus"]} />
      <CareReferral />
      <ContactCta topic="سؤال عن الرعاية الصحية للمرأة في السعودية" />
    </div>
  );
}
