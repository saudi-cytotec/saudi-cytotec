import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { articles } from "../src/data/articles";
import { staticPages } from "../src/data/pages";
import { clusters, SITE } from "../src/data/site";
import { bodyStructure } from "../src/utils/bodyWordCount";

/**
 * emitSeoManifest — build-time SEO manifest.
 *
 * Runs on every build (buildStart) and writes dist/seo-manifest.json: a
 * machine-readable snapshot of exactly what the deployed bundle contains, with
 * the expected indexing behavior per URL.
 *
 * Why this exists: the production incident where /blog/cytotec-in-saudi-arabia
 * served Google a noindex 404-fallback was invisible to every existing check —
 * the sitemap did not contain the URL and nothing asserted that the bundle,
 * the sitemap and the catalog agree with each other. This manifest is the input
 * to scripts/auditIndexability.mjs, which fails the build if:
 *   - a published article is absent from the sitemap (or vice versa),
 *   - a sitemap URL has no corresponding public page,
 *   - canonical, sitemap URL and route disagree,
 *   - a public page carries noindex (or a protected page does not),
 *   - an article is missing title / meta description / canonical,
 *   - internal links (related / cornerstones) point at routes that do not exist.
 *
 * Written to dist/ (build output, not committed) next to the HTML it describes.
 */

const INDEXABLE = "index,follow,max-image-preview:large";
const NOINDEX = "noindex,nofollow";

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
  expectedRobots: string;
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

export function emitSeoManifest(): Plugin {
  return {
    name: "emit-seo-manifest",
    // closeBundle: dist/ has been emptied and the final HTML written, so the
    // manifest survives the build (writing it in buildStart would be wiped).
    closeBundle() {
      // The catalog is the static .ts articles plus every committed JSON under
      // content/published (bundled via import.meta.glob in src/cms/contentSource).
      // Mirroring that merge here keeps the manifest honest about what ships.
      const publishedDir = path.resolve(__dirname, "..", "content", "published");
      const committed = new Map<string, { updatedAt?: string }>();
      try {
        for (const file of fs.readdirSync(publishedDir).filter((f) => f.endsWith(".json"))) {
          try {
            const parsed = JSON.parse(fs.readFileSync(path.join(publishedDir, file), "utf8"));
            if (parsed && typeof parsed.slug === "string" && parsed.slug) {
              committed.set(parsed.slug, { updatedAt: parsed.updatedAt });
            }
          } catch {
            // Malformed files are already skipped (with a warning) by contentSource.
          }
        }
      } catch {
        // No content dir on a fresh clone — static articles still manifest.
      }

      const articleSlugs = new Set(articles.map((a) => a.slug));
      const allSlugs = new Set([...articleSlugs, ...committed.keys()]);

      const articleEntries: ArticleEntry[] = articles.map((article) => {
        const committedRow = committed.get(article.slug);
        const updatedAt = committedRow?.updatedAt ?? article.updatedAt;
        return {
          slug: article.slug,
          path: `/blog/${article.slug}`,
          url: `${SITE.domain}/blog/${article.slug}`,
          canonical: `${SITE.domain}/blog/${article.slug}`,
          title: article.title,
          h1: article.h1,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          cluster: article.cluster,
          publishedAt: article.publishedAt,
          updatedAt,
          source: committedRow ? "cms" : "static",
          // Everything in the deployed bundle is public by construction:
          // ArticlePage renders it with index,follow (no noindex prop).
          status: "published",
          wordCount: bodyWordCount(article),
          structure: bodyStructure(article.blocks),
          references: article.references,
          related: article.related,
          cornerstones: article.cornerstones,
          expectedRobots: INDEXABLE,
        };
      });

      // Articles that exist only in content/published (never in the .ts files):
      // their metadata comes from the JSON itself.
      for (const [slug, meta] of committed) {
        if (articleSlugs.has(slug)) continue;
        const file = path.join(publishedDir, `${slug}.json`);
        let parsed: Record<string, any> = {};
        try {
          parsed = JSON.parse(fs.readFileSync(file, "utf8"));
        } catch {
          continue;
        }
        const BLOCK_TYPES = new Set(["p", "h2", "h3", "ul", "callout"]);
        const blocks: { type: "p" | "h2" | "h3" | "ul" | "callout"; text?: string; items?: string[] }[] = Array.isArray(parsed.blocks)
          ? (parsed.blocks as Record<string, unknown>[])
              .filter((b) => b && typeof b.type === "string" && BLOCK_TYPES.has(b.type))
              .map((b) => ({
                type: b.type as "p" | "h2" | "h3" | "ul" | "callout",
                text: typeof b.text === "string" ? b.text : undefined,
                items: Array.isArray(b.items) ? (b.items as unknown[]).filter((i): i is string => typeof i === "string") : undefined,
              }))
          : [];
        articleEntries.push({
          slug,
          path: `/blog/${slug}`,
          url: `${SITE.domain}/blog/${slug}`,
          canonical:
            typeof parsed.canonical === "string" && parsed.canonical
              ? parsed.canonical
              : `${SITE.domain}/blog/${slug}`,
          title: typeof parsed.title === "string" ? parsed.title : "",
          h1: typeof parsed.h1 === "string" ? parsed.h1 : typeof parsed.title === "string" ? parsed.title : "",
          metaTitle: typeof parsed.metaTitle === "string" ? parsed.metaTitle : typeof parsed.title === "string" ? parsed.title : "",
          metaDescription: typeof parsed.metaDescription === "string" ? parsed.metaDescription : "",
          cluster: typeof parsed.cluster === "string" ? parsed.cluster : "",
          publishedAt: typeof parsed.publishedAt === "string" ? parsed.publishedAt : "",
          updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : meta.updatedAt ?? "",
          source: "cms",
          status: "published",
          wordCount: bodyStructure(blocks).wordCount,
          structure: bodyStructure(blocks),
          references: Array.isArray(parsed.references) ? parsed.references : [],
          related: Array.isArray(parsed.related) ? parsed.related : [],
          cornerstones: Array.isArray(parsed.cornerstones) ? parsed.cornerstones : [],
          expectedRobots: INDEXABLE,
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
        path: "/service-areas",
        url: `${SITE.domain}/service-areas`,
        title: "مناطق التغطية",
        metaDescription: "مناطق التغطية والوصول إلى الرعاية في السعودية والخليج",
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

      // Deliberately noindex — these protections are load-bearing and must stay.
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

function bodyWordCount(article: { blocks: Parameters<typeof bodyStructure>[0] }): number {
  return bodyStructure(article.blocks).wordCount;
}
