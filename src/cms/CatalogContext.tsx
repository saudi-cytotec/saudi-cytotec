import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Article, ContentMapItem, ManagedArticle, NotFoundEntry, RedirectRule, SiteSettings } from "../types";
import { defaultSettings } from "./defaults";
import { effectiveRedirectRules, loadState, saveState, type CmsState } from "./storage";

interface CatalogValue {
  articles: Article[];
  managed: ManagedArticle[];
  map: ContentMapItem[];
  settings: SiteSettings;
  redirectRules: RedirectRule[];
  notFoundLog: NotFoundEntry[];
  ready: boolean;
  upsertArticle: (article: ManagedArticle) => void;
  removeArticle: (id: string) => void;
  setMap: (items: ContentMapItem[]) => void;
  upsertMapItem: (item: ContentMapItem) => void;
  setSettings: (settings: SiteSettings) => void;
  setRedirectRules: (rules: RedirectRule[]) => void;
  recordNotFound: (path: string) => void;
  markNotFoundHandled: (path: string, handledBy: string) => void;
}

const CatalogContext = createContext<CatalogValue | null>(null);

const EMPTY: CmsState = {
  articles: [],
  map: [],
  settings: defaultSettings,
  redirectRules: null,
  notFoundLog: [],
};

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CmsState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const value = useMemo<CatalogValue>(() => {
    // Case-insensitive on purpose: the content-map vocabulary uses "PUBLISHED"
    // while the catalog uses "published". A published article must never be
    // silently dropped from the public catalog because of a casing difference —
    // that would render its URL as a noindex 404 fallback in production.
    // Only genuinely published articles reach the public catalog. Drafts,
    // review, scheduled and archived rows stay out of the rendered site.
    const published = state.articles.filter(
      (item) => String(item.status).toLowerCase() === "published",
    );
    return {
      articles: published,
      managed: state.articles,
      map: state.map,
      settings: state.settings,
      redirectRules: effectiveRedirectRules(state),
      notFoundLog: state.notFoundLog,
      ready,
      upsertArticle: (article) => {
        setState((current) => {
          const exists = current.articles.some((item) => item.id === article.id);
          return {
            ...current,
            articles: exists
              ? current.articles.map((item) => (item.id === article.id ? article : item))
              : [article, ...current.articles],
          };
        });
      },
      removeArticle: (id) => {
        setState((current) => ({
          ...current,
          articles: current.articles.filter((item) => item.id !== id || item.source === "static"),
        }));
      },
      setMap: (items) => setState((current) => ({ ...current, map: items })),
      upsertMapItem: (item) => {
        setState((current) => {
          const exists = current.map.some((row) => row.id === item.id);
          return {
            ...current,
            map: exists ? current.map.map((row) => (row.id === item.id ? item : row)) : [item, ...current.map],
          };
        });
      },
      setSettings: (settings) => setState((current) => ({ ...current, settings })),
      setRedirectRules: (rules) => setState((current) => ({ ...current, redirectRules: rules })),
      recordNotFound: (path) =>
        setState((current) => {
          const log = [...current.notFoundLog];
          const existing = log.find((entry) => entry.path === path);
          const now = new Date().toISOString().slice(0, 10);
          if (existing) {
            existing.count += 1;
            existing.lastSeen = now;
          } else {
            log.unshift({ path, firstSeen: now, lastSeen: now, count: 1, handled: false });
          }
          return { ...current, notFoundLog: log.slice(0, 200) };
        }),
      markNotFoundHandled: (path, handledBy) =>
        setState((current) => ({
          ...current,
          notFoundLog: current.notFoundLog.map((entry) =>
            entry.path === path ? { ...entry, handled: true, handledBy } : entry,
          ),
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
