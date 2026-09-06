import { useState } from "react";
import { useCatalog } from "../../cms/CatalogContext";
import { saveFileRequest } from "../api";
import { Field, Section, inputClass } from "../ui";

export function SettingsScreen() {
  const { settings, setSettings } = useCatalog();
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function saveToRepo() {
    setBusy(true);
    setNote(null);
    const payload = { version: 1, updatedAt: new Date().toISOString().slice(0, 10), settings };
    const res = await saveFileRequest("content/settings.json", JSON.stringify(payload, null, 2) + "\n", "settings: update site settings");
    setBusy(false);
    setNote(res.ok ? "حُفظت الإعدادات في المستودع وستُطبق بعد إعادة النشر." : `${res.data.error || res.data.blocker || "تعذر الحفظ"} — الإعدادات محلية فقط.`);
  }

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-3xl font-bold text-brand-deep">إعدادات الموقع</h1>
      <Section title="الهوية والنطاق">
        <div className="grid gap-4">
          <Field label="اسم الموقع">
            <input className={inputClass()} value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
          </Field>
          <Field label="النطاق" hint="يُستخدم في canonical وOpen Graph وsitemap.">
            <input dir="ltr" className={inputClass()} value={settings.domain} onChange={(e) => setSettings({ ...settings, domain: e.target.value })} />
          </Field>
          <Field label="البريد التحريري">
            <input dir="ltr" className={inputClass()} value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
          </Field>
          <Field label="الوصف العام" hint="يظهر في الصفحة الرئيسية وOpen Graph الافتراضي.">
            <textarea className={inputClass()} rows={3} value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.indexPublic} onChange={(e) => setSettings({ ...settings, indexPublic: e.target.checked })} />
            المحتوى العام قابل للفهرسة (index) — تعطيله يضيف noindex على كل الصفحات العامة
          </label>
        </div>
        <button type="button" disabled={busy} onClick={saveToRepo} className="mt-5 rounded-full bg-brand px-4 py-2 text-sm text-white disabled:opacity-60">
          {busy ? "جارٍ الحفظ..." : "حفظ الإعدادات في المستودع"}
        </button>
        {note ? <p role="status" className="mt-3 rounded-2xl bg-brand-soft p-3 text-sm text-brand-deep">{note}</p> : null}
      </Section>

      <Section title="أمان البيانات">
        <ul className="list-disc space-y-2 pr-6 text-sm leading-7 text-ink-soft">
          <li>لا مفاتيح في الواجهة الأمامية: OPENAI_API_KEY وGITHUB_PUBLISH_TOKEN وADMIN_PASSWORD وADMIN_SESSION_SECRET تُقرأ من بيئة Vercel فقط (api/*).</li>
          <li>لا نشر مجدول ولا cron — النشر يتم يدوياً من المحرر بعد جلسة مشرف فقط.</li>
          <li>الأصول الدائمة ثلاثة فقط (الشعار، بانر الرئيسية، social-share للـOG/Twitter metadata فقط)؛ أما صور CMS فمرفوعة ومسجلة يدوياً تحت /media/. تمت إزالة بانر واتساب كجزء من إعادة التموضع إلى صحة المرأة.</li>
          <li>الجلسة الإدارية: كوكي HttpOnly موقّع بـ HMAC مع مهلة 12 ساعة.</li>
          <li>CSP مقيّد + X-Frame-Options DENY + nosniff على كل الاستجابات (vercel.json).</li>
          <li>/admin و/api بلا تخزين مؤقت (no-store).</li>
        </ul>
      </Section>
    </div>
  );
}
