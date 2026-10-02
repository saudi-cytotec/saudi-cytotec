/**
 * Brand logo — supplied Saudiersaa asset.
 * Optimized WebP for fast header/footer/favicons.
 */
export const LOGO_SRC = "/images/logo.webp";
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
    <span className={`inline-flex overflow-hidden ${plateClass} bg-brand-deep ring-1 ring-white/15 ${className}`}>
      <span className="inline-flex h-full w-full items-center justify-center">
        <img
          src={LOGO_SRC}
          alt={LOGO_ALT}
          width={192}
          height={192}
          decoding="async"
          fetchPriority="high"
          className="h-full w-auto max-w-full object-contain"
        />
      </span>
    </span>
  );
}
