import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { articles } from "../src/data/articles";
import { staticPages } from "../src/data/pages";
import { countryCornerstones, countryReferenceIds } from "../src/data/countryCornerstones";
import { references } from "../src/data/references";
import { clusters, SITE } from "../src/data/site";
import { bodyStructure } from "../src/utils/bodyWordCount";

/**
 * emitSeoManifest — build-time SEO manifest.
 *
 * Runs on every build and writes dist/seo-manifest.json: a machine-readable
 * snapshot of the URLs the deployed bundle contains and the indexability each
 * one is expected to expose.
 */

const INDEXABLE = "index,follow,max-image-preview:large";
const NOINDEX = "noindex,nofollow";
const BLOCK_TYPES = new Set(["p", "h2", "h3", "ul", "callout"]);

interface ArticleEntry {
  slug: string;
  path: string;
  url: string;
  canonical: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  cluster: string;
  publishedAt: string;
  updatedAt: string;
  source: string;
  status: string;
  wordCount: number;
  structure: ReturnType<typeof bodyStructure>;
  references: string[];
  related: string[];
  cornerstones: string[];
  internalLinks: string[];
  resourceLinks: { to: string; label: string; description?: string }[];
  image: string;
  thumbnail: string;
  bannerImage: string;
  ogImage: string;
  expectedRobots: string;
  sitemapIncluded: boolean;
}

interface RouteEntry {
  path: string;
  url: string;
  title: string;
  metaDescription: string;
  canonical: string;
  kind: "page" | "cluster" | "index" | "protected";
  expectedRobots: string;
}

interface PublishedRow {
  parsed: Record<string, any>;
  updatedAt?: string;
  noindex: boolean;
  excludeFromSitemap: boolean;
}

function parseBlocks(raw: unknown) {
  const blocks: { type: "p" | "h2" | "h3" | "ul" | "callout"; text?: string; items?: string[] }[] = Array.isArray(raw)
    ? (raw as Record<string, unknown>[])
        .filter((b) => b && typeof b.type === "string" && BLOCK_TYPES.has(String(b.type)))
        .map((b) => ({
          type: b.type as "p" | "h2" | "h3" | "ul" | "callout",
          text: typeof b.text === "string" ? b.text : undefined,
          items: Array.isArray(b.items) ? (b.items as unknown[]).filter((i): i is string => typeof i === "string") : undefined,
        }))
    : [];
  return blocks;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function selfUrl(slug: string) {
  return `${SITE.domain}/blog/${slug}`;
}

function resourceLinks(value: unknown): { to: string; label: string; description?: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .filter((item) => typeof item.to === "string" && typeof item.label === "string")
    .map((item) => ({
      to: String(item.to),
      label: String(item.label),
      description: typeof item.description === "string" ? item.description : undefined,
    }));
}

function imageValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function loadCommitted(dir: string) {
  const committed = new Map<string, PublishedRow>();
  try {
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      try {
        const parsed = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
        if (parsed && typeof parsed.slug === "string" && parsed.slug) {
          committed.set(parsed.slug, {
            parsed,
            updatedAt: parsed.updatedAt,
            noindex: parsed.noindex === true,
            excludeFromSitemap: parsed.excludeFromSitemap === true,
          });
        }
      } catch {
        // Malformed files are already skipped by the runtime content loader.
      }
    }
  } catch {
    // No content directory on a fresh clone.
  }
  return committed;
}

