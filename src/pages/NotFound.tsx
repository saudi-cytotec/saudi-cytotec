import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

export function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <Seo title="الصفحة غير موجودة" description="تعذر العثور على الصفحة المطلوبة." path="/404" noindex />
      <h1 className="text-4xl font-bold text-teal-deep">الصفحة غير موجودة</h1>
      <p className="mt-4 leading-8 text-ink-soft">ربما تغيّر الرابط أو كُتب بشكل غير صحيح.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/" className="rounded-full bg-teal px-5 py-2 text-white">
          الرئيسية
        </Link>
        <Link to="/blog" className="rounded-full border border-line px-5 py-2">
          المقالات
        </Link>
      </div>
    </div>
  );
}
