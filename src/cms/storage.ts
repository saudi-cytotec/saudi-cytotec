import type { ContentMapItem, ManagedArticle, SiteSettings } from "../types";
import { defaultSettings, generatedDrafts, seedContentMap, staticManaged } from "./defaults";

const KEY = "saudiersaa-cms-v1";

export interface CmsState {
  articles: ManagedArticle[];
  map: ContentMapItem[];
  settings: SiteSettings;
}

function emptyState(): CmsState {
  return {
    articles: [...staticManaged, ...generatedDrafts],
    map: seedContentMap(),
    settings: defaultSettings,
  };
}

export function loadState(): CmsState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<CmsState>;
    const extras = (parsed.articles ?? []).filter((item) => item.source === "cms");
    const staticIds = new Set(staticManaged.map((item) => item.id));
    const mergedExtras = [
      ...generatedDrafts.filter((item) => !extras.some((row) => row.id === item.id)),
      ...extras.filter((item) => !staticIds.has(item.id)),
    ];
    return {
      articles: [...staticManaged, ...mergedExtras],
      map: parsed.map?.length ? parsed.map : seedContentMap(),
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state: CmsState) {
  if (typeof window === "undefined") return;
  const persistable: CmsState = {
    ...state,
    articles: state.articles.filter((item) => item.source === "cms"),
  };
  window.localStorage.setItem(KEY, JSON.stringify(persistable));
}
