/**
 * Homepage content model.
 *
 * Positioning: Saudiersaa is a Saudi pharmaceutical/pharmacy platform for
 * women's health — the homepage must read as a commercial service page (drug
 * information + regulated dispensing guidance + contact), not as an
 * educational-only blog.
 *
 * Honesty rules that this file must keep obeying:
 *   - no invented prices, stock, availability, delivery, branches, licences,
 *     ratings, reviews, physicians or medical reviewers,
 *   - no dosing, no home protocols, no abortion instructions, no purchase
 *     routes, no private contact numbers or WhatsApp sales channels,
 *   - no fabricated "24/7" or "nationwide delivery" claims: the only contact
 *     capability that exists in this project is the /contact page,
 *   - no city keyword stuffing. Coverage is explained once and linked to
 *     /service-areas.
 *
 * Every `to` value must resolve to a route that really exists; this is checked
 * by `scripts/auditIndexability.mjs` and `npm run verify`.
 */

export const HOME_SEO = {
  /** Rendered <title> and og:title — the approved homepage title. */
  title: "سايتوتك في السعودية | صحة المرأة السعودية",
  /** Visible <h1> — identical to the title by editorial decision. */
  h1: "سايتوتك في السعودية | صحة المرأة السعودية",
  /** Meta description: one natural mention of each core term. */
  description:
    "دليل دوائي عن سايتوتك في السعودية: ما هو سايتوتك وميزوبروستول، الوصفة الطبية والإشراف، الأمان الدوائي، ومسار الصرف النظامي، مع معلومات موثوقة عن صحة المرأة.",
} as const;

export interface HomeLink {
  to: string;
  label: string;
}

/** Short factual bullets under the "سايتوتك في السعودية" section. */
export const HOME_QUICK_FACTS: string[] = [
  "سايتوتك اسم تجاري، والمادة الفعالة فيه هي ميزوبروستول (Misoprostol)، وهو نظير صناعي للبروستاغلاندين E1.",
  "دواء خاضع للتنظيم الدوائي في المملكة، ويُصرف بوصفة طبية وبإشراف طبي، لا بقرار ذاتي.",
  "النشرات التنظيمية تحمل تحذيراً بارزاً بشأن الحمل، وهذا التحذير جزء من هوية الدواء لا معلومة هامشية.",
  "الصرف يتم عبر الصيدليات المرخّصة وفق أنظمة الهيئة العامة للغذاء والدواء ووزارة الصحة.",
];

/** The paragraphs of the "سايتوتك في السعودية" section (kept short on purpose). */
export const HOME_CYTOTEC_INTRO: string[] = [
  "سايتوتك (Cytotec) هو الاسم التجاري لدواء مادته الفعالة ميزوبروستول. عُرف في الأصل باستطباب يتعلق بحماية المعدة لدى فئات محددة من المرضى، وتُناقش له استخدامات أخرى داخل الأنظمة الصحية تحت إشراف مختصين وضمن بروتوكولات مؤسسية.",
  "ما يهم القارئة في السعودية قبل أي خطوة: أن الدواء لا يُصرف جزافاً، وأن الوصفة الطبية هي الأداة التي تربط الدواء بحالة مفحوصة وموانع مستبعدة ومتابعة واضحة. لذلك نبني هذا الموقع حول المعلومات الدوائية الموثوقة ومسار الصرف النظامي، لا حول وعود تجارية.",
];

export interface HomeService {
  /** Presentation key (icon + hue resolved in the page component). */
  key: "information" | "prescription" | "dispensing" | "safety" | "contact";
  title: string;
  text: string;
  to: string;
  label: string;
}

/**
 * Services the site can honestly claim today: verified drug information, the
 * prescription/supervision pathway, the regulated dispensing route, safety and
 * emergency guidance, and the contact channel. Nothing here promises stock,
 * price, delivery or a physical branch, because the project holds no such data.
 */
