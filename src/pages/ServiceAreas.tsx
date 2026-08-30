import { CareReferral } from "../components/CareReferral";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { PageHero } from "../components/PageHero";
import { JsonLd, Seo } from "../components/Seo";
import { WhatsAppContactCard } from "../components/WhatsAppContact";
import geo from "../../content/geo-coverage.json";
import { SITE } from "../data/site";

interface GeoCountry {
  code: string;
  name: string;
  priority: string;
  regulator: string;
  healthLine: string;
  emergency: string;
  note: string;
}
interface GeoCity {
  city: string;
  country: string;
  coverage: string;
}

const countries = (geo.countries ?? []) as GeoCountry[];
const cities = (geo.cities ?? []) as GeoCity[];

export function ServiceAreas() {
  const sa = countries.find((c) => c.code === "SA");
  const byCountry = (code: string) => cities.filter((c) => c.country === code);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <Seo
        title="مناطق التغطية والوصول إلى الرعاية في السعودية والخليج"
        description="صفحة مرجعية واحدة توضّح أن المعلومة الطبية التعليمية واحدة في كل مدن السعودية والخليج، مع أرقام الطوارئ والخطوط الصحية الرسمية لكل دولة — بلا صفحات مداخل مكررة."
        path="/service-areas"
        image="/images/hero.jpg"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: "مناطق التغطية والوصول إلى الرعاية",
          url: `${SITE.domain}/service-areas`,
          inLanguage: "ar",
          description:
            "صفحة مرجعية للتغطية الجغرافية وأرقام الرعاية الرسمية في السعودية والإمارات والكويت والبحرين.",
        }}
      />
      <PageHero
        crumbs={[{ name: "مناطق التغطية", path: "/service-areas" }]}
        title="مناطق التغطية: المعلومة الطبية لا تتغير بتغيّر المدينة"
        description="هذه المنصة تعليمية؛ المعلومة الطبية الموثّقة واحدة سواء كنتِ في الرياض أو جدة أو الدمام أو أي مدينة خليجية. لذلك لا ننشئ صفحات متكررة لكل مدينة، ونوفّر بدلاً منها صفحة مرجعية واحدة توجّهك إلى الجهة الرسمية الصحيحة في دولتك."
      />

      <div className="max-w-3xl">
        <DisclaimerBanner />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {countries.map((country) => {
          const list = byCountry(country.code);
          return (
            <section
              key={country.code}
              className={`card-premium p-6 ${country.code === "SA" ? "ring-2 ring-brand/25" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-xl font-extrabold text-brand-deep">{country.name}</h2>
                <span className="rounded-full bg-sky-soft px-2.5 py-1 text-[11px] font-bold text-brand ring-1 ring-line">
                  {country.priority === "PRIMARY" ? "السوق الأساسي" : "تغطية ثانوية"}
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex flex-wrap gap-x-3">
                  <dt className="text-ink-soft">الجهة التنظيمية:</dt>
                  <dd className="font-bold text-brand-deep">{country.regulator}</dd>
                </div>
                <div className="flex flex-wrap gap-x-3">
                  <dt className="text-ink-soft">الخط الصحي:</dt>
                  <dd dir="ltr" className="font-mono font-bold text-brand">
                    {country.healthLine}
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-3">
                  <dt className="text-ink-soft">الطوارئ:</dt>
                  <dd dir="ltr" className="font-mono font-bold text-clay">
                    {country.emergency}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-6 text-ink-soft">{country.note}</p>
              {list.length ? (
                <p className="mt-3 text-xs leading-6 text-ink-soft">
                  <strong>تغطى المدن داخل المحتوى فقط (بلا صفحات منفصلة):</strong>{" "}
                  {list.map((c) => c.city).join("، ")}
                </p>
              ) : null}
            </section>
          );
        })}
      </div>

      {sa ? (
        <div className="card-premium p-6">
          <h2 className="font-display text-lg font-extrabold text-brand-deep">لماذا لا توجد صفحة لكل مدينة؟</h2>
          <p className="mt-2 max-w-3xl text-sm leading-8 text-ink-soft">
            صفحات المداخل (city doorway pages) التي تكرّر النص ذاته مع تغيير اسم المدينة لا تضيف قيمة للقارئ وقد
            تُعامَل كمحتوى منخفض الجودة. بدلاً من ذلك نذكر المدن داخل المحتوى ذي الصلة، ونضع المعلومة العملية
            الحقيقية — أرقام الرعاية والطوارئ الرسمية — في هذه الصفحة الواحدة.
          </p>
        </div>
      ) : null}

      <div className="max-w-3xl">
        <WhatsAppContactCard compact />
      </div>
      <div className="max-w-3xl">
        <CareReferral />
      </div>
    </div>
  );
}
