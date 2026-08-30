/**
 * Neutral medical-information contact channel.
 * ---------------------------------------------------------------------------
 * The number below is provided by the site operator for **general medical
 * information questions and signposting** only. It is NOT a verified licensed
 * clinic, pharmacy or drug seller, and this site makes no claim that it is.
 * It must never be used to:
 *   - offer or arrange the sale, delivery, payment or procurement of any drug,
 *   - promise availability of a prescription-controlled medicine,
 *   - provide a diagnosis, a prescription or a dose.
 * Prescriptions and emergencies are always routed to licensed care and the
 * official emergency lines (see data/contact.ts).
 */

/** Digits only, international format (966 = Saudi Arabia). */
export const INFO_WHATSAPP_DIGITS = "966538159747";
export const INFO_WHATSAPP_DISPLAY = "+966 53 815 9747";

/** Pre-filled message kept strictly informational. */
const INFO_MESSAGE =
  "السلام عليكم، لدي سؤال معلوماتي عام عن المحتوى التعليمي في موقع سعودي إرساء (ليس طلب دواء أو وصفة).";

export function whatsappInfoUrl(): string {
  return `https://wa.me/${INFO_WHATSAPP_DIGITS}?text=${encodeURIComponent(INFO_MESSAGE)}`;
}

export const INFO_CONTACT_NOTE =
  "قناة معلومات عامة وإرشاد تعليمي فقط — ليست عيادة أو صيدلية، ولا تُقدَّم عبرها وصفة أو تشخيص أو دواء، ولا تُرتَّب أي عملية بيع أو توصيل. للحالات الطبية راجعي جهة صحية مرخصة، وفي الطوارئ اتصلي بالإسعاف 997.";

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}

/** A single compliant anchor styled like a button. */
export function WhatsAppContactLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={whatsappInfoUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={`تواصل معلوماتي عبر واتساب: ${INFO_WHATSAPP_DISPLAY}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span>تواصل معلوماتي عبر واتساب</span>
    </a>
  );
}

/**
 * Full contact card — neutral medical-information framing with the emergency
 * boundary made explicit. Safe to embed on the contact page, home and articles.
 */
export function WhatsAppContactCard({ compact = false }: { compact?: boolean }) {
  return (
    <section
      aria-labelledby="info-contact-heading"
      className="overflow-hidden rounded-3xl border border-line bg-paper shadow-sm"
    >
      <div className="border-b border-line bg-brand px-6 py-4 text-white">
        <h2 id="info-contact-heading" className="flex items-center gap-2 text-xl font-bold md:text-2xl">
          <WhatsAppIcon className="h-6 w-6 text-accent" />
          استفسار معلوماتي عام
        </h2>
        <p className="mt-1 text-sm text-white/85">
          قناة للأسئلة التعليمية العامة وتوجيهك إلى المصدر الصحي — ليست عيادة ولا صيدلية.
        </p>
      </div>
      <div className={`grid gap-5 ${compact ? "p-5" : "p-6 md:grid-cols-[1fr_auto] md:items-center"}`}>
        <div>
          <p className="text-sm leading-8 text-ink-soft">
            لو لديك سؤال عن معلومة منشورة أو عن كيفية الوصول إلى رعاية مرخصة، يمكنك إرسال رسالة نصية عامة. لن
            تُعطى عبرها وصفة أو جرعة أو تشخيص، ولا يُطلب أو يُرتَّب أي دواء.
          </p>
          <p className="mt-2 text-xs leading-6 text-ink-soft">{INFO_CONTACT_NOTE}</p>
        </div>
        <div className="flex flex-col items-stretch gap-2">
          <a
            href={whatsappInfoUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
          >
            <WhatsAppIcon className="h-5 w-5" />
            واتساب — {INFO_WHATSAPP_DISPLAY}
          </a>
          <span className="text-center text-[11px] text-ink-soft" dir="ltr">
            {INFO_WHATSAPP_DISPLAY}
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * Fixed floating WhatsApp button shown site-wide (never on /admin). It links to
 * the same informational channel and is labelled so it cannot read as a
 * drug-sales funnel.
 */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappInfoUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="استفسار معلوماتي عام عبر واتساب (ليس طلب دواء)"
      title="استفسار معلوماتي عام — ليس وصفة أو بيع دواء"
      className="group fixed bottom-5 end-5 z-40 flex items-center gap-2 rounded-full bg-brand p-3.5 text-white shadow-xl ring-2 ring-accent/70 transition hover:brightness-110 focus-visible:outline-none"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-[16rem] group-hover:ps-1 rtl:group-hover:pe-1">
        استفسار معلوماتي عام
      </span>
      <span className="absolute -top-1 -end-1 flex h-3.5 w-3.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
        <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-accent" />
      </span>
    </a>
  );
}
