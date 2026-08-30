import { mediaLibrary } from "../../data/media";
import { Section } from "../ui";

/**
 * Media library — READ-ONLY.
 *
 * Only the three owner-approved image assets exist in this project:
 * the logo, the homepage hero banner and the permanent article WhatsApp
 * banner. Image upload has been removed, so no new image asset can be added
 * through the CMS — the approved set cannot drift.
 */
export function MediaScreen() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-brand-deep">مكتبة الوسائط</h1>
      <p className="max-w-3xl text-sm leading-7 text-ink-soft">
        الأصول المعتمدة فقط (3): الشعار المعتمد، بانر الصفحة الرئيسية، وبانر واتساب المقالات. لا رفع صور جديد —
        أي إضافة تتجاوز المجموعة المعتمدة مرفوضة من النظام.
      </p>

      <Section title="الأصول المعتمدة (لا تُعدَّل ولا تُستبدل)">
        <div className="grid gap-4 md:grid-cols-3">
          {mediaLibrary.map((item) => (
            <div key={item.file} className="rounded-3xl border border-line bg-paper p-4">
              <div className="h-40 overflow-hidden rounded-2xl bg-cream">
                <img src={item.file} alt={item.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <p className="mt-3 flex items-center justify-between gap-2 font-mono text-xs" dir="ltr">
                {item.file}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                {item.width}×{item.height} · {item.role}
              </p>
              <p className="mt-1 text-xs leading-5">ALT: {item.alt || "زخرفية (فارغة)"}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
