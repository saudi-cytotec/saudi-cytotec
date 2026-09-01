/// <reference types="vite/client" />
import type { ContentBlock, ManagedArticle } from "../types";
import { staticToManaged } from "./defaults";
import { SITE } from "../data/site";
import { isValidShortSlug } from "../utils/slug";
import { resolveImage } from "../utils/images";
import { selectableImagePaths } from "../data/media";

/**
 * Build-time content source.
 *
 * Every JSON file under /content/published is bundled into the app by Vite at
 * build time. Because it is part of the bundle, a published article:
 *   - exists in the deployed output (not in one visitor's browser),
 *   - is reachable at a stable URL,
 *   - appears in the generated sitemap,
 *   - is crawlable without JavaScript-dependent state.
 *
 * Files are written by api/publish.js as a Git commit, which triggers a Vercel
 * redeploy. That is the whole publishing pipeline: commit -> build -> live.
 */
const modules = import.meta.glob("../../content/published/*.json", { eager: true });

const BLOCK_TYPES = new Set(["p", "h2", "h3", "ul", "callout"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitize(raw: unknown, fileName: string): ManagedArticle | null {
  if (!isRecord(raw)) {
    console.warn(`[content] skipped ${fileName}: not an object`);
    return null;
  }

  const slug = typeof raw.slug === "string" ? raw.slug.trim() : "";
  if (!isValidShortSlug(slug).ok) {
    console.warn(`[content] skipped ${fileName}: invalid slug "${slug}"`);
    return null;
  }

  const blocks: ContentBlock[] = Array.isArray(raw.blocks)
    ? raw.blocks
        .filter((block): block is Record<string, unknown> => isRecord(block))
        .filter((block) => typeof block.type === "string" && BLOCK_TYPES.has(block.type))
        .map((block) => ({
          type: block.type as ContentBlock["type"],
          text: typeof block.text === "string" ? block.text : undefined,
          items: Array.isArray(block.items)
            ? (block.items as unknown[]).filter((i): i is string => typeof i === "string")
            : undefined,
          tone: ["info", "warning", "emergency"].includes(String(block.tone))
            ? (block.tone as ContentBlock["tone"])
            : undefined,
        }))
    : [];

  if (!blocks.length) {
    console.warn(`[content] skipped ${fileName}: no valid content blocks`);
    return null;
  }

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) {
    console.warn(`[content] skipped ${fileName}: missing title`);
    return null;
  }

  const asStatic = {
    slug,
    title,
    h1: typeof raw.h1 === "string" && raw.h1.trim() ? raw.h1 : title,
    metaTitle: typeof raw.metaTitle === "string" && raw.metaTitle ? raw.metaTitle : title,
    metaDescription: typeof raw.metaDescription === "string" ? raw.metaDescription : "",
    cluster: raw.cluster,
    excerpt: typeof raw.excerpt === "string" ? raw.excerpt : "",
    publishedAt: typeof raw.publishedAt === "string" ? raw.publishedAt : new Date().toISOString().slice(0, 10),
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString().slice(0, 10),
    // Images: exactly what the administrator selected, or nothing at all.
    image: resolveImage(raw.image, selectableImagePaths),
    imageAlt: typeof raw.imageAlt === "string" ? raw.imageAlt : "",
    thumbnail: resolveImage(raw.thumbnail, selectableImagePaths),
    thumbnailAlt: typeof raw.thumbnailAlt === "string" ? raw.thumbnailAlt : "",
    bannerImage: resolveImage(raw.bannerImage, selectableImagePaths),
    bannerImageAlt: typeof raw.bannerImageAlt === "string" ? raw.bannerImageAlt : "",
    ogImage: resolveImage(raw.ogImage, selectableImagePaths),
    related: Array.isArray(raw.related) ? raw.related.filter((v): v is string => typeof v === "string") : [],
    cornerstones: Array.isArray(raw.cornerstones)
      ? raw.cornerstones.filter((v): v is string => typeof v === "string")
      : [],
    references: Array.isArray(raw.references) ? raw.references.filter((v): v is string => typeof v === "string") : [],
    blocks,
    faqs: Array.isArray(raw.faqs)
      ? raw.faqs
          .filter((f): f is Record<string, unknown> => isRecord(f))
          .filter((f) => typeof f.q === "string" && typeof f.a === "string")
          .map((f) => ({ q: f.q as string, a: f.a as string }))
      : [],
    noindex: raw.noindex === true,
  } as unknown as Parameters<typeof staticToManaged>[0];

  const managed = staticToManaged(asStatic);
  const noindex = raw.noindex === true;
  const selfCanonical = `${SITE.domain}/blog/${slug}`;
  // Indexable articles must self-canonicalize. A different canonical is only
  // retained for an intentionally noindex/consolidated legacy record.
  const canonical = noindex && typeof raw.canonical === "string" && raw.canonical ? raw.canonical : selfCanonical;

  return {
    ...managed,
    status: "published",
    source: "cms",
    id: typeof raw.id === "string" && raw.id ? raw.id : `cms-${slug}`,
    slugLocked: true,
    canonical,
    primaryKeyword:
      typeof raw.primaryKeyword === "string" && raw.primaryKeyword ? raw.primaryKeyword : managed.primaryKeyword,
    secondaryKeywords: Array.isArray(raw.secondaryKeywords)
      ? raw.secondaryKeywords.filter((v): v is string => typeof v === "string")
      : managed.secondaryKeywords,
    searchIntent:
      typeof raw.searchIntent === "string" && raw.searchIntent
        ? (raw.searchIntent as ManagedArticle["searchIntent"])
        : managed.searchIntent,
    articleType:
      typeof raw.articleType === "string" && raw.articleType
        ? (raw.articleType as ManagedArticle["articleType"])
        : managed.articleType,
    seoTitle: typeof raw.seoTitle === "string" && raw.seoTitle ? raw.seoTitle : managed.seoTitle,
    ogTitle: typeof raw.ogTitle === "string" && raw.ogTitle ? raw.ogTitle : managed.ogTitle,
    ogDescription:
      typeof raw.ogDescription === "string" && raw.ogDescription ? raw.ogDescription : managed.ogDescription,
    description: typeof raw.description === "string" && raw.description ? raw.description : managed.description,
    image: resolveImage(raw.image, selectableImagePaths),
    imageAlt: resolveImage(raw.image, selectableImagePaths) && typeof raw.imageAlt === "string" ? raw.imageAlt : "",
    thumbnail: resolveImage(raw.thumbnail, selectableImagePaths),
    thumbnailAlt:
      resolveImage(raw.thumbnail, selectableImagePaths) && typeof raw.thumbnailAlt === "string"
        ? raw.thumbnailAlt
        : "",
    bannerImage: resolveImage(raw.bannerImage, selectableImagePaths),
    bannerImageAlt:
      resolveImage(raw.bannerImage, selectableImagePaths) && typeof raw.bannerImageAlt === "string"
        ? raw.bannerImageAlt
        : "",
    ogImage: resolveImage(raw.ogImage, selectableImagePaths),
    medicalReviewer: typeof raw.medicalReviewer === "string" ? raw.medicalReviewer : undefined,
    lastReviewedAt: typeof raw.lastReviewedAt === "string" ? raw.lastReviewedAt : undefined,
    nofollow: raw.nofollow === true,
    excludeFromSitemap: raw.excludeFromSitemap === true,
    metaDescription: typeof raw.metaDescription === "string" ? raw.metaDescription : managed.metaDescription,
    internalLinks: Array.isArray(raw.internalLinks)
      ? raw.internalLinks.filter((v): v is string => typeof v === "string")
      : managed.internalLinks,
    resourceLinks: Array.isArray(raw.resourceLinks)
      ? raw.resourceLinks
          .filter((item): item is Record<string, unknown> => isRecord(item))
          .filter((item) => typeof item.to === "string" && typeof item.label === "string")
          .map((item) => ({
            to: item.to as string,
            label: item.label as string,
            description: typeof item.description === "string" ? item.description : undefined,
          }))
      : managed.resourceLinks,
    references: Array.isArray(raw.references) ? (raw.references as string[]) : managed.references,
    hasDisclaimer: raw.hasDisclaimer === false ? false : managed.hasDisclaimer,
    noindex: raw.noindex === true,
    author: typeof raw.author === "string" ? raw.author : managed.author,
  };
}

function load(): ManagedArticle[] {
  const out: ManagedArticle[] = [];
  for (const [path, mod] of Object.entries(modules)) {
    const payload = (mod as { default?: unknown }).default ?? mod;
    const article = sanitize(payload, path);
    if (article) out.push(article);
  }
  return out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export const committedArticles: ManagedArticle[] = load();
