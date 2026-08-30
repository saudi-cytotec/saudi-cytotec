import type { ManagedArticle } from "../types";

/**
 * Internal-linking engine.
 *
 * Builds the link graph from the article corpus (related, internalLinks,
 * cornerstones) and reports the signals the CMS dashboard uses:
 *
 *   - outgoing/incoming counts per article
 *   - orphans: published articles no other article links to
 *   - broken: links pointing at slugs/paths that do not exist in the corpus
 *   - suggestions: same-cluster or cornerstone targets not yet linked
 *
 * Links are editorial suggestions only — the site adds no automatic spammy
 * linking. Contextual, natural links stay the editor's job.
 */

export interface LinkStats {
  outgoing: number;
  incoming: number;
  brokenTargets: string[];
  suggestions: string[];
}

export interface LinkGraph {
  stats: Map<string, LinkStats>;
  orphans: ManagedArticle[];
  brokenLinks: { from: string; to: string }[];
}

function normalizeTarget(target: string): string | null {
  const value = target.trim();
  if (!value) return null;
  if (value.startsWith("/blog/")) return value.slice("/blog/".length);
  if (value.startsWith("/")) return value; // cornerstone path (e.g. /safety)
  return value;
}

export function buildLinkGraph(articles: ManagedArticle[]): LinkGraph {
  const published = articles.filter((article) => article.status === "published");
  const knownSlugs = new Set(published.map((article) => article.slug));
  const knownPaths = new Set<string>(["/", "/topics", "/blog", "/faq", "/service-areas", "/contact", "/sitemap", "/search", "/admin"]);
  // Cornerstone pages and cluster hubs are valid link targets even though
  // they are not articles.
  for (const article of articles) {
    for (const path of article.cornerstones) knownPaths.add(path);
    knownPaths.add(`/blog/cluster/${article.cluster}`);
  }

  const outgoingMap = new Map<string, string[]>();
  const incomingMap = new Map<string, string[]>();
  const brokenLinks: { from: string; to: string }[] = [];

  for (const article of published) {
    const targets = [...new Set([...article.related, ...article.internalLinks, ...article.cornerstones])];
    const normalized: string[] = [];
    for (const target of targets) {
      const norm = normalizeTarget(target);
      if (!norm) continue;
      normalized.push(norm);
      const exists = knownSlugs.has(norm) || knownPaths.has(norm.startsWith("/") ? norm : `/${norm}`);
      if (!exists) brokenLinks.push({ from: article.slug, to: target });
      if (!incomingMap.has(norm)) incomingMap.set(norm, []);
      incomingMap.get(norm)!.push(article.slug);
    }
    outgoingMap.set(article.slug, [...new Set(normalized)]);
  }

  const stats = new Map<string, LinkStats>();
  for (const article of published) {
    const incoming = [...new Set(incomingMap.get(article.slug) ?? [])];
    const clusterSiblings = published.filter(
      (other) => other.cluster === article.cluster && other.slug !== article.slug,
    );
    const linked = new Set(outgoingMap.get(article.slug) ?? []);
    const suggestions = [
      ...clusterSiblings
        .filter((sibling) => !linked.has(sibling.slug))
        .slice(0, 3)
        .map((sibling) => `/blog/${sibling.slug}`),
      ...article.cornerstones.filter((path) => !linked.has(path)).slice(0, 2),
    ].slice(0, 4);
    const brokenTargets = brokenLinks.filter((broken) => broken.from === article.slug).map((broken) => broken.to);
    stats.set(article.slug, {
      outgoing: outgoingMap.get(article.slug)?.length ?? 0,
      incoming: incoming.length,
      brokenTargets,
      suggestions,
    });
  }

  const orphans = published.filter((article) => (incomingMap.get(article.slug)?.length ?? 0) === 0);

  return { stats, orphans, brokenLinks };
}

export function incomingSources(graph: LinkGraph, slug: string): string[] {
  const entry = graph.stats.get(slug);
  return entry ? [] : [];
}
