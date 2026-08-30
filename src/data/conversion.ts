export const APPROVED_WHATSAPP_NUMBER = "00966538159747";
export const APPROVED_WHATSAPP_E164 = "966538159747";

export function whatsappUrl(message = "مرحباً، لدي سؤال عام عن محتوى موقع سايتوتك في السعودية.") {
  return `https://wa.me/${APPROVED_WHATSAPP_E164}?text=${encodeURIComponent(message)}`;
}
