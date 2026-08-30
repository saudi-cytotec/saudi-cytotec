import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../cms/CatalogContext";
import { clusters } from "../../data/site";
import { buildLinkGraph } from "../../utils/internalLinks";
import { statusRequest } from "../api";
import { Badge, Card, Section, StatusBadge, Td, Th } from "../ui";

export function Overview() {
  const { managed, map, redirectRules, notFoundLog, articles } = useCatalog();
  const [env, setEnv] = useState<Awaited<ReturnType<typeof statusRequest>>["data"] | null>(null);
  const [envError, setEnvError] = useState(false);

  useEffect(() => {
    statusRequest()
      .then((res) => {
        if (res.ok) setEnv(res.data);
        else setEnvError(true);
      })
      .catch(() => setEnvError(true));
  }, []);

  const graph = useMemo(() => buildLinkGraph(managed), [managed]);

  const drafts = managed.filter((a) => a.status === "draft").length;
  const review = managed.filter((a) => a.status === "review").length;
  const published = articles.length;

  const mapPublished = map.filter((row) => row.status === "PUBLISHED" || row.status === "UPDATED").length;
  const mapP0 = map.filter((row) => row.priority === "P0");
  const mapP0Done = mapP0.filter((row) => row.status === "PUBLISHED" || row.status === "UPDATED").length;
  const open404 = notFoundLog.filter((entry) => !entry.handled).length;
  const orphans = graph.orphans.length;
  const broken = graph.brokenLinks.length;

  const recent = [...managed].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || "")).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-brand-deep">نظرة عامة</h1>
        <div className="flex gap-2 text-xs">
          <Badge tone={env?.environment === "production" ? "ok" : "neutral"}>
            {env ? `بيئة ${env.environment}` : envError ? "تعذر التحقق من البيئة" : "جاري التحقق من البيئة..."}
          </Badge>
          <Badge tone={env?.capabilities.publish ? "ok" : "warn"}>
            {env ? (env.capabilities.publish ? "النشر إلى المستودع مفعّل" : "النشر ينتظر GITHUB_PUBLISH_TOKEN") : "..."}
          </Badge>
          <Badge tone={env?.capabilities.aiWriter ? "ok" : "warn"}>{env ? (env.capabilities.aiWriter ? "مولّد AI مفعّل" : "AI ينتظر OPENAI_API_KEY") : "..."}</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card label="منشور للعامة" value={published} />
        <Card label="مسودات" value={drafts} />
        <Card label="قيد المراجعة" value={review} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card label="خريطة المحتوى" value={`${mapPublished}/${map.length}`} hint={`P0 مكتمل: ${mapP0Done}/${mapP0.length}`} tone={mapPublished === map.length ? "ok" : "warn"} />
        <Card label="إجمالي المقالات" value={managed.length} hint={`منشور: ${published} · مسودات: ${drafts}`} />
        <Card label="روابط داخلية مكسورة" value={broken} tone={broken ? "bad" : "ok"} hint={`مقالات بلا روابط واردة: ${orphans}`} />
        <Card label="404 غير معالجة" value={open404} hint={`قواعد إعادة توجيه نشطة: ${redirectRules.length}`} tone={open404 ? "warn" : "ok"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section
          title="المجموعات العشر"
          action={<Link to="/admin/clusters" className="text-sm text-brand underline">إدارة التصنيفات</Link>}
        >
          <table className="w-full text-sm">
            <thead>
              <tr>
                <Th>المجموعة</Th>
                <Th>منشور</Th>
                <Th>مسودة</Th>
              </tr>
            </thead>
            <tbody>
              {clusters.map((cluster) => (
                <tr key={cluster.id} className="border-t border-line">
                  <Td>{cluster.shortTitle}</Td>
                  <Td>{managed.filter((a) => a.cluster === cluster.id && a.status === "published").length}</Td>
                  <Td>{managed.filter((a) => a.cluster === cluster.id && a.status !== "published").length}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section
          title="أحدث المحتوى"
          action={<Link to="/admin/articles" className="text-sm text-brand underline">كل المقالات</Link>}
        >
          <ul className="space-y-2 text-sm">
            {recent.map((article) => (
              <li key={article.id} className="flex items-center justify-between gap-2 rounded-2xl border border-line px-3 py-2">
                <Link to={`/admin/articles/${article.id}`} className="truncate font-semibold hover:text-brand">
                  {article.title || "بدون عنوان"}
                </Link>
                <span className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={article.status} />
                  <span className="text-xs text-ink-soft" dir="ltr">{article.updatedAt}</span>
                </span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="حالة المنصة" action={<Link to="/admin/indexability" className="text-sm text-brand underline">فحص الفهرسة</Link>}>
        <div className="grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-2xl border border-line p-4">
            <p className="font-bold text-brand-deep">النشر (Git → Vercel)</p>
            <p className="mt-1 text-xs leading-6 text-ink-soft">
              {env?.capabilities.publish
                ? "مفعّل: النشر يلتزم في المستودع ويفعّل إعادة النشر."
                : "بانتظار GITHUB_PUBLISH_TOKEN في متغيرات بيئة Vercel. المقالات تُحفظ محلياً حتى التفعيل."}
            </p>
          </div>
          <div className="rounded-2xl border border-line p-4">
            <p className="font-bold text-brand-deep">النشر الآلي والمجدول</p>
            <p className="mt-1 text-xs leading-6 text-ink-soft">
              لا توجد جدولة ولا cron ولا نشر تلقائي — النشر يحدث فقط بضغطة «نشر» من المحرر بعد جلسة مشرف.
            </p>
          </div>
          <div className="rounded-2xl border border-line p-4">
            <p className="font-bold text-brand-deep">مولّد المحتوى</p>
            <p className="mt-1 text-xs leading-6 text-ink-soft">
              {env?.capabilities.aiWriter
                ? "مفعّل (OPENAI_API_KEY مُعدّة)."
                : "بانتظار OPENAI_API_KEY — التوليد المحلي المساعد يعمل دائماً."}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
