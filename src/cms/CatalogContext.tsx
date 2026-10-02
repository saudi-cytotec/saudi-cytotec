import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Article, ContentMapItem, ManagedArticle, NotFoundEntry, RedirectRule, SiteSettings } from "../types";
import { sanitizeArticleImages } from "../utils/images";
import { selectableImagePaths } from "../data/media";
import { defaultSettings } from "./defaults";
import { effectiveRedirectRules, loadState, saveState, type CmsState } from "./storage";

interface CatalogValue {
  articles: Article[]; managed: ManagedArticle[]; map: ContentMapItem[]; settings: SiteSettings;
  redirectRules: RedirectRule[]; notFoundLog: NotFoundEntry[]; ready: boolean;
  upsertArticle: (article: ManagedArticle) => void; removeArticle: (id: string) => void;
  setMap: (items: ContentMapItem[]) => void; upsertMapItem: (item: ContentMapItem) => void;
  setSettings: (settings: SiteSettings) => void; setRedirectRules: (rules: RedirectRule[]) => void;
  recordNotFound: (path: string) => void; markNotFoundHandled: (path: string, handledBy: string) => void;
}
const CatalogContext = createContext<CatalogValue | null>(null);
export function CatalogProvider({ children }: { children: ReactNode }) {
  // Match the prerendered catalog on the first client render to prevent
  // hydrateRoot from throwing away the static HTML and delaying LCP.
  const [state, setState] = useState<CmsState>(() => loadState());
  const [ready, setReady] = useState(false);
  useEffect(() => { setState(loadState()); setReady(true); }, []);
  useEffect(() => { if (ready) saveState(state); }, [state, ready]);

  const value = useMemo<CatalogValue>(() => {
    const published = state.articles.filter((item) => String(item.status).toLowerCase() === "published");
    return {
      articles: published.map((item) => sanitizeArticleImages(item, selectableImagePaths)),
      managed: state.articles, map: state.map, settings: state.settings,
      redirectRules: effectiveRedirectRules(state), notFoundLog: state.notFoundLog, ready,
      upsertArticle: (article) => setState((current) => {
        const exists = current.articles.some((item) => item.id === article.id);
        return { ...current, articles: exists ? current.articles.map((item) => item.id === article.id ? article : item) : [article, ...current.articles] };
      }),
      removeArticle: (id) => setState((current) => ({ ...current, articles: current.articles.filter((item) => item.id !== id || item.source === "static") })),
      setMap: (items) => setState((current) => ({ ...current, map: items })),
      upsertMapItem: (item) => setState((current) => {
        const exists = current.map.some((row) => row.id === item.id);
        return { ...current, map: exists ? current.map.map((row) => row.id === item.id ? item : row) : [item, ...current.map] };
      }),
      setSettings: (settings) => setState((current) => ({ ...current, settings })),
      setRedirectRules: (rules) => setState((current) => ({ ...current, redirectRules: rules })),
      recordNotFound: (path) => setState((current) => {
        const log = [...current.notFoundLog], existing = log.find((entry) => entry.path === path);
        const now = new Date().toISOString().slice(0, 10);
        if (existing) { existing.count += 1; existing.lastSeen = now; }
        else log.unshift({ path, firstSeen: now, lastSeen: now, count: 1, handled: false });
        return { ...current, notFoundLog: log.slice(0, 200) };
      }),
      markNotFoundHandled: (path, handledBy) => setState((current) => ({
        ...current, notFoundLog: current.notFoundLog.map((entry) => entry.path === path ? { ...entry, handled: true, handledBy } : entry),
      })),
    };
  }, [state, ready]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error("CatalogProvider missing");
  return value;
}
