import { useMemo, useState } from "react";
import { useCatalog } from "../../cms/CatalogContext";
import type { RedirectRule } from "../../types";
import { syncRedirectsRequest } from "../api";
import { Badge, EmptyState, Field, Section, Td, Th, inputClass } from "../ui";

export function RedirectsScreen() {
  const { redirectRules, setRedirectRules } = useCatalog();
  const [wwwToApex, setWwwToApex] = useState(true);
  const [q, setQ] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ source: "", destination: "", reason: "" });

  const problems = useMemo(() => {
    const list: string[] = [];
    const sources = new Set(redirectRules.map((rule) => rule.source));
    for (const rule of redirectRules) {
      if (rule.destination && sources.has(rule.destination)) {
        list.push(`حلقة: ${rule.source} → ${rule.destination}`);
      }
      if (rule.statusCode === 301 && !rule.destination) {
        list.push(`301 بلا وجهة: ${rule.source}`);
      }
    }
    return list;
  }, [redirectRules]);

  const rows = redirectRules.filter((rule) => `${rule.source} ${rule.destination} ${rule.reason}`.includes(q));

  function addRule() {
    if (!form.source || !form.reason) return;
    const rule: RedirectRule = {
      source: form.source.startsWith("/") ? form.source : `/${form.source}`,
      destination: form.destination.startsWith("/") || !form.destination ? form.destination : `/${form.destination}`,
      statusCode: form.destination ? 301 : 410,
      reason: form.reason,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setRedirectRules([...redirectRules, rule]);
    setForm({ source: "", destination: "", reason: "" });
  }

  function updateRule(index: number, patch: Partial<RedirectRule>) {
    setRedirectRules(redirectRules.map((rule, i) => (i === index ? { ...rule, ...patch } : rule)));
  }

  function removeRule(index: number) {
    setRedirectRules(redirectRules.filter((_, i) => i !== index));
  }

  async function commit() {
    if (problems.length) {
      setNote("لا يمكن الحفظ: " + problems.join("؛ "));
      return;
    }
    setBusy(true);
    setNote(null);
    const res = await syncRedirectsRequest(redirectRules, wwwToApex);
    setBusy(false);
    if (res.ok) setNote(res.data.note ?? "تمت المزامنة.");
    else setNote(`${res.data.error || res.data.blocker || "تعذرت المزامنة"} — القواعد محفوظة محلياً.`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold text-brand-deep">مدير إعادة التوجيه</h1>
        <button type="button" disabled={busy} onClick={commit} className="rounded-full bg-brand px-4 py-2 text-sm text-white disabled:opacity-60">
          {busy ? "جارٍ الالتزام..." : "حفظ ومزامنة القواعد"}
        </button>
      </div>

      <p className="max-w-3xl text-sm leading-7 text-ink-soft">
        المصدر الرسمي: <span dir="ltr">content/redirects.json</span> — تُولَّد منه قواعد الحافة 301 في <span dir="ltr">vercel.json</span> وقواعد 410 في <span dir="ltr">middleware.js</span> (إعادة توجيه 410 حقيقية قبل تحويل SPA). الحفظ يلتزم الملفات معاً في Commit واحد ذري ويفعّل إعادة النشر. القاعدة: 301 فقط لبديل مكافئ حقيقي؛ و410 للمحتوى الملغى؛ ولا تحويل عام لكل 404 إلى الرئيسية.
      </p>

      {problems.length ? (
        <p className="rounded-2xl bg-accent-soft p-3 text-sm text-clay">حماية من الحلقات — عالجي قبل الحفظ: {problems.join("؛ ")}</p>
      ) : null}
      {note ? <p role="status" className="rounded-2xl bg-brand-soft p-3 text-sm text-brand-deep">{note}</p> : null}

      <Section title="إضافة قاعدة">
        <form
          className="grid gap-3 md:grid-cols-[1fr_1fr_2fr_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            addRule();
          }}
        >
          <Field label="Old URL (source)">
            <input dir="ltr" className={inputClass()} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="/old-url" />
          </Field>
          <Field label="New URL (destination)" hint="اتركيه فارغاً لقاعدة 410 Gone.">
            <input dir="ltr" className={inputClass()} value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="/new-url" />
          </Field>
          <Field label="السبب (موثق)">
            <input className={inputClass()} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </Field>
          <div className="flex items-end">
            <button className="rounded-full border border-line px-4 py-2 text-sm">إضافة</button>
          </div>
        </form>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <input className={inputClass()} placeholder="بحث في القواعد" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={wwwToApex} onChange={(e) => setWwwToApex(e.target.checked)} />
          تحويل www إلى النطاق الأساسي
        </label>
        <span className="text-xs text-ink-soft">{rows.length} قاعدة</span>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-cream">
            <tr>
              <Th>Old URL</Th>
              <Th>New URL</Th>
              <Th>الحالة</Th>
              <Th>السبب</Th>
              <Th>أُنشئت</Th>
              <Th>إجراء</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((rule, index) => (
              <tr key={`${rule.source}-${index}`} className="border-t border-line align-top">
                <Td>
                  <input dir="ltr" className={`${inputClass()} font-mono text-xs`} value={rule.source} onChange={(e) => updateRule(index, { source: e.target.value })} />
                </Td>
                <Td>
                  <input dir="ltr" className={`${inputClass()} font-mono text-xs`} value={rule.destination ?? ""} placeholder="(410 — بلا وجهة)" onChange={(e) => updateRule(index, { destination: e.target.value, statusCode: e.target.value ? 301 : 410 })} />
                </Td>
                <Td><Badge tone={rule.statusCode === 301 ? "ok" : "bad"}>{rule.statusCode}</Badge></Td>
                <Td className="min-w-48 text-xs leading-5">{rule.reason}</Td>
                <Td className="text-xs" >{rule.createdAt}</Td>
                <Td>
                  <button type="button" className="text-clay" onClick={() => removeRule(index)}>حذف</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? <EmptyState text="لا توجد قواعد." /> : null}
      </div>
    </div>
  );
}
