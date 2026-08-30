import { Link } from "react-router-dom";
import { useCatalog } from "../../cms/CatalogContext";
import { clusters } from "../../data/site";
import { Td, Th } from "../ui";

export function CategoriesScreen() {
  const { managed, map } = useCatalog();
  const strategyClusters = map.reduce<Map<string, typeof map>>((acc, row) => {
    if (!acc.has(row.cluster)) acc.set(row.cluster, []);
    acc.get(row.cluster)!.push(row);
    return acc;
  }, new Map());

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-deep">التصنيفات والمجموعات</h1>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-ink-soft">
        عشر مجموعات منشورة في الموقع (مصدرها <span dir="ltr">src/data/site.ts</span>)، وخريطة المحتوى تغطيها مع مجموعات التوسع A–J. كل مقال جديد يجب أن يحدد مجموعته ومقاله الأصلي (Parent).
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {clusters.map((cluster) => {
          const inCluster = managed.filter((a) => a.cluster === cluster.id);
          const published = inCluster.filter((a) => a.status === "published").length;
          return (
            <div key={cluster.id} className="rounded-3xl border border-line bg-paper p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold text-brand-deep">{cluster.title}</h2>
                <Link to={`/blog/cluster/${cluster.slug}`} target="_blank" className="text-xs text-brand underline" rel="noreferrer">
                  الصفحة العامة
                </Link>
              </div>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{cluster.description}</p>
              <p className="mt-3 text-xs">
                <strong>{published}</strong> منشور · <strong>{inCluster.filter((a) => a.status === "draft").length}</strong> مسودة
              </p>
              <div className="mt-3 border-t border-line pt-3">
                <p className="text-xs font-semibold text-ink-soft">مواضيع خريطة المحتوى المرتبطة:</p>
                <ul className="mt-1 flex flex-wrap gap-1 text-xs">
                  {(strategyClusters.get(cluster.id) ?? []).slice(0, 6).map((row) => (
                    <li key={row.id} className="rounded-full bg-cream px-2 py-0.5">
                      {row.id}: {row.topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-8 text-xl font-bold text-brand-deep">مجموعات التوسع في خريطة المحتوى (A–J)</h2>
      <div className="mt-3 overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-cream">
            <tr>
              <Th>المجموعة</Th>
              <Th>العنوان</Th>
              <Th>عدد المواضيع</Th>
              <Th>منشور / محدّث</Th>
              <Th>الركن (Pillar)</Th>
            </tr>
          </thead>
          <tbody>
            {[...strategyClusters.entries()].map(([letter, rows]) => {
              const done = rows.filter((row) => row.status === "PUBLISHED" || row.status === "UPDATED").length;
              const pillar = rows.find((row) => row.parent === row.targetUrl) ?? rows[0];
              return (
                <tr key={letter} className="border-t border-line">
                  <Td className="font-bold">{letter}</Td>
                  <Td>{pillar?.topic ? (pillar.topic.match(/: (.*)$/)?.[1] ?? pillar.topic) : "—"}</Td>
                  <Td>{rows.length}</Td>
                  <Td>{done}</Td>
                  <Td className="font-mono text-xs" ><span dir="ltr">{pillar?.targetUrl}</span></Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
