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
