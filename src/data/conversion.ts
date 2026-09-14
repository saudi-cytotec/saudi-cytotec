/**
 * Conversion channels — SINGLE SOURCE OF TRUTH for the official WhatsApp
 * number and link.
 *
 * - Official WhatsApp channel (the only one on this site): 00966530945626
 *   (international digits: 966530945626)
 * - The only WhatsApp link format used anywhere: https://wa.me/966530945626
 * - Purpose: editorial and general drug-info inquiries only. No
 *   prescriptions, no diagnoses, no direct sales — medical care goes through
 *   licensed facilities and official MOH lines (see src/data/contact.ts).
 *
 * Every module that displays or links WhatsApp (header, hero, floating
 * button, footer, article banner, /contact card) MUST import from this file.
 * Defining the number anywhere else is a build-audit failure
 * (scripts/auditWhatsApp.mjs).
 */

export const WHATSAPP_NUMBER_RAW = "00966530945626";
export const WHATSAPP_NUMBER_DIGITS = "966530945626";
export const WHATSAPP_NUMBER_DISPLAY = "+966 53 094 5626";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER_DIGITS}`;

/** WhatsApp link with a pre-filled message (still the same number/link). */
export function whatsappUrlWithText(text: string): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}

/** Editorial contact for corrections only. Never used for medical advice. */
export const APPROVED_CONTACT_EMAIL = "info@saudiersaa.com";
