import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { articles } from "../src/data/articles";
import { staticPages } from "../src/data/pages";
import { clusters, SITE } from "../src/data/site";

/**
 * Automatic sitemap generation.
 *
 * Runs on every build and rewrites public/sitemap.xml from the actual routable
 * content, so a newly published article enters the sitemap with no manual step.
 *
 * Inclusion rules (deliberately strict):
 *   + every static page and every cluster index
 *   + every article that is part of the deployed bundle (static .ts articles
 *     plus every JSON file in content/published)
 *   - /admin, /api, /search: disallowed or non-content
 *   - anything not yet published (drafts/review/archived)
 *   - duplicate URLs (deduplicated below)
 *
 * There is no scheduled publishing; only content/published/*.json entries are
 * live, so the sitemap never needs a scheduler to stay accurate.
 */

const PUBLISHED_DIR = path.resolve("content/published");

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface Entry {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

const EXTRA_ROUTES: Entry[] = [
  { loc: "/topics", changefreq: "weekly", priority: "0.9" },
  { loc: "/service-areas", changefreq: "monthly", priority: "0.8" },
  { loc: "/contact", changefreq: "yearly", priority: "0.5" },
  { loc: "/service-areas", changefreq: "monthly", priority: "0.6" },
  { loc: "/sitemap", changefreq: "monthly", priority: "0.4" },
];

function readCommittedSlugs(): { slug: string; updatedAt?: string; noindex?: boolean }[] {
  try {
    const files = fs.readdirSync(PUBLISHED_DIR).filter((f) => f.endsWith(".json"));
    const out: { slug: string; updatedAt?: string; noindex?: boolean }[] = [];
    for (const file of files) {
      try {
        const parsed = JSON.parse(fs.readFileSync(path.join(PUBLISHED_DIR, file), "utf8"));
        if (parsed && typeof parsed.slug === "string" && parsed.slug) {
          out.push({
            slug: parsed.slug,
            updatedAt: parsed.updatedAt,
            noindex: parsed.noindex === true,
          });
        }
      } catch (err) {
        console.warn(`[sitemap] skipped malformed ${file}`);
      }
    }
    return out;
  } catch {
    // Directory may not exist on a fresh clone; static articles still emit.
    return [];
  }
}

export function emitSitemap(): Plugin {
  return {
    name: "emit-sitemap",
    buildStart() {
      const entries: Entry[] = [];
      const seen = new Set<string>();

      const push = (entry: Entry) => {
        const url = `${SITE.domain}${entry.loc === "/" ? "/" : entry.loc}`;
        if (seen.has(url)) return;
        seen.add(url);
        entries.push({ ...entry, loc: url });
      };

      push({ loc: "/", changefreq: "weekly", priority: "1.0" });

      // Static editorial pages.
      for (const page of staticPages) {
        push({ loc: page.path, changefreq: "monthly", priority: page.path.startsWith("/medical") ? "0.9" : "0.8" });
      }

      // Routable pages that are React components rather than StaticPage records.
      // Listed explicitly so they can never silently drop out of the sitemap.
      for (const extra of EXTRA_ROUTES) push(extra);

      // Cluster index pages.
      for (const cluster of clusters) {
        push({ loc: `/blog/cluster/${cluster.slug}`, changefreq: "weekly", priority: "0.7" });
      }

      push({ loc: "/blog", changefreq: "weekly", priority: "0.8" });

      // Articles published through the CMS (committed JSON) come FIRST: a
      // committed file overrides its static twin in the bundle (see
      // src/cms/storage.ts), so the content that actually ships also owns the
      // sitemap entry and its lastmod. Pushing static first would silently
      // keep a stale lastmod for any re-published article.
      const committedRows = new Map(readCommittedSlugs().map((row) => [row.slug, row]));
      for (const row of committedRows.values()) {
        if (row.noindex) continue;
        push({
          loc: `/blog/${row.slug}`,
          lastmod: row.updatedAt,
          changefreq: "monthly",
          priority: "0.6",
        });
      }

      // Articles shipped in the bundle (static .ts files).
      for (const article of articles) {
        if (committedRows.has(article.slug)) continue;
        if (article.noindex) continue;
        push({
          loc: `/blog/${article.slug}`,
          lastmod: article.updatedAt,
          changefreq: "monthly",
          priority: "0.6",
        });
      }

      const body = entries
        .map((entry) => {
          const lastmod = entry.lastmod ? `<lastmod>${xmlEscape(entry.lastmod)}</lastmod>` : "";
          return (
            `  <url><loc>${xmlEscape(entry.loc)}</loc>${lastmod}` +
            `<changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`
          );
        })
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

      const target = path.resolve("public/sitemap.xml");
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, xml);
      console.log(`[sitemap] wrote ${entries.length} URLs to public/sitemap.xml`);
    },
  };
}
