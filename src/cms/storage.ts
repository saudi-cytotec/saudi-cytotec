import type { ContentMapItem, ManagedArticle, NotFoundEntry, RedirectRule, SiteSettings } from "../types";
import { defaultSettings, seedContentMap, staticManaged } from "./defaults";
import { committedArticles } from "./contentSource";
import { redirectRegistry } from "./registrySource";

const KEY = "saudiersaa-cms-v3";
const MIGRATED_FROM = ["saudiersaa-cms-v2", "saudiersaa-cms-v1"];

/**
 * Content architecture
 * --------------------
 * There are three layers, merged in this order (later wins):
 *
 *  1. staticManaged      — the original TypeScript articles in src/data/articles.
 *                          Preserved verbatim so no existing URL ever breaks.
 *  2. committedArticles  — JSON files under /content/published, committed to the
 *                          repository by api/publish.js. This is the durable
 *                          source of truth for anything created in the CMS: it
 *                          is bundled at build time, so a published article is
 *                          real, crawlable, server-rendered content — not a
 *                          record sitting in one visitor's browser.
 *  3. local overlay      — unsaved/in-progress edits and drafts, kept in
 *                          localStorage so an editor does not lose work between
 *                          sessions and can publish when the API is unreachable.
 *
 * The old implementation persisted ONLY `source === "cms"` rows, which silently
 * discarded every edit to an existing article. That bug is fixed below by
 * storing any row that differs from its static baseline.
 */

export interface CmsState {
  articles: ManagedArticle[];
  map: ContentMapItem[];
  settings: SiteSettings;
  /** Local overlay of the redirect registry (uncommitted edits). */
  redirectRules: RedirectRule[] | null;
  /** 404 hits seen in this browser (the 404 Monitor). */
  notFoundLog: NotFoundEntry[];
}

function baseline(): ManagedArticle[] {
  // Committed JSON overrides a static row with the same slug, so a re-published
  // article keeps its URL and updates in place. The override matches by slug
  // (committed rows carry a `cms-` id, so matching by id would silently keep
  // BOTH rows and publish a duplicate catalog entry under one URL). The static
  // row keeps its id so an editor's local overlay continues to merge cleanly.
  const bySlug = new Map(staticManaged.map((item) => [item.slug, item]));
  for (const article of committedArticles) {
    const base = bySlug.get(article.slug);
    bySlug.set(article.slug, base ? { ...article, id: base.id } : article);
  }
  return [...bySlug.values()];
}

function baseArticles(): ManagedArticle[] {
  return baseline();
}

function emptyState(): CmsState {
  return {
    articles: baseArticles(),
    map: seedContentMap(),
    settings: defaultSettings,
    redirectRules: null,
    notFoundLog: [],
  };
}

function migrateLegacy(): Partial<CmsState> | null {
  if (typeof window === "undefined") return null;
  for (const key of MIGRATED_FROM) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as Partial<CmsState>;
      // Only drafts/edits are worth carrying forward from v2; the content map
      // shape changed entirely and must come from content/map.json.
      window.localStorage.removeItem(key);
      return { articles: parsed.articles ?? [], map: undefined, settings: parsed.settings };
    } catch {
      continue;
    }
  }
  return null;
}

function readLocal(): Partial<CmsState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Partial<CmsState>;
    return migrateLegacy();
  } catch {
    return null;
  }
}

const MAP_STATUSES = new Set(["IDEA", "RESEARCH", "OUTLINE", "DRAFT", "REVIEW", "READY", "PUBLISHED", "UPDATED"]);

function sanitizeMapRows(rows: unknown): ContentMapItem[] {
  if (!Array.isArray(rows)) return [];
  return rows.filter(
    (row): row is ContentMapItem =>
      Boolean(row) &&
      typeof (row as ContentMapItem).id === "string" &&
      typeof (row as ContentMapItem).topic === "string" &&
      MAP_STATUSES.has((row as ContentMapItem).status),
  );
}

export function loadState(): CmsState {
  const base = emptyState();
  const local = readLocal();
  if (!local) return base;

  const localRows = (local.articles ?? []).filter((row) => row && row.id && row.slug);
  const localIds = new Set(localRows.map((row) => row.id));
  const localMap = sanitizeMapRows(local.map);
  const mapById = new Map(localMap.map((row) => [row.id, row]));

  return {
    // Local edits win over the bundle; anything not touched locally comes from it.
    articles: [...localRows, ...base.articles.filter((item) => !localIds.has(item.id))],
    map: base.map.map((row) => mapById.get(row.id) ?? row),
    // Only current settings keys are used anywhere — no default-OG-image field
    // exists in the type, so any legacy key in storage is inert dead data.
    settings: { ...base.settings, ...(local.settings ?? {}) },
    redirectRules: Array.isArray(local.redirectRules) ? (local.redirectRules as RedirectRule[]) : null,
    notFoundLog: Array.isArray(local.notFoundLog) ? (local.notFoundLog as NotFoundEntry[]) : [],
  };
}

/**
 * Persist only what differs from the bundled baseline.
 *
 * Previously this filtered on `source === "cms"`, so edits to any article that
 * shipped in src/data/articles were thrown away on reload. We now diff against
 * the baseline instead, which keeps localStorage small while preserving edits
 * to existing articles.
 */
export function saveState(state: CmsState) {
  if (typeof window === "undefined") return;
  const base = new Map(baseline().map((item) => [item.id, item]));

  const dirty = state.articles.filter((item) => {
    if (item.source === "cms") return true;
    const original = base.get(item.id);
    return !original || JSON.stringify(original) !== JSON.stringify(item);
  });

  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({
        articles: dirty,
        map: state.map,
        settings: state.settings,
        redirectRules: state.redirectRules,
        notFoundLog: state.notFoundLog,
      } satisfies CmsState),
    );
  } catch {
    // Storage full or unavailable (private mode). Edits stay in memory for this
    // session; publishing still works because it goes through the API.
  }
}

/** The effective redirect registry: local (uncommitted) overlay over committed. */
export function effectiveRedirectRules(state: CmsState): RedirectRule[] {
  return state.redirectRules ?? redirectRegistry.rules;
}
