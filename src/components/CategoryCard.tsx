import { Link } from "react-router-dom";
import type { Cluster } from "../types";

export function CategoryCard({ cluster, count }: { cluster: Cluster; count: number }) {
  return (
    <Link
      to={`/blog/cluster/${cluster.slug}`}
      className="block rounded-3xl border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h3 className="text-lg font-bold text-teal-deep">{cluster.title}</h3>
      <p className="mt-2 text-sm leading-7 text-ink-soft">{cluster.description}</p>
      <p className="mt-4 text-xs font-semibold text-sage">{count} مقالاً تعليمياً</p>
    </Link>
  );
}
