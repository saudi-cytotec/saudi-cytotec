import { useState } from "react";
import { CareReferral } from "../components/CareReferral";
import { IconShieldCheck } from "../components/icons";
import { PageHero } from "../components/PageHero";
import { Seo } from "../components/Seo";
import { EDITORIAL_EMAIL, HEALTH_LINES } from "../data/contact";

const SA = HEALTH_LINES.find((c) => c.code === "sa");

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <Seo
        title="اتصل بنا - تواصل تحريري"
        description="تواصل تحريري بشأن منصة صحة المرأة السعودية التعليمية. لا يُستخدم النموذج للتشخيص أو صرف الأدوية أو بيعها."
        path="/contact"
      />
      <PageHero
        crumbs={[{ name: "تواصل معنا", path: "/contact" }]}
        title="تواصل تحريري مع منصة صحة المرأة السعودية"
        description="للأسئلة عن المحتوى المنشور أو ملاحظات تحريرية على المنصة التعليمية. لا نقدم استشارة طبية فردية ولا نبيع أدوية."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-premium p-6">
          <h2 className="font-display text-lg font-extrabold text-brand-deep">القنوات الرسمية للرعاية الصحية</h2>
          <p className="mt-2 text-sm leading-8 text-ink-soft">
            هذا الموقع تعليمي فقط. للرعاية الصحية استخدمي القنوات الرسمية لوزارة الصحة السعودية.
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
            المحتوى تعليمي عام — لا تشخيص ولا وصف دوائي ولا بيع أدوية.
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            البريد التحريري (ملاحظات تحريرية فقط):{" "}
            <a href={`mailto:${EDITORIAL_EMAIL}`} className="font-bold text-brand hover:text-accent">
              {EDITORIAL_EMAIL}
            </a>
          </p>
        </div>

        <div className="space-y-6">
          <div className="card-premium p-6">
            <h2 className="font-display text-lg font-extrabold text-brand-deep">ما الذي لا نقدمه</h2>
            <ul className="mt-3 list-disc space-y-2 pr-5 text-sm leading-7 text-ink-soft">
              <li>لا نبيع أدوية ولا نوسط للحصول عليها</li>
              <li>لا نقدم جرعات أو طرق استخدام أو تعليمات لإنهاء الحمل</li>
              <li>لا نشخص عبر الرسائل أو النماذج</li>
              <li>لا نعرض أرقام بائعين أو أسعار أو روابط تجارية</li>
              <li>لا ندعي وجود عيادة معتمدة أو فريق طبي - نحن منصة توعوية تعليمية</li>
            </ul>
          </div>
          <div className="card-premium p-6">
            <h3 className="font-bold text-brand-deep">التزامنا</h3>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              منصة صحة المرأة السعودية - سعودي إرساء منصة توعوية موثوقة. نعتمد على وزارة الصحة، الهيئة العامة للغذاء
              والدواء، FDA، WHO، MedlinePlus. لا نستخدم حشو أسماء المدن لأغراض SEO ولا ننشئ صفحات doorway مكررة.
            </p>
          </div>
        </div>
      </div>

      {sent ? (
        <div className="card-premium border-brand/20 bg-brand-soft/50 p-5 leading-8">
          تم استلام رسالتك محلياً في هذا المتصفح لأغراض العرض. إن كان لديك تصحيح لمصدر طبي، أرسليه أيضاً عبر البريد التحريري.
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
            هذا النموذج لملاحظات تحريرية أو أسئلة عن الموقع التعليمي فقط. لا يمكن للفريق تشخيص حالتك أو وصف دواء أو ترتيب أي
            خدمة علاجية أو بيع أدوية.
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
            إرسال ملاحظة تحريرية
          </button>
        </form>
      )}

      <CareReferral />
    </div>
  );
}
