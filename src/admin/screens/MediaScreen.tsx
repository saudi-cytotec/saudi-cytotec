import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../cms/CatalogContext";
import { approvedAssets, uploadedMedia, type MediaItem } from "../../data/media";
import { deleteImageRequest, uploadImageRequest } from "../api";
import { Badge, Section, inputClass } from "../ui";

/**
 * Media library.
 * --------------
 * Two clearly separated groups:
 *
 *   1. PERMANENT APPROVED ASSETS — the logo, the homepage banner and the
 *      permanent article WhatsApp banner. Never deleted, replaced or redrawn.
 *   2. UPLOADED MEDIA — images an administrator uploaded through the CMS.
 *      They are committed to the repository, so they survive refresh, logout,
 *      deployment and redeploy, and are visible from any browser.
 *
 * Upload and delete require an authenticated admin session (enforced server
 * side). Deleting is only offered for uploaded images that no article uses.
 * No legacy generated image is ever reintroduced.
 */

function describeFailure(data: Record<string, unknown> | undefined, status: number): string {
  if (status === 401) return "انتهت جلسة الدخول — سجّلي الدخول مرة أخرى. (AUTH_REQUIRED)";
  const error = typeof data?.error === "string" ? data.error : `فشل الطلب (HTTP ${status}).`;
  const remedy = typeof data?.remedy === "string" ? data.remedy : "";
  const code = typeof data?.code === "string" ? data.code : "";
  return [error, remedy, code ? `رمز: ${code}` : ""].filter(Boolean).join(" — ");
}

