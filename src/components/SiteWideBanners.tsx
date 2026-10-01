import { WHATSAPP_NUMBER_RAW, WHATSAPP_URL } from "../data/conversion";

const MEDICAL_BANNER_SRC = "/images/site-medical-banner.png";
const CONSULTATION_BANNER_SRC = "/images/site-consultation-banner.png";

export function MedicalBanner() {
  return (
    <section aria-label="معلومات دوائية" className="mx-auto w-full max-w-7xl px-4 py-5 md:py-7">
      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
        className="group block overflow-hidden rounded-3xl border border-line bg-paper shadow-sm transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        aria-label={`معلومات دوائية عن سايتوتك — واتساب ${WHATSAPP_NUMBER_RAW}`}>
        <img src={MEDICAL_BANNER_SRC} alt="معلومات توعوية عن سايتوتك وصحة المرأة السعودية"
          width={1160} height={1355} loading="lazy" decoding="async" fetchPriority="low"
          className="mx-auto h-auto max-h-[360px] w-auto max-w-full object-contain" />
      </a>
    </section>
  );
}

export function ConsultationBanner() {
  return (
    <section aria-label="استشارة وتواصل" className="mx-auto w-full max-w-7xl px-4 py-5 md:py-7">
      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
        className="group block overflow-hidden rounded-3xl border border-line bg-paper shadow-sm transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        aria-label={`استشارة سايتوتك ومعلومات عامة — واتساب ${WHATSAPP_NUMBER_RAW}`}>
        <img src={CONSULTATION_BANNER_SRC} alt="استشارة سايتوتك ومعلومات عامة عبر واتساب"
          width={1536} height={1024} loading="lazy" decoding="async"
          className="mx-auto h-auto max-h-[300px] w-full object-contain" />
      </a>
    </section>
  );
}
