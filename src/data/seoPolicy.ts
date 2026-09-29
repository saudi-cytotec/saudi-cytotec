/**
 * Public SEO/content policy.
 *
 * The site is intentionally focused on a small Saudi-first editorial core.
 * Source files for retired articles remain in the repository for rollback and
 * editorial reference, but they are not part of the public catalog.
 */
export const ACTIVE_ARTICLE_SLUGS = new Set<string>([
  "cytotec-definition",
  "misoprostol-active-ingredient",
  "difference-cytotec-misoprostol",
  "cytotec-pharmaceutical-forms",
  "approved-medical-uses-misoprostol",
  "misoprostol-gastric-ulcers",
  "obstetric-uses-under-supervision",
  "unsafe-unsupervised-use",
  "general-safety-warnings",
  "pregnancy-boxed-warning",
  "regulatory-drug-warnings",
  "saudi-drug-regulation-context",
  "common-side-effects",
  "diarrhea-abdominal-pain",
  "abnormal-bleeding",
  "rare-serious-complications",
  "early-pregnancy-overview",
  "pregnancy-follow-up-care",
  "warning-signs-in-pregnancy",
  "reproductive-health-reliable-info",
  "womens-health-life-stages",
  "irregular-menstrual-cycle",
  "anemia-womens-health",
  "reliable-womens-health-sources",
  "common-myths-cytotec",
  "is-cytotec-safe-for-everyone",
  "use-without-prescription",
  "how-to-verify-medical-information",
  "contraindications-misoprostol",
  "basic-drug-interactions",
  "conditions-needing-prior-assessment",
  "medicines-that-may-increase-risk",
  "when-to-see-doctor-immediately",
  "signs-of-dangerous-bleeding",
  "severe-abdominal-pain",
  "high-fever-and-infection",
  "how-to-evaluate-medical-evidence",
  "fda-cytotec-warnings",
  "official-drug-leaflets",
  "trusted-sources-further-reading",
]);

export function isActiveArticleSlug(slug: string): boolean {
  return ACTIVE_ARTICLE_SLUGS.has(slug);
}
