import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Article, ContentMapItem, ManagedArticle, SiteSettings } from "../types";
import { defaultSettings } from "./defaults";
import { loadState, saveState, type CmsState } from "./storage";

interface CatalogValue {
  articles: Article[];
  managed: ManagedArticle[];
  map: ContentMapItem[];
  settings: SiteSettings;
  ready: boolean;
  upsertArticle: (article: ManagedArticle) => void;
  removeArticle: (id: string) => void;
  setMap: (items: ContentMapItem[]) => void;
  upsertMapItem: (item: ContentMapItem) => void;
  setSettings: (settings: SiteSettings) => void;
}

const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CmsState>({
    articles: [],
    map: [],
    settings: defaultSettings,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const value = useMemo<CatalogValue>(() => {
    const published = state.articles.filter((item) => item.status === "published");
    return {
      articles: published,
      managed: state.articles,
      map: state.map,
      settings: state.settings,
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
    };
  }, [state, ready]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error("CatalogProvider missing");
  return value;
}
