import { SITE } from "../data/site";

export function MedicalEditorial() {
  return (
    <aside className="card-premium border border-line bg-paper p-5" aria-label="الشفافية التحريرية والمصادر">
      <h2 className="text-lg font-extrabold text-brand-deep">الشفافية التحريرية والمصادر</h2>
      <div className="mt-3 space-y-2 text-sm leading-7 text-ink-soft">
        <p><strong>التحرير:</strong> فريق تحرير المحتوى في {SITE.name}.</p>
        <p><strong>منهج المراجع:</strong> نعتمد على النشرات الرسمية والجهات الصحية والتنظيمية والمراجع السريرية القابلة للتحقق، ونميز بين المعلومة الطبية العامة والسياق المحلي.</p>
        <p><strong>حدود المراجعة:</strong> هذه الصفحة لا تدعي مراجعة من طبيب بعينه ما لم تُذكر هوية المراجع ومؤهلاته صراحة. المحتوى لا يشخص حالة فردية ولا يقدم وصفة أو جرعات.</p>
        <p><strong>آخر مراجعة تحريرية:</strong> 29 سبتمبر 2026. عند تغير مصدر رسمي أو تنظيم محلي، تُراجع الصفحة قبل اعتماد التغيير التحريري.</p>
      </div>
    </aside>
  );
}
