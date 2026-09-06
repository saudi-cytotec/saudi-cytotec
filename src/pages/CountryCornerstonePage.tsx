import { Link } from "react-router-dom";
import { ContentBlocks } from "../components/ContentBlocks";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { PageHero } from "../components/PageHero";
import { ReferencesList } from "../components/ReferencesList";
import { JsonLd, Seo } from "../components/Seo";
import { countryReferenceIds, type CountryCornerstone } from "../data/countryCornerstones";
import { references } from "../data/references";
import { clusters, SITE } from "../data/site";
import { useCountryPageMetadata } from "../utils/countryPageMetadata";
import { APPROVED_IMAGE_FILES } from "../data/media";

/** Only the four new cornerstones use this renderer; existing pages are untouched. */
export function CountryCornerstonePage({ page }: { page: CountryCornerstone }) {
  useCountryPageMetadata();
  const url = `${SITE.domain}${page.path}`;
  const referenceIds = countryReferenceIds(page);
  const topicClusters = clusters.filter((cluster) => page.topicClusters.includes(cluster.id));
  // Keep the editorial sequence consistent across the four independently written countries.
  const orderedSections = [...page.sections].sort((a, b) => {
    const rank = (heading: string) => {
      if (/مقصود|أسماء|اسم التجاري|سايتوتك والمادة/.test(heading)) return 1;
      if (/استخدامات/.test(heading)) return 2;
      if (/السلامة|التقييم|أمراض مزمنة|الأمان/.test(heading)) return 3;
      if (/فقدان|التبقيع/.test(heading)) return 4;
      if (/خارج الرحم/.test(heading)) return 5;
      if (/طارئ|طوارئ|علامات تستدعي/.test(heading)) return 6;
      if (/وزارة|مؤسسة|NHRA|تنظم|قرار مجلس/.test(heading)) return 7;
      if (/عبوة|منتج|مستحضر|مجهول المصدر|المستورد/.test(heading)) return 8;
      return 9;
    };
    return rank(a.heading) - rank(b.heading);
  });

  function Sources({ ids }: { ids: string[] }) {
    return (
      <p className="mt-3 text-xs leading-7 text-ink-soft" data-source-notes>
        المصادر:{" "}
        {ids.map((id, index) => {
          const reference = references[id];
          return reference ? (
            <span key={id}>
              {index > 0 ? "، " : ""}
              {reference.source}{" "}
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand underline underline-offset-4"
                aria-label={`${reference.source}: ${reference.title}`}
              >
                [{referenceIds.indexOf(id) + 1}]
              </a>
            </span>
          ) : null;
        })}
      </p>
    );
  }

  return (
    <article className="mx-auto max-w-7xl space-y-8 px-4 py-8" data-country-cornerstone={page.countryCode}>
      <Seo title={page.metaTitle} description={page.metaDescription} path={page.path} canonical={url} />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            "@id": `${url}#webpage`,
            url,
            name: page.h1,
            description: page.metaDescription,
            inLanguage: "ar",
            dateModified: page.updatedAt,
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.domain },
            citation: referenceIds.map((id) => references[id]?.url).filter(Boolean),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            url: `${url}#faq`,
            inLanguage: "ar",
            mainEntity: page.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]}
      />
      <PageHero
        crumbs={[
          { name: "محاور المحتوى", path: "/topics" },
          { name: page.title, path: page.path },
        ]}
        title={page.h1}
      />
      <figure className="overflow-hidden rounded-3xl border border-line bg-paper shadow-sm">
        <img
          src={APPROVED_IMAGE_FILES[1]}
          alt={`صورة توضيحية لمعلومات طبية موثوقة عن صحة المرأة في ${page.countryName}`}
          width={1536}
          height={1024}
          loading="eager"
          decoding="async"
          className="h-auto max-h-80 w-full object-cover"
        />
      </figure>

      <div className="max-w-3xl space-y-8">
        <section aria-labelledby="direct-answer-heading" data-direct-answer>
          <h2 id="direct-answer-heading" className="text-2xl font-bold text-teal-deep">الإجابة المباشرة</h2>
          <ContentBlocks blocks={page.blocks} />
          <Sources ids={page.introSources} />
        </section>

        <div data-country-emergency>
          <ContentBlocks blocks={[{ type: "callout", tone: "emergency", text: page.emergency.text }]} />
          <Sources ids={[page.emergency.source]} />
        </div>
        <DisclaimerBanner />
        <p className="text-sm text-ink-soft">
          تحديث تحريري: <time dateTime={page.updatedAt}>{page.updatedAt}</time>.
          {" "}معلومات عامة وليست تشخيصاً أو استشارة قانونية لحالة فردية.
        </p>

        <nav aria-label="محتويات الدليل" className="rounded-3xl border border-line bg-paper p-6">
          <h2 className="text-xl font-bold text-teal-deep">في هذا الدليل</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7">
            {orderedSections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="font-semibold text-brand underline underline-offset-4">
                  {section.heading}
                </a>
              </li>
            ))}
            <li><a href="#faq" className="font-semibold text-brand underline underline-offset-4">أسئلة شائعة عن الرعاية في {page.countryName}</a></li>
          </ul>
        </nav>

        {page.sections.map((section) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} data-country-section>
            <h2 id={`${section.id}-heading`} className="text-2xl font-bold leading-8 text-teal-deep">{section.heading}</h2>
            <ContentBlocks blocks={section.blocks} />
            <Sources ids={section.sources} />
            {section.links?.length ? (
              <ul className="mt-4 space-y-2 text-sm leading-7" aria-label={`قراءات مرتبطة: ${section.heading}`}>
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="font-semibold text-brand underline underline-offset-4">{link.label}</Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <ReferencesList ids={referenceIds} />

        <section id="faq" aria-labelledby="country-faq-heading" data-country-faqs>
          <h2 id="country-faq-heading" className="text-2xl font-bold text-teal-deep">أسئلة شائعة عن الرعاية في {page.countryName}</h2>
          <div className="mt-4 space-y-4">
            {page.faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-line bg-paper p-4" data-country-faq>
                <h3 className="font-bold text-teal">{faq.q}</h3>
                <p className="mt-2 leading-8" data-faq-answer>{faq.a}</p>
                <Sources ids={faq.sources} />
              </div>
            ))}
          </div>
        </section>

        <nav aria-label="المحاور الطبية المرتبطة" className="flex flex-wrap gap-3 text-sm">
          {topicClusters.map((cluster) => (
            <Link key={cluster.id} to={`/blog/cluster/${cluster.slug}`} className="rounded-full border border-line bg-paper px-4 py-2 font-semibold text-brand hover:bg-cream">
              {cluster.title}
            </Link>
          ))}
          <Link to="/topics" className="rounded-full border border-line bg-paper px-4 py-2 font-semibold text-brand hover:bg-cream">العودة إلى محاور المحتوى</Link>
        </nav>
      </div>
    </article>
  );
}
