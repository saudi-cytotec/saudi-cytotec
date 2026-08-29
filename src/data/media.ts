/**
 * Media registry — every committed image the site serves, with the metadata
 * the Media screen and the article editor need (alt text, dimensions, role).
 * Uploads via /api/upload-image land in /images/uploads/ and appear in the
 * Media screen as "uploaded" entries.
 */

export interface MediaItem {
  file: string;
  alt: string;
  width: number;
  height: number;
  role: string;
  uploaded?: boolean;
}

export const mediaLibrary: MediaItem[] = [
  {
    file: "/images/logo.png",
    alt: "شعار منصة سعودي إرساء",
    width: 512,
    height: 512,
    role: "الشعار — أيقونة الموقع وأيقونة أبل",
  },
  {
    file: "/images/hero-doctor.jpg",
    alt: "طبيبة سعودية بحجاب في عيادة صحة المرأة",
    width: 1200,
    height: 900,
    role: "صورة البطل في الصفحة الرئيسية (LCP)",
  },
  {
    file: "/images/og-default.jpg",
    alt: "صورة مشاركة افتراضية لمنصة سعودي إرساء",
    width: 1200,
    height: 675,
    role: "صورة Open Graph الافتراضية للمقالات والصفحات",
  },
  {
    file: "/images/article-mark.svg",
    alt: "",
    width: 0,
    height: 0,
    role: "علامة تصميم موحّدة للمقالات",
  },
  {
    file: "/images/emergency.jpg",
    alt: "سياق الطوارئ الطبية",
    width: 1200,
    height: 900,
    role: "صورة سياقية — الطوارئ",
  },
  {
    file: "/images/hero.jpg",
    alt: "بانر توعوي عام",
    width: 1200,
    height: 675,
    role: "بانر عام احتياطي",
  },
  {
    file: "/images/safety.jpg",
    alt: "سلامة الأدوية",
    width: 900,
    height: 1200,
    role: "صورة سياقية — الأمان الدوائي",
  },
  {
    file: "/images/sources.jpg",
    alt: "المصادر الطبية",
    width: 900,
    height: 1200,
    role: "صورة سياقية — المصادر",
  },
  {
    file: "/images/whatsapp-consult.jpg",
    alt: "استشارة تعليمية عامة",
    width: 1024,
    height: 1024,
    role: "صورة سياقية للاستشارة التعليمية",
  },
  {
    file: "/images/womens-health.jpg",
    alt: "صحة المرأة",
    width: 900,
    height: 1200,
    role: "صورة سياقية — صحة المرأة",
  },
];
