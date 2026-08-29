import { EDITORIAL_EMAIL, HEALTH_LINES } from "../data/contact";

/**
 * Replaces the former "ConsultCTA" / "WhatsAppFloat" components.
 *
 * Those linked to a private mobile number framed as a "private medical
 * consultation", which contradicted the site's own /about and /safety pages and
 * functioned as a sales funnel for a prescription-controlled drug. This
 * component instead routes the reader to government-operated services.
 *
 * Do not add private numbers, WhatsApp links, or "order/consult" CTAs here.
 */
export function CareReferral({ compact = false }: { compact?: boolean }) {
  return (
    <section
      aria-labelledby="care-referral-heading"
      className={`my-10 overflow-hidden rounded-3xl border border-line bg-paper shadow-sm ${compact ? "" : ""}`}
    >
      <div className="border-b border-line bg-brand-deep px-6 py-4">
        <h2 id="care-referral-heading" className="text-xl font-bold text-white md:text-2xl">
          أين تحصلين على رعاية حقيقية
        </h2>
        <p className="mt-1 text-sm text-white/85">
          هذا الموقع تعليمي. لا نشخّص، ولا نصف أدوية، ولا نرتّب أي خدمة علاجية أو دوائية.
        </p>
      </div>

      <div className="grid gap-px bg-line md:grid-cols-2">
        {HEALTH_LINES.map((entry) => (
          <div key={entry.code} className="bg-paper p-5">
            <h3 className="flex items-center gap-2 text-base font-bold text-brand-deep">
              <span aria-hidden="true">{entry.flag}</span>
              {entry.country}
            </h3>
            <dl className="mt-3 space-y-2">
              {entry.lines.map((line) => (
                <div key={line.label} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <dt className="text-sm text-ink-soft">{line.label}</dt>
                  <dd dir="ltr" className="font-mono text-base font-bold text-accent">
                    {line.value}
                  </dd>
                  {line.note ? <span className="text-xs text-ink-soft">({line.note})</span> : null}
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs">
              الجهة الرسمية:{" "}
              <a
                href={entry.authorityUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-brand font-semibold underline underline-offset-4 hover:text-accent"
              >
                {entry.authority}
              </a>
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-line bg-cream/60 px-6 py-4">
        <p className="text-sm leading-7 text-ink-soft">
          عند ظهور نزيف شديد، أو إغماء، أو ألم بطني حاد، أو حمى مرتفعة، أو ضيق تنفس: اطلبي رعاية طارئة فوراً ولا
          تنتظري رد رسالة.
        </p>
        <p className="mt-2 text-xs text-ink-soft">
          للملاحظات التحريرية وتصحيح المصادر فقط:{" "}
          <a href={`mailto:${EDITORIAL_EMAIL}`} className="text-brand underline underline-offset-4">
            {EDITORIAL_EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}
