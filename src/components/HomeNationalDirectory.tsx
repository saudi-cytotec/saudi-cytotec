import { Link } from "react-router-dom";

const GULF = [
  ["السعودية", "النهدي، الدواء، المتحدة"],
  ["الإمارات", "دليل الصيدليات والمنشآت المرخصة"],
  ["الكويت", "دليل الصيدليات والمنشآت المرخصة"],
  ["البحرين", "دليل الصيدليات والمنشآت المرخصة"],
  ["قطر", "دليل الصيدليات والمنشآت المرخصة"],
  ["عُمان", "دليل الصيدليات والمنشآت المرخصة"],
];

const REGIONS = [
  "الرياض: الرياض، الخرج، الدرعية",
  "مكة: مكة المكرمة، جدة، الطائف",
  "المدينة: المدينة المنورة، ينبع، العلا",
  "القصيم: بريدة، عنيزة، الرس",
  "الشرقية: الدمام، الخبر، الظهران، الأحساء",
  "عسير: أبها، خميس مشيط، بيشة",
  "تبوك: تبوك، ضباء، الوجه",
  "حائل: حائل، بقعاء",
  "جازان: جازان، صبيا، أبو عريش",
  "نجران: نجران، شرورة",
  "الباحة: الباحة، بلجرشي",
  "الجوف: سكاكا، القريات",
  "الحدود الشمالية: عرعر، رفحاء",
];

export default function HomeNationalDirectory() {
  return (
    <section className="space-y-6" aria-labelledby="national-directory-heading">
      <div className="card-premium p-6">
        <p className="text-[11px] font-bold uppercase tracking-wide text-accent">الدليل الوطني</p>
        <h2 id="national-directory-heading" className="mt-2 font-display text-2xl font-extrabold text-brand-deep">
          سايتوتك في السعودية والمدن الخليجية
        </h2>
        <span className="mt-3 block h-1 w-14 rounded-full bg-accent" aria-hidden="true" />
        <p className="mt-4 text-sm leading-8 text-ink-soft">
          هذا القسم يجمع التغطية الجغرافية للموقع مع أسماء سلاسل الصيدليات التي نستخدمها كعبارات بحث مرجعية.
          في السعودية تشمل القائمة الأساسية <strong>النهدي، الدواء، والمتحدة</strong>. ذكر اسم صيدلية هنا لا يعني
          أن سايتوتك أو ميزوبروستول متوفر فيها، ولا يعني إمكانية الصرف دون وصفة؛ التحقق من الترخيص والتوفر الحالي
          يجب أن يتم من المصدر الرسمي أو من المنشأة نفسها.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GULF.map(([country, note]) => (
          <article key={country} className="rounded-2xl border border-line bg-cream p-4">
            <h3 className="font-display text-base font-extrabold text-brand-deep">{country}</h3>
            <p className="mt-2 text-xs leading-6 text-ink-soft">{note}</p>
          </article>
        ))}
      </div>

      <div className="card-premium p-6">
        <h2 className="font-display text-xl font-extrabold text-brand-deep">الصيدليات في السعودية</h2>
        <p className="mt-3 text-sm leading-8 text-ink-soft">
          نستخدم أسماء <strong>النهدي، الدواء، المتحدة</strong> ضمن بنية البحث المحلي، مع تجنب اختراع فروع أو
          أرقام أو ادعاءات عن المخزون. الهيئة العامة للغذاء والدواء تنشر قائمة رسمية للصيدليات المرخص لها بيع
          المستحضرات المقيدة والخاضعة للرقابة، ويمكن الرجوع إليها للتحقق من اسم المنشأة والمنطقة والبيانات
          المنشورة. القائمة الرسمية نفسها تتغير وتُحدّث، لذلك لا نستبدلها بقائمة ثابتة داخل الموقع.
        </p>
        <a
          href="https://www.sfda.gov.sa/ar/list_registered_pharmacies"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-deep"
        >
          التحقق من قائمة الصيدليات الرسمية ←
        </a>
      </div>

      <div className="card-premium p-6">
        <h2 className="font-display text-xl font-extrabold text-brand-deep">تغطية مناطق المملكة</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((region) => (
            <span key={region} className="rounded-xl bg-cream px-3 py-2 text-xs font-semibold leading-6 text-ink-soft">
              {region}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs leading-7 text-ink-soft">
          التغطية الجغرافية تساعد القارئة على الوصول إلى المحتوى المحلي، لكنها لا تعني وجود فرع للموقع أو توفر
          دواء محدد في كل مدينة. المعلومات الطبية الأساسية تبقى موحدة، بينما تختلف منشآت الرعاية والصيدليات حسب
          المنطقة.
        </p>
      </div>

      <div className="rounded-2xl border border-brand/15 bg-brand-soft/50 p-5">
        <h2 className="font-display text-lg font-extrabold text-brand-deep">قبل البحث عن أي دواء</h2>
        <p className="mt-2 text-sm leading-8 text-ink-soft">
          سايتوتك اسم تجاري مرتبط بميزوبروستول، والمعلومة الدوائية لا تُحوّل إلى وصفة شخصية من خلال محرك البحث.
          عند وجود حمل أو احتمال حمل، أو نزيف أو ألم شديد أو دوخة أو إغماء، تكون الأولوية للتقييم الطبي المناسب.
          هدف الموقع هو التوعية، شرح المصطلحات والتحذيرات، وتوجيه القارئة إلى المصادر الرسمية، وليس تقديم جرعات
          أو خطوات استخدام منزلية.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/what-is-cytotec" className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white">
            ما هو سايتوتك؟
          </Link>
          <Link to="/safety" className="rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-brand-deep">
            السلامة والتحذيرات
          </Link>
          <Link to="/service-areas" className="rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-brand-deep">
            المناطق والخدمات
          </Link>
        </div>
      </div>
    </section>
  );
}