export const HOME_SERVICES: HomeService[] = [
  {
    key: "information",
    title: "معلومات دوائية موثّقة",
    text: "شرح للمادة الفعالة والاستطبابات المعتمدة والتحذيرات، مستند إلى النشرات التنظيمية الرسمية.",
    to: "/medical-sources",
    label: "منهج المصادر",
  },
  {
    key: "prescription",
    title: "التزام بالوصفة الطبية",
    text: "توضيح لشروط الاستخدام والإشراف الطبي، ولماذا تُقيَّم الموانع والتداخلات قبل أي صرف.",
    to: "/safety",
    label: "شروط الأمان",
  },
  {
    key: "dispensing",
    title: "مسار الصرف النظامي",
    text: "الأدوية الخاضعة للتنظيم تُصرف من الصيدليات المرخّصة، وتوضع هنا القنوات الرسمية للوصول إلى الرعاية.",
    to: "/service-areas",
    label: "الرعاية في السعودية",
  },
  {
    key: "safety",
    title: "تحذيرات وعلامات طارئة",
    text: "تفريق واضح بين أثر جانبي محتمل وبين علامة تستدعي مراجعة عاجلة أو طوارئ فوراً.",
    to: "/when-to-see-doctor",
    label: "علامات تستدعي الطبيب",
  },
  {
    key: "contact",
    title: "قناة تواصل للاستفسارات",
    text: "استفسارات عن المعلومات الدوائية والخدمات وملاحظات تصحيح المصادر عبر صفحة الاتصال.",
    to: "/contact",
    label: "تواصل معنا",
  },
];

/** Support pages around the product itself (short links, not long articles). */
export const HOME_SUPPORT_PAGES: { to: string; label: string; note: string }[] = [
  { to: "/what-is-cytotec", label: "ما هو سايتوتك؟", note: "تعريف الاسم التجاري وحدود دوره." },
  { to: "/misoprostol", label: "ميزوبروستول", note: "المادة الفعالة والتصنيف الدوائي." },
  { to: "/medical-uses", label: "الاستخدامات الطبية", note: "ما يُقرَّر تحت إشراف طبي فقط." },
  { to: "/safety", label: "الأمان والتحذيرات", note: "التحذيرات والتنظيم وسلسلة الصرف." },
  { to: "/side-effects", label: "الآثار الجانبية", note: "الشائع مقابل العلامة التي لا تنتظر." },
];

/** Why Saudiersaa — only claims backed by something already in the project. */
export const HOME_VALUE: { title: string; text: string; to: string; label: string }[] = [
  {
    title: "معلومات دوائية قابلة للتحقق",
    text: "كل صفحة تُدرج مراجعها من نشرات وهيئات تنظيمية رسمية، بلا اختلاق دراسات أو نسب.",
    to: "/medical-sources",
    label: "المصادر الطبية",
  },
  {
    title: "تعامل منضبط مع الأدوية الخاضعة للتنظيم",
    text: "الوصفة والإشراف الطبي شرط، ولا ننشر جرعات ولا طرق استخدام ولا تعليمات منزلية.",
    to: "/medical-uses",
    label: "الاستخدامات الطبية",
  },
  {
    title: "وضوح في المخاطر",
    text: "التحذيرات والعلامات الطارئة مذكورة في مكان بارز، مع أرقام القنوات الرسمية.",
    to: "/safety",
    label: "الأمان الدوائي",
  },
  {
    title: "تغطية وطنية بمسار نظامي",
    text: "المعلومة الدوائية موحّدة في كل مناطق المملكة؛ ما يختلف هو مسار الوصول للرعاية، وقد جمعناه في صفحة واحدة.",
    to: "/service-areas",
    label: "مناطق الخدمة",
  },
  {
    title: "قناة تواصل واضحة",
    text: "للاستفسارات عن المحتوى الدوائي أو الخدمات أو تصحيح مصدر، عبر صفحة الاتصال.",
    to: "/contact",
    label: "تواصل معنا",
  },
];

export interface HomeFaq {
  q: string;
  a: string;
  links: HomeLink[];
}

