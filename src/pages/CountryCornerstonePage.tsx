import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../cms/CatalogContext";
import { CareReferral } from "../components/CareReferral";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { PageHero } from "../components/PageHero";
import { ReferencesList } from "../components/ReferencesList";
import { RelatedArticles } from "../components/RelatedArticles";
import { JsonLd, Seo } from "../components/Seo";
import { SITE } from "../data/site";
import type { CountryBlock, CountrySpec } from "../data/country/types";

/**
 * Country cornerstone page — shared renderer for the four country pages.
 *
 * The layout is identical for every country (H1 → tagline → banner image →
 * direct answer → 9 educational body sections → official sources → FAQ →
 * care referral → related articles). Content itself is fully authored per
 * country in src/data/country/*.ts and is deliberately NOT a template.
 */

const BANNER_SRC = "/images/Bannerrr.png";
const BANNER_ALT = "سعودي إرساء - منصة سعودية موثوقة للتوعية بصحة المرأة";

/** [[label|/path]] → <Link>, everything else stays text. */
function richText(text: string): ReactNode[] {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[\[([^|]+)\|([^\]]+)\]\]$/);
    if (match) {
      const [, label, to] = match;
      return (
        <Link key={i} to={to} className="font-semibold text-brand underline decoration-accent/60 underline-offset-4 hover:text-accent">
          {label}
        </Link>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Paragraph({ text }: { text: string }) {
  return <p>{richText(text)}</p>;
}

function CountryLinks({ items }: { items: { to: string; label: string; note?: string }[] }) {
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="rounded-2xl border border-line bg-paper p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand-soft/60"
        >
          <span className="text-sm font-bold text-brand-deep">{item.label}</span>
          {item.note ? <span className="mt-1 block text-xs leading-6 text-ink-soft">{item.note}</span> : null}
        </Link>
      ))}
    </div>
  );
}

function BodyBlock({ block }: { block: CountryBlock }) {
  switch (block.kind) {
    case "p":
      return <Paragraph text={block.text} />;
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "callout": {
      const tone =
        block.tone === "emergency"
          ? "border-clay bg-[#fae9ea] text-clay"
          : block.tone === "warning"
            ? "border-warn bg-warn-soft"
            : "border-brand bg-brand-soft";
      return (
        <aside className={`my-5 rounded-2xl border-r-4 px-4 py-3 leading-[2.05] ${tone}`}>
          {richText(block.text)}
        </aside>
      );
    }
    case "links":
      return <CountryLinks items={block.items} />;
  }
}

export function CountryCornerstonePage({ spec }: { spec: CountrySpec }) {
  const { articles } = useCatalog();
  const faqs = spec.faqs ?? [];
  const related = spec.relatedSlugs
    .map((slug) => articles.find((a) => a.slug === slug && !a.noindex))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const crumbs = [
    { name: "محاور المحتوى", path: "/topics" },
    { name: spec.title, path: spec.path },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <Seo
        title={spec.metaTitle}
        description={spec.metaDescription}
        path={spec.path}
        image={BANNER_SRC}
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": ["WebPage", "MedicalWebPage"],
            name: spec.h1,
            url: `${SITE.domain}${spec.path}`,
            inLanguage: "ar",
            description: spec.metaDescription,
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.domain },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          },
        ]}
      />

      <PageHero crumbs={crumbs} title={spec.h1}>
        <p className="mt-4 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/25">
          {spec.tagline}
        </p>
      </PageHero>

      {/* Approved homepage banner asset reused with the same layout language —
          contained inside a navy panel, never stretching over the content. */}
      <figure className="relative overflow-hidden rounded-[1.75rem] bg-brand-deep p-4 ring-1 ring-white/10 sm:p-6">
        <span className="pointer-events-none absolute -top-16 -start-16 h-56 w-56 rounded-full bg-sky/25 blur-3xl" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-20 -end-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex min-h-[9rem] items-center justify-center">
          <img
            src={BANNER_SRC}
            alt={BANNER_ALT}
            width={1536}
            height={1024}
            loading="eager"
            decoding="async"
            className="max-h-[17rem] w-auto max-w-full rounded-2xl object-contain drop-shadow-[0_18px_35px_rgb(0_0_0/0.45)]"
          />
        </div>
      </figure>

      {/* Short, direct answer (section 2 of the layout). */}
      <section className="card-premium max-w-3xl p-6">
        <h2 className="font-display text-xl font-extrabold text-brand-deep">إجابة مباشرة</h2>
        <div className="article-prose mt-3">
          <Paragraph text={spec.directAnswer} />
        </div>
      </section>

      <div className="max-w-3xl">
        <DisclaimerBanner />
      </div>

      <div className="max-w-3xl">
        <div className="article-prose">
          {spec.body.map((block, i) => (
            <BodyBlock key={i} block={block} />
          ))}
        </div>
      </div>

      {/* Section 12 — official sources. */}
      <ReferencesList title="المصادر الرسمية والمراجع" ids={spec.references} />

      {/* Section 13 — FAQ (visible items mirror the FAQPage JSON-LD exactly). */}
      {faqs.length ? (
        <section className="max-w-3xl">
          <h2 className="text-2xl font-bold text-teal-deep">الأسئلة الشائعة</h2>
          <div className="mt-4 space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-2xl border border-line bg-paper p-4">
                <h3 className="font-bold text-teal">{item.q}</h3>
                <div className="article-prose mt-2 [&>p]:mb-0">
                  <Paragraph text={item.a} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="max-w-3xl">
        <CareReferral />
      </div>

      {/* Section 14 — related articles. */}
      <section>
        <h2 className="mb-5 text-2xl font-bold text-teal-deep">مقالات ذات صلة</h2>
        {related.length ? (
          <RelatedArticles articles={related} />
        ) : (
          <p className="text-ink-soft">لا توجد مقالات مرتبطة إضافية في هذه المجموعة حالياً.</p>
        )}
      </section>

      <Link
        to="/topics"
        className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-deep"
      >
        تصفحي محاور المحتوى
      </Link>
    </div>
  );
}
