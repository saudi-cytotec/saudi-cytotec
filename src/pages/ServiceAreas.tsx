import { Link } from "react-router-dom";
import { CareReferral } from "../components/CareReferral";
import { ContactCta } from "../components/ContactCta";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { PageHero } from "../components/PageHero";
import { ReferencesList } from "../components/ReferencesList";
import { JsonLd, Seo } from "../components/Seo";
import { serviceAreaLinks } from "../data/serviceAreas";
import { SITE } from "../data/site";

const faqItems = [
  {
    q: "هل يقدم هذا الموقع أدوية أو يبيعها؟",
    a: "لا إطلاقاً. الموقع تعليمي فقط. يقدم معلومات عامة عن صحة المرأة وسلامة الأدوية، بما في ذلك معلومات توعوية عن سايتوتك وميزوبروستول كمادة دوائية، دون بيع أو توصيل أو وصفات أو تعليمات استخدام.",
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
        title="الرعاية الصحية للمرأة في السعودية | دليل الوصول للخدمات"
        description="دليل تعليمي عن كيفية الوصول إلى الرعاية الصحية المرخصة للمرأة في السعودية: دور وزارة الصحة والهيئة العامة للغذاء والدواء، القنوات الرسمية 937 و997، ومعلومات توعوية عن سلامة الأدوية بما في ذلك سايتوتك وميزوبروستول كمادة توعوية فقط."
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
        title="الرعاية الصحية للمرأة في السعودية"
        description="دليل تعليمي يوضح كيف تصلين إلى الرعاية الصحية المرخصة داخل المملكة عبر القنوات الرسمية لوزارة الصحة والهيئة العامة للغذاء والدواء. المحتوى توعوي فقط، لا يبيع أدوية ولا يقدم وصفات."
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
              هذا الموقع يقدم معلومات تعليمية عامة فقط عن صحة المرأة، بما في ذلك معلومات توعوية عن بعض الأدوية مثل
              سايتوتك وميزوبروستول كمادة دوائية ضمن إطار التثقيف الدوائي، دون تقديم جرعات أو طرق استخدام أو تعليمات لإنهاء
              الحمل أو طرق شراء أو بيع. أي قرار علاجي فردي يجب أن يتم عبر جهة صحية مرخصة يمكنها التقييم والمتابعة.
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
            هذا الموقع لا يبيع أدوية ولا يوسط للحصول عليها. أي ادعاء بوجود بيع باسمنا هو ادعاء كاذب.
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

      <ReferencesList ids={["sfda", "moh", "fdaLabel", "dailyMed", "medlinePlus"]} />
      <CareReferral />
      <ContactCta topic="سؤال عن الرعاية الصحية للمرأة في السعودية" />
    </div>
  );
}
