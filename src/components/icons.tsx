/**
 * Shared inline icon set (24×24, stroke-based, lucide-style).
 * Kept dependency-free so the whole site renders with zero icon fonts.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function IconShieldCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconShieldAlert(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

export function IconStethoscope(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 3v6a5 5 0 0 0 10 0V3" />
      <path d="M4 3h2M14 3h2" />
      <path d="M10 14v2a6 6 0 0 0 12 0v-2" transform="translate(-2 0) scale(0.92)" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

export function IconUserMd(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a7 7 0 0 1 13 0" />
      <path d="M12 11v3" />
      <path d="M10.5 12.5h3" />
    </svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  );
}

export function IconBook(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 4h7a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2z" />
      <path d="M22 4h-7a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22z" />
    </svg>
  );
}

export function IconAward(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14.5-1.5 7 5-3 5 3-1.5-7" />
    </svg>
  );
}

export function IconAlertTriangle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function IconHelp(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function IconPill(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="8.5" width="17" height="7" rx="3.5" transform="rotate(-30 12 12)" />
      <path d="m8.7 6.9 6.6 10.2" transform="rotate(0 12 12)" />
    </svg>
  );
}

export function IconVenus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="9" r="5" />
      <path d="M12 14v7" />
      <path d="M9 18h6" />
    </svg>
  );
}

export function IconBaby(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 12h.01M15 12h.01" />
      <path d="M10 16c.5.5 1.2.8 2 .8s1.5-.3 2-.8" />
      <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9z" />
      <path d="M12 3c0 1.5.5 2.5 1.5 3" />
    </svg>
  );
}

export function IconBan(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="10" />
      <path d="m5 5 14 14" transform="rotate(90 12 12)" />
    </svg>
  );
}

export function IconSiren(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 18v-6a5 5 0 0 1 10 0v6" />
      <rect x="5" y="18" width="14" height="3" rx="1" />
      <path d="M12 2v2M4.5 6.5 6 8M19.5 6.5 18 8" />
    </svg>
  );
}

export function IconLandmark(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 21h18" />
      <path d="M5 21V10M9 21V10M15 21V10M19 21V10" />
      <path d="m12 3 8 5H4z" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m14 6-6 6 6 6" />
    </svg>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}

export function IconHeartPulse(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 1 1 7.5-6.6 5 5 0 1 1 7.5 6.6z" />
      <path d="M3.5 12h4l1.5-2.5 2.5 5 2-3.5h3" />
    </svg>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function IconCross(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
    </svg>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconFacebook(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v9h4v-9h3l1-4h-4V8z" transform="scale(0.92) translate(1 0.5)" />
    </svg>
  );
}

export function IconXSocial(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  );
}

export function IconYoutube(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2.5" y="6" width="19" height="12" rx="4" />
      <path d="m10.5 9.5 5 2.5-5 2.5z" />
    </svg>
  );
}
