/**
 * Editorial contact only - no private phone numbers, no WhatsApp sales funnel.
 * All medical inquiries must be directed to licensed facilities and official MOH lines (937, 997).
 * See src/data/contact.ts for verified government health lines.
 */

export const APPROVED_CONTACT_EMAIL = "info@saudiersaa.com";

// Legacy exports kept for backward compatibility but no longer contain phone numbers
export const APPROVED_WHATSAPP_NUMBER = "";
export const APPROVED_WHATSAPP_E164 = "";

export function whatsappUrl(_message = ""): string {
  // Deprecated: return contact page instead of WhatsApp
  return "/contact";
}
