import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "../../cms/CatalogContext";
import { buildLinkGraph } from "../../utils/internalLinks";
import { Badge, Card, EmptyState, Section, Td, Th } from "../ui";

interface LiveCheck {
  path: string;
  http: number;
  title: string | null;
  h1: string | null;
  canonical: string | null;
  robotsMeta: string | null;
  schemaTypes: string[];
  ok: boolean;
  error?: string;
}

/**
 * Indexability status — live, same-origin checks of rendered public pages
 * plus computed per-URL checks for the whole catalog.
 */
export function IndexabilityScreen() {
  const { managed, articles } = useCatalog();
  const [robots, setRobots] = useState<string | null>(null);
  const [checks, setChecks] = useState<LiveCheck[] | null>(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    fetch("/robots.txt", { cache: "no-store" })
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then(setRobots)
      .catch(() => setRobots("FETCH_FAILED"));
  }, []);

  useEffect(() => {
    const sample = ["/", "/blog", "/what-is-cytotec", ...articles.filter((a) => !a.noindex).slice(0, 4).map((a) => `/blog/${a.slug}`)];
    Promise.all(sample.map((path) => checkPage(path)))
      .then(setChecks)
      .finally(() => setRunning(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles.length]);

  const graph = useMemo(() => buildLinkGraph(managed), [managed]);

  const computed = useMemo(() => {
    // Keep in sync with CatalogProvider: status matching is case-insensitive so
    // a published article can never be miscounted as non-public here.
    const published = managed.filter((a) => String(a.status).toLowerCase() === "published");
    const notIndexed = published.filter((a) => a.noindex).length;
    const orphans = graph.orphans.length;
    return {
      total: published.length,
      notIndexed,
      orphans,
      canonicalOk: true,
    };
  }, [managed, graph]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-brand-deep">حالة الفهرسة (Indexability)</h1>
      <p className="max-w-3xl text-sm leading-7 text-ink-soft">
        كل صفحة مهمة يجب أن تكون: 200 · قابلة للفهرسة · Canonical ذاتي · مرتبطة داخلياً · مؤهلة للخريطة. الفحص أدناه يجري طلبات حقيقية same-origin لصفحات منشورة ويتحقق من العنوان وH1 وcanonical والـschema في الناتج المعروض.
      </p>

      <div className="grid gap-4 md:grid-cols-4">
        <Card label="مقالات منشورة" value={computed.total} />
        <Card label="صفحات noindex" value={computed.notIndexed} tone={computed.notIndexed ? "warn" : "ok"} hint={computed.notIndexed ? "روابط انتقالية مقصودة خارج الخريطة" : "لا يوجد noindex على أي صفحة عامة"} />
        <Card label="مقالات معزولة" value={computed.orphans} tone={computed.orphans ? "warn" : "ok"} />
        <Card label="Robots.txt" value={robots === "FETCH_FAILED" ? "تعذر الجلب" : robots ? "مقروء" : "..."} tone={robots && robots !== "FETCH_FAILED" ? "ok" : "warn"} />
      </div>

      {robots && robots !== "FETCH_FAILED" ? (
        <Section title="robots.txt المنشور">
          <pre className="overflow-x-auto rounded-2xl bg-brand-deep p-4 text-xs text-sand" dir="ltr">{robots}</pre>
          <p className="mt-2 text-xs text-ink-soft">
            القاعدة: Allow: / مع استبعاد /search و/admin و/api فقط — ولا حجب لـ CSS أو JS أو الصور. يُعلَن sitemap.
          </p>
        </Section>
      ) : null}

      <Section title="فحص صفحات حية (same-origin)">
        {running ? <p className="text-sm text-ink-soft">جاري الفحص...</p> : null}
        {checks?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream">
                <tr>
                  <Th>الصفحة</Th>
                  <Th>HTTP</Th>
                  <Th>Title</Th>
                  <Th>H1</Th>
                  <Th>Canonical</Th>
                  <Th>Robots meta</Th>
                  <Th>Schema</Th>
                  <Th>الحكم</Th>
                </tr>
              </thead>
              <tbody>
                {checks.map((check) => (
                  <tr key={check.path} className="border-t border-line align-top">
                    <Td className="font-mono text-xs" ><span dir="ltr">{check.path}</span></Td>
                    <Td className={check.http === 200 ? "text-sage" : "text-clay"}>{check.http}</Td>
                    <Td className="text-xs">{check.title ? (check.title.length > 60 ? check.title.slice(0, 60) + "…" : check.title) : <span className="text-clay">—</span>}</Td>
                    <Td className="text-xs">{check.h1 ? (check.h1.length > 40 ? check.h1.slice(0, 40) + "…" : check.h1) : <span className="text-clay">—</span>}</Td>
                    <Td className="font-mono text-[10px]">
                      {check.canonical ? (
                        <span dir="ltr" className="block max-w-44 truncate">{check.canonical}</span>
                      ) : (
                        <span className="text-clay">—</span>
                      )}
                    </Td>
                    <Td className="text-xs">{check.robotsMeta ?? "index (افتراضي)"}</Td>
                    <Td className="text-xs">{check.schemaTypes.join("، ") || "—"}</Td>
                    <Td>{check.ok ? <Badge tone="ok">PASS</Badge> : <Badge tone="bad">FAIL</Badge>}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {!checks?.length && !running ? <EmptyState text="لا توجد نتائج فحص." /> : null}
      </Section>
    </div>
  );
}

async function checkPage(path: string): Promise<LiveCheck> {
  const base: LiveCheck = { path, http: 0, title: null, h1: null, canonical: null, robotsMeta: null, schemaTypes: [], ok: false };
  try {
    const res = await fetch(path, { cache: "no-store", headers: { Accept: "text/html" } });
    base.http = res.status;
    const html = await res.text();
    base.title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? null;
    base.h1 = html.match(/<h1[^>]*>([^<]*)<\/h1>/i)?.[1]?.trim() ?? null;
    base.canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? null;
    base.robotsMeta = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] ?? null;
    const types = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
    base.schemaTypes = [...new Set(types)];
    const selfCanonical = base.canonical?.endsWith(path === "/" ? "/" : path) ?? false;
    base.ok = base.http === 200 && Boolean(base.title) && selfCanonical;
    return base;
  } catch (err) {
    base.error = String(err);
    return base;
  }
}
