export function ArticleMark({ label = "محتوى تعليمي" }: { label?: string }) {
  return (
    <div className="mt-6 flex max-w-3xl items-center gap-3 rounded-2xl border border-line bg-paper px-3 py-2">
      <img src="/images/article-mark.svg" alt="" width={40} height={40} className="h-10 w-10" />
      <p className="text-xs leading-6 text-ink-soft">{label} — رسم داخلي صغير ضمن التصميم، وليس مادة ترويجية.</p>
    </div>
  );
}
