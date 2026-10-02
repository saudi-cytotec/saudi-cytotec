/**
 * Brand logo — approved 2026 asset.
 * Canonical file: /images/logo.png
 */
export const LOGO_SRC = "/images/logo.png";
export const LOGO_ALT = "شعار سايتوتك في السعودية | وكيل Pfizer الرسمي";

/**
 * Typographic wordmark used on the homepage hero brand panel and footer
 * branding contexts where the logo mark sits alongside text lockups.
 */
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

/**
 * Approved logo lockup.
 * The heavy raster asset is kept for desktop branding, while mobile uses the
 * lightweight typographic wordmark so the 1.65 MB logo does not block the
 * initial mobile load.
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
  return (
    <span className={`inline-flex overflow-hidden ${plateClass} bg-brand-deep ring-1 ring-white/15 ${className}`}>
      <span className="sm:hidden px-3 py-2">
        <Wordmark tone={tone === "light" ? "light" : "dark"} />
      </span>
      <span className="hidden h-full sm:inline-flex">
        <img
          src={LOGO_SRC}
          alt={LOGO_ALT}
          width={1254}
          height={1254}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="h-full w-auto object-contain"
        />
      </span>
    </span>
  );
}
