/**
 * Site-wide image policy.
 * -----------------------
 * Rule: an article renders EXACTLY the image the administrator selected, and
 * NOTHING when nothing was selected.
 *
 *   - no default image
 *   - no fallback image
 *   - no cluster / category image
 *   - no random image
 *   - no generated (AI) image
 *   - no automatic assignment of any kind
 *
 * Absence of an image is a fully valid, first-class state: the article renders
 * with no article-specific figure, the card stays text-only, and no
 * og:image / twitter:image meta tag is emitted at all.
 *
 * Permanent, design-level assets (the approved logo, the approved homepage
 * banner, the permanent article WhatsApp banner) are NOT article images: they
 * belong to the layout and are rendered independently of this policy.
 */

/**
 * Paths the CMS is allowed to persist as an article image.
 *
 * Only two sources are permitted, and both require an explicit administrator
 * action: an image uploaded through the CMS (committed under /media/), or one
 * of the permanent approved assets passed in by the caller.
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
 * The image used for social metadata. ONLY the explicitly selected OG image —
 * there is deliberately no featured-image fallback and no default asset. When
 * nothing is selected, no og:image/twitter:image tag is emitted.
 */
export function socialImage(article: ArticleImageFields, approved: readonly string[] = []): string {
  return resolveImage(article.ogImage, approved);
}
