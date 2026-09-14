/**
 * WhatsApp contact components — production-approved green identity.
 * Commit 8ac2a34: WhatsApp + prerender + green identity + production rendering fixes.
 *
 * - Official WhatsApp channel: 00966530945626 (966530945626)
 * - Green medical identity (#0f6b4a / #16a34a) replaces navy/red
 * - Prerender-ready: no window access at module top-level, all CTAs are
 *   static <a> with proper rel and aria-labels for crawler visibility
 * - Production rendering fixes: floating button uses fixed positioning
 *   with safe-area insets, banner image uses approved Bannerrr.png
 */

import { EDITORIAL_EMAIL, HEALTH_LINES } from "../data/contact";

export const INFO_WHATSAPP_DIGITS = "966530945626";
export const INFO_WHATSAPP_DISPLAY = "+966 53 094 5626";
export const INFO_WHATSAPP_RAW = "00966530945626";

export function whatsappInfoUrl(): string {
  return `https://wa.me/${INFO_WHATSAPP_DIGITS}`;
}

export function whatsappInfoUrlWithText(text: string): string {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${INFO_WHATSAPP_DIGITS}?text=${encoded}`;
}

export const ARTICLE_WHATSAPP_BANNER_SRC = "/images/Bannerrr.png";

export function ArticleWhatsAppBanner() {
  return (
    <section
      aria-labelledby="whatsapp-banner-heading"
      className="card-premium relative overflow-hidden border-green-200 bg-gradient-to-l from-[#f0fdf4] to-white"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#0f6b4a] via-[#16a34a] to-[#22c55e]" aria-hidden="true" />
      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#dcfce7] text-[#0f6b4a] ring-1 ring-[#bbf7d0]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.04c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.04 14.08c-.22.62-1.29 1.18-1.8 1.26-.48.07-.94.22-3.12-.65-2.64-1.06-4.33-3.72-4.46-3.89-.13-.17-1.07-1.42-1.07-2.71 0-1.29.68-1.92.92-2.18.24-.26.52-.33.69-.33h.5c.16 0 .38-.06.58.44.2.5.69 1.73.75 1.85.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.29-.36.39-.12.11-.24.23-.1.45.14.22.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.16 1.2z" />
              </svg>
            </span>
            <div>
              <h2 id="whatsapp-banner-heading" className="font-display text-lg font-extrabold text-[#0a4a33] md:text-xl">
                تواصل عبر واتساب — استفسارات دوائية
              </h2>
              <p className="mt-1 text-sm leading-7 text-[#4a6359]">
                قناة تواصل سريعة للاستفسارات التحريرية والدوائية العامة. لا تُصرف أدوية عبر واتساب، ولا تُقدم وصفات فردية.
              </p>
              <p className="mt-2 font-mono text-sm font-bold text-[#0f6b4a]" dir="ltr">
                {INFO_WHATSAPP_DISPLAY} — {INFO_WHATSAPP_RAW}
              </p>
            </div>
          </div>
          <a
            href={whatsappInfoUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل واتساب 00966530945626"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#16a34a] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#15803d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.04c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.04 14.08c-.22.62-1.29 1.18-1.8 1.26-.48.07-.94.22-3.12-.65-2.64-1.06-4.33-3.72-4.46-3.89-.13-.17-1.07-1.42-1.07-2.71 0-1.29.68-1.92.92-2.18.24-.26.52-.33.69-.33h.5c.16 0 .38-.06.58.44.2.5.69 1.73.75 1.85.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.29-.36.39-.12.11-.24.23-.1.45.14.22.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.16 1.2z" />
            </svg>
            واتساب مباشر
          </a>
        </div>
      </div>
    </section>
  );
}

export const INFO_CONTACT_NOTE =
  "هذا الموقع للتوعية الدوائية العامة. للرعاية الطبية راجعي جهة صحية مرخصة، وللطوارئ اتصلي بالإسعاف 997 أو مركز وزارة الصحة 937. واتساب 00966530945626 للاستفسارات التحريرية والدوائية العامة فقط، بلا وصفات فردية ولا بيع مباشر. للملاحظات التحريرية: info@saudiersaa.com";

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.04c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.04 14.08c-.22.62-1.29 1.18-1.8 1.26-.48.07-.94.22-3.12-.65-2.64-1.06-4.33-3.72-4.46-3.89-.13-.17-1.07-1.42-1.07-2.71 0-1.29.68-1.92.92-2.18.24-.26.52-.33.69-.33h.5c.16 0 .38-.06.58.44.2.5.69 1.73.75 1.85.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.29-.36.39-.12.11-.24.23-.1.45.14.22.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.16 1.2z" />
    </svg>
  );
}

export function WhatsAppContactLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={whatsappInfoUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-[#16a34a] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#15803d] ${className}`}
      aria-label={`تواصل واتساب ${INFO_WHATSAPP_DISPLAY}`}
    >
      <WhatsAppIcon className="h-4 w-4" />
      <span>واتساب {INFO_WHATSAPP_DISPLAY}</span>
    </a>
  );
}

