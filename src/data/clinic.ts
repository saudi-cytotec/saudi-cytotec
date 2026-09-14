/**
 * Legacy clinic record — PRESERVED EXACTLY AS IT WAS.
 *
 * This module is the SINGLE SOURCE OF TRUTH for the old clinic data:
 *   - doctor name : دكتور هيثم الخطيب
 *   - clinic phone: 00966599287172
 *
 * Rules (enforced by scripts/auditLegacyClinic.mjs, run by
 * `npm run audit`, `npm run verify` and `postbuild`):
 *   1. These two values are kept verbatim. Nothing here is reworded,
 *      re-formatted or "cleaned up".
 *   2. They are NEVER replaced by the official WhatsApp CTA number defined in
 *      src/data/conversion.ts. The WhatsApp
 *      channel exists only in the dedicated CTA components (header bar,
 *      hero CTA, floating button, article banner, /contact card, footer
 *      WhatsApp button) — see src/components/Header.tsx,
 *      src/components/WhatsAppContact.tsx, src/pages/Home.tsx.
 *   3. The two are NEVER merged into the official ministry/emergency line
 *      registry (src/data/contact.ts). Old clinic data and new CTA data
 *      stay in separate modules so they cannot conflict.
 *   4. The legacy phone is a PHONE number only: it must never appear inside
 *      a wa.me link (only `tel:` links). That is what keeps the WhatsApp
 *      audits (auditWhatsApp / auditPrerender) green while this number
 *      remains visible.
 *
 * Display sites: src/components/Footer.tsx (site-wide, so it is present on
 * every prerendered page) and src/pages/Contact.tsx via
 * <LegacyClinicCard />. The static no-JS fallback in index.html repeats the
 * pair literally, for crawlers and readers without JavaScript.
 */

/** Old clinic doctor name — keep exactly as written, no rephrasing. */
export const LEGACY_CLINIC_DOCTOR_NAME = "دكتور هيثم الخطيب";

/** Old clinic phone — keep exactly as written (same digits, same format). */
export const LEGACY_CLINIC_PHONE = "00966599287172";

/** Dial link for the old clinic phone. Phone only — never a wa.me link. */
export const LEGACY_CLINIC_PHONE_HREF = `tel:${LEGACY_CLINIC_PHONE}`;

export const LEGACY_CLINIC = {
  /** Label used wherever the block is rendered. */
  label: "بيانات العيادة",
  doctorName: LEGACY_CLINIC_DOCTOR_NAME,
  phone: LEGACY_CLINIC_PHONE,
  phoneHref: LEGACY_CLINIC_PHONE_HREF,
  /** Kept verbatim so the old clinic stays reachable on the same terms. */
  note: "بيانات العيادة القديمة محفوظة كما هي ولم تُستبدل بأي قناة أخرى.",
} as const;
