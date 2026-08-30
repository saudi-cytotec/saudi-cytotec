import { useState } from "react";
import { CareReferral } from "../components/CareReferral";
import { IconShieldCheck } from "../components/icons";
import { PageHero } from "../components/PageHero";
import { Seo } from "../components/Seo";
import { WhatsAppContactCard } from "../components/WhatsAppContact";
import { EDITORIAL_EMAIL, HEALTH_LINES } from "../data/contact";

const SA = HEALTH_LINES.find((c) => c.code === "sa");

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <Seo
        title="اتصل بنا"
        description="تواصل تحريري بشأن الموقع التعليمي. لا يُستخدم النموذج للتشخيص أو صرف الأدوية."
        path="/contact"
      />
      <PageHero
        crumbs={[{ name: "تواصل معنا", path: "/contact" }]}
        title="تواصل معنا"
        description="للأسئلة عن المحتوى المنشور أو ملاحظات تحريرية على الموقع التعليمي."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <WhatsAppContactCard />
        <div className="space-y-6">
          <div className="card-premium p-6">
            <h2 className="font-display text-lg font-extrabold text-brand-deep">لستِ في المكان الصحيح للاستشارة الطبية</h2>
            <p className="mt-2 text-sm leading-8 text-ink-soft">
              للإسعاف في السعودية{" "}
              <span dir="ltr" className="font-mono font-bold text-clay">{SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value}</span>
              ، ولمركز اتصال وزارة الصحة{" "}
              <span dir="ltr" className="font-mono font-bold text-brand">{SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value}</span>.
              للأرقام الرسمية في الإمارات والكويت والبحرين راجعي صفحة{" "}
              <a href="/service-areas" className="font-bold text-brand hover:text-accent">مناطق التغطية</a>.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-soft px-4 py-3 text-xs font-semibold text-brand">
              <IconShieldCheck className="h-4.5 w-4.5" />
              المحتوى تعليمي عام — لا تشخيص ولا وصف دوائي عبر أي قناة.
            </div>
          </div>
          <p className="text-sm text-ink-soft">
            البريد التحريري:{" "}
            <a href={`mailto:${EDITORIAL_EMAIL}`} className="font-bold text-brand hover:text-accent">
              {EDITORIAL_EMAIL}
            </a>
          </p>
        </div>
      </div>

      {sent ? (
        <div className="card-premium border-brand/20 bg-brand-soft/50 p-5 leading-8">
          تم استلام رسالتك محلياً في هذا المتصفح لأغراض العرض. إن كان لديك تصحيح لمصدر طبي، أرسليه أيضاً عبر البريد.
        </div>
      ) : (
        <form
          className="card-premium space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <h2 className="font-display text-lg font-extrabold text-brand-deep">أرسلي ملاحظة تحريرية</h2>
          <p className="text-sm text-ink-soft">
            هذا النموذج لملاحظات تحريرية أو أسئلة عن الموقع. لا يمكن للفريق تشخيص حالتك أو وصف دواء أو ترتيب أي خدمة علاجية.
          </p>
          <label className="block text-sm font-bold text-brand-deep">
            الاسم
            <input required className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>
          <label className="block text-sm font-bold text-brand-deep">
            البريد
            <input type="email" required className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>
          <label className="block text-sm font-bold text-brand-deep">
            الرسالة التحريرية
            <textarea required rows={5} className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>
          <button type="submit" className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-deep">
            إرسال
          </button>
        </form>
      )}

      <CareReferral />
    </div>
  );
}
