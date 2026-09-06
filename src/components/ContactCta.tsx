import { Link } from "react-router-dom";
import { HEALTH_LINES } from "../data/contact";

export function ContactCta({ compact = false, topic = "سؤال عام" }: { compact?: boolean; topic?: string }) {
  const SA = HEALTH_LINES.find((c) => c.code === "sa");
  const moh = SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value ?? "937";
  const ems = SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value ?? "997";

  return (
    <section
      className={`rounded-3xl border border-brand/20 bg-brand-soft p-5 ${compact ? "" : "my-10"}`}
      aria-label="خطوة تواصل مناسبة"
    >
      <p className="text-xs font-bold text-brand">الخطوة التالية</p>
      <h2 className="mt-1 text-xl font-bold text-brand-deep">تحتاجين توجيهاً لصفحة مناسبة؟</h2>
      <p className="mt-2 text-sm leading-7 text-ink-soft">
        هذا الموقع تعليمي عام حول {topic}. لا نبيع أدوية، ولا نقدم جرعات أو تشخيصاً فردياً. للرعاية الطبية استخدمي القنوات
        الرسمية: وزارة الصحة <span dir="ltr" className="font-mono font-bold">{moh}</span> والطوارئ{" "}
        <span dir="ltr" className="font-mono font-bold">{ems}</span>.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/contact"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-deep"
        >
          صفحة الاتصال التحريري
        </Link>
        <Link
          to="/when-to-see-doctor"
          className="rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-brand-deep hover:bg-cream"
        >
          علامات الطوارئ
        </Link>
        <Link
          to="/medical-sources"
          className="rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-brand-deep hover:bg-cream"
        >
          المصادر الطبية
        </Link>
      </div>
    </section>
  );
}
