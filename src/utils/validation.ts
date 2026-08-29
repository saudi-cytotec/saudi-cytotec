import type { ManagedArticle, ValidationItem, ValidationResult } from "../types";
import { MIN_BODY_WORDS, bodyStructure, bodyWordCount, isDisclaimerBlock } from "./bodyWordCount";
import { isValidShortSlug } from "./slug";

/**
 * Validation policy
 * -----------------
 * Two classes of finding, deliberately separated:
 *
 *  BLOCKING  — the page is technically broken and would render a bad or
 *              unreachable URL: missing/duplicate slug, missing title, or an
 *              empty body. These are correctness bugs, not opinions.
 *
 *  WARNING   — quality and SEO recommendations: word count, SEO title length,
 *              meta description length, heading structure, reference count,
 *              duplicate title, per-article disclaimer.
 *
 * Warnings NEVER prevent publishing. The publishing model is
 * publish -> crawl -> index -> monitor -> improve, not
 * perfect-SEO -> publish. Editorial and SEO judgement belongs to the editor,
 * not to a hard gate in code.
 */

function hasStructure(article: ManagedArticle): boolean {
  const types = article.blocks.filter((b) => !isDisclaimerBlock(b)).map((b) => b.type);
  return types.includes("p") && types.filter((t) => t === "h2").length >= 6 && types.filter((t) => t === "h3").length >= 2;
}

function hasDisclaimer(article: ManagedArticle): boolean {
  if (article.hasDisclaimer) return true;
  return article.blocks.some((block) => isDisclaimerBlock(block));
}

export const MIN_WORDS = MIN_BODY_WORDS;

export function validateArticle(
  article: ManagedArticle,
  usedSlugs: string[],
  usedTitles: string[],
): ValidationResult {
  const words = bodyWordCount(article.blocks);
  const missingWords = Math.max(0, MIN_BODY_WORDS - words);
  const slugCheck = isValidShortSlug(article.slug);
  const slugTaken = usedSlugs.some((s) => s === article.slug);
  const titleTaken = usedTitles.some((t) => t.trim() === article.title.trim());
  const structure = bodyStructure(article.blocks);
  const seoTitleLen = article.seoTitle.trim().length;
  const metaLen = article.metaDescription.trim().length;

  const items: ValidationItem[] = [
    // ── BLOCKING: technically broken output ──────────────────────────────
    {
      id: "slug",
      label: "رابط إنجليزي قصير وصالح",
      ok: slugCheck.ok,
      detail: slugCheck.reason,
      blocking: true,
    },
    {
      id: "unique-slug",
      label: "الرابط غير مكرر",
      ok: !slugTaken,
      detail: slugTaken
        ? "هذا الرابط مستخدم لمقال آخر — النشر سيُنشئ تصادماً في المسارات."
        : "الرابط فريد.",
      blocking: true,
    },
    {
      id: "title",
      label: "يوجد عنوان وH1",
      ok: article.title.trim().length > 0 && article.h1.trim().length > 0,
      detail:
        article.title.trim() && article.h1.trim()
          ? "العنوان وH1 موجودان."
          : "الصفحة بلا عنوان أو H1 — لا يمكن نشر صفحة بلا عنوان.",
      blocking: true,
    },
    {
      id: "body",
      label: "يوجد محتوى في المتن",
      ok: words > 0,
      detail: words > 0 ? `${words} كلمة في المتن.` : "المتن فارغ — لا يوجد ما يُنشر.",
      blocking: true,
    },

    // ── WARNING: editorial & SEO recommendations (never block) ───────────
    {
      id: "words",
      label: `العمق المقترح: ${MIN_BODY_WORDS} كلمة`,
      ok: words >= MIN_BODY_WORDS,
      detail:
        words >= MIN_BODY_WORDS
          ? `${words} كلمة — ضمن العمق المقترح.`
          : `${words} كلمة. يُنصح بتوسيع المقال بـ ${missingWords} كلمة تقريباً. هذا لا يمنع النشر.`,
      blocking: false,
    },
    {
      id: "seo-title",
      label: "طول عنوان SEO (12–70 حرفاً)",
      ok: seoTitleLen >= 12 && seoTitleLen <= 70,
      detail: seoTitleLen
        ? `الطول الحالي ${seoTitleLen} حرفاً.`
        : "لا يوجد عنوان SEO — سيُستخدم عنوان المقال افتراضياً.",
      blocking: false,
    },
    {
      id: "meta",
      label: "طول الوصف التعريفي (70–170 حرفاً)",
      ok: metaLen >= 70 && metaLen <= 170,
      detail: metaLen ? `الطول الحالي ${metaLen} حرفاً.` : "لا يوجد وصف تعريفي.",
      blocking: false,
    },
    {
      id: "keyword",
      label: "كلمة مفتاحية أساسية",
      ok: article.primaryKeyword.trim().length >= 3,
      detail: article.primaryKeyword.trim() || "لم تُحدَّد كلمة مفتاحية أساسية.",
      blocking: false,
    },
    {
      id: "structure",
      label: "بنية العناوين (6×H2 و2×H3 مقترحة)",
      ok: hasStructure(article),
      detail: `فقرات ${structure.paragraphs} · H2 ${structure.h2} · H3 ${structure.h3}`,
      blocking: false,
    },
    {
      id: "disclaimer",
      label: "إخلاء المسؤولية الطبية",
      ok: hasDisclaimer(article),
      detail: hasDisclaimer(article)
        ? "موجود داخل المقال."
        : "غير موجود داخل المقال — يُعرض إخلاء المسؤولية العام تلقائياً في كل صفحة مقال.",
      blocking: false,
    },
    {
      id: "references",
      label: "المراجع (يُستحسن مرجعان فأكثر)",
      ok: article.references.length >= 2,
      detail:
        article.references.length >= 2
          ? `${article.references.length} مراجع.`
          : "لا توجد مراجع كافية — يُستحسن إضافة مصادر يمكن التحقق منها.",
      blocking: false,
    },
    {
      id: "duplicate",
      label: "لا يوجد عنوان مكرر",
      ok: !titleTaken,
      detail: titleTaken
        ? "عنوان مطابق لمقال آخر — قد يتسبب في تآكل الكلمات المفتاحية."
        : "العنوان غير مكرر.",
      blocking: false,
    },
  ];

  const blockingFailures = items.filter((i) => i.blocking && !i.ok);

  return {
    ok: blockingFailures.length === 0,
    wordCount: words,
    missingWords,
    items,
  };
}

export function blockingFailures(result: ValidationResult) {
  return result.items.filter((item) => item.blocking && !item.ok);
}

export function warnings(result: ValidationResult) {
  return result.items.filter((item) => !item.blocking && !item.ok);
}
