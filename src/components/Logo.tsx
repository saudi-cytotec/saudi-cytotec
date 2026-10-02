/**
 * Brand logo — approved 2026 asset.
 * Canonical file: /images/logo.png
 */

export const LOGO_SRC = "/images/logo.png";
export const LOGO_ALT = "شعار سايتوتك في السعودية | وكيل Pfizer الرسمي";

export function Wordmark({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={`leading-none ${className}`}>
      <span dir="ltr" className="font-display block text-[1.65rem] font-extrabold tracking-tight">
        <span className="text-accent">saudi</span>
        <span className={tone === "light" ? "text-white" : "text-brand"}>ersaa</span>
      </span>
      <span className={`mt-1 block text-[11px] font-semibold ${tone === "light" ? "text-white/70" : "text-ink-soft"}`}>
        سايتوتك في السعودية | وكيل Pfizer الرسمي
      </span>
    </span>
  );
}

export function BrandLogo({
  className = "h-14",
}: {
  className?: string;
  plateClass?: string;
  tone?: "dark" | "light";
}) {
  return (
    <img
      src={LOGO_SRC}
      alt={LOGO_ALT}
      className={`block w-auto object-contain ${className}`}
      width="320"
      height="96"
      loading="eager"
      decoding="async"
    />
  );
}
