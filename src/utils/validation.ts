import type { ManagedArticle } from "../types";
import { isValidShortSlug } from "./slug";

/**
 * Data-integrity check (NOT an SEO / content-quality validator)
 * ------------------------------------------------------------
 * The visible ERROR / WARNING / PASS "SEO validation" system has been removed.
 * Publishing is never blocked or scored by content-quality rules (word count,
 * SEO title/meta length, heading structure, FAQ, references, keywords, images,
 * disclaimers, ...). Editorial and SEO judgement belongs to the editor.
 *
 * The only thing kept here is the minimum needed so a *technically broken*
 * record cannot be saved to the repository and produce an unreachable URL:
 *
 *   - a valid, unique short slug (otherwise the page has no working URL), and
 *   - a non-empty title, and
 *   - at least some body content.
 *
 * These are correctness bugs, not opinions, and they mirror the same checks the
 * publish API enforces server-side. Nothing here is surfaced as a scoring panel.
 */

export interface IntegrityProblem {
  field: "slug" | "title" | "body";
  message: string;
}

export interface IntegrityResult {
  ok: boolean;
  problems: IntegrityProblem[];
}

function hasBodyContent(article: ManagedArticle): boolean {
  return article.blocks.some(
    (block) => (block.text && block.text.trim().length > 0) || (block.items && block.items.length > 0),
  );
}

export function checkArticleIntegrity(article: ManagedArticle, usedSlugs: string[] = []): IntegrityResult {
  const problems: IntegrityProblem[] = [];

  const slugCheck = isValidShortSlug(article.slug);
  if (!slugCheck.ok) {
    problems.push({ field: "slug", message: slugCheck.reason });
  } else if (usedSlugs.some((s) => s === article.slug)) {
    problems.push({ field: "slug", message: "هذا الرابط مستخدم لمقال آخر — اختاري رابطاً مختلفاً." });
  }

  if (!article.title.trim()) {
    problems.push({ field: "title", message: "العنوان مطلوب." });
  }

  if (!hasBodyContent(article)) {
    problems.push({ field: "body", message: "لا يوجد محتوى في المتن." });
  }

  return { ok: problems.length === 0, problems };
}

/**
 * Pre-publish status report — PASS / WARNING / ERROR.
 * ---------------------------------------------------
 * IMPORTANT POLICY: only genuine technical / data-integrity problems are
 * ERRORS, and only ERRORS can block publication. Everything else is an
 * informational WARNING that NEVER blocks publishing:
 *
 *   - article shorter than the recommended depth (word count is informational)
 *   - no secondary keywords
 *   - no FAQ
 *   - fewer H2/H3 than recommended
 *   - no optional image
 *   - SEO title/description not "perfect"
 *
 * This is deliberately NOT the removed "SEO gatekeeper": there is no score, no
 * pass mark and no gate. Editorial judgement belongs to the editor.
 */

export type PrePublishVerdict = "PASS" | "WARNING" | "ERROR";

export interface PrePublishNote {
  id: string;
  message: string;
}

export interface PrePublishReport {
  verdict: PrePublishVerdict;
  /** Blocking — a technically broken record. */
  errors: PrePublishNote[];
  /** Informational only — never blocks publishing. */
  warnings: PrePublishNote[];
}

/** Recommended body depth. Informational only — never enforced. */
export const RECOMMENDED_BODY_WORDS = 2000;

export function prePublishReport(article: ManagedArticle, integrity: IntegrityResult): PrePublishReport {
  const errors: PrePublishNote[] = integrity.problems.map((problem, index) => ({
    id: `${problem.field}-${index}`,
    message: problem.message,
  }));

  const warnings: PrePublishNote[] = [];
  const words = article.blocks.reduce((total, block) => {
    const text = [block.text ?? "", ...(block.items ?? [])].join(" ");
    return total + text.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
  const h2 = article.blocks.filter((b) => b.type === "h2").length;
  const h3 = article.blocks.filter((b) => b.type === "h3").length;

  if (words < RECOMMENDED_BODY_WORDS) {
    warnings.push({
      id: "words",
      message: `طول المتن ${words} كلمة (الطول المرجعي ${RECOMMENDED_BODY_WORDS} كلمة). معلومة إرشادية فقط — لا تمنع النشر.`,
    });
  }
  if (!article.secondaryKeywords.length) {
    warnings.push({ id: "secondary", message: "لا توجد كلمات مفتاحية ثانوية — اختيارية ولا تمنع النشر." });
  }
  if (!article.faqs?.length) {
    warnings.push({ id: "faq", message: "لا توجد أسئلة شائعة — اختيارية ولا تمنع النشر." });
  }
  if (h2 < 6 || h3 < 2) {
    warnings.push({
      id: "structure",
      message: `بنية العناوين: ${h2}×H2 و${h3}×H3 (المقترح 6×H2 و2×H3). توصية فقط — لا تمنع النشر.`,
    });
  }
  if (!article.image && !article.thumbnail && !article.bannerImage && !article.ogImage) {
    warnings.push({
      id: "image",
      message: "لم تُحدَّد أي صورة — هذا وضع صحيح تماماً: سيُنشر المقال بلا صورة ولن يُستبدل ذلك بصورة افتراضية.",
    });
  }
  const seoLen = article.seoTitle.trim().length;
  if (seoLen && (seoLen < 12 || seoLen > 70)) {
    warnings.push({ id: "seo-title", message: `طول عنوان SEO ${seoLen} حرفاً (المقترح 12–70). توصية فقط.` });
  }
  const metaLen = article.metaDescription.trim().length;
  if (metaLen && (metaLen < 70 || metaLen > 170)) {
    warnings.push({ id: "meta", message: `طول الوصف التعريفي ${metaLen} حرفاً (المقترح 70–170). توصية فقط.` });
  }
  if (article.references.length < 2) {
    warnings.push({ id: "references", message: "أقل من مرجعين — يُستحسن إضافة مصادر يمكن التحقق منها. لا يمنع النشر." });
  }

  return {
    verdict: errors.length ? "ERROR" : warnings.length ? "WARNING" : "PASS",
    errors,
    warnings,
  };
}
