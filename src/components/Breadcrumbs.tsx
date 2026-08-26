import { Link } from "react-router-dom";
import { SITE } from "../data/site";
import { JsonLd } from "./Seo";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "الرئيسية", path: "/" }, ...items];
  return (
    <nav aria-label="مسار التنقل" className="text-sm text-ink-soft">
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
      <ol className="flex flex-wrap items-center gap-1">
        {all.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1">
            {i > 0 ? <span className="opacity-50">/</span> : null}
            {i === all.length - 1 ? (
              <span className="text-ink">{item.name}</span>
            ) : (
              <Link to={item.path} className="hover:text-teal">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
