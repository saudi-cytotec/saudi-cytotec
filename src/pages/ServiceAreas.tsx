import { Link } from "react-router-dom";
import { CareReferral } from "../components/CareReferral";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { PageHero } from "../components/PageHero";
import { JsonLd, Seo } from "../components/Seo";
import { WhatsAppContactCard } from "../components/WhatsAppContact";
import { serviceAreaLinks, serviceRegions } from "../data/serviceAreas";
import { SITE } from "../data/site";

export function ServiceAreas() {
  const cities = serviceRegions.flatMap((region) => region.cities.map((city) => city.name));
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <Seo
        title="المناطق والمدن في السعودية"
        description="دليل مناطق السعودية للوصول إلى معلومات صحة المرأة وسلامة الأدوية ومتى تجب مراجعة الرعاية المرخصة، دون صفحات مدينة مكررة أو وعود بيع."
        path="/service-areas"
        image="/images/hero.jpg"
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
      <PageHero
        crumbs={[{ name: "المناطق والمدن", path: "/service-areas" }]}
        title="المناطق والمدن في السعودية: معلومات صحية لا صفحات بيع"
        description="نعرض المدن لتسهيل الوصول إلى المسار الصحيح: قراءة معلومات موثوقة، معرفة علامات الخطر، ثم التواصل مع جهة صحية مرخصة عند الحاجة. لا ننشئ صفحات مدينة رقيقة، ولا نعد بتوفر دواء أو توصيل أو أسعار."
      />

      <div className="max-w-3xl"><DisclaimerBanner /></div>

      <section className="card-premium p-6">
        <h2 className="font-display text-2xl font-extrabold text-brand-deep">اكتشاف جغرافي مسؤول</h2>
        <p className="mt-2 max-w-3xl text-sm leading-8 text-ink-soft">
          اقتبسنا من المنافسين فكرة تنظيم المدن وتعدد مسارات الاكتشاف، ثم أزلنا التكرار التجاري. هذه الصفحة تربط المدينة بالموضوع، الأمان، الأسئلة، والمصدر الرسمي — لا بسعر أو طلب.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {serviceAreaLinks.map((link) => (
            <Link key={link.to} to={link.to} className="rounded-full border border-line bg-cream px-4 py-2 text-sm font-semibold text-brand-deep transition hover:bg-brand-soft">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {serviceRegions.map((region) => (
          <article key={region.id} className="card-premium p-6">
            <h2 className="font-display text-2xl font-extrabold text-brand-deep">{region.title}</h2>
            <p className="mt-2 leading-8 text-ink-soft">{region.description}</p>
            <div className="mt-5 grid gap-3">
              {region.cities.map((city) => (
                <div key={city.slug} className="rounded-2xl border border-line bg-cream/70 p-4">
                  <h3 className="font-bold text-brand-deep">{city.name}</h3>
                  <p className="mt-1 text-sm leading-7 text-ink-soft">{city.note}</p>
                  <p className="mt-2 text-xs text-ink-soft">أرقام مفيدة: {city.resources.join(" · ")}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="card-premium p-6">
        <h2 className="font-display text-2xl font-extrabold text-brand-deep">أسئلة محلية شائعة</h2>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <WhatsAppContactCard compact />
        <CareReferral />
      </div>
    </div>
  );
}