/** FAQ serving both commercial and medical intent, without dosing content. */
export const HOME_FAQS: HomeFaq[] = [
  {
    q: "ما هو سايتوتك؟",
    a: "سايتوتك اسم تجاري لدواء مادته الفعالة ميزوبروستول. تُحدد طبيعة استخدامه بحسب الاستطباب المعتمد في النشرة، والحالة الصحية الفردية، وتقييم الطبيب للموانع والتداخلات.",
    links: [
      { to: "/what-is-cytotec", label: "ما هو سايتوتك؟" },
      { to: "/medical-uses", label: "الاستخدامات الطبية" },
    ],
  },
  {
    q: "ما هي المادة الفعالة؟",
    a: "المادة الفعالة هي ميزوبروستول، وهي نظير صناعي للبروستاغلاندين E1 يحاكي بعض تأثيراته، ولهذا تظهر له تأثيرات على المعدة وعلى الرحم تُفسَّر طبقاً للسياق الطبي.",
    links: [{ to: "/misoprostol", label: "ميزوبروستول" }],
  },
  {
    q: "هل يحتاج سايتوتك إلى وصفة طبية؟",
    a: "نعم. الدواء خاضع للتنظيم الدوائي في المملكة، ويُصرف بوصفة طبية عبر الصيدليات المرخّصة. الوصفة ليست إجراءً شكلياً؛ هي توثيق لتقييم الموانع واحتمال الحمل والتداخلات والمتابعة.",
    links: [
      { to: "/safety", label: "الأمان والتحذيرات" },
      { to: "/service-areas", label: "مسار الصرف والرعاية" },
    ],
  },
  {
    q: "كيف أعرف المعلومات الدوائية الصحيحة؟",
    a: "ابدئي من النشرة الرسمية والجهات التنظيمية مثل الهيئة العامة للغذاء والدواء ووزارة الصحة، ومن مراجع تنظيمية دولية مثل FDA وWHO وMedlinePlus. نرفض أي محتوى يبيع دواءً أو يعرض جرعات أو يطلب تواصلاً خاصاً.",
    links: [
      { to: "/medical-sources", label: "منهج المصادر" },
      { to: "/blog/how-to-verify-medical-information", label: "كيف تتحققين من المعلومة؟" },
    ],
  },
  {
    q: "أين أجد معلومات الأمان والعلامات الطارئة؟",
    a: "تحذير الحمل والموانع والتداخلات في صفحة الأمان، والآثار الجانبية في صفحتها، والعلامات التي تستدعي عيادة أو طوارئ في صفحة مخصصة مع أرقام القنوات الرسمية.",
    links: [
      { to: "/safety", label: "الأمان الدوائي" },
      { to: "/side-effects", label: "الآثار الجانبية" },
      { to: "/when-to-see-doctor", label: "متى تراجعين الطبيب" },
    ],
  },
  {
    q: "كيف أتواصل مع الخدمة؟",
    a: "عبر صفحة الاتصال، للاستفسارات عن المعلومات الدوائية والخدمات، أو لتصحيح مصدر. لا يمكن إصدار وصفة أو تحديد جرعة أو تشخيص حالة فردية عبر الموقع، والحالات العاجلة مسارها الطوارئ.",
    links: [{ to: "/contact", label: "تواصل معنا" }],
  },
];

/** Internal-link hub: the cornerstone pages of the site (crawl + authority flow). */
export const HOME_CORE_PAGES: { to: string; label: string }[] = [
  { to: "/what-is-cytotec", label: "ما هو سايتوتك؟" },
  { to: "/misoprostol", label: "ميزوبروستول" },
  { to: "/medical-uses", label: "الاستخدامات الطبية" },
  { to: "/safety", label: "الأمان الدوائي" },
  { to: "/side-effects", label: "الآثار الجانبية" },
  { to: "/when-to-see-doctor", label: "متى تراجعين الطبيب" },
  { to: "/womens-health", label: "صحة المرأة" },
  { to: "/early-pregnancy", label: "الحمل المبكر" },
  { to: "/medical-sources", label: "المصادر الطبية" },
  { to: "/faq", label: "الأسئلة الشائعة" },
  { to: "/topics", label: "محاور المحتوى" },
  { to: "/service-areas", label: "الرعاية في السعودية" },
  { to: "/blog", label: "المقالات" },
];

/**
 * Curated starting points. Slugs are matched against the live catalog; missing
 * entries are skipped and the first catalog rows are used as a fallback.
 */
export const HOME_FEATURED_SLUGS = [
  "cytotec-definition",
  "pregnancy-boxed-warning",
  "is-cytotec-safe-for-everyone",
] as const;

/** Reference ids rendered on the homepage (verified registrations only). */
export const HOME_REFERENCE_IDS = ["fdaLabel", "dailyMed", "whoEml", "sfda", "moh"] as const;
