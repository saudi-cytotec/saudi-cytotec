import { useMemo, useState } from "react";
import { useCatalog } from "../../cms/CatalogContext";
import { mapRegistry, suggestSlugForTopic } from "../../cms/registrySource";
import type { ContentMapItem, MapPriority, MapStatus } from "../../types";
import { saveFileRequest } from "../api";
import { Badge, EmptyState, StatusBadge, Td, Th, inputClass } from "../ui";

const STATUS_ORDER: MapStatus[] = ["IDEA", "RESEARCH", "OUTLINE", "DRAFT", "REVIEW", "READY", "PUBLISHED", "UPDATED"];
const PRIORITIES: MapPriority[] = ["P0", "P1", "P2", "P3"];

export function MapScreen() {
  const { map, upsertMapItem, managed } = useCatalog();
  const [q, setQ] = useState("");
  const [clusterFilter, setClusterFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const liveSlugs = useMemo(() => new Set(managed.filter((a) => a.status === "published").map((a) => a.slug)), [managed]);

  const rows = map
    .filter((row) => (clusterFilter ? row.cluster === clusterFilter : true))
    .filter((row) => (statusFilter ? row.status === statusFilter : true))
    .filter((row) => `${row.id} ${row.topic} ${row.primaryKeyword} ${row.targetUrl}`.includes(q));

  const counts = useMemo(() => {
    const byStatus = new Map<MapStatus, number>();
    for (const status of STATUS_ORDER) byStatus.set(status, map.filter((row) => row.status === status).length);
    return byStatus;
  }, [map]);

  const conflicts = useMemo(() => {
    const urls = new Map<string, number>();
    const topics = new Map<string, number>();
    for (const row of map) {
      urls.set(row.targetUrl, (urls.get(row.targetUrl) ?? 0) + 1);
      topics.set(row.topic.trim(), (topics.get(row.topic.trim()) ?? 0) + 1);
    }
    return map.filter(
      (row) => (urls.get(row.targetUrl) ?? 0) > 1 || (topics.get(row.topic.trim()) ?? 0) > 1,
    );
  }, [map]);

  function patchRow(id: string, patch: Partial<ContentMapItem>) {
    const row = map.find((item) => item.id === id);
    if (row) upsertMapItem({ ...row, ...patch });
  }

  async function commitToRepo() {
    setBusy(true);
    setNote(null);
    const payload = JSON.stringify({ ...mapRegistry, items: map }, null, 2) + "\n";
    const res = await saveFileRequest("content/map.json", payload, "content-map: update 100-topic map statuses");
    setBusy(false);
    if (res.ok) setNote("حُفظت الخريطة في المستودع وستظهر بعد إعادة النشر.");
    else setNote(`${res.data.error || res.data.blocker || "تعذر الحفظ في المستودع."} — التغييرات محفوظة محلياً.`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold text-brand-deep">خريطة المحتوى — 100 موضوع</h1>
        <button type="button" disabled={busy} onClick={commitToRepo} className="rounded-full bg-brand px-4 py-2 text-sm text-white disabled:opacity-60">
          {busy ? "جارٍ الحفظ..." : "حفظ الخريطة في المستودع"}
        </button>
      </div>
      {note ? <p role="status" className="rounded-2xl bg-brand-soft p-3 text-sm text-brand-deep">{note}</p> : null}

      <div className="grid gap-2 md:grid-cols-4">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="flex items-center justify-between rounded-2xl border border-line bg-paper px-3 py-2 text-sm">
            <StatusBadge status={status} />
            <strong>{counts.get(status) ?? 0}</strong>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <input className={inputClass()} placeholder="بحث بالموضوع أو الكلمة أو الرابط" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={inputClass()} value={clusterFilter} onChange={(e) => setClusterFilter(e.target.value)}>
          <option value="">كل المجموعات</option>
          {mapRegistry.clusters.map((cluster) => (
            <option key={cluster.id} value={cluster.id}>
              {cluster.id} — {cluster.title}
            </option>
          ))}
        </select>
        <select className={inputClass()} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">كل الحالات</option>
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {conflicts.length ? (
        <p className="rounded-2xl bg-accent-soft p-3 text-sm text-clay">
          تعارضات (رابط أو موضوع مكرر): {conflicts.map((c) => c.id).join("، ")}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-cream">
            <tr>
              <Th>ID</Th>
              <Th>الموضوع</Th>
              <Th>الكلمة الأساسية</Th>
              <Th>القصد</Th>
              <Th>الدولة</Th>
              <Th>الأولوية</Th>
              <Th>الرابط المستهدف</Th>
              <Th>الحالة</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isLive = liveSlugs.has(row.targetUrl.replace("/blog/", ""));
              return (
                <tr key={row.id} className="border-t border-line align-top">
                  <Td className="font-mono text-xs">{row.id}</Td>
                  <Td>
                    <strong>{row.topic}</strong>
                    {row.secondaryKeywords.length ? (
                      <span className="block text-xs text-ink-soft">{row.secondaryKeywords.join("، ")}</span>
                    ) : null}
                  </Td>
                  <Td>{row.primaryKeyword}</Td>
                  <Td>{row.searchIntent}</Td>
                  <Td>{row.country}</Td>
                  <Td>
                    <select value={row.priority} onChange={(e) => patchRow(row.id, { priority: e.target.value as MapPriority })} className="rounded-full border border-line px-2 py-1 text-xs">
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </Td>
                  <Td className="font-mono text-xs">
                    <span dir="ltr" className="block">{row.targetUrl}</span>
                    {isLive ? <Badge tone="ok">منشور فعلياً</Badge> : null}
                    {row.parent ? <span className="block text-[10px] text-ink-soft">الأصل: {row.parent}</span> : null}
                    {row.internalLinks?.length ? <span className="block text-[10px] text-ink-soft">روابط: {row.internalLinks.slice(0, 3).join("، ")}</span> : null}
                    {row.faqOpportunities?.length ? <span className="block text-[10px] text-ink-soft">FAQ: {row.faqOpportunities.slice(0, 2).join("، ")}</span> : null}
                    {row.cta ? <span className="block text-[10px] text-ink-soft">CTA: {row.cta}</span> : null}
                  </Td>
                  <Td>
                    <select value={row.status} onChange={(e) => patchRow(row.id, { status: e.target.value as MapStatus })} className="rounded-full border border-line px-2 py-1 text-xs">
                      {STATUS_ORDER.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!rows.length ? <EmptyState text="لا توجد صفوف مطابقة للمرشحات." /> : null}
      </div>

      <p className="text-xs leading-6 text-ink-soft">
        المصدر: <span dir="ltr">content/map.json</span> (ملتزم في المستودع). تعديلات الحالة تُحفظ محلياً فوراً، وزر «حفظ الخريطة في المستودع» يلتزمها في Git لتصبح مشتركة مع فريق التحرير. المواضيع المخططة لا تُنشر آلياً — كل مقال يمر بالمسار IDEA ← RESEARCH ← OUTLINE ← DRAFT ← REVIEW ← READY ← PUBLISHED.
        {suggestSlugForTopic("") ? "" : ""}
      </p>
    </div>
  );
}
