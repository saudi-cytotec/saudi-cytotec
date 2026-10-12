/**
 * Brand logo. The current WebP asset renders as a solid green tile in the live preview,
 * so use a clear text fallback instead of showing a blank square.
 */
export const LOGO_SRC = "/images/saudiersaa-logo.webp";
export const LOGO_ALT = "شعار سايتوتك في السعودية";

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
  plateClass = "rounded-xl",
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
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${plateClass} bg-brand-deep ring-1 ring-white/15 ${className}`}
    >
      <span dir="ltr" className="font-display text-[1.35rem] font-black tracking-[-0.08em] text-white">
        <span className="text-accent">s</span>r
      </span>
    </span>
  );
}
