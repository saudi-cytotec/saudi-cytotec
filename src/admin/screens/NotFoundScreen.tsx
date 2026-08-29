import { useEffect, useState } from "react";
import { useCatalog } from "../../cms/CatalogContext";
import type { RedirectRule } from "../../types";
import { notFoundLogRequest, notFoundSyncRequest } from "../api";
import { Badge, EmptyState, Section, Td, Th } from "../ui";

export function NotFoundScreen() {
  const { notFoundLog, setRedirectRules, redirectRules, markNotFoundHandled } = useCatalog();
  const [committed, setCommitted] = useState<{ path: string; count: number; lastSeen: string }[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    notFoundLogRequest()
      .then((res) => {
        if (res.ok && Array.isArray(res.data.entries)) {
          setCommitted(res.data.entries as { path: string; count: number; lastSeen: string }[]);
        }
      })
      .catch(() => undefined);
  }, []);

  async function sync() {
    setBusy(true);
    setNote(null);
    const res = await notFoundSyncRequest(notFoundLog);
    setBusy(false);
    setNote(res.ok ? res.data.note ?? "تمت المزامنة." : `${res.data.error || res.data.blocker || "تعذرت المزامنة"} — السجل محلي.`);
  }

  function quickRedirect(path: string, destination: string, reason: string) {
    const exists = redirectRules.some((rule) => rule.source === path);
    if (exists) return;
    const rule: RedirectRule = {
      source: path,
      destination,
      statusCode: 301,
      reason,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setRedirectRules([...redirectRules, rule]);
    markNotFoundHandled(path, `redirect:${destination}`);
    setNote(`أُضيفت القاعدة ${path} → ${destination}. لا تنسي «حفظ ومزامنة vercel.json» من تبويب مدير إعادة التوجيه.`);
  }

  const open = notFoundLog.filter((entry) => !entry.handled);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold text-brand-deep">مراقب 404</h1>
        <button type="button" disabled={busy} onClick={sync} className="rounded-full bg-brand px-4 py-2 text-sm text-white disabled:opacity-60">
          {busy ? "جارٍ المزامنة..." : "مزامنة السجل مع المستودع"}
        </button>
      </div>

      <p className="max-w-3xl text-sm leading-7 text-ink-soft">
        تُسجَّل الزيارات لصفحات غير موجودة في هذا المتصفح تلقائياً (بدون طلبات شبكة من الزوار)، ويمكن مزامنتها إلى <span dir="ltr">content/404-log.json</span> ليراها الفريق. كل ضربة تُحوَّل إلى قاعدة 301 (ببديل مكافئ) أو تُترك 404/410 — لا تحويل عام إلى الرئيسية.
      </p>

      {note ? <p role="status" className="rounded-2xl bg-brand-soft p-3 text-sm text-brand-deep">{note}</p> : null}

      <Section title={`ضربات 404 في هذه الجلسة — ${open.length} غير معالجة`}>
        {notFoundLog.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream">
                <tr>
                  <Th>المسار</Th>
                  <Th>المرات</Th>
                  <Th>أول ظهور</Th>
                  <Th>آخر ظهور</Th>
                  <Th>الحالة</Th>
                  <Th>إجراء سريع</Th>
                </tr>
              </thead>
              <tbody>
                {notFoundLog.map((entry) => (
                  <tr key={entry.path} className="border-t border-line align-top">
                    <Td className="font-mono text-xs" ><span dir="ltr">{entry.path}</span></Td>
                    <Td>{entry.count}</Td>
                    <Td>{entry.firstSeen}</Td>
                    <Td>{entry.lastSeen}</Td>
                    <Td>{entry.handled ? <Badge tone="ok">عولجت ({entry.handledBy})</Badge> : <Badge tone="warn">مفتوحة</Badge>}</Td>
                    <Td>
                      {!entry.handled ? (
                        <div className="flex flex-wrap gap-1">
                          <button type="button" className="rounded-full border border-line px-2 py-0.5 text-xs" onClick={() => quickRedirect(entry.path, "/", "404 مكررة → الرئيسية (بديل عام)")}>
                            → الرئيسية
                          </button>
                          <button type="button" className="rounded-full border border-line px-2 py-0.5 text-xs" onClick={() => quickRedirect(entry.path, "/blog", "404 → صفحة المقالات")}>
                            → المقالات
                          </button>
                          <button type="button" className="rounded-full border border-clay px-2 py-0.5 text-xs text-clay" onClick={() => markNotFoundHandled(entry.path, "410-review")}>
                            ترك 404
                          </button>
                        </div>
                      ) : null}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState text="لا توجد ضربات 404 مسجلة في هذا المتصفح بعد. تصفحي الموقع بجلسة عادية لتسجيلها." />
        )}
      </Section>

      <Section title="سجل المستودع الملتزم">
        {committed.length ? (
          <div className="grid gap-2 md:grid-cols-2">
            {committed.map((entry) => (
              <div key={entry.path} className="flex items-center justify-between rounded-2xl border border-line px-3 py-2 text-xs">
                <span className="font-mono" dir="ltr">{entry.path}</span>
                <span className="text-ink-soft">×{entry.count} · {entry.lastSeen}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="لا يوجد سجل ملتزم بعد في content/404-log.json." />
        )}
      </Section>
    </div>
  );
}
