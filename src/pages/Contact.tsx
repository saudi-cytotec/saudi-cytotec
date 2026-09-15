import { useState } from "react";
import { CareReferral } from "../components/CareReferral";
import { IconShieldCheck } from "../components/icons";
import { LegacyClinicCard } from "../components/LegacyClinicCard";
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
        title="تواصل معنا - استفسارات دوائية وتحريرية"
        description="قناة التواصل مع منصة صحة المرأة السعودية - سعودي إرساء للاستفسارات عن المعلومات الدوائية والخدمات وملاحظات تصحيح المصادر. لا تشخيص ولا وصفات ولا جرعات عبر الموقع."
        path="/contact"
      />
      <PageHero
        crumbs={[{ name: "تواصل معنا", path: "/contact" }]}
        title="تواصل مع منصة صحة المرأة السعودية"
        description="للاستفسارات عن المعلومات الدوائية والخدمات، أو لتصحيح مصدر طبي، أو لملاحظة تحريرية. لا يمكن إصدار وصفة أو تحديد جرعة أو تشخيص حالة فردية عبر الموقع."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-premium p-6">
          <h2 className="font-display text-lg font-extrabold text-brand-deep">القنوات الرسمية للرعاية الصحية</h2>
          <p className="mt-2 text-sm leading-8 text-ink-soft">
            الصرف والمتابعة الطبية يتمّان عبر الجهات المرخّصة، وهذه هي قنوات وزارة الصحة الرسمية للرعاية والطوارئ.
          </p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl bg-cream p-4">
              <p className="text-xs font-bold text-brand-deep">مركز اتصال وزارة الصحة</p>
              <p className="mt-1 font-mono text-lg font-bold text-brand" dir="ltr">
                {SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value}
              </p>
              <p className="mt-1 text-xs text-ink-soft">من داخل المملكة، على مدار الساعة - استفسارات صحية عامة</p>
            </div>
            <div className="rounded-2xl bg-accent-soft p-4">
              <p className="text-xs font-bold text-accent">الإسعاف والطوارئ الطبية</p>
              <p className="mt-1 font-mono text-lg font-bold text-accent" dir="ltr">
                {SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value}
              </p>
              <p className="mt-1 text-xs text-ink-soft">للحالات الطارئة: نزيف شديد، إغماء، ألم حاد</p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-brand-soft px-4 py-3 text-xs font-semibold text-brand">
            <IconShieldCheck className="h-4.5 w-4.5" />
            لا تشخيص فردي ولا وصفات ولا جرعات عبر الموقع أو الرسائل.
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            البريد (استفسارات وملاحظات وتصحيح المصادر):{" "}
            <a href={`mailto:${EDITORIAL_EMAIL}`} className="font-bold text-brand hover:text-accent">
              {EDITORIAL_EMAIL}
            </a>
          </p>
        </div>

        <div className="space-y-6">
          <div className="card-premium p-6">
            <h2 className="font-display text-lg font-extrabold text-brand-deep">حدود الخدمة</h2>
            <ul className="mt-3 list-disc space-y-2 pr-5 text-sm leading-7 text-ink-soft">
              <li>لا نصدر وصفات طبية ولا نحدد جرعات عبر الموقع أو الرسائل.</li>
              <li>لا نشخّص الحالات الفردية؛ التشخيص والوصف للطبيب المرخّص.</li>
              <li>لا ننشر أسعاراً أو مخزوناً أو مواعيد توصيل، لأنها تحتاج تأكيداً من الجهة المرخّصة.</li>
              <li>لا نتعامل بأي بيع عبر قنوات تواصل خاصة، وأي ادعاء من هذا النوع باسمنا كاذب.</li>
              <li>لا نقدّم تعليمات استخدام منزلية أو تعليمات لإنهاء الحمل.</li>
            </ul>
          </div>
          <div className="card-premium p-6">
            <h3 className="font-bold text-brand-deep">التزامنا</h3>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              منصة صحة المرأة السعودية - سعودي إرساء: خدمات ومعلومات دوائية لصحة المرأة، نعتمد فيها على وزارة الصحة،
              الهيئة العامة للغذاء والدواء، FDA، WHO، MedlinePlus. لا نستخدم حشو أسماء المدن لأغراض SEO ولا ننشئ صفحات
              doorway مكررة، ولا ننشر بيانات تجارية غير مثبتة.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl">
        <LegacyClinicCard />
      </div>

      <div className="max-w-3xl">
        <WhatsAppContactCard />
      </div>

      {sent ? (
        <div className="card-premium border-brand/20 bg-brand-soft/50 p-5 leading-8">
          تم استلام رسالتك محلياً في هذا المتصفح لأغراض العرض. إن كان لديك استفسار أو تصحيح لمصدر طبي، أرسليه أيضاً عبر البريد.
        </div>
      ) : (
        <form
          className="card-premium space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <h2 className="font-display text-lg font-extrabold text-brand-deep">أرسلي رسالتك</h2>
          <p className="text-sm text-ink-soft">
            يُستخدم النموذج للاستفسارات عن المعلومات الدوائية والخدمات وملاحظات تصحيح المصادر. لا يمكن للفريق تشخيص حالتك
            أو وصف دواء أو تحديد جرعة عبر النموذج، والحالات العاجلة مسارها الطوارئ.
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
            الرسالة
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
