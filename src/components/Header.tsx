import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { moreNav, mainNav, SITE } from "../data/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/95 backdrop-blur-md">
      {/* Red identity accent strip */}
      <div className="h-1 w-full bg-accent" aria-hidden="true" />
      <div className="bg-brand-deep text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-xs sm:text-sm">
          <p>محتوى تعليمي عام — ليس استشارة طبية فردية</p>
          <Link to="/medical-disclaimer" className="underline decoration-accent/80 underline-offset-4">
            إخلاء المسؤولية
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src="/images/logo.png" alt="" width={48} height={48} className="h-12 w-12 rounded-2xl object-cover ring-1 ring-line" />
          <span className="min-w-0">
            <span className="block truncate text-lg font-bold text-brand-deep">{SITE.name}</span>
            <span className="block text-xs text-ink-soft">معلومات طبية تعليمية</span>
          </span>
        </Link>
        <form onSubmit={onSearch} className="mr-auto hidden max-w-sm flex-1 md:block">
          <label className="sr-only" htmlFor="site-search">
            بحث في المقالات
          </label>
          <input
            id="site-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن موضوع تعليمي..."
            className="w-full rounded-full border border-line bg-cream px-4 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
          />
        </form>
        <button
          type="button"
          className="rounded-full border border-line px-3 py-2 text-sm lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="فتح قائمة التنقل"
        >
          القائمة
        </button>
      </div>
      <nav className="hidden border-t border-line/70 lg:block" aria-label="التنقل الرئيسي">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-2">
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-sm ${isActive ? "bg-brand text-white" : "text-ink-soft hover:bg-brand-soft"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="relative">
            <button
              type="button"
              className="rounded-full px-3 py-1.5 text-sm text-ink-soft hover:bg-brand-soft"
              onClick={() => setMore((v) => !v)}
            >
              المزيد
            </button>
            {more ? (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-line bg-paper p-2 shadow-lg">
                {moreNav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMore(false)}
                    className="block rounded-xl px-3 py-2 text-sm hover:bg-cream"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </nav>
      {open ? (
        <div className="border-t border-line bg-paper px-4 py-4 lg:hidden">
          <form onSubmit={onSearch} className="mb-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث..."
              className="w-full rounded-full border border-line bg-cream px-4 py-2 text-sm"
            />
          </form>
          <div className="grid gap-1">
            {[...mainNav, ...moreNav].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 hover:bg-cream">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
