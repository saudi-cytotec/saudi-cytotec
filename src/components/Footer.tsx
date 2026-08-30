import { Link } from "react-router-dom";
import { BrandLogo } from "./Logo";
import { WhatsAppContactLink } from "./WhatsAppContact";
import { IconArrowLeft } from "./icons";
import { EDITORIAL_EMAIL, HEALTH_LINES } from "../data/contact";
import { clusters, mainNav, moreNav, SITE } from "../data/site";

const SA = HEALTH_LINES.find((c) => c.code === "sa");

export function Footer() {
  return (
    <footer className="mt-16 bg-brand-deep text-white">
      <div className="h-1 w-full bg-gradient-to-l from-accent via-brand to-brand" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandLogo className="h-14" tone="light" />
          <p className="mt-5 max-w-xl text-sm leading-8 text-white/75">
            مدونة سعودية توعوية تقدم معلومات عامة موثوقة حول سايتوتك (ميزوبروستول) والصحة النسائية: الاستخدامات
            الطبية، تحذيرات الأمان، الآثار الجانبية، ومتى تجب مراجعة الطبيب — بلغة واضحة وبلا وصف دوائي.
          </p>
          <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4">
            <p className="text-xs font-bold">لرعاية طبية حقيقية</p>
            <p className="mt-1 text-xs leading-6 text-white/75">
              الإسعاف <span dir="ltr" className="font-mono font-bold text-white">{SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value}</span>{" "}
              · مركز وزارة الصحة السعودية{" "}
              <span dir="ltr" className="font-mono font-bold text-white">{SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value}</span>
            </p>
            <p className="mt-3">
              <WhatsAppContactLink className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white transition hover:bg-accent-deep" />
            </p>
            <p className="mt-2 text-xs text-white/75">
              ملاحظات تحريرية فقط:{" "}
              <a href={`mailto:${EDITORIAL_EMAIL}`} className="underline underline-offset-4 transition hover:text-white">
                {EDITORIAL_EMAIL}
              </a>
            </p>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold text-white/95">روابط سريعة</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-white/75">
            {[...mainNav, ...moreNav].slice(0, 10).map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="inline-flex items-center gap-1.5 transition hover:text-white">
                  <IconArrowLeft className="h-3.5 w-3.5 text-accent" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold text-white/95">مجموعات المقالات</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-white/75">
            {clusters.map((c) => (
              <li key={c.id}>
                <Link to={`/blog/cluster/${c.slug}`} className="inline-flex items-center gap-1.5 transition hover:text-white">
                  <IconArrowLeft className="h-3.5 w-3.5 text-accent" />
                  {c.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name} — {SITE.nameEn}. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy" className="transition hover:text-white">سياسة الخصوصية</Link>
            <Link to="/medical-disclaimer" className="transition hover:text-white">إخلاء المسؤولية الطبية</Link>
            <Link to="/sitemap" className="transition hover:text-white">خريطة الموقع</Link>
            <Link to="/contact" className="transition hover:text-white">اتصل بنا</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
