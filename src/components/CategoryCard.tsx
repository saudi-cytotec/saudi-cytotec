import { Link } from "react-router-dom";
import type { Cluster, ClusterId } from "../types";
import {
  IconAlertTriangle,
  IconBaby,
  IconBan,
  IconBook,
  IconHelp,
  IconHeartPulse,
  IconLandmark,
  IconPill,
  IconSiren,
  IconStethoscope,
  IconVenus,
} from "./icons";

/** Icon + hue per cluster, matching the approved category-card language. */
const CLUSTER_META: Record<ClusterId, { Icon: typeof IconPill; color: string; soft: string }> = {
  definition: { Icon: IconPill, color: "text-sky", soft: "bg-sky-soft" },
  uses: { Icon: IconStethoscope, color: "text-brand", soft: "bg-brand-soft" },
  safety: { Icon: IconAlertTriangle, color: "text-warn", soft: "bg-warn-soft" },
  "side-effects": { Icon: IconHeartPulse, color: "text-accent", soft: "bg-accent-soft" },
  pregnancy: { Icon: IconBaby, color: "text-[#2f9e63]", soft: "bg-[#e9f7ef]" },
  "womens-health": { Icon: IconVenus, color: "text-accent", soft: "bg-accent-soft" },
  faq: { Icon: IconHelp, color: "text-[#7048c6]", soft: "bg-[#f1ecfb]" },
  interactions: { Icon: IconBan, color: "text-[#5b6b84]", soft: "bg-sand" },
  emergency: { Icon: IconSiren, color: "text-clay", soft: "bg-[#fdeceb]" },
  evidence: { Icon: IconLandmark, color: "text-sky", soft: "bg-sky-soft" },
};

export function CategoryCard({ cluster, count }: { cluster: Cluster; count: number }) {
  const meta = CLUSTER_META[cluster.id] ?? CLUSTER_META.definition;
  const { Icon, color, soft } = meta;

  return (
    <Link
      to={`/blog/cluster/${cluster.slug}`}
      className="card-premium group flex flex-col items-center gap-3 p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgb(11_37_69/0.25)]"
    >
      <span className={`grid h-14 w-14 place-items-center rounded-2xl ${soft} ${color} transition duration-300 group-hover:scale-105`}>
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="font-display text-[1.02rem] font-bold leading-7 text-brand-deep">{cluster.title}</h3>
      <p className="text-[13px] leading-6 text-ink-soft line-clamp-2">{cluster.description}</p>
      <span className="mt-auto rounded-full bg-sky-soft px-3.5 py-1 text-xs font-bold text-brand">
        {count} {count === 1 ? "مقال" : count === 2 ? "مقالان" : count <= 10 ? "مقالات" : "مقالاً"}
      </span>
    </Link>
  );
}

/** Icon lookup helper reused by cluster hero headers. */
export function clusterMeta(id: ClusterId) {
  return CLUSTER_META[id] ?? CLUSTER_META.definition;
}

/** Book icon export for page-level use. */
export { IconBook };
