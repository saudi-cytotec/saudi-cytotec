/**
 * Repositioned contact components - no private WhatsApp numbers.
 * All medical content must direct to official health lines (937, 997) and editorial email.
 * This file previously contained a private WhatsApp sales funnel - now removed.
 */

import { EDITORIAL_EMAIL, HEALTH_LINES } from "../data/contact";

export const INFO_WHATSAPP_DIGITS = "";
export const INFO_WHATSAPP_DISPLAY = "";

export function whatsappInfoUrl(): string {
  return "/contact";
}

export const ARTICLE_WHATSAPP_BANNER_SRC = "";

export function ArticleWhatsAppBanner() {
  // Removed: banner previously linked to private WhatsApp
  return null;
}

export const INFO_CONTACT_NOTE =
  "هذا الموقع تعليمي فقط. للرعاية الطبية راجعي جهة صحية مرخصة، وللطوارئ اتصلي بالإسعاف 997 أو مركز وزارة الصحة 937. للملاحظات التحريرية فقط: info@saudiersaa.com";

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z" />
    </svg>
  );
}

export function WhatsAppContactLink({ className = "" }: { className?: string }) {
  return (
    <a href="/contact" className={className} aria-label="تواصل تحريري عبر صفحة الاتصال">
      <span>تواصل تحريري</span>
    </a>
  );
}

export function WhatsAppContactCard({ compact = false }: { compact?: boolean }) {
  const SA = HEALTH_LINES.find((c) => c.code === "sa");
  return (
    <section
      aria-labelledby="info-contact-heading"
      className="card-premium relative overflow-hidden"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-brand via-brand to-accent" aria-hidden="true" />
      <div className={`${compact ? "p-5" : "p-6 md:p-7"}`}>
        <div className="flex items-start gap-4">
          <span
            className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand ring-1 ring-line"
            style={{ width: "3.25rem", height: "3.25rem" }}
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </span>
          <div>
            <h2 id="info-contact-heading" className="font-display text-xl font-extrabold text-brand-deep md:text-[1.45rem]">
              الرعاية الصحية الرسمية
            </h2>
            <p className="mt-1 text-sm leading-7 text-ink-soft">
              هذا الموقع لا يقدم استشارة طبية فردية. للرعاية الصحية استخدمي القنوات الرسمية لوزارة الصحة.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl bg-cream p-4">
            <p className="text-xs font-bold text-brand-deep">مركز اتصال وزارة الصحة</p>
            <p className="mt-1 font-mono text-lg font-bold text-brand" dir="ltr">
              {SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value ?? "937"}
            </p>
            <p className="mt-1 text-xs text-ink-soft">من داخل المملكة، على مدار الساعة</p>
          </div>
          <div className="rounded-2xl bg-accent-soft p-4">
            <p className="text-xs font-bold text-accent">الإسعاف / الطوارئ الطبية</p>
            <p className="mt-1 font-mono text-lg font-bold text-accent" dir="ltr">
              {SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value ?? "997"}
            </p>
            <p className="mt-1 text-xs text-ink-soft">للحالات الطارئة فقط</p>
          </div>
        </div>

        <p className="mt-4 rounded-xl bg-cream px-4 py-3 text-[11px] leading-6 text-ink-soft">
          {INFO_CONTACT_NOTE}
        </p>
        <p className="mt-3 text-center text-xs text-ink-soft">
          ملاحظات تحريرية: <a href={`mailto:${EDITORIAL_EMAIL}`} className="font-bold text-brand hover:text-accent">{EDITORIAL_EMAIL}</a>
        </p>
      </div>
    </section>
  );
}

export function WhatsAppFloat() {
  // Removed floating WhatsApp button - violates medical information positioning
  return null;
}
