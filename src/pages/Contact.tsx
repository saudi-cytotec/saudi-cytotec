import { useState } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ConsultCTA } from "../components/ConsultCTA";
import { Seo } from "../components/Seo";
import { CONTACT_PHONE_DISPLAY } from "../data/contact";
import { SITE } from "../data/site";

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Seo
        title="اتصل بنا"
        description="تواصل تحريري بشأن الموقع التعليمي. لا يُستخدم النموذج للتشخيص أو صرف الأدوية."
        path="/contact"
      />
      <Breadcrumbs items={[{ name: "اتصل بنا", path: "/contact" }]} />
      <h1 className="mt-5 text-4xl font-bold text-teal-deep">اتصل بنا</h1>
      <p className="mt-4 leading-8 text-ink-soft">
        هذا النموذج لملاحظات تحريرية أو أسئلة عن الموقع. لا يمكن للفريق تشخيص حالتك أو وصف دواء أو ترتيب أي خدمة علاجية.
        للاستشارة الطبية راجعي جهة صحية مرخصة.
      </p>
      <p className="mt-3 text-sm">
        البريد التحريري: <a href={`mailto:${SITE.email}`} className="text-teal">{SITE.email}</a>
      </p>
      <p className="mt-2 text-sm">
        واتساب الاستشارة: <span dir="ltr" className="font-mono">{CONTACT_PHONE_DISPLAY}</span>
      </p>
      <ConsultCTA />
      {sent ? (
        <div className="mt-8 rounded-3xl border border-sage bg-[#eef5f0] p-5 leading-8">
          تم استلام رسالتك محلياً في هذا المتصفح لأغراض العرض. إن كان لديك تصحيح لمصدر طبي، أرسليه أيضاً عبر البريد.
        </div>
      ) : (
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label className="block text-sm font-semibold">
            الاسم
            <input required className="mt-1 w-full rounded-2xl border border-line bg-paper px-4 py-2" />
          </label>
          <label className="block text-sm font-semibold">
            البريد
            <input type="email" required className="mt-1 w-full rounded-2xl border border-line bg-paper px-4 py-2" />
          </label>
          <label className="block text-sm font-semibold">
            الرسالة التحريرية
            <textarea required rows={5} className="mt-1 w-full rounded-2xl border border-line bg-paper px-4 py-2" />
          </label>
          <button type="submit" className="rounded-full bg-teal px-5 py-2 text-white">
            إرسال
          </button>
        </form>
      )}
    </div>
  );
}
