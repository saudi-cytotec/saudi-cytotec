import type { ClusterId } from "../types";

export const MEDICATION_KEYWORDS = [
  "سايتوتك في السعودية",
  "حبوب سايتوتك في السعودية",
  "ميزوبروستول في السعودية",
  "ميفيبرستون في السعودية",
  "حبوب ميفيبرستون في السعودية",
] as const;

export const COUNTRY_MEDICATION_KEYWORDS = {
  saudi: ["سايتوتك في السعودية", "حبوب سايتوتك في السعودية", "ميزوبروستول في السعودية", "ميفيبرستون في السعودية", "حبوب ميفيبرستون في السعودية"],
  uae: ["حبوب إجهاض الحمل في الإمارات", "حبوب سايتوتك في الإمارات", "سايتوتك في الإمارات", "ميزوبروستول في الإمارات", "ميفيبرستون في الإمارات"],
  bahrain: ["حبوب إجهاض الحمل في البحرين", "حبوب سايتوتك في البحرين", "سايتوتك في البحرين", "ميزوبروستول في البحرين", "ميفيبرستون في البحرين"],
  kuwait: ["حبوب إجهاض الحمل في الكويت", "حبوب سايتوتك في الكويت", "سايتوتك في الكويت", "ميزوبروستول في الكويت", "ميفيبرستون في الكويت"],
  qatar: ["حبوب إجهاض الحمل في قطر", "حبوب سايتوتك في قطر", "سايتوتك في قطر", "ميزوبروستول في قطر", "ميفيبرستون في قطر"],
} as const;

export const SAUDI_PHARMACY_CHAINS = [
  "النهدي الطبية",
  "الدواء",
  "المتحدة للصيدليات",
] as const;

export const COUNTRY_PHARMACY_CHAINS = {
  saudi: SAUDI_PHARMACY_CHAINS,
  uae: ["LIFE Pharmacy", "BinSina Pharmacy", "Aster Pharmacy"],
  bahrain: ["Nasser Pharmacy", "صيدلية جعفر", "Bahrain Pharmacy"],
  kuwait: ["Al Mutawa Pharmacy", "Al-Hajery Pharmacy"],
  qatar: [],
} as const;

export const SAUDI_CITY_KEYWORDS = [
  "سايتوتك في الرياض",
  "سايتوتك في جدة",
  "سايتوتك في مكة",
  "سايتوتك في المدينة المنورة",
  "سايتوتك في الدمام",
  "سايتوتك في الخبر",
  "سايتوتك في أبها",
  "سايتوتك في تبوك",
  "سايتوتك في جازان",
  "سايتوتك في نجران",
  "سايتوتك في بريدة",
  "سايتوتك في الطائف",
] as const;

export const COUNTRY_KEYWORDS = {
  saudi: "حبوب إجهاض الحمل في السعودية",
  uae: "حبوب إجهاض الحمل في الإمارات",
  kuwait: "حبوب إجهاض الحمل في الكويت",
  bahrain: "حبوب إجهاض الحمل في البحرين",
  qatar: "حبوب إجهاض الحمل في قطر",
} as const;

