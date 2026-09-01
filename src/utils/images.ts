/**
 * Site-wide image policy.
 * -----------------------
 * Rule: an article renders EXACTLY the image the administrator selected, and
 * NOTHING when nothing was selected.
 *
 *   - no default image
 *   - no article-image fallback (featured, thumbnail or banner)
 *   - the global social-share image is permitted only as metadata fallback
 *   - no cluster / category image
 *   - no random image
 *   - no generated (AI) image
 *   - no automatic article-image assignment of any kind
 *
 * Absence of an article image is a fully valid, first-class state: the article
 * renders with no article-specific figure and the card stays text-only. SEO
 * metadata may still use the approved global social-share fallback.
 *
 * Permanent, design-level assets (the approved logo, the approved homepage
 * banner, the permanent article WhatsApp banner) are NOT article images: they
 * belong to the layout and are rendered independently of this policy.
 */

import { GLOBAL_SOCIAL_SHARE_IMAGE } from "../data/media";

/**
 * Paths the CMS is allowed to persist as an article image.
 *
 * Two sources are permitted for explicit article fields: an image uploaded
 * through the CMS (committed under /media/), or one of the permanent approved
 * assets passed in by the caller. The global social-share image is additionally
 * used by the SEO component as metadata fallback, never as an article field.
 *
 * Every legacy asset was deleted and must never be resolved or recreated.
 * Rather than listing those filenames here (which would reintroduce them as
 * string references), the rule is expressed as an allowlist: anything that is
 * not an upload and not an approved asset resolves to "no image". That covers
 * every deleted legacy file, and every future equivalent under a new name.
 */
const UPLOAD_PREFIX = "/media/";

/**
 * Normalise an image value coming from anywhere (CMS state, committed JSON,
 * localStorage overlay). Returns "" when there is no usable, permitted image.
 *
 * Anything outside the allowlist — including every deleted legacy asset and
 * any stale value left in a browser from an older build — resolves to
 * "no image", and is NEVER replaced by a substitute.
 */
export function resolveImage(value: unknown, approved: readonly string[] = []): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  // Never allow protocol-relative / absolute external URLs or traversal.
  if (/^(https?:)?\/\//i.test(trimmed)) return "";
  if (trimmed.includes("..")) return "";
  if (!trimmed.startsWith("/")) return "";
  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return "";
  }
  if (decoded.startsWith(UPLOAD_PREFIX)) return trimmed;
  if (approved.includes(decoded) || approved.includes(trimmed)) return trimmed;
  return "";
}

/** True when the path points at an admin-uploaded media file. */
export function isUploadedMedia(value: string): boolean {
  return typeof value === "string" && value.startsWith(UPLOAD_PREFIX) && !value.includes("..");
}

export interface ArticleImageFields {
  image?: string;
  imageAlt?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  bannerImage?: string;
  bannerImageAlt?: string;
  ogImage?: string;
}

/**
 * Sanitise the image fields of an article without ever inventing a value.
 * Alt text is preserved verbatim (the admin's exact words) but dropped when
 * its image is absent, so no orphan alt survives.
 */
export function sanitizeArticleImages<T extends ArticleImageFields>(
  article: T,
  approved: readonly string[] = [],
): T {
  const image = resolveImage(article.image, approved);
  const thumbnail = resolveImage(article.thumbnail, approved);
  const bannerImage = resolveImage(article.bannerImage, approved);
  const ogImage = resolveImage(article.ogImage, approved);
  return {
    ...article,
    image,
    imageAlt: image ? (article.imageAlt ?? "") : "",
    thumbnail,
    thumbnailAlt: thumbnail ? (article.thumbnailAlt ?? "") : "",
    bannerImage,
    bannerImageAlt: bannerImage ? (article.bannerImageAlt ?? "") : "",
    ogImage,
  };
}

/**
 * The image used for social metadata. A custom OG image has priority; when
 * none is selected, the caller may use the approved global metadata fallback.
 * Featured, thumbnail and banner fields are never consulted here.
 */
export function socialImage(
  article: ArticleImageFields,
  approved: readonly string[] = [],
  globalFallback = GLOBAL_SOCIAL_SHARE_IMAGE,
): string {
  return resolveImage(article.ogImage, approved) || globalFallback;
}
