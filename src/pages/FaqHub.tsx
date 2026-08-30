import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ContactCta } from "../components/ContactCta";
import { JsonLd, Seo } from "../components/Seo";
import { faqGroups } from "../data/faqs";
import { SITE } from "../data/site";

export function FaqHub() {
  const faqs = faqGroups.flatMap((group) => group.items);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo
        title="الأسئلة الشائعة عن سايتوتك وميزوبروستول وصحة المرأة"
        description="FAQ منظم حسب الاسم والمادة، الأمان، الحمل المبكر، والوصول للرعاية في السعودية مع روابط داخلية للمقالات والمصادر."
        path="/faq"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
          url: `${SITE.domain}/faq`,
          inLanguage: "ar-SA",
        }}
      />
      <Breadcrumbs items={[{ name: "الأسئلة الشائعة", path: "/faq" }]} />
      <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.35] text-teal-deep">الأسئلة الشائعة: إجابات مختصرة تقود إلى مصدر أعمق</h1>
      <p className="mt-4 max-w-3xl leading-8 text-ink-soft">هذه الصفحة تربط السؤال بالإجابة ثم بالخطوة التالية المناسبة: صفحة أمان، مقال تفصيلي، مصدر رسمي، أو تواصل عام. لا توجد تعليمات علاجية أو جرعات.</p>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="أقسام الأسئلة">
        {faqGroups.map((group) => (
          <a key={group.id} href={`#${group.id}`} className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-brand-deep hover:bg-cream">
            {group.title}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-8">
        {faqGroups.map((group) => (
          <section id={group.id} key={group.id} className="scroll-mt-32 rounded-3xl border border-line bg-paper p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-teal-deep">{group.title}</h2>
            <p className="mt-2 text-sm leading-7 text-ink-soft">{group.intro}</p>
            <div className="mt-5 divide-y divide-line">
              {group.items.map((item) => (
                <article key={item.q} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="text-lg font-bold text-brand-deep">{item.q}</h3>
                  <p className="mt-2 leading-8 text-ink-soft">{item.a}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.links.map((link) => (
                      <Link key={link.to} to={link.to} className="rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-teal hover:bg-brand-soft">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ContactCta topic="سؤال شائع" />
    </div>
  );
}
