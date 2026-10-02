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
        <picture>
          <source srcSet="/images/logo.webp" type="image/webp" />
          <img src={LOGO_SRC} alt={LOGO_ALT} width={1536} height={1024} decoding="async" fetchPriority="low" className="h-full w-auto max-w-full object-contain" />
        </picture>
      </span>
    </span>
  );
}
