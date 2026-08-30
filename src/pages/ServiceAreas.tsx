import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CareReferral } from "../components/CareReferral";
import { ContactCta } from "../components/ContactCta";
import { JsonLd, Seo } from "../components/Seo";
import { serviceAreaLinks, serviceRegions } from "../data/serviceAreas";
import { SITE } from "../data/site";

export function ServiceAreas() {
  const cities = serviceRegions.flatMap((region) => region.cities.map((city) => city.name));
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo
        title="المناطق والمدن في السعودية"
        description="دليل مناطق السعودية للوصول إلى معلومات صحة المرأة وسلامة الأدوية ومتى تجب مراجعة الرعاية المرخصة، دون صفحات مدينة مكررة أو وعود بيع."
        path="/service-areas"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "المناطق والمدن في السعودية",
          url: `${SITE.domain}/service-areas`,
          inLanguage: "ar-SA",
          about: cities.map((name) => ({ "@type": "City", name })),
        }}
      />
      <Breadcrumbs items={[{ name: "المناطق والمدن", path: "/service-areas" }]} />
      <section className="mt-5 rounded-[2rem] border border-line bg-paper p-7 shadow-sm">
        <p className="text-sm font-bold text-accent">اكتشاف جغرافي مسؤول</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-[1.35] text-teal-deep">المناطق والمدن في السعودية: معلومات صحية لا صفحات بيع</h1>
        <p className="mt-4 max-w-3xl leading-8 text-ink-soft">
          نعرض المدن لتسهيل الوصول إلى المسار الصحيح: قراءة معلومات موثوقة، معرفة علامات الخطر، ثم التواصل مع جهة صحية مرخصة عند الحاجة. لا ننشئ صفحات مدينة رقيقة، ولا نعد بتوفر دواء أو توصيل أو أسعار.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {serviceAreaLinks.map((link) => (
            <Link key={link.to} to={link.to} className="rounded-full border border-line bg-cream px-4 py-2 text-sm font-semibold text-brand-deep hover:bg-brand-soft">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        {serviceRegions.map((region) => (
          <article key={region.id} className="rounded-3xl border border-line bg-paper p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-teal-deep">{region.title}</h2>
            <p className="mt-2 leading-8 text-ink-soft">{region.description}</p>
            <div className="mt-5 grid gap-3">
              {region.cities.map((city) => (
                <div key={city.slug} className="rounded-2xl border border-line bg-cream/60 p-4">
                  <h3 className="font-bold text-brand-deep">{city.name}</h3>
                  <p className="mt-1 text-sm leading-7 text-ink-soft">{city.note}</p>
                  <p className="mt-2 text-xs text-ink-soft">أرقام مفيدة: {city.resources.join(" · ")}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-3xl border border-line bg-paper p-6">
        <h2 className="text-2xl font-bold text-teal-deep">أسئلة محلية شائعة</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-cream p-4">
            <h3 className="font-bold text-brand-deep">لماذا لا توجد صفحة منفصلة لكل مدينة؟</h3>
            <p className="mt-2 text-sm leading-7 text-ink-soft">لأن المعلومات الطبية والتحذيرات لا تختلف بين الرياض وجدة والدمام وغيرها. صفحة مكررة باسم مدينة فقط ستكون أقل فائدة وأقرب إلى doorway page.</p>
          </div>
          <div className="rounded-2xl bg-cream p-4">
            <h3 className="font-bold text-brand-deep">متى أستخدم 937 ومتى أستخدم 997؟</h3>
            <p className="mt-2 text-sm leading-7 text-ink-soft">937 للاستفسارات الصحية العامة داخل السعودية. 997 للحالات الإسعافية مثل النزيف الشديد أو الإغماء أو الألم الحاد أو ضيق التنفس.</p>
          </div>
        </div>
      </section>

      <CareReferral />
      <ContactCta topic="سؤال عن منطقة أو مدينة" />
    </div>
  );
}
