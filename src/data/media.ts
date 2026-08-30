/**
 * Media registry — the ONLY image assets the site may serve.
 *
 * Exactly three owner-approved assets exist. Nothing else may be added:
 *   - the approved logo
 *   - the approved homepage banner / hero
 *   - the approved permanent article WhatsApp banner
 *
 * Image upload is intentionally unavailable: adding new image assets would
 * violate the approved set, so there is no upload endpoint and no uploads
 * directory.
 */

export interface MediaItem {
  file: string;
  alt: string;
  width: number;
  height: number;
  role: string;
}

/**
 * The exact allowlist used by the image audit. Only these three files may
 * exist under public/ — no favicons, no generated article images, no
 * og-default, no uploads.
 */
export const APPROVED_IMAGE_FILES = [
  "/images/لوجو.png",
  "/images/Bannerrr.png",
  "/images/saudiersaa-article-whatsapp-banner.png.png",
] as const;


export const mediaLibrary: MediaItem[] = [
  {
    file: "/images/لوجو.png",
    alt: "شعار saudiersaa — مدونة سايتوتك التوعوية في السعودية",
    width: 1536,
    height: 1024,
    role: "الشعار المعتمد — الهيدر والفوتر",
  },
  {
    file: "/images/Bannerrr.png",
    alt: "بانر الصفحة الرئيسية المعتمد — معلومات طبية موثوقة عن صحة المرأة",
    width: 1536,
    height: 1024,
    role: "صورة البطل في الصفحة الرئيسية (LCP)",
  },
  {
    file: "/images/saudiersaa-article-whatsapp-banner.png.png",
    alt: "بانر واتساب المعتمد للمقالات — قناة معلومات عامة",
    width: 1717,
    height: 916,
    role: "بانر واتساب أعلى المقالات",
  },
];
