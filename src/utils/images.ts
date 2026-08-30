/**
 * Site-wide image policy.
 *
 * The public website may serve EXACTLY three owner-approved assets:
 *   1. the logo
 *   2. the homepage hero / banner
 *   3. the permanent article WhatsApp banner
 *
 * Articles never have their own image. Absence of an article image is the
 * only valid public state — no default, fallback, cluster, OG, thumbnail or
 * generated substitute is ever invented. Stale CMS / localStorage values
 * pointing at deleted files are stripped before they can reach the renderer.
 */

/** Drop every article-specific image field. Used on the public catalog. */
export function wipeArticleImages<T extends object>(article: T): T {
  return {
    ...article,
    image: "",
    imageAlt: "",
    bannerImage: "",
    bannerImageAlt: "",
    ogImage: "",
  };
}
