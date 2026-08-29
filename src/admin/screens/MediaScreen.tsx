import { useRef, useState } from "react";
import { mediaLibrary } from "../../data/media";
import { uploadImageRequest } from "../api";
import { Badge, Section } from "../ui";

export function MediaScreen() {
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      setNote("الملف أكبر من 2MB.");
      return;
    }
    setBusy(true);
    setNote(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = String(reader.result).split(",")[1] ?? "";
      const res = await uploadImageRequest(file.name, base64);
      setBusy(false);
      if (res.ok && res.data.url) {
        setUploaded((current) => [...current, res.data.url!]);
        setNote(`رُفعت الصورة: ${res.data.url} ${res.data.note ?? ""}`);
      } else {
        setNote(res.data.error || res.data.blocker || "تعذر الرفع.");
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-brand-deep">مكتبة الوسائط</h1>
      <p className="max-w-3xl text-sm leading-7 text-ink-soft">
        كل صورة مهمة تحمل اسم ملف وصفياً ونصاً بديلاً وأبعاداً، وتُخدَّم بتخزين مؤقت طويل (Cache-Control immutable في vercel.json). الرفع يلتزم الصورة في المستودع تحت <span dir="ltr">public/images/uploads/</span> ثم يفعّل إعادة النشر.
      </p>
      {note ? <p role="status" className="rounded-2xl bg-brand-soft p-3 text-sm text-brand-deep">{note}</p> : null}

      <Section
        title="رفع صورة جديدة"
        action={
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
                e.currentTarget.value = "";
              }}
            />
            <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="rounded-full bg-brand px-4 py-2 text-sm text-white disabled:opacity-60">
              {busy ? "جارٍ الرفع..." : "اختيار ملف (JPG/PNG/WebP/SVG ≤ 2MB)"}
            </button>
          </>
        }
      >
        {uploaded.length ? (
          <ul className="flex flex-wrap gap-2 font-mono text-xs" dir="ltr">
            {uploaded.map((url) => (
              <li key={url} className="rounded-full bg-cream px-3 py-1">{url}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-soft">لم تُرفع صور في هذه الجلسة بعد.</p>
        )}
      </Section>

      <div className="grid gap-4 md:grid-cols-3">
        {mediaLibrary.map((item) => (
          <div key={item.file} className="rounded-3xl border border-line bg-paper p-4">
            <div className="h-40 overflow-hidden rounded-2xl bg-cream">
              <img src={item.file} alt={item.alt} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <p className="mt-3 flex items-center justify-between gap-2 font-mono text-xs" dir="ltr">
              {item.file}
              {item.uploaded ? <Badge tone="info">مرفوعة</Badge> : null}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              {item.width}×{item.height} · {item.role}
            </p>
            <p className="mt-1 text-xs leading-5">ALT: {item.alt || "زخرفية (فارغة)"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
