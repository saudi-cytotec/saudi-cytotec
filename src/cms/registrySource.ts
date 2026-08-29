/// <reference types="vite/client" />
import type { CompetitorGap, ContentMapItem, RedirectRegistry } from "../types";
import { isValidShortSlug } from "../utils/slug";

/**
 * Registry sources.
 *
 * The operational registries of the CMS are committed JSON files under
 * /content. They are bundled at build time exactly like published articles,
 * so the admin always renders the deployed state of the registry, and a
 * change committed through the API becomes visible after the redeploy.
 *
 *   content/map.json          -> 100-topic content map (source of truth)
 *   content/redirects.json    -> redirect registry (vercel.json is generated)
 *   content/competitors.json  -> competitor gap matrix
 *   content/geo-coverage.json -> Saudi/GCC geographic coverage decisions
 */

const MAP_MODULES = import.meta.glob("../../content/map.json", { eager: true }) as unknown as Record<string, JsonModule>;
const REDIRECT_MODULES = import.meta.glob("../../content/redirects.json", { eager: true }) as unknown as Record<string, JsonModule>;
const COMPETITOR_MODULES = import.meta.glob("../../content/competitors.json", { eager: true }) as unknown as Record<string, JsonModule>;
const GEO_MODULES = import.meta.glob("../../content/geo-coverage.json", { eager: true }) as unknown as Record<string, JsonModule>;

type JsonModule = { default?: unknown };

function firstPayload(modules: Record<string, JsonModule>): unknown {
  const keys = Object.keys(modules);
  if (!keys.length) return null;
  return modules[keys[0]].default ?? modules[keys[0]];
}

