import { LEGACY_CLINIC } from "../data/clinic";

/**
 * LegacyClinicCard — the old clinic block: دكتور هيثم الخطيب and the clinic
 * phone, both read from src/data/clinic.ts (single definition, no copy).
 *
 * This is preserved clinic data, rendered on its own so that it is neither
 * merged with nor replaced by the official WhatsApp CTA channel. The phone is
 * a plain `tel:` link — deliberately not a wa.me link.
 *
 * Green brand tokens only (bg-brand-soft / text-brand / text-brand-deep),
 * consistent with the rest of the site.
 */
export function LegacyClinicCard({ compact = false }: { compact?: boolean }) {
  return (
    <section
      aria-labelledby="legacy-clinic-heading"
      className={`rounded-3xl border border-brand/20 bg-cream ${compact ? "p-5" : "p-6 md:p-7"}`}
    >
      <p className="text-xs font-bold text-brand">{LEGACY_CLINIC.label}</p>
      <h2 id="legacy-clinic-heading" className="mt-1 font-display text-lg font-extrabold text-brand-deep">
        {LEGACY_CLINIC.doctorName}
      </h2>
      <p className="mt-2 text-sm text-ink-soft">هاتف العيادة:</p>
      <a
        href={LEGACY_CLINIC.phoneHref}
        dir="ltr"
        aria-label={`${LEGACY_CLINIC.doctorName} — هاتف العيادة ${LEGACY_CLINIC.phone}`}
        className="mt-1 inline-block font-mono text-lg font-bold text-brand underline underline-offset-4 transition hover:text-brand-deep"
      >
        {LEGACY_CLINIC.phone}
      </a>
      <p className="mt-3 text-xs leading-6 text-ink-soft">{LEGACY_CLINIC.note}</p>
    </section>
  );
}
