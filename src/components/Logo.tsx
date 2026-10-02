/**
 * Site logo.
 * The header uses the approved image asset from /public/images/logo.png.
 */

export const LOGO_SRC = "/images/logo.png";
export const LOGO_ALT = "سايتوتك في السعودية";

export function BrandLogo({
  className = "h-14",
}: {
  className?: string;
}) {
  return (
    <img
      src={LOGO_SRC}
      alt={LOGO_ALT}
      width={320}
      height={96}
      className={`block h-auto w-auto max-w-full object-contain ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}