export function emitSeoManifest(): Plugin {
  return {
    name: "emit-seo-manifest",
    closeBundle() {
      const publishedDir = path.resolve(__dirname, "..", "content", "published");
      const committed = loadCommitted(publishedDir);
      const articleSlugs = new Set(articles.map((a) => a.slug));
      const allSlugs = new Set([...articleSlugs, ...committed.keys()]);

      const articleEntries: ArticleEntry[] = articles.map((article) => {
        const override = committed.get(article.slug)?.parsed;
        const updatedAt = str(override?.updatedAt, committed.get(article.slug)?.updatedAt ?? article.updatedAt);
        const blocks = override ? parseBlocks(override.blocks) : article.blocks;
        const noindex = override?.noindex === true || article.noindex === true;
        const url = selfUrl(article.slug);
        // A canonical override is only valid for an intentionally consolidated
        // noindex URL. Indexable articles always self-canonicalize.
        const canonical = noindex ? str(override?.canonical, url) : url;
        return {
          slug: article.slug,
          path: `/blog/${article.slug}`,
          url,
          canonical,
          title: str(override?.title, article.title),
          h1: str(override?.h1, article.h1),
          metaTitle: str(override?.metaTitle, article.metaTitle),
          metaDescription: str(override?.metaDescription, article.metaDescription),
          cluster: str(override?.cluster, article.cluster),
          publishedAt: str(override?.publishedAt, article.publishedAt),
          updatedAt,
          source: override ? "cms" : "static",
          status: "published",
          wordCount: bodyStructure(blocks).wordCount,
          structure: bodyStructure(blocks),
          references: override ? stringArray(override.references) : article.references,
          related: override ? stringArray(override.related) : article.related,
          cornerstones: override ? stringArray(override.cornerstones) : article.cornerstones,
          internalLinks: override ? stringArray(override.internalLinks) : [...article.related, ...article.cornerstones],
          resourceLinks: override ? resourceLinks(override.resourceLinks) : resourceLinks(article.resourceLinks),
          image: imageValue(override?.image ?? article.image),
          thumbnail: imageValue(override?.thumbnail ?? article.thumbnail),
          bannerImage: imageValue(override?.bannerImage ?? article.bannerImage),
          ogImage: imageValue(override?.ogImage ?? article.ogImage),
          expectedRobots: noindex ? NOINDEX : INDEXABLE,
          sitemapIncluded: !noindex && !(override?.excludeFromSitemap === true),
        };
      });

      for (const [slug, row] of committed) {
        if (articleSlugs.has(slug)) continue;
        const parsed = row.parsed;
        const blocks = parseBlocks(parsed.blocks);
        const url = selfUrl(slug);
        const canonical = row.noindex ? str(parsed.canonical, url) : url;
        articleEntries.push({
          slug,
          path: `/blog/${slug}`,
          url,
          canonical,
          title: str(parsed.title),
          h1: str(parsed.h1, str(parsed.title)),
          metaTitle: str(parsed.metaTitle, str(parsed.title)),
          metaDescription: str(parsed.metaDescription),
          cluster: str(parsed.cluster),
          publishedAt: str(parsed.publishedAt),
          updatedAt: str(parsed.updatedAt, row.updatedAt ?? ""),
          source: "cms",
          status: "published",
          wordCount: bodyStructure(blocks).wordCount,
          structure: bodyStructure(blocks),
          references: stringArray(parsed.references),
          related: stringArray(parsed.related),
          cornerstones: stringArray(parsed.cornerstones),
          internalLinks: stringArray(parsed.internalLinks),
          resourceLinks: resourceLinks(parsed.resourceLinks),
          image: imageValue(parsed.image),
          thumbnail: imageValue(parsed.thumbnail),
          bannerImage: imageValue(parsed.bannerImage),
          ogImage: imageValue(parsed.ogImage),
          expectedRobots: row.noindex ? NOINDEX : INDEXABLE,
          sitemapIncluded: !row.noindex && !row.excludeFromSitemap,
        });
      }

      const routeEntries: RouteEntry[] = [];
      const pushRoute = (entry: RouteEntry) => routeEntries.push(entry);

      pushRoute({
        path: "/",
        url: `${SITE.domain}/`,
        title: "الرئيسية",
        metaDescription: SITE.description,
        canonical: `${SITE.domain}/`,
        kind: "index",
        expectedRobots: INDEXABLE,
      });

      for (const page of staticPages) {
        pushRoute({
          path: page.path,
          url: `${SITE.domain}${page.path}`,
          title: page.title,
          metaDescription: page.metaDescription,
          canonical: `${SITE.domain}${page.path}`,
          kind: "page",
          expectedRobots: INDEXABLE,
        });
      }

      for (const cluster of clusters) {
        pushRoute({
          path: `/blog/cluster/${cluster.slug}`,
          url: `${SITE.domain}/blog/cluster/${cluster.slug}`,
          title: cluster.title,
          metaDescription: cluster.description,
          canonical: `${SITE.domain}/blog/cluster/${cluster.slug}`,
          kind: "cluster",
          expectedRobots: INDEXABLE,
        });
      }

      pushRoute({
        path: "/blog",
        url: `${SITE.domain}/blog`,
        title: "المقالات",
        metaDescription: "كل المقالات التعليمية",
        canonical: `${SITE.domain}/blog`,
        kind: "index",
        expectedRobots: INDEXABLE,
      });
      pushRoute({
        path: "/contact",
        url: `${SITE.domain}/contact`,
        title: "اتصل بنا",
        metaDescription: "التواصل مع الموقع",
        canonical: `${SITE.domain}/contact`,
        kind: "page",
        expectedRobots: INDEXABLE,
      });
      pushRoute({
        path: "/topics",
        url: `${SITE.domain}/topics`,
        title: "محاور المحتوى",
        metaDescription: "محاور المحتوى وخريطة الموضوعات في سايتوتك في السعودية",
        canonical: `${SITE.domain}/topics`,
        kind: "page",
        expectedRobots: INDEXABLE,
      });
      pushRoute({
        path: "/service-areas",
        url: `${SITE.domain}/service-areas`,
        title: "سايتوتك في السعودية",
        metaDescription: "المركز السعودي الرئيسي لصفحات المدن والمعلومات الطبية العامة عن ميزوبروستول",
        canonical: `${SITE.domain}/service-areas`,
        kind: "page",
        expectedRobots: INDEXABLE,
      });
      pushRoute({
        path: "/sitemap",
        url: `${SITE.domain}/sitemap`,
        title: "خريطة الموقع",
        metaDescription: "كل روابط الموقع",
        canonical: `${SITE.domain}/sitemap`,
        kind: "page",
        expectedRobots: INDEXABLE,
      });

      pushRoute({
        path: "/admin",
        url: `${SITE.domain}/admin`,
        title: "لوحة التحرير",
        metaDescription: "",
        canonical: `${SITE.domain}/admin`,
        kind: "protected",
        expectedRobots: NOINDEX,
      });
      pushRoute({
        path: "/search",
        url: `${SITE.domain}/search`,
        title: "البحث",
        metaDescription: "",
        canonical: `${SITE.domain}/search`,
        kind: "protected",
        expectedRobots: NOINDEX,
      });

      const manifest = {
        generatedAt: new Date().toISOString(),
        domain: SITE.domain,
        articles: articleEntries,
        routes: routeEntries,
        // The country-page verifier compares these same editorial records with
        // the rendered production bundle (including FAQ text and citations).
        countryCornerstones: countryCornerstones.map((page) => ({
          ...page,
          references: countryReferenceIds(page).map((id) => references[id]),
        })),
        allArticleSlugs: [...allSlugs].sort(),
      };

      const distDir = path.resolve(__dirname, "..", "dist");
      fs.mkdirSync(distDir, { recursive: true });
      const target = path.join(distDir, "seo-manifest.json");
      fs.writeFileSync(target, JSON.stringify(manifest, null, 2) + "\n");
      console.log(`[seo-manifest] wrote ${articleEntries.length} articles + ${routeEntries.length} routes to dist/seo-manifest.json`);
    },
  };
}
