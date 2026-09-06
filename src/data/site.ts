import type { Cluster, NavItem } from "../types";

export const SITE = {
  name: "صحة المرأة السعودية - سعودي إرساء",
  nameEn: "Saudi Women's Health - Saudiersaa",
  domain: "https://saudiersaa.com",
  locale: "ar-SA",
  language: "ar",
  description:
    "منصة سعودية توعوية موثوقة لصحة المرأة: معلومات طبية مبسطة عن الحمل، الخصوبة، الدورة الشهرية، الصحة الإنجابية، سلامة الأدوية، والطوارئ النسائية. يتضمن المحتوى معلومات تعليمية عن سايتوتك وميزوبروستول كمادة دوائية ضمن إطار التوعية الدوائية فقط. المحتوى تعليمي ولا يغني عن الاستشارة الطبية.",
  email: "info@saudiersaa.com",
  updated: "2026-09-06",
};

export const DISCLAIMER_SHORT =
  "هذا المحتوى تعليمي عام، ولا يُعد استشارة طبية أو خطة علاج فردية، ولا يشجع على الحصول على أدوية خاضعة للتنظيم خارج القنوات النظامية. استشيري طبيباً مرخصاً في حالتك الخاصة.";

export const EMERGENCY_NOTE =
  "إذا ظهر نزيف شديد، إغماء، ألم بطني حاد، حمى مرتفعة، أو ضيق تنفس، اطلبي رعاية طبية طارئة فوراً.";

export const BRAND_NAME_EN = "saudiersaa";
export const BRAND_TAGLINE = "منصة سعودية موثوقة للتوعية بصحة المرأة";

export const mainNav: NavItem[] = [
  { to: "/", label: "الرئيسية" },
  { to: "/topics", label: "محاور المحتوى" },
  { to: "/blog", label: "المقالات" },
  { to: "/womens-health", label: "صحة المرأة" },
  { to: "/early-pregnancy", label: "الحمل المبكر" },
  { to: "/safety", label: "الأمان الدوائي" },
  { to: "/faq", label: "الأسئلة الشائعة" },
];

export const moreNav: NavItem[] = [
  { to: "/what-is-cytotec", label: "ما هو سايتوتك؟ (توعوي)" },
  { to: "/misoprostol", label: "ميزوبروستول (توعوي)" },
  { to: "/medical-uses", label: "الاستخدامات الطبية" },
  { to: "/side-effects", label: "الآثار الجانبية" },
  { to: "/when-to-see-doctor", label: "متى تراجعين الطبيب" },
  { to: "/medical-sources", label: "المصادر الطبية" },
  { to: "/service-areas", label: "الرعاية في السعودية" },
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
    title: "ما هو سايتوتك وميزوبروستول - معلومات توعوية",
    shortTitle: "التعريف الدوائي",
    description:
      "شرح تعليمي للمادة الفعالة والاسم التجاري، وآلية العمل، والأشكال الصيدلانية، وحدود المعلومات العامة ضمن إطار التوعية الدوائية.",
  },
  {
    id: "uses",
    slug: "alestekhdamat-altebbiya",
    title: "الاستخدامات الطبية في الإطار النظامي",
    shortTitle: "الاستخدامات",
    description:
      "الاستطبابات المعتمدة والاستخدامات السريرية تحت إشراف طبي، ومعنى الاستخدام خارج النشرة، ولماذا لا يُعامل الدواء كعلاج منزلي.",
  },
  {
    id: "safety",
    slug: "alaman-walthahdhirat",
    title: "الأمان الدوائي والتحذيرات",
    shortTitle: "الأمان",
    description:
      "تحذيرات الحمل، الإشراف الطبي، قراءة النشرة، التنظيم الدوائي السعودي، ومخاطر المصادر غير الموثوقة.",
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
      "مقالات عن الدورة الشهرية، تكيس المبايض، الخصوبة، ألم الحوض، فقر الدم، الفحوصات الدورية، والصحة النفسية المرتبطة بالصحة الإنجابية.",
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
      "موانع الاستخدام، الحساسية، اعتبارات القلب والكبد والكلى والرضاعة، وكيفية مناقشة التاريخ الدوائي مع الطبيب.",
  },
  {
    id: "emergency",
    slug: "mata-murajaa-altabeeb",
    title: "متى يجب مراجعة الطبيب والطوارئ",
    shortTitle: "الطوارئ",
    description:
      "علامات النزيف الخطير، الحمى، الألم الحاد، الإغماء، وما ينبغي ذكره في قسم الطوارئ، مع أرقام وزارة الصحة الرسمية.",
  },
  {
    id: "evidence",
    slug: "aladilla-walmasader",
    title: "الأدلة والمصادر والمعلومات الطبية الموثوقة",
    shortTitle: "المصادر",
    description:
      "كيف تُقيَّم الأدلة، النشرات الرسمية، هيئات التنظيم السعودية والدولية، وحدود الدراسات والقصص الشخصية.",
  },
];

export const cornerstonePaths = [
  "/womens-health",
  "/early-pregnancy",
  "/safety",
  "/what-is-cytotec",
  "/misoprostol",
  "/side-effects",
  "/when-to-see-doctor",
  "/medical-sources",
];
