import { Link } from "react-router-dom";
import { SITE } from "../data/site";
import { JsonLd } from "./Seo";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all = [{ name: "الرئيسية", path: "/" }, ...items];
  const light = tone === "light";
  return (
    <nav aria-label="مسار التنقل" className={`text-sm ${light ? "text-white/70" : "text-ink-soft"}`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${SITE.domain}${item.path}`,
          })),
        }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {i > 0 ? <span className="opacity-40" aria-hidden="true">/</span> : null}
            {i === all.length - 1 ? (
              <span className={light ? "font-semibold text-white" : "font-semibold text-ink"}>{item.name}</span>
            ) : (
              <Link to={item.path} className={light ? "transition hover:text-white" : "transition hover:text-brand"}>
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
