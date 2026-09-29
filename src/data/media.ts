/// <reference types="vite/client" />
import mediaRegistry from "../../content/media.json";

/**
 * Media registry - repositioned.
 * Permanent approved assets: logo, homepage banner, social-share, and the two approved site-wide banners.
 * No legacy or auto-assigned article images are permitted.
 * No private WhatsApp funnel.
 */

export interface MediaItem {
  file: string;
  alt: string;
  width: number;
  height: number;
  role: string;
  uploaded?: boolean;
  uploadedAt?: string;
  bytes?: number;
}

export const APPROVED_IMAGE_FILES = [
  "/images/logo.png",
  "/images/Bannerrr.png",
  "/images/saudiersaa-social-share.png",
  "/images/site-medical-banner.png",
  "/images/site-consultation-banner.png",
] as const;

export const GLOBAL_SOCIAL_SHARE_IMAGE = "/images/saudiersaa-social-share.png" as const;

export const approvedAssets: MediaItem[] = [
  {
    file: "/images/logo.png",
    alt: "شعار سعودي إرساء — صحة المرأة السعودية",
    width: 1536,
    height: 1024,
    role: "الشعار المعتمد — الهيدر والفوتر",
  },
  {
    file: "/images/Bannerrr.png",
    alt: "بانر الصفحة الرئيسية السابق — معلومات طبية موثوقة عن صحة المرأة",
    width: 1536,
    height: 1024,
    role: "أصل بصري معتمد محفوظ للتوافق",
  },
  {
    file: "/images/saudiersaa-social-share.png",
    alt: "صحة المرأة السعودية — معلومات طبية توعوية",
    width: 0,
    height: 0,
    role: "صورة مشاركة اجتماعية معتمدة — fallback للـOG/Twitter metadata فقط",
  },
  {
    file: "/images/site-medical-banner.png",
    alt: "بانر طبي توعوي عن سايتوتك وصحة المرأة السعودية",
    width: 0,
    height: 0,
    role: "بانر طبي معتمد للموقع",
  },
  {
    file: "/images/site-consultation-banner.png",
    alt: "بانر استشارة سايتوتك ومعلومات صحة المرأة السعودية",
    width: 0,
    height: 0,
    role: "بانر تواصل معتمد للموقع",
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

export const uploadedMedia: MediaItem[] = Array.isArray((mediaRegistry as { items?: unknown }).items)
  ? ((mediaRegistry as { items: RegistryRow[] }).items.map(sanitizeUpload).filter(Boolean) as MediaItem[])
  : [];

export const mediaLibrary: MediaItem[] = [...approvedAssets, ...uploadedMedia];

export const selectableImagePaths: string[] = mediaLibrary.map((item) => item.file);
