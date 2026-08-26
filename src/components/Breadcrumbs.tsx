import { Link } from "react-router-dom";
import { JsonLd } from "./Seo";
import { SITE } from "../data/site";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "الرئيسية", path: "/" }, ...items];
  return (
    <>
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
      <nav aria-label="مسار التنقل" className="text-sm text-ink-soft">
        <ol className="flex flex-wrap items-center gap-2">
          {all.map((item, i) => (
            <li key={item.path} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden="true">/</span> : null}
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
    </>
  );
}
