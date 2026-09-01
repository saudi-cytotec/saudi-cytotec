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
  "السلام عليكم، لدي سؤال معلوماتي عام عن المحتوى التعليمي في موقع ساوديرساء (ليس طلب دواء أو وصفة).";

export function whatsappInfoUrl(): string {
  return `https://wa.me/${INFO_WHATSAPP_DIGITS}?text=${encodeURIComponent(INFO_MESSAGE)}`;
}

/** Article banner — the EXACT approved asset (public/images/saudiersaa-article-whatsapp-banner.png.png). */
export const ARTICLE_WHATSAPP_BANNER_SRC = "/images/saudiersaa-article-whatsapp-banner.png.png";

/**
 * The approved WhatsApp banner shown on article pages. The whole image is the
 * link to the informational channel (same compliant URL as every other CTA).
 */
export function ArticleWhatsAppBanner() {
  return (
    <a
      href={whatsappInfoUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`التواصل عبر واتساب للاستشارة المعلوماتية: ${INFO_WHATSAPP_DISPLAY}`}
      className="card-premium mt-7 block max-w-4xl overflow-hidden transition hover:shadow-[0_24px_50px_-20px_rgb(11_37_69/0.45)]"
    >
      <img
        src={ARTICLE_WHATSAPP_BANNER_SRC}
        alt={`بانر واتساب — استشارة معلوماتية عبر ${INFO_WHATSAPP_DISPLAY} (قناة معلومات عامة فقط)`}
        width={1717}
        height={916}
        loading="lazy"
        decoding="async"
        className="w-full object-cover"
      />
    </a>
  );
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
      <span>تواصل عبر واتساب</span>
    </a>
  );
}

/**
 * Light, clear, premium consultation card.
 * White surface, soft shadow, navy heading, red/pink CTA — the approved
 * replacement for the old dark rectangle.
 */
export function WhatsAppContactCard({ compact = false }: { compact?: boolean }) {
  return (
    <section
      aria-labelledby="info-contact-heading"
      className="card-premium relative overflow-hidden"
    >
      {/* Premium top accent: navy → red */}
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-brand via-brand to-accent" aria-hidden="true" />
      <div className={`${compact ? "p-5" : "p-6 md:p-7"}`}>
        <div className="flex items-start gap-4">
          <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-[#e7f8ee] text-[#1faf57] ring-1 ring-[#c9ecd8]" style={{ width: "3.25rem", height: "3.25rem" }}>
            <WhatsAppIcon className="h-7 w-7" />
          </span>
          <div>
            <h2 id="info-contact-heading" className="font-display text-xl font-extrabold text-brand-deep md:text-[1.45rem]">
              تواصل معلوماتي عام
            </h2>
            <p className="mt-1 text-sm leading-7 text-ink-soft">
              استخدمي واتساب لطلب رابط تعليمي مناسب أو توضيح عام حول محتوى الموقع فقط.
            </p>
          </div>
        </div>

        <a
          href={whatsappInfoUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-[0_10px_22px_-10px_rgb(216_31_60/0.65)] transition hover:bg-accent-deep"
        >
          <WhatsAppIcon className="h-5 w-5" />
          تواصل عبر واتساب
        </a>
        <p className="mt-2 text-center text-sm font-bold tracking-wide text-brand" dir="ltr">
          {INFO_WHATSAPP_DISPLAY}
        </p>

        <p className="mt-4 rounded-xl bg-cream px-4 py-3 text-[11px] leading-6 text-ink-soft">
          {INFO_CONTACT_NOTE}
        </p>
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
      aria-label="تواصل معلوماتي عبر واتساب (قناة معلومات عامة — ليس طلب دواء)"
      title="تواصل معلوماتي عام — معلومات عامة فقط"
      className="group fixed bottom-5 end-5 z-40 flex items-center gap-2 rounded-full bg-white p-2.5 shadow-[0_12px_32px_-8px_rgb(11_37_69/0.35)] ring-1 ring-line transition hover:shadow-[0_16px_40px_-8px_rgb(11_37_69/0.45)]"
    >
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#25D366] text-white">
        <WhatsAppIcon className="h-6 w-6" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold text-brand-deep transition-all duration-300 group-hover:max-w-[14rem] group-hover:ps-1 group-hover:pe-2">
        تواصل معلوماتي عام
      </span>
      <span className="absolute -top-1 -end-1 flex h-3.5 w-3.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-accent" />
      </span>
    </a>
  );
}
