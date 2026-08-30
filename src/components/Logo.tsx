/**
 * Brand logo — the EXACT approved asset.
 *
 * Canonical file: /images/لوجو.png (the supplied saudiersaa logo,
 * committed verbatim into the repo — never redrawn or regenerated).
 * This is one of only three approved image assets; no fallback image or
 * generated alternative is introduced anywhere.
 */
export const LOGO_SRC = "/images/لوجو.png";
export const LOGO_ALT = "شعار saudiersaa — مدونة سايتوتك التوعوية في السعودية";

/**
 * Typographic wordmark used on the homepage hero brand panel and footer
 * branding contexts where the logo marks sit alongside text lockups.
 * This is a text element, not an image and not an image fallback.
 */
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
 * The approved logo lockup — the committed file rendered verbatim inside a
 * rounded dark plate (the supplied asset has a black canvas, so a plate keeps
 * it crisp on white/navy).
 */
export function BrandLogo({
  className = "h-14",
  plateClass = "rounded-xl",
  tone = "dark",
}: {
  className?: string;
  plateClass?: string;
  tone?: "dark" | "light";
}) {
  // `tone` is accepted for API compatibility (light isnavy host in the
  // footer); the committed asset has a dark canvas so the plate is always navy.
  void tone;
  return (
    <span className={`inline-flex overflow-hidden ${plateClass} bg-brand-deep ring-1 ring-white/15 ${className}`}>
      <img
        src={LOGO_SRC}
        alt={LOGO_ALT}
        loading="eager"
        decoding="async"
        className="h-full w-auto object-contain"
      />
    </span>
  );
}