const MAP_STATUSES = new Set(["IDEA", "RESEARCH", "OUTLINE", "DRAFT", "REVIEW", "READY", "PUBLISHED", "UPDATED"]);
const MAP_PRIORITIES = new Set(["P0", "P1", "P2", "P3"]);
const MAP_INTENTS = new Set(["informational", "navigational", "commercial", "transactional"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeMapItem(raw: unknown): ContentMapItem | null {
  if (!isRecord(raw)) return null;
  const id = typeof raw.id === "string" ? raw.id : "";
  const topic = typeof raw.topic === "string" ? raw.topic.trim() : "";
  if (!id || !topic) return null;
  return {
    id,
    cluster: typeof raw.cluster === "string" ? raw.cluster : "?",
    topic,
    primaryKeyword: typeof raw.primaryKeyword === "string" ? raw.primaryKeyword : "",
    secondaryKeywords: Array.isArray(raw.secondaryKeywords)
      ? raw.secondaryKeywords.filter((v): v is string => typeof v === "string")
      : [],
    searchIntent: MAP_INTENTS.has(String(raw.searchIntent)) ? (raw.searchIntent as ContentMapItem["searchIntent"]) : "informational",
    country: typeof raw.country === "string" ? raw.country : "neutral",
    cityRelevance: Array.isArray(raw.cityRelevance)
      ? raw.cityRelevance.filter((v): v is string => typeof v === "string")
      : [],
    priority: MAP_PRIORITIES.has(String(raw.priority)) ? (raw.priority as ContentMapItem["priority"]) : "P2",
    targetUrl: typeof raw.targetUrl === "string" ? raw.targetUrl : "",
    parent: typeof raw.parent === "string" ? raw.parent : "",
    related: Array.isArray(raw.related) ? raw.related.filter((v): v is string => typeof v === "string") : [],
    status: MAP_STATUSES.has(String(raw.status)) ? (raw.status as ContentMapItem["status"]) : "IDEA",
    notes: typeof raw.notes === "string" ? raw.notes : undefined,
  };
}

export interface MapClusterMeta {
  id: string;
  title: string;
  siteClusterId: string;
  pillar: string;
}

export interface MapRegistry {
  version: number;
  updatedAt: string;
  statuses: string[];
  clusters: MapClusterMeta[];
  items: ContentMapItem[];
}

function loadContentMap(): MapRegistry {
  const payload = firstPayload(MAP_MODULES) as { version?: unknown; updatedAt?: unknown; statuses?: unknown[]; clusters?: unknown[]; items?: unknown[] } | null;
  const clusters: MapClusterMeta[] = Array.isArray(payload?.clusters)
    ? payload.clusters
        .filter((cluster): cluster is Record<string, unknown> => isRecord(cluster))
        .map((cluster) => ({
          id: typeof cluster.id === "string" ? cluster.id : "?",
          title: typeof cluster.title === "string" ? cluster.title : "",
          siteClusterId: typeof cluster.siteClusterId === "string" ? cluster.siteClusterId : "",
          pillar: typeof cluster.pillar === "string" ? cluster.pillar : "",
        }))
    : [];
  const items = Array.isArray(payload?.items)
    ? payload.items.map(sanitizeMapItem).filter((item): item is ContentMapItem => Boolean(item))
    : [];
  if (!items.length) console.warn("[content] map.json missing or empty — the 100-topic map is unavailable");
  return {
    version: typeof payload?.version === "number" ? payload.version : 1,
    updatedAt: typeof payload?.updatedAt === "string" ? payload.updatedAt : "",
    statuses: Array.isArray(payload?.statuses) ? payload.statuses.filter((s): s is string => typeof s === "string") : [],
    clusters,
    items,
  };
}

function sanitizeRedirects(raw: unknown): RedirectRegistry {
  if (!isRecord(raw)) return { version: 1, updatedAt: "", wwwToApex: true, rules: [] };
  const rules = Array.isArray(raw.rules)
    ? raw.rules
        .filter(isRecord)
        .filter((rule) => typeof rule.source === "string" && rule.source)
        .map((rule) => ({
          source: rule.source as string,
          destination: typeof rule.destination === "string" ? rule.destination : null,
          statusCode: rule.statusCode === 410 ? (410 as const) : (301 as const),
          isRegex: rule.isRegex === true,
          reason: typeof rule.reason === "string" ? rule.reason : "",
          createdAt: typeof rule.createdAt === "string" ? rule.createdAt : "",
        }))
    : [];
  return {
    version: typeof raw.version === "number" ? raw.version : 1,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : "",
    wwwToApex: raw.wwwToApex !== false,
    rules,
  };
}

function loadCompetitors(): CompetitorGap[] {
  const payload = firstPayload(COMPETITOR_MODULES) as { gaps?: unknown[] } | null;
  if (!Array.isArray(payload?.gaps)) return [];
  return payload.gaps.filter(isRecord).map((gap) => ({
    keyword: typeof gap.keyword === "string" ? gap.keyword : "",
    competitor: typeof gap.competitor === "string" ? gap.competitor : "",
    competitorUrl: typeof gap.competitorUrl === "string" ? gap.competitorUrl : "",
    searchIntent: typeof gap.searchIntent === "string" ? gap.searchIntent : "",
    contentQuality: typeof gap.contentQuality === "string" ? gap.contentQuality : "",
    missingInformation: typeof gap.missingInformation === "string" ? gap.missingInformation : "",
    ourOpportunity: typeof gap.ourOpportunity === "string" ? gap.ourOpportunity : "",
    priority: typeof gap.priority === "string" ? gap.priority : "",
  }));
}

interface GeoCountry {
  code: string;
  name: string;
  priority: string;
  regulator: string;
  healthLine: string;
  emergency: string;
  contextTopics: string[];
  note: string;
}

interface GeoCity {
  city: string;
  country: string;
  hasPage: boolean;
  coverage: string;
}

function loadGeo(): { policy: string; countries: GeoCountry[]; cities: GeoCity[] } {
  const payload = firstPayload(GEO_MODULES) as { policy?: unknown; countries?: unknown[]; cities?: unknown[] } | null;
  return {
    policy: typeof payload?.policy === "string" ? payload.policy : "",
    countries: Array.isArray(payload?.countries)
      ? payload.countries.filter(isRecord).map((c) => ({
          code: typeof c.code === "string" ? c.code : "",
          name: typeof c.name === "string" ? c.name : "",
          priority: typeof c.priority === "string" ? c.priority : "",
          regulator: typeof c.regulator === "string" ? c.regulator : "",
          healthLine: typeof c.healthLine === "string" ? c.healthLine : "",
          emergency: typeof c.emergency === "string" ? c.emergency : "",
          contextTopics: Array.isArray(c.contextTopics) ? c.contextTopics.filter((v): v is string => typeof v === "string") : [],
          note: typeof c.note === "string" ? c.note : "",
        }))
      : [],
    cities: Array.isArray(payload?.cities)
      ? payload.cities.filter(isRecord).map((c) => ({
          city: typeof c.city === "string" ? c.city : "",
          country: typeof c.country === "string" ? c.country : "",
          hasPage: c.hasPage === true,
          coverage: typeof c.coverage === "string" ? c.coverage : "",
        }))
      : [],
  };
}

export const mapRegistry: MapRegistry = loadContentMap();
export const contentMap: ContentMapItem[] = mapRegistry.items;
export const redirectRegistry: RedirectRegistry = sanitizeRedirects(firstPayload(REDIRECT_MODULES));
export const competitorGaps: CompetitorGap[] = loadCompetitors();
export const geoCoverage = loadGeo();

/** Live article slugs/paths known at build time (for map cross-referencing). */
export function isTargetLive(targetUrl: string, live: Set<string>): boolean {
  if (targetUrl.startsWith("/blog/")) return live.has(targetUrl.slice("/blog/".length));
  return live.has(targetUrl);
}

export function suggestSlugForTopic(topic: string): string {
  // Stable, readable ASCII slug from a topic string (shared with the editor's slug helper).
  const normalized = topic
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 6)
    .join("-");
  const fallback = `topic-${Math.abs(hashString(topic)).toString(36)}`;
  const candidate = normalized || fallback;
  return isValidShortSlug(candidate).ok ? candidate : fallback;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
