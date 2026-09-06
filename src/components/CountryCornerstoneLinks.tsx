import { Link } from "react-router-dom";
import { countryCornerstones } from "../data/countryCornerstones";
import type { ClusterId } from "../types";

/** Discovery within related medical hubs only; never mounted on the homepage. */
export function CountryCornerstoneLinks({ cluster }: { cluster?: ClusterId }) {
  const pages = countryCornerstones.filter((page) => !cluster || page.topicClusters.includes(cluster));
  if (!pages.length) return null;

  return (
    <section className="mt-12 rounded-3xl border border-line bg-paper p-6" aria-labelledby="country-guides-heading">
      <h2 id="country-guides-heading" className="text-2xl font-bold text-teal-deep">أدلة أدوية الإجهاض وسايتوتك حسب البلد</h2>
      <p className="mt-2 text-sm leading-7 text-ink-soft">
        معلومات تعليمية تربط سلامة الدواء وفقدان الحمل بالمصادر الرسمية وقنوات الرعاية المحلية، وليست صفحات بيع أو أدلة للمدن.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {pages.map((page) => (
          <Link key={page.path} to={page.path} className="rounded-2xl bg-cream p-4 hover:bg-brand-soft">
            <h3 className="font-bold text-brand-deep">{page.title}</h3>
            <p className="mt-2 text-sm leading-7 text-ink-soft">{page.metaDescription}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
