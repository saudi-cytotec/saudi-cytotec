/// <reference types="vite/client" />
import mediaRegistry from "../../content/media.json";

/**
 * Media registry.
 * ---------------
 * Two distinct kinds of asset exist, and they must never be confused:
 *
 * 1. PERMANENT APPROVED ASSETS (3, immutable)
 *    The approved logo, the approved homepage banner and the permanent article
 *    WhatsApp banner. These belong to the site design. They are never an
 *    article's featured image, thumbnail or OG image by default.
 *
 * 2. UPLOADED MEDIA (content/media.json + public/media/*)
 *    Images an administrator explicitly uploaded through the CMS. They are
 *    committed to the repository, so they survive refresh, logout, deployment
 *    and redeploy, and are visible from any browser. They are only ever used
 *    where an administrator explicitly selected them.
 *
 * Nothing in this file assigns an image to anything automatically.
 */

export interface MediaItem {
  file: string;
  alt: string;
  width: number;
  height: number;
  role: string;
  /** True for admin uploads (deletable); false for the permanent assets. */
  uploaded?: boolean;
  uploadedAt?: string;
  bytes?: number;
}

/**
 * The permanent approved assets. These three files may never be deleted,
 * replaced or redrawn, and no other permanent asset may be added.
 */
export const APPROVED_IMAGE_FILES = [
  "/images/لوجو.png",
  "/images/Bannerrr.png",
  "/images/saudiersaa-article-whatsapp-banner.png.png",
  "/images/saudiersaa-social-share.png",
] as const;

export const approvedAssets: MediaItem[] = [
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
  {
    file: "/images/saudiersaa-social-share.png",
    alt: "سايتوتك في السعودية والميزوبروستول — معلومات طبية توعوية",
    width: 0,
    height: 0,
    role: "صورة مشاركة اجتماعية معتمدة — تُختار يدوياً فقط",
  },
];

interface RegistryRow {
  file?: unknown;
  alt?: unknown;
  width?: unknown;
  height?: unknown;
  uploadedAt?: unknown;
  bytes?: unknown;
}

function sanitizeUpload(row: RegistryRow): MediaItem | null {
  const file = typeof row.file === "string" ? row.file.trim() : "";
  // Uploads live under /media/ only — no traversal, no other prefix.
  if (!file.startsWith("/media/") || file.includes("..")) return null;
  return {
    file,
    alt: typeof row.alt === "string" ? row.alt : "",
    width: typeof row.width === "number" ? row.width : 0,
    height: typeof row.height === "number" ? row.height : 0,
    role: "صورة مرفوعة من لوحة التحكم",
    uploaded: true,
    uploadedAt: typeof row.uploadedAt === "string" ? row.uploadedAt : undefined,
    bytes: typeof row.bytes === "number" ? row.bytes : undefined,
  };
}

/** Admin-uploaded images committed to the repository. */
export const uploadedMedia: MediaItem[] = Array.isArray((mediaRegistry as { items?: unknown }).items)
  ? ((mediaRegistry as { items: RegistryRow[] }).items.map(sanitizeUpload).filter(Boolean) as MediaItem[])
  : [];

/**
 * Everything an editor may pick from: the permanent approved assets plus
 * whatever has actually been uploaded. Selecting is always explicit.
 */
export const mediaLibrary: MediaItem[] = [...approvedAssets, ...uploadedMedia];

/** Every path the renderer is allowed to resolve for an article image. */
export const selectableImagePaths: string[] = mediaLibrary.map((item) => item.file);
