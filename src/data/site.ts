import type { Cluster, NavItem } from "../types";

export const SITE = {
  name: "سايتوتك في السعودية",
  nameEn: "Cytotec in Saudi Arabia",
  domain: "https://saudiersaa.com",
  locale: "ar-SA",
  language: "ar",
  description:
    "موقع تعليمي عربي يقدم معلومات عامة عن سايتوتك (ميزوبروستول)، الاستخدامات الطبية، تحذيرات الأمان، الآثار الجانبية، ومتى تجب مراجعة الطبيب. المحتوى تعليمي ولا يغني عن الاستشارة الطبية.",
  email: "info@saudiersaa.com",
  updated: "2026-03-20",
};

export const DISCLAIMER_SHORT =
  "هذا المحتوى تعليمي عام، ولا يُعد استشارة طبية أو خطة علاج فردية، ولا يشجع على الحصول على أدوية خاضعة للتنظيم خارج القنوات النظامية. استشيري طبيباً مرخصاً في حالتك الخاصة.";

export const EMERGENCY_NOTE =
  "إذا ظهر نزيف شديد، إغماء، ألم بطني حاد، حمى مرتفعة، أو ضيق تنفس، اطلبي رعاية طبية طارئة فوراً.";

export const BRAND_NAME_EN = "saudiersaa";
export const BRAND_TAGLINE = "مدونة سايتوتك التوعوية في السعودية";

export const mainNav: NavItem[] = [
  { to: "/", label: "الرئيسية" },
  { to: "/topics", label: "محاور المحتوى" },
  { to: "/blog", label: "المقالات" },
  { to: "/what-is-cytotec", label: "ما هو سايتوتك؟" },
  { to: "/safety", label: "الأمان" },
  { to: "/early-pregnancy", label: "الحمل المبكر" },
  { to: "/faq", label: "الأسئلة الشائعة" },
  { to: "/service-areas", label: "المناطق" },
];

export const moreNav: NavItem[] = [
  { to: "/medical-uses", label: "الاستخدامات الطبية" },
  { to: "/side-effects", label: "الآثار الجانبية" },
  { to: "/when-to-see-doctor", label: "متى تراجعين الطبيب" },
  { to: "/misoprostol", label: "ميزوبروستول" },
  { to: "/womens-health", label: "صحة المرأة" },
  { to: "/medical-sources", label: "المصادر الطبية" },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "اتصل بنا" },
  { to: "/medical-disclaimer", label: "إخلاء المسؤولية" },
  { to: "/privacy", label: "الخصوصية" },
  { to: "/sitemap", label: "خريطة الموقع" },
];

export const clusters: Cluster[] = [
  {
    id: "definition",
    slug: "ma-huwa-saytotek",
    title: "ما هو سايتوتك وميزوبروستول",
    shortTitle: "التعريف",
    description:
      "شرح تعليمي للمادة الفعالة والاسم التجاري، وآلية العمل، والأشكال الصيدلانية، وحدود المعلومات العامة.",
  },
  {
    id: "uses",
    slug: "alestekhdamat-altebbiya",
    title: "الاستخدامات الطبية",
    shortTitle: "الاستخدامات",
    description:
      "الاستطبابات المعتمدة والاستخدامات السريرية تحت إشراف طبي، ومعنى الاستخدام خارج النشرة، ولماذا لا يُعامل الدواء كعلاج منزلي.",
  },
  {
    id: "safety",
    slug: "alaman-walthahdhirat",
    title: "الأمان والتحذيرات",
    shortTitle: "الأمان",
    description:
      "تحذيرات الحمل، الإشراف الطبي، قراءة النشرة، التنظيم الدوائي، ومخاطر المصادر غير الموثوقة.",
  },
  {
    id: "side-effects",
    slug: "alathar-aljanibiyya",
    title: "الآثار الجانبية والمضاعفات",
    shortTitle: "الآثار الجانبية",
    description:
      "الآثار الشائعة والنادرة، النزيف، الحمى، أعراض الجهاز الهضمي، ومتى تتحول الأعراض إلى حالة طارئة.",
  },
  {
    id: "pregnancy",
    slug: "alhaml-walsehha-alenjabiyya",
    title: "الحمل والصحة الإنجابية",
    shortTitle: "الحمل",
    description:
      "معلومات تعليمية عن الحمل المبكر، متابعة الحمل، النزيف، والأدوية، مع التأكيد أن العلاج فردي لدى الطبيب.",
  },
  {
    id: "womens-health",
    slug: "sehhat-almarah",
    title: "صحة المرأة",
    shortTitle: "صحة المرأة",
    description:
      "مقالات عن الدورة، ألم الحوض، فقر الدم، الفحوصات الدورية، والصحة النفسية المرتبطة بالصحة الإنجابية.",
  },
  {
    id: "faq",
    slug: "alasila-alshaea",
    title: "الأسئلة الشائعة والمفاهيم الخاطئة",
    shortTitle: "الأسئلة الشائعة",
    description:
      "تصحيح المفاهيم الشائعة، وحدود الإنترنت، والفرق بين الاسم التجاري والمادة الفعالة، وطرق التحقق من المعلومة.",
  },
  {
    id: "interactions",
    slug: "altadakholat-wamawane",
    title: "التداخلات الدوائية وموانع الاستخدام",
    shortTitle: "الموانع",
    description:
      "موانع الاستخدام، الحساسية، اعتبارات القلب والكبد والكلى والرضاعة، وكيفية مناقشة التاريخ الدوائي.",
  },
  {
    id: "emergency",
    slug: "mata-murajaa-altabeeb",
    title: "متى يجب مراجعة الطبيب والطوارئ",
    shortTitle: "الطوارئ",
    description:
      "علامات النزيف الخطير، الحمى، الألم الحاد، الإغماء، وما ينبغي ذكره في قسم الطوارئ.",
  },
  {
    id: "evidence",
    slug: "aladilla-walmasader",
    title: "الأدلة والمصادر والمعلومات الطبية المتقدمة",
    shortTitle: "المصادر",
    description:
      "كيف تُقيَّم الأدلة، النشرات الرسمية، هيئات التنظيم، وحدود الدراسات والقصص الشخصية.",
  },
];

export const cornerstonePaths = [
  "/what-is-cytotec",
  "/misoprostol",
  "/medical-uses",
  "/safety",
  "/side-effects",
  "/when-to-see-doctor",
  "/medical-sources",
];
