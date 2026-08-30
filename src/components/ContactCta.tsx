import { Link } from "react-router-dom";
import { APPROVED_WHATSAPP_NUMBER, whatsappUrl } from "../data/conversion";

export function ContactCta({ compact = false, topic = "سؤال عام" }: { compact?: boolean; topic?: string }) {
  return (
    <section className={`rounded-3xl border border-brand/20 bg-brand-soft p-5 ${compact ? "" : "my-10"}`} aria-label="خطوة تواصل مناسبة">
      <p className="text-xs font-bold text-brand">الخطوة التالية</p>
      <h2 className="mt-1 text-xl font-bold text-brand-deep">تحتاجين توجيهاً لصفحة مناسبة أو توضيحاً عاماً؟</h2>
      <p className="mt-2 text-sm leading-7 text-ink-soft">
        يمكن استخدام واتساب للتواصل العام حول محتوى الموقع فقط. لا نبيع أدوية، ولا نقدم جرعات أو تشخيصاً فردياً. عند الأعراض الحادة اتجهي للطوارئ فوراً.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={whatsappUrl(`مرحباً، لدي ${topic} وأحتاج رابطاً تعليمياً مناسباً من موقع سايتوتك في السعودية.`)}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:brightness-110"
        >
          واتساب {APPROVED_WHATSAPP_NUMBER}
        </a>
        <Link to="/contact" className="rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-brand-deep">
          صفحة الاتصال
        </Link>
        <Link to="/when-to-see-doctor" className="rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-brand-deep">
          علامات الطوارئ
        </Link>
      </div>
    </section>
  );
}