export function MediaScreen() {
  const { managed } = useCatalog();
  const [items, setItems] = useState<MediaItem[]>(uploadedMedia);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingAlt, setPendingAlt] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  /** Which articles reference a given file, for the "Used by" column. */
  const usage = useMemo(() => {
    const map = new Map<string, { id: string; title: string; where: string }[]>();
    const add = (file: string | undefined, id: string, title: string, where: string) => {
      const key = (file ?? "").trim();
      if (!key) return;
      map.set(key, [...(map.get(key) ?? []), { id, title, where }]);
    };
    for (const a of managed) {
      add(a.image, a.id, a.title, "بارزة");
      add(a.thumbnail, a.id, a.title, "بطاقة");
      add(a.bannerImage, a.id, a.title, "بانر");
      add(a.ogImage, a.id, a.title, "مشاركة");
    }
    return map;
  }, [managed]);

  async function upload(file: File) {
    setError(null);
    setNote(null);
    if (!/\.(jpe?g|png|webp)$/i.test(file.name)) {
      setError("صيغة غير مدعومة. المسموح: JPG، JPEG، PNG، WEBP فقط.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(`حجم الملف ${(file.size / 1048576).toFixed(1)}MB — الحد الأقصى 5MB.`);
      return;
    }
    setBusy(true);
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
    if (!base64) {
      setBusy(false);
      setError("تعذر قراءة الملف من الجهاز.");
      return;
    }
    const res = await uploadImageRequest(file.name, base64, pendingAlt);
    setBusy(false);
    if (!res.ok || !res.data.url) {
      setError(describeFailure(res.data as Record<string, unknown>, res.status));
      return;
    }
    setItems((current) => [
      ...current.filter((item) => item.file !== res.data.url),
      {
        file: res.data.url!,
        alt: pendingAlt,
        width: res.data.width ?? 0,
        height: res.data.height ?? 0,
        role: "صورة مرفوعة من لوحة التحكم",
        uploaded: true,
        bytes: res.data.bytes,
      },
    ]);
    setPendingAlt("");
    setNote(`${res.data.note ?? "رُفعت الصورة."} المسار العام: ${res.data.url}`);
  }

  async function remove(file: string) {
    setError(null);
    setNote(null);
    setBusy(true);
    const res = await deleteImageRequest(file);
    setBusy(false);
    if (!res.ok) {
      setError(describeFailure(res.data as Record<string, unknown>, res.status));
      return;
    }
    setItems((current) => current.filter((item) => item.file !== file));
    setNote(res.data.note ?? "حُذفت الصورة.");
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-brand-deep">مكتبة الوسائط</h1>
      <p className="max-w-3xl text-sm leading-7 text-ink-soft">
        الصور المرفوعة تُلتزم في المستودع تحت <span dir="ltr">public/media/</span> وتُسجَّل في{" "}
        <span dir="ltr">content/media.json</span>، فتبقى بعد تحديث الصفحة وتسجيل الخروج وإعادة النشر على Vercel، وتظهر من أي
        متصفح. لا تُسنَد أي صورة إلى أي مقال تلقائياً — الاختيار يدوي دائماً من داخل المحرر.
      </p>

      {error ? <p role="alert" className="rounded-2xl bg-accent-soft p-3 text-sm leading-7 text-clay">{error}</p> : null}
      {note ? <p role="status" className="rounded-2xl bg-brand-soft p-3 text-sm leading-7 text-brand-deep">{note}</p> : null}

      <Section
        title="رفع صورة جديدة"
        hint="الصيغ المقبولة: JPG · JPEG · PNG · WEBP، حتى 5MB. يُفحص نوع الملف الحقيقي من محتواه، ويُنظَّف اسم الملف لمنع أي مسار غير آمن."
        action={
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.currentTarget.value = "";
                if (file) void upload(file);
              }}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="rounded-full bg-brand px-4 py-2 text-sm text-white disabled:opacity-60"
            >
              {busy ? "جارٍ الرفع..." : "رفع صورة"}
            </button>
          </>
        }
      >
        <label className="block text-sm font-semibold">
          النص البديل (ALT) للصورة الجديدة
          <input
            className={`${inputClass()} mt-1`}
            value={pendingAlt}
            onChange={(e) => setPendingAlt(e.target.value)}
            placeholder="وصف دقيق ومختصر — يُحفظ كما كتبتِه تماماً"
          />
        </label>
      </Section>

      <Section title={`الصور المرفوعة (${items.length})`} hint="يمكن حذف الصور غير المستخدمة فقط.">
        {items.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((item) => {
              const used = usage.get(item.file) ?? [];
              return (
                <div key={item.file} className="rounded-3xl border border-line bg-paper p-4">
                  <div className="h-40 overflow-hidden rounded-2xl bg-cream">
                    <img src={item.file} alt={item.alt} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-3 flex items-center justify-between gap-2 font-mono text-xs" dir="ltr">
                    {item.file}
                    <Badge tone="info">مرفوعة</Badge>
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {item.width}×{item.height}
                    {item.bytes ? ` · ${(item.bytes / 1024).toFixed(0)}KB` : ""}
                    {item.uploadedAt ? ` · ${item.uploadedAt}` : ""}
                  </p>
                  <p className="mt-1 text-xs leading-5">ALT: {item.alt || "— (غير محدد)"}</p>
                  <p className="mt-1 text-xs leading-5 text-ink-soft">
                    مستخدمة في:{" "}
                    {used.length ? (
                      used.map((u, i) => (
                        <span key={`${u.id}-${u.where}`}>
                          {i ? "، " : ""}
                          <Link to={`/admin/articles/${u.id}`} className="text-brand hover:underline">
                            {u.title || u.id}
                          </Link>{" "}
                          ({u.where})
                        </span>
                      ))
                    ) : (
                      <span>لا شيء</span>
                    )}
                  </p>
                  {used.length ? (
                    <p className="mt-2 text-xs text-ink-soft">لا يمكن الحذف: الصورة مستخدمة في مقال.</p>
                  ) : (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => remove(item.file)}
                      className="mt-2 rounded-full border border-clay px-3 py-1 text-xs text-clay disabled:opacity-60"
                    >
                      حذف الصورة غير المستخدمة
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-ink-soft">لا توجد صور مرفوعة بعد. استخدمي «رفع صورة» أعلاه.</p>
        )}
      </Section>

      <Section title="الأصول الدائمة المعتمدة (لا تُحذف ولا تُستبدل)">
        <div className="grid gap-4 md:grid-cols-3">
          {approvedAssets.map((item) => (
            <div key={item.file} className="rounded-3xl border border-line bg-paper p-4">
              <div className="h-40 overflow-hidden rounded-2xl bg-cream">
                <img src={item.file} alt={item.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <p className="mt-3 flex items-center justify-between gap-2 font-mono text-xs" dir="ltr">
                {item.file}
                <Badge tone="ok">معتمدة</Badge>
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                {item.width}×{item.height} · {item.role}
              </p>
              <p className="mt-1 text-xs leading-5">ALT: {item.alt || "زخرفية (فارغة)"}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
