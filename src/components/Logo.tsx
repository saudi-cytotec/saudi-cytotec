/**
 * BrandLogo — the approved vector mark for saudiersaa.com.
 *
 * A single continuous teal line reads, in Arabic reading direction (right →
 * left), as a woman's profile wearing a headscarf; the same line resolves into
 * a stethoscope whose binaural crosses the neckline and whose chest piece
 * carries a small ECG pulse in gold. It mirrors the approved teal PNG mark and
 * renders crisply at any size on both the light header and the deep-teal
 * footer. The teal/gold palette follows --color-brand / --color-accent.
 */
export function BrandLogo({
  className = "h-11 w-11",
  tone = "teal",
  title = "شعار منصة سعودي إرساء الطبية",
}: {
  className?: string;
  /** "teal" uses the deep-teal stroke (light backgrounds); "light" uses white (deep-teal footer). */
  tone?: "teal" | "light";
  title?: string;
}) {
  const main = tone === "light" ? "#ffffff" : "var(--color-brand)";
  const gold = tone === "light" ? "var(--color-accent)" : "var(--color-brand)";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {/* Headscarf + hair + stethoscope binaural, one continuous teal line */}
      <path
        d="M44.5 14.5
           C40 10.5 32 10 27.5 14
           C24.2 17 23 21 23.6 25
           C22 24.4 20.2 24.7 19 26
           C17.3 27.9 17.6 30.6 19.6 32
           C18.2 33.2 17.8 35.4 18.8 37.2
           C20 39.4 23 39.6 24.8 37.8
           C25.4 41 27.4 43.6 30.4 45
           L28.6 52.5
           M30.4 45
           C33.6 46.6 37.6 45.6 40 43
           C42.4 40.4 43.2 36.6 42.6 33
           C45.8 31.4 46.8 27.4 45.2 24.4
           C47.4 22.4 48 18.8 46.4 16.2"
        stroke={main}
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Profile features (nose/lips/chin) */}
      <path
        d="M44.5 24.5
           C46.2 25 46.4 27.2 44.9 28.1
           L46 29.4
           C45 30.4 43.2 30.3 42.6 29.2"
        stroke={main}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stethoscope binaural sweep + tubing down the back */}
      <path
        d="M27 18.5
           C31.5 15.5 38 16.2 41 20.5
           M36 17
           C35 24 30 28 25 30.5
           M26.5 31
           C22 34 21.5 40 25.5 44
           C29 47.4 34.5 47 37.4 43.4
           M38.5 41
           C40 38.5 39.6 35 37.4 33.2"
        stroke={main}
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Chest piece with gold ECG pulse */}
      <circle cx="39.5" cy="47.5" r="5.4" stroke={main} strokeWidth="2.6" />
      <path
        d="M36.6 47.6 H38.4 L39.2 45.8 L40.4 49.4 L41.2 47.6 H42.6"
        stroke={gold}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
