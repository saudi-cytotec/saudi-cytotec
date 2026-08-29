import { useState } from "react";
import { referenceList } from "../../data/references";
import { saveFileRequest } from "../api";
import { Badge, Field, inputClass, Section, Td, Th } from "../ui";

/**
 * Reference library. The static list ships in src/data/references.ts; a
 * committed content/references.json (written via this screen) overrides it
 * for the whole team after the next deploy.
 */
export function ReferencesScreen() {
  const [rows, setRows] = useState(referenceList.map((ref) => ({ ...ref })));
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function patch(id: string, field: "title" | "source" | "url" | "note", value: string) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }

  async function saveToRepo() {
    setBusy(true);
    setNote(null);
    const payload = { version: 1, updatedAt: new Date().toISOString().slice(0, 10), references: rows };
    const res = await saveFileRequest("content/references.json", JSON.stringify(payload, null, 2) + "\n", "references: update library");
    setBusy(false);
    setNote(res.ok ? "حُفظت المكتبة في المستودع وستُطبق بعد إعادة النشر." : `${res.data.error || res.data.blocker || "تعذر الحفظ"} — التعديلات محلية فقط.`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold text-brand-deep">مكتبة المراجع</h1>
        <button type="button" disabled={busy} onClick={saveToRepo} className="rounded-full bg-brand px-4 py-2 text-sm text-white disabled:opacity-60">
          {busy ? "جارٍ الحفظ..." : "حفظ المكتبة في المستودع"}
        </button>
      </div>
      {note ? <p role="status" className="rounded-2xl bg-brand-soft p-3 text-sm text-brand-deep">{note}</p> : null}

      <Section title={`${rows.length} مرجعاً معتمداً`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream">
              <tr>
                <Th>المصدر</Th>
                <Th>العنوان</Th>
                <Th>الرابط</Th>
                <Th>ملاحظة عربية</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((ref) => (
                <tr key={ref.id} className="border-t border-line align-top">
                  <Td>
                    <Badge tone="info">{ref.id}</Badge>
                    <span className="block font-semibold">{ref.source}</span>
                  </Td>
                  <Td className="min-w-56">
                    <input className={inputClass()} value={ref.title} onChange={(e) => patch(ref.id, "title", e.target.value)} />
                  </Td>
                  <Td className="min-w-56">
                    <input dir="ltr" className={`${inputClass()} font-mono text-xs`} value={ref.url} onChange={(e) => patch(ref.id, "url", e.target.value)} />
                  </Td>
                  <Td className="min-w-56">
                    <textarea className={inputClass()} rows={2} value={ref.note ?? ""} onChange={(e) => patch(ref.id, "note", e.target.value)} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Field label="إضافة مرجع جديد (id فريد بحروف إنجليزية)" hint="يُضاف إلى القائمة المحلية ثم يُحفظ للمستودع.">
        <form
          className="mt-1 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const id = String(form.get("id") || "").trim();
            if (!id || rows.some((row) => row.id === id)) return;
            setRows((current) => [
              ...current,
              { id, title: String(form.get("title") || ""), source: String(form.get("source") || ""), url: String(form.get("url") || ""), note: String(form.get("note") || "") },
            ]);
            e.currentTarget.reset();
          }}
        >
          <input name="id" placeholder="id" className={`${inputClass()} w-32`} dir="ltr" />
          <input name="source" placeholder="المصدر" className={`${inputClass()} w-56`} />
          <input name="title" placeholder="العنوان" className={`${inputClass()} w-72`} dir="ltr" />
          <input name="url" placeholder="https://..." className={`${inputClass()} w-72`} dir="ltr" />
          <input name="note" placeholder="ملاحظة" className={`${inputClass()} w-64`} />
          <button className="rounded-full bg-brand px-4 py-2 text-sm text-white">إضافة</button>
        </form>
      </Field>
    </div>
  );
}
