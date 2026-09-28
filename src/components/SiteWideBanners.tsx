import { WHATSAPP_NUMBER_RAW, WHATSAPP_URL } from "../data/conversion";

const MEDICAL_BANNER_SRC = "/images/site-medical-banner.png";
const CONSULTATION_BANNER_SRC = "/images/site-consultation-banner.png";

export function SiteWideBanners() {
  return (
    <section aria-label="معلومات وتواصل" className="mx-auto w-full max-w-7xl px-4 pb-10 pt-4 md:pb-14">
      <div className="grid gap-5 lg:grid-cols-2">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-3xl border border-line bg-paper shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          aria-label={`معلومات دوائية عن سايتوتك — تواصل عبر واتساب ${WHATSAPP_NUMBER_RAW}`}
        >
          <img
            src={MEDICAL_BANNER_SRC}
            alt="معلومات توعوية عن سايتوتك وصحة المرأة السعودية"
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.01]"
          />
        </a>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-3xl border border-line bg-paper shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          aria-label={`استشارة سايتوتك ومعلومات عامة — تواصل عبر واتساب ${WHATSAPP_NUMBER_RAW}`}
        >
          <img
            src={CONSULTATION_BANNER_SRC}
            alt="استشارة سايتوتك ومعلومات عامة عبر واتساب"
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.01]"
          />
        </a>
      </div>
    </section>
  );
}
