import { FormEvent, useState } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Seo } from "../components/Seo";
import { SITE } from "../data/site";

export function Contact() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Seo
        title="اتصل بنا"
        description="تواصلي معنا بخصوص المحتوى التعليمي أو التصحيحات التحريرية. لا نستقبل طلبات علاج أو صرف أدوية."
        path="/contact"
      />
      <Breadcrumbs items={[{ name: "اتصل بنا", path: "/contact" }]} />
      <h1 className="mt-5 text-4xl font-bold text-teal-deep">اتصل بنا</h1>
      <p className="mt-4 leading-8 text-ink-soft">
        هذا النموذج لملاحظات تحريرية أو أسئلة عن الموقع. لا يمكن للفريق تشخيص حالتك أو وصف دواء أو ترتيب أي خدمة علاجية.
        للاستشارة الطبية راجعي جهة صحية مرخصة.
      </p>
      <p className="mt-2 text-sm">
        البريد التحريري: <a className="text-teal underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </p>
      {sent ? (
        <div className="mt-8 rounded-3xl border border-sage bg-[#eef5f0] p-6">
          تم استلام رسالتك محلياً في هذا المتصفح لأغراض العرض. إن كان لديك تصحيح لمصدر طبي، أرسليه أيضاً عبر البريد.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl border border-line bg-paper p-6">
          <label className="block text-sm font-semibold">
            الاسم
            <input required name="name" className="mt-1 w-full rounded-2xl border border-line px-3 py-2" />
          </label>
          <label className="block text-sm font-semibold">
            البريد الإلكتروني
            <input required type="email" name="email" className="mt-1 w-full rounded-2xl border border-line px-3 py-2" />
          </label>
          <label className="block text-sm font-semibold">
            موضوع الرسالة
            <select name="topic" className="mt-1 w-full rounded-2xl border border-line px-3 py-2">
              <option>ملاحظة تحريرية</option>
              <option>تصحيح مصدر</option>
              <option>مشكلة تقنية</option>
              <option>أخرى</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            الرسالة
            <textarea required name="message" rows={6} className="mt-1 w-full rounded-2xl border border-line px-3 py-2" />
          </label>
          <button type="submit" className="rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-white">
            إرسال الملاحظة
          </button>
        </form>
      )}
    </div>
  );
}
