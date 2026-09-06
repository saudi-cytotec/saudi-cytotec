/**
 * Service areas - Repositioned as general Saudi women's health care access.
 * No city-specific doorway content. No keyword stuffing.
 * This file provides only general, non-commercial educational links about
 * accessing licensed care in Saudi Arabia.
 */

export interface ServiceCity {
  name: string;
  slug: string;
  articleSlug: string;
  keyword: string;
  blurb: string;
  accessNote: string;
}

export interface ServiceRegion {
  id: string;
  title: string;
  description: string;
  cities: ServiceCity[];
}

// No city-specific doorway regions - kept empty to prevent SEO stuffing
export const serviceRegions: ServiceRegion[] = [];

export const priorityCityLinks: ServiceCity[] = [];

/**
 * General educational guides about Saudi health system - not city doorway pages
 */
export const geoGuideLinks: { slug: string; label: string; note: string }[] = [
  {
    slug: "saudi-drug-regulation-context",
    label: "تنظيم الدواء في السعودية",
    note: "دور الهيئة العامة للغذاء والدواء ووزارة الصحة في تنظيم تداول الأدوية.",
  },
  {
    slug: "how-to-verify-medical-information",
    label: "كيف تتحققين من المعلومة الطبية",
    note: "منهج بسيط للتحقق من المصادر قبل اتخاذ أي قرار صحي.",
  },
  {
    slug: "when-symptoms-are-emergencies",
    label: "متى تكون الأعراض طارئة",
    note: "علامات تستدعي مراجعة عاجلة أو طوارئ دون تأخير.",
  },
];

export const serviceAreaLinks = [
  { to: "/womens-health", label: "صحة المرأة" },
  { to: "/early-pregnancy", label: "الحمل المبكر" },
  { to: "/safety", label: "الأمان الدوائي" },
  { to: "/when-to-see-doctor", label: "متى تراجعين الطبيب" },
  { to: "/what-is-cytotec", label: "ما هو سايتوتك؟ (توعوي)" },
  { to: "/misoprostol", label: "ميزوبروستول (توعوي)" },
  { to: "/medical-sources", label: "المصادر الطبية" },
  { to: "/faq", label: "الأسئلة الشائعة" },
];
