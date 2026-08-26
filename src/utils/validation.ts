import type { ManagedArticle, ValidationItem, ValidationResult } from "../types";
import { MIN_BODY_WORDS, bodyStructure, bodyWordCount, isDisclaimerBlock } from "./bodyWordCount";
import { isValidShortSlug } from "./slug";

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

  const items: ValidationItem[] = [
    {
      id: "words",
      label: "متن المقال ≥ 2000 كلمة",
      ok: words >= MIN_BODY_WORDS,
      detail:
        words >= MIN_BODY_WORDS
          ? `Word count: ${words} (المتن فقط)`
          : `Word count: ${words} — ناقص ${missingWords} كلمة من المتن قبل النشر.`,
      blocking: true,
    },
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
      detail: slugTaken ? "هذا الرابط مستخدم لمقال آخر." : "الرابط فريد.",
      blocking: true,
    },
    {
      id: "seo-title",
      label: "عنوان SEO",
      ok: article.seoTitle.trim().length >= 12 && article.seoTitle.trim().length <= 70,
      detail: article.seoTitle.trim() ? `الطول الحالي ${article.seoTitle.trim().length} حرفاً.` : "عنوان SEO مطلوب.",
      blocking: true,
    },
    {
      id: "meta",
      label: "الوصف التعريفي",
      ok: article.metaDescription.trim().length >= 70 && article.metaDescription.trim().length <= 170,
      detail: article.metaDescription.trim()
        ? `الطول الحالي ${article.metaDescription.trim().length} حرفاً.`
        : "الوصف التعريفي مطلوب.",
      blocking: true,
    },
    {
      id: "keyword",
      label: "الكلمة المفتاحية الأساسية",
      ok: article.primaryKeyword.trim().length >= 3,
      detail: article.primaryKeyword.trim() ? article.primaryKeyword : "أضيفي كلمة مفتاحية أساسية.",
      blocking: true,
    },
    {
      id: "structure",
      label: "بنية المقال التعليمية",
      ok: hasStructure(article),
      detail: hasStructure(article)
        ? `فقرات ${structure.paragraphs} · H2 ${structure.h2} · H3 ${structure.h3}`
        : "يلزم مقدمة و6 عناوين H2 على الأقل وعنوانان H3.",
      blocking: true,
    },
    {
      id: "disclaimer",
      label: "إخلاء المسؤولية الطبية",
      ok: hasDisclaimer(article),
      detail: hasDisclaimer(article) ? "موجود خارج عدّ المتن." : "أضيفي إخلاء مسؤولية تعليمية واضحاً.",
      blocking: true,
    },
    {
      id: "references",
      label: "المراجع",
      ok: article.references.length >= 2,
      detail: article.references.length >= 2 ? `${article.references.length} مراجع.` : "يلزم مرجعان حقيقيان على الأقل.",
      blocking: true,
    },
    {
      id: "duplicate",
      label: "لا يوجد عنوان مكرر",
      ok: !titleTaken,
      detail: titleTaken ? "عنوان مطابق لمقال آخر. هذا يسبب تآكل الكلمات المفتاحية." : "العنوان غير مكرر.",
      blocking: true,
    },
  ];

  return {
    ok: items.filter((i) => i.blocking).every((i) => i.ok),
    wordCount: words,
    missingWords,
    items,
  };
}
