import { Link } from "react-router-dom";
import { CONTACT_PHONE_DISPLAY, WHATSAPP_MESSAGE } from "../data/contact";
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
            الأمان، التحذيرات، المصادر، ومتى تجب مراجعة الطبيب.
          </p>
          <a
            href={WHATSAPP_MESSAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white"
          >
            <svg viewBox="0 0 32 32" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M16.02 4C9.4 4 4 9.4 4 16.02c0 2.11.55 4.17 1.6 5.99L4 28l6.15-1.6a11.94 11.94 0 0 0 5.87 1.5h.01c6.62 0 12.02-5.4 12.02-12.02 0-3.21-1.25-6.23-3.52-8.5A11.93 11.93 0 0 0 16.02 4z" />
            </svg>
            <span dir="ltr" className="font-mono">{CONTACT_PHONE_DISPLAY}</span>
          </a>
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
