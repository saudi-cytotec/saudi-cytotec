import { Link } from "react-router-dom";
import { clusters, moreNav, SITE } from "../data/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-teal-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="" className="h-12 w-12 rounded-2xl object-cover" />
            <strong className="text-lg">{SITE.name}</strong>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-8 text-sand">
            منصة تعليمية عربية لشرح المعلومات العامة عن سايتوتك (ميزوبروستول) وصحة المرأة ذات الصلة، مع التركيز على
            الأمان، التحذيرات، المصادر، ومتى تجب مراجعة الطبيب. لا نبيع أدوية ولا نقدّم خطط علاج فردية.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold">صفحات أساسية</h2>
          <ul className="space-y-2 text-sm text-sand">
            {moreNav.slice(0, 6).map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold">مجموعات المقالات</h2>
          <ul className="space-y-2 text-sm text-sand">
            {clusters.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link to={`/blog/cluster/${c.slug}`} className="hover:text-white">
                  {c.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-sand sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. جميع الحقوق محفوظة.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy">سياسة الخصوصية</Link>
            <Link to="/medical-disclaimer">إخلاء المسؤولية الطبية</Link>
            <Link to="/sitemap">خريطة الموقع</Link>
            <Link to="/contact">اتصل بنا</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