export const STATIC_KEYWORD_MAP = {
  "/": {
    primary: "حبوب إجهاض الحمل في السعودية",
    cities: SAUDI_CITY_KEYWORDS,
    countries: ["السعودية"],
    links: ["/what-is-cytotec", "/misoprostol", "/abortion-pills-saudi-arabia", "/service-areas", "/faq"],
  },
  "/what-is-cytotec": {
    primary: "ما هو سايتوتك",
    cities: [],
    countries: ["السعودية"],
    links: ["/misoprostol", "/medical-uses", "/safety", "/medical-sources"],
  },
  "/misoprostol": {
    primary: "ميزوبروستول",
    cities: [],
    countries: ["السعودية"],
    links: ["/what-is-cytotec", "/medical-uses", "/safety", "/side-effects"],
  },
  "/medical-uses": {
    primary: "استخدامات ميزوبروستول الطبية",
    cities: [],
    countries: ["السعودية"],
    links: ["/what-is-cytotec", "/misoprostol", "/safety", "/medical-sources"],
  },
  "/safety": {
    primary: "أمان سايتوتك وميزوبروستول",
    cities: [],
    countries: ["السعودية"],
    links: ["/what-is-cytotec", "/side-effects", "/when-to-see-doctor", "/medical-disclaimer"],
  },
  "/side-effects": {
    primary: "الآثار الجانبية لسايتوتك وميزوبروستول",
    cities: [],
    countries: ["السعودية"],
    links: ["/safety", "/when-to-see-doctor", "/early-pregnancy"],
  },
  "/when-to-see-doctor": {
    primary: "متى أراجع الطبيب بعد أعراض مرتبطة بسايتوتك",
    cities: [],
    countries: ["السعودية"],
    links: ["/side-effects", "/early-pregnancy", "/medical-disclaimer", "/contact"],
  },
  "/faq": {
    primary: "الأسئلة الشائعة عن سايتوتك وميزوبروستول",
    cities: [],
    countries: ["السعودية"],
    links: ["/what-is-cytotec", "/safety", "/side-effects", "/medical-disclaimer"],
  },
  "/womens-health": {
    primary: "صحة المرأة السعودية",
    cities: [],
    countries: ["السعودية"],
    links: ["/early-pregnancy", "/when-to-see-doctor", "/medical-sources", "/blog"],
  },
  "/early-pregnancy": {
    primary: "الحمل المبكر",
    cities: [],
    countries: ["السعودية"],
    links: ["/womens-health", "/safety", "/when-to-see-doctor"],
  },
  "/medical-sources": {
    primary: "المصادر الطبية الموثوقة",
    cities: [],
    countries: ["السعودية"],
    links: ["/about", "/medical-disclaimer", "/blog/fda-cytotec-warnings", "/blog/official-drug-leaflets"],
  },
  "/about": {
    primary: "من نحن | صحة المرأة السعودية",
    cities: [],
    countries: ["السعودية"],
    links: ["/medical-sources", "/medical-disclaimer", "/contact"],
  },
  "/privacy": { primary: "سياسة الخصوصية", cities: [], countries: ["السعودية"], links: ["/contact", "/about"] },
  "/medical-disclaimer": {
    primary: "إخلاء المسؤولية الطبية",
    cities: [],
    countries: ["السعودية"],
    links: ["/safety", "/medical-sources", "/when-to-see-doctor"],
  },
  "/abortion-pills-saudi-arabia": {
    primary: "حبوب إجهاض الحمل في السعودية",
    cities: SAUDI_CITY_KEYWORDS,
    countries: ["السعودية"],
    links: ["/", "/service-areas", "/safety", "/medical-uses", "/medical-disclaimer", "/faq"],
  },
  "/abortion-pills-uae": {
    primary: "حبوب إجهاض الحمل في الإمارات",
    cities: [],
    countries: ["الإمارات"],
    links: ["/", "/what-is-cytotec", "/medical-sources", "/medical-disclaimer"],
  },
  "/abortion-pills-kuwait": {
    primary: "حبوب إجهاض الحمل في الكويت",
    cities: [],
    countries: ["الكويت"],
    links: ["/", "/what-is-cytotec", "/medical-sources", "/medical-disclaimer"],
  },
  "/abortion-pills-qatar": {
    primary: "حبوب إجهاض الحمل في قطر",
    cities: [],
    countries: ["قطر"],
    links: ["/", "/what-is-cytotec", "/medical-sources", "/medical-disclaimer"],
  },
  "/abortion-pills-bahrain": {
    primary: "حبوب إجهاض الحمل في البحرين",
    cities: [],
    countries: ["البحرين"],
    links: ["/", "/what-is-cytotec", "/medical-sources", "/medical-disclaimer"],
  },
  "/topics": { primary: "مواضيع سايتوتك وصحة المرأة", cities: [], countries: ["السعودية"], links: ["/", "/blog", "/womens-health", "/faq"] },
  "/service-areas": {
    primary: "حبوب إجهاض الحمل في السعودية | سايتوتك وميزوبروستول",
    cities: SAUDI_CITY_KEYWORDS,
    countries: ["السعودية"],
    links: ["/abortion-pills-saudi-arabia", "/safety", "/medical-sources", "/contact"],
  },
  "/contact": { primary: "التواصل التحريري | صحة المرأة السعودية", cities: [], countries: ["السعودية"], links: ["/about", "/medical-disclaimer", "/privacy"] },
  "/sitemap": { primary: "خريطة موقع سايتوتك في السعودية", cities: [], countries: ["السعودية"], links: ["/", "/topics", "/blog"] },
  "/blog": { primary: "مدونة سايتوتك وصحة المرأة", cities: [], countries: ["السعودية"], links: ["/topics", "/what-is-cytotec", "/safety", "/womens-health"] },
} as const;

const CLUSTER_LINKS: Record<ClusterId, string[]> = {
  definition: ["/what-is-cytotec", "/misoprostol", "/medical-sources"],
  uses: ["/medical-uses", "/safety", "/what-is-cytotec"],
  safety: ["/safety", "/medical-disclaimer", "/when-to-see-doctor"],
  "side-effects": ["/side-effects", "/when-to-see-doctor", "/safety"],
  pregnancy: ["/early-pregnancy", "/womens-health", "/safety"],
  "womens-health": ["/womens-health", "/early-pregnancy", "/when-to-see-doctor"],
  faq: ["/faq", "/what-is-cytotec", "/medical-disclaimer"],
  interactions: ["/safety", "/medical-uses", "/when-to-see-doctor"],
  emergency: ["/when-to-see-doctor", "/side-effects", "/contact"],
  evidence: ["/medical-sources", "/medical-disclaimer", "/about"],
  geographic: ["/abortion-pills-saudi-arabia", "/abortion-pills-uae", "/abortion-pills-kuwait", "/abortion-pills-bahrain"],
};

export function articleKeywordPlan(
  slug: string,
  title: string,
  cluster: ClusterId,
  related: string[],
) {
  const primary = title.replace(/[:؟]/g, "").trim();
  const clusterLinks = CLUSTER_LINKS[cluster] ?? [];
  const relatedLinks = related.slice(0, 3).map((item) => `/blog/${item}`);
  return {
    slug,
    primary,
    cities: cluster === "geographic" ? SAUDI_CITY_KEYWORDS : [],
    countries: ["السعودية"],
    internalLinks: [...new Set([...clusterLinks, ...relatedLinks])].slice(0, 8),
  };
}
