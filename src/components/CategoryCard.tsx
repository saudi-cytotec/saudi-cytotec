import { Link } from "react-router-dom";
import type { Cluster } from "../types";

export function CategoryCard({ cluster, count }: { cluster: Cluster; count: number }) {
  return (
    <Link
      to={`/blog/cluster/${cluster.slug}`}
      className="overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_8px_30px_rgba(15,76,92,0.04)]"
    >
      <img src={cluster.image} alt="" className="h-36 w-full object-cover" loading="lazy" />
      <div className="space-y-2 p-5">
        <h3 className="text-lg font-bold text-teal-deep">{cluster.title}</h3>
        <p className="text-sm leading-7 text-ink-soft">{cluster.description}</p>
        <p className="text-xs font-semibold text-gold">{count} مقالاً تعليمياً</p>
      </div>
    </Link>
  );
}
