/**
 * Brand logo — the EXACT approved asset.
 *
 * Canonical file: /images/saudiersaa-logo.png (the supplied saudiersaa logo,
 * committed verbatim into the repo — never redrawn or regenerated).
 *
 * Until that file is present in the build, the <img> silently falls back to a
 * plain typographic wordmark ("saudiersaa" + tagline) so the header stays
 * clean. The moment the exact file is committed, every surface below renders
 * the supplied logo with zero further code changes.
 */
import { useState } from "react";

export const LOGO_SRC = "/images/saudiersaa-logo.png";
export const LOGO_ALT = "شعار saudiersaa — مدونة سايتوتك التوعوية في السعودية";

/** Typographic wordmark used ONLY as the missing-file fallback. */
export function Wordmark({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={`leading-none ${className}`}>
      <span dir="ltr" className="font-display block text-[1.65rem] font-extrabold tracking-tight">
        <span className="text-accent">saudi</span>
        <span className={tone === "light" ? "text-white" : "text-brand"}>ersaa</span>
      </span>
      <span className={`mt-1 block text-[11px] font-semibold ${tone === "light" ? "text-white/70" : "text-ink-soft"}`}>
        مدونة سايتوتك التوعوية في السعودية
      </span>
    </span>
  );
}

/**
 * The approved logo lockup.
 * - File present: rendered verbatim inside a rounded dark plate (the supplied
 *   asset has a black canvas, so a plate keeps it crisp on white/navy).
 * - File pending: plain typographic wordmark (no plate) so nothing renders
 *   dark-on-dark. `tone` controls the wordmark colours for light/dark hosts.
 */
export function BrandLogo({
  tone = "dark",
  className = "h-14",
  plateClass = "rounded-xl",
}: {
  tone?: "dark" | "light";
  className?: string;
  plateClass?: string;
}) {
  const [missing, setMissing] = useState(false);

  if (missing) return <Wordmark tone={tone} className={className} />;

  return (
    <span className={`inline-flex overflow-hidden ${plateClass} bg-brand-deep ring-1 ring-white/15 ${className}`}>
      <img
        src={LOGO_SRC}
        alt={LOGO_ALT}
        loading="eager"
        decoding="async"
        className="h-full w-auto object-contain"
        onError={() => setMissing(true)}
      />
    </span>
  );
}
