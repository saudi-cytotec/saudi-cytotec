import { Link } from "react-router-dom";
import { EDITORIAL_EMAIL, HEALTH_LINES } from "../data/contact";

const SA = HEALTH_LINES.find((c) => c.code === "sa");
import { clusters, moreNav, SITE } from "../data/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-accent bg-brand-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="" className="h-12 w-12 rounded-2xl object-cover" />
            <strong className="text-lg">{SITE.name}</strong>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-8 text-white/75">
            منصة تعليمية عربية لشرح المعلومات العامة عن سايتوتك (ميزوبروستول) وصحة المرأة ذات الصلة، مع التركيز على
            الأمان، التحذيرات، المصادر، ومتى تجب مراجعة الطبيب.
          </p>
          <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4">
            <p className="text-xs font-bold text-white">لرعاية طبية حقيقية</p>
            <p className="mt-1 text-xs leading-6 text-white/75">
              الإسعاف <span dir="ltr" className="font-mono">{SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value}</span>{" "}
              · وزارة الصحة السعودية{" "}
              <span dir="ltr" className="font-mono">{SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value}</span>
            </p>
            <p className="mt-2 text-xs text-white/75">
              ملاحظات تحريرية فقط:{" "}
              <a href={`mailto:${EDITORIAL_EMAIL}`} className="underline underline-offset-4 hover:text-white">
                {EDITORIAL_EMAIL}
              </a>
            </p>
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold">صفحات أساسية</h2>
          <ul className="space-y-2 text-sm text-white/75">
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
          <ul className="space-y-2 text-sm text-white/75">
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
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. جميع الحقوق محفوظة.
          </p>
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
