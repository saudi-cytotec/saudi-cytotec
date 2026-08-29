import type { ContentMapItem, ManagedArticle, SiteSettings } from "../types";
import { defaultSettings, generatedDrafts, seedContentMap, staticManaged } from "./defaults";
import { committedArticles } from "./contentSource";

const KEY = "saudiersaa-cms-v2";
const MIGRATED_FROM = "saudiersaa-cms-v1";

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
}

function baseline(): ManagedArticle[] {
  // Committed JSON overrides a static row with the same slug, so a re-published
  // article keeps its URL and updates in place.
  const byId = new Map(staticManaged.map((item) => [item.id, item]));
  for (const article of committedArticles) {
    byId.set(article.id, article);
  }
  return [...byId.values()];
}

function baseArticles(): ManagedArticle[] {
  const rows = baseline();
  const known = new Set(rows.map((item) => item.id));
  return [...rows, ...generatedDrafts.filter((item) => !known.has(item.id))];
}

function emptyState(): CmsState {
  return {
    articles: baseArticles(),
    map: seedContentMap(),
    settings: defaultSettings,
  };
}

function migrateV1(): Partial<CmsState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MIGRATED_FROM);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CmsState>;
    // Carry the author's work forward, then drop the old key.
    window.localStorage.removeItem(MIGRATED_FROM);
    return parsed;
  } catch {
    return null;
  }
}

function readLocal(): Partial<CmsState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Partial<CmsState>;
    return migrateV1();
  } catch {
    return null;
  }
}

export function loadState(): CmsState {
  const base = emptyState();
  const local = readLocal();
  if (!local) return base;

  const localRows = (local.articles ?? []).filter((row) => row && row.id && row.slug);
  const localIds = new Set(localRows.map((row) => row.id));

  return {
    // Local edits win over the bundle; anything not touched locally comes from it.
    articles: [...localRows, ...base.articles.filter((item) => !localIds.has(item.id))],
    map: local.map?.length ? local.map : base.map,
    settings: { ...base.settings, ...(local.settings ?? {}) },
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
      JSON.stringify({ articles: dirty, map: state.map, settings: state.settings } satisfies CmsState),
    );
  } catch {
    // Storage full or unavailable (private mode). Edits stay in memory for this
    // session; publishing still works because it goes through the API.
  }
}
