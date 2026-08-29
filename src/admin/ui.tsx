import type { ReactNode } from "react";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <div className="mt-1 font-normal">{children}</div>
      {hint ? <p className="mt-1 text-xs font-normal text-ink-soft">{hint}</p> : null}
    </label>
  );
}

export function inputClass() {
  return "w-full rounded-2xl border border-line bg-white px-3 py-2 text-sm";
}

export function Card({ label, value, hint, tone }: { label: string; value: string | number; hint?: string; tone?: "ok" | "warn" | "bad" }) {
  const color = tone === "ok" ? "text-sage" : tone === "warn" ? "text-clay" : tone === "bad" ? "text-clay" : "text-brand-deep";
  return (
    <div className="rounded-3xl border border-line bg-paper p-5">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
      {hint ? <p className="mt-2 text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}

export function Section({ title, action, hint, children }: { title: string; action?: ReactNode; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-paper p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-brand-deep">{title}</h2>
        {action}
      </div>
      {hint ? <p className="mb-4 text-xs leading-6 text-ink-soft">{hint}</p> : null}
      {children}
    </section>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "ok" | "warn" | "bad" | "neutral" | "info" }) {
  const classes: Record<string, string> = {
    ok: "bg-[#e8f3ec] text-[#2e7d4f]",
    warn: "bg-[#fdf3e3] text-[#a06a12]",
    bad: "bg-accent-soft text-clay",
    neutral: "bg-cream text-ink-soft",
    info: "bg-brand-soft text-brand",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes[tone]}`}>{children}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, "ok" | "warn" | "bad" | "neutral" | "info"> = {
    PUBLISHED: "ok",
    UPDATED: "info",
    READY: "ok",
    REVIEW: "warn",
    DRAFT: "warn",
    OUTLINE: "info",
    RESEARCH: "info",
    IDEA: "neutral",
    published: "ok",
    scheduled: "info",
    draft: "warn",
    review: "warn",
  };
  return <Badge tone={map[status] ?? "neutral"}>{status}</Badge>;
}

export function Th({ children }: { children?: ReactNode }) {
  return <th className="px-3 py-2 text-right text-xs font-semibold text-ink-soft">{children}</th>;
}

export function Td({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <td className={`px-3 py-2 align-top ${className}`}>{children}</td>;
}

export function EmptyState({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed border-line bg-cream px-4 py-8 text-center text-sm text-ink-soft">{text}</p>;
}
