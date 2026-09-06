import { references } from "../data/references";

export function ReferencesList({ ids, title = "مراجع طبية وتنظيمية" }: { ids: string[]; title?: string }) {
  const items = ids.map((id) => references[id]).filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="mt-12 rounded-3xl border border-line bg-paper p-6">
      <h2 className="text-2xl font-bold text-teal-deep">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-ink-soft">
        الروابط التالية لمصادر عامة أو نشرات رسمية. وجود المرجع لا يعني أنه يغطي حالتك الفردية.
      </p>
      <ol className="mt-4 space-y-3">
        {items.map((ref, i) => (
          <li key={ref.id} className="text-sm leading-7">
            <span className="text-ink-soft">{i + 1}. </span>
            <a href={ref.url} target="_blank" rel="noreferrer" className="font-semibold text-teal hover:underline">
              {ref.source}: {ref.title}
            </a>
            {ref.note ? <p className="text-ink-soft">{ref.note}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