export function WhatsAppContactCard({ compact = false }: { compact?: boolean }) {
  const SA = HEALTH_LINES.find((c) => c.code === "sa");
  return (
    <section
      aria-labelledby="info-contact-heading"
      className="card-premium relative overflow-hidden border-green-200"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#0f6b4a] via-[#16a34a] to-[#22c55e]" aria-hidden="true" />
      <div className={`${compact ? "p-5" : "p-6 md:p-7"}`}>
        <div className="flex items-start gap-4">
          <span
            className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-[#dcfce7] text-[#0f6b4a] ring-1 ring-[#bbf7d0]"
            style={{ width: "3.25rem", height: "3.25rem" }}
          >
            <WhatsAppIcon className="h-7 w-7" />
          </span>
          <div>
            <h2 id="info-contact-heading" className="font-display text-xl font-extrabold text-[#0a4a33] md:text-[1.45rem]">
              تواصل واتساب — القناة الرسمية
            </h2>
            <p className="mt-1 text-sm leading-7 text-[#4a6359]">
              للاستفسارات التحريرية والدوائية العامة. لا وصفات فردية ولا بيع عبر واتساب.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <a
            href={whatsappInfoUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-[#f0fdf4] p-4 ring-1 ring-[#bbf7d0] transition hover:bg-[#dcfce7]"
          >
            <p className="text-xs font-bold text-[#0a4a33]">واتساب — استفسارات</p>
            <p className="mt-1 font-mono text-lg font-bold text-[#0f6b4a]" dir="ltr">
              {INFO_WHATSAPP_DISPLAY}
            </p>
            <p className="mt-1 text-xs text-[#4a6359]" dir="ltr">{INFO_WHATSAPP_RAW} — wa.me/{INFO_WHATSAPP_DIGITS}</p>
            <p className="mt-1 text-xs text-[#4a6359]">رد خلال ساعات العمل، بلا وصفات فردية</p>
          </a>
          <div className="rounded-2xl bg-[#f4f8f5] p-4">
            <p className="text-xs font-bold text-[#0a4a33]">مركز اتصال وزارة الصحة</p>
            <p className="mt-1 font-mono text-lg font-bold text-[#0f6b4a]" dir="ltr">
              {SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value ?? "937"}
            </p>
            <p className="mt-1 text-xs text-[#4a6359]">من داخل المملكة، على مدار الساعة</p>
          </div>
          <div className="rounded-2xl bg-[#f0fdf4] p-4">
            <p className="text-xs font-bold text-[#16a34a]">الإسعاف / الطوارئ الطبية</p>
            <p className="mt-1 font-mono text-lg font-bold text-[#16a34a]" dir="ltr">
              {SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value ?? "997"}
            </p>
            <p className="mt-1 text-xs text-[#4a6359]">للحالات الطارئة فقط</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <a
            href={whatsappInfoUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#16a34a] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#15803d]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            فتح واتساب
          </a>
          <a
            href={`mailto:${EDITORIAL_EMAIL}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0f6b4a] ring-1 ring-[#bbf7d0] transition hover:bg-[#f0fdf4]"
          >
            {EDITORIAL_EMAIL}
          </a>
        </div>

        <p className="mt-4 rounded-xl bg-[#f4f8f5] px-4 py-3 text-[11px] leading-6 text-[#4a6359]">
          {INFO_CONTACT_NOTE}
        </p>
      </div>
    </section>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappInfoUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`واتساب ${INFO_WHATSAPP_DISPLAY} — 00966530945626`}
      className="fixed bottom-4 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-lg ring-1 ring-[#15803d] transition hover:bg-[#15803d] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2 md:bottom-6 md:left-6 md:h-16 md:w-16"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <WhatsAppIcon className="h-7 w-7 md:h-8 md:w-8" />
      <span className="sr-only">واتساب {INFO_WHATSAPP_DISPLAY}</span>
    </a>
  );
}

export function WhatsAppCTA({
  text = "استفسار دوائي عبر واتساب",
  className = "",
  source = "general",
}: {
  text?: string;
  className?: string;
  source?: string;
}) {
  const url = whatsappInfoUrlWithText(`${text} — ${source} — saudiersaa.com`);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#16a34a] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#15803d] ${className}`}
      aria-label={`واتساب ${INFO_WHATSAPP_DISPLAY}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      {text}
    </a>
  );
}
