import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Shared navy page header — the internal-page counterpart of the homepage
 * hero: deep-navy gradient panel, white display title, light breadcrumbs.
 */
export function PageHero({
  crumbs,
  title,
  description,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-bl from-brand-deep via-[#102c52] to-brand text-white ring-1 ring-line/60">
      <span className="pointer-events-none absolute -top-20 -start-20 h-64 w-64 rounded-full bg-sky/25 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute -bottom-24 -end-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
      <div className="relative px-6 py-9 sm:px-10 sm:py-11">
        <Breadcrumbs tone="light" items={crumbs} />
        <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.35] sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-3xl text-[0.98rem] leading-8 text-white/80">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}
