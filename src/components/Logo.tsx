/**
 * Brand logo: accessible text wordmark, avoiding the broken square asset.
 */
export const LOGO_SRC = "/images/saudiersaa-logo.webp";
export const LOGO_ALT = "شعار سايتوتك في السعودية";

export function Wordmark({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={`inline-flex flex-col justify-center leading-none ${className}`}>
      <span dir="ltr" className="block whitespace-nowrap font-display text-[1.35rem] font-extrabold tracking-tight">
        <span className="text-accent">saudi</span>
        <span className={tone === "light" ? "text-white" : "text-brand-deep"}>ersaa</span>
      </span>
      <span className={`mt-1 block whitespace-nowrap text-[9px] font-semibold ${tone === "light" ? "text-white/75" : "text-ink-soft"}`}>
        سايتوتك في السعودية | وكيل Pfizer الرسمي
      </span>
    </span>
  );
}

export function BrandLogo({
  className = "h-14",
  tone = "dark",
}: {
  className?: string;
  plateClass?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      role="img"
      aria-label={LOGO_ALT}
      className={`inline-flex min-w-[145px] shrink-0 items-center justify-center overflow-visible ${className}`}
    >
      <Wordmark tone={tone} />
    </span>
  );
}
