import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BrandLogo } from "./Logo";
import {
  IconFacebook,
  IconInstagram,
  IconMenu,
  IconSearch,
  IconShieldCheck,
  IconX,
  IconXSocial,
  IconYoutube,
} from "./icons";
import { mainNav, moreNav, SITE } from "../data/site";
import { HEALTH_LINES } from "../data/contact";

const SOCIALS = [
  { label: "إنستغرام", Icon: IconInstagram },
  { label: "فيسبوك", Icon: IconFacebook },
  { label: "إكس", Icon: IconXSocial },
  { label: "يوتيوب", Icon: IconYoutube },
];

const SA = HEALTH_LINES.find((c) => c.code === "sa");

export function Header() {
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setOpen(false);
    setSearchOpen(false);
    setQ("");
  }

  return (
    <header className="sticky top-0 z-40">
      {/* ── Top navy bar ─────────────────────────────────────────────── */}
      <div className="bg-brand-deep text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:text-[13px]">
          {/* Start (right in RTL): Official health lines */}
          <div className="flex items-center gap-3 font-semibold">
            <span className="flex items-center gap-1.5">
              <IconShieldCheck className="h-4 w-4 text-[#7fd4a8]" />
              منصة توعوية موثوقة لصحة المرأة السعودية
            </span>
            <span className="hidden sm:inline-flex items-center gap-2 text-white/80">
              <span>وزارة الصحة</span>
              <span dir="ltr" className="font-mono font-bold text-white">
                {SA?.lines.find((l) => l.label.includes("وزارة الصحة"))?.value ?? "937"}
              </span>
              <span>· الطوارئ</span>
              <span dir="ltr" className="font-mono font-bold text-white">
                {SA?.lines.find((l) => l.label.includes("الإسعاف"))?.value ?? "997"}
              </span>
            </span>
          </div>
          {/* End (left in RTL): socials + verified content */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2.5 text-white/75 sm:flex" aria-hidden="true">
              {SOCIALS.map(({ label, Icon }) => (
                <span key={label} title={label} className="transition hover:text-white">
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
            <span className="flex items-center gap-1.5 font-semibold text-white/90">
              <IconShieldCheck className="h-4 w-4 text-[#7fd4a8]" />
              محتوى طبي موثّق
            </span>
          </div>
        </div>
      </div>

      {/* ── White branded header ─────────────────────────────────────── */}
      <div className="border-b border-line bg-white shadow-[0_1px_10px_-4px_rgb(11_37_69/0.12)]">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          {/* Brand lockup — the exact supplied logo */}
          <Link to="/" className="shrink-0" aria-label={`${SITE.name} — الرئيسية`}>
            <BrandLogo className="h-14 sm:h-[4.4rem]" />
          </Link>

          {/* Primary navigation (desktop) */}
          <nav className="ms-2 hidden items-center gap-0.5 xl:flex" aria-label="التنقل الرئيسي">
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `relative rounded-lg px-3 py-2 text-[15px] font-semibold transition ${
                    isActive
                      ? "text-accent after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[3px] after:rounded-full after:bg-accent"
                      : "text-brand-deep hover:bg-brand-soft hover:text-brand"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMore((v) => !v)}
                aria-expanded={more}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-semibold text-brand-deep transition hover:bg-brand-soft"
              >
                المزيد
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 transition ${more ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {more ? (
                <div className="absolute start-0 top-full z-50 mt-2 w-60 rounded-2xl border border-line bg-white p-2 shadow-xl">
                  {moreNav.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMore(false)}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-ink transition hover:bg-brand-soft hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>

          {/* Actions */}
          <div className="ms-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
              aria-label="بحث في المقالات"
              className="grid h-10 w-10 place-items-center rounded-full text-brand-deep transition hover:bg-brand-soft"
            >
              <IconSearch className="h-5 w-5" />
            </button>
            <Link
              to="/contact"
              className="hidden items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_16px_-6px_rgb(22_53_107/0.6)] transition hover:bg-brand-deep md:inline-flex"
            >
              تواصل تحريري
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line text-brand-deep xl:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="فتح قائمة التنقل"
            >
              {open ? <IconX className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Slide-down search row */}
        {searchOpen ? (
          <div className="border-t border-line/70 bg-white">
            <form onSubmit={onSearch} className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3">
              <div className="relative flex-1">
                <IconSearch className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" />
                <label className="sr-only" htmlFor="site-search">
                  بحث في المقالات
                </label>
                <input
                  id="site-search"
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ابحثي عن موضوع: صحة المرأة، الحمل، الخصوبة، الأمان الدوائي..."
                  className="w-full rounded-full border border-line bg-cream py-2.5 pe-4 ps-11 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-deep"
              >
                بحث
              </button>
            </form>
          </div>
        ) : null}

        {/* Mobile menu */}
        {open ? (
          <div className="border-t border-line bg-white px-4 pb-5 pt-3 xl:hidden">
            <form onSubmit={onSearch} className="mb-3 flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحثي في المقالات..."
                aria-label="بحث في المقالات"
                className="w-full rounded-full border border-line bg-cream px-4 py-2 text-sm"
              />
              <button type="submit" className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white">
                بحث
              </button>
            </form>
            <div className="grid grid-cols-2 gap-1">
              {[...mainNav, ...moreNav].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-accent-soft text-accent" : "text-brand-deep hover:bg-brand-soft"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white"
            >
              تواصل تحريري
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
