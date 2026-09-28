# SAUDIERSAA — Master Site Audit & Change Plan

Date: 2026-09-28
Branch: seo/article-audit-phase1

## Current status
- Sitewide SEO optimization merged into main.
- Article author/medical-review schema merged into main.
- Article metadata/internal-link phase 1 is in PR #43.
- Phase 2 enrichment data exists in src/data/articles/phase2Enrichment.ts.
- Phase 2 is NOT yet wired into expand.ts, so those four enrichments are not active.
- Production deployment must be revalidated after the Vercel deployment-rate-limit issue is cleared.

## Completed
1. Sitewide metadata, OG/Twitter, JSON-LD, city route registration, and SEO audits.
2. Saudi city URLs added to generated sitemap.
3. Article schema improved with author/reviewer/date fields.
4. 27 short article descriptions improved.
5. One short article title expanded.
6. Broken related slug cytotec-uses fixed.
7. Phase 2 editorial enrichment drafted for:
   - approved-medical-uses-misoprostol
   - common-side-effects
   - warning-signs-in-pregnancy
   - how-to-evaluate-medical-evidence

## P0 — must finish before calling the site complete
1. Wire PHASE2_ARTICLE_ENRICHMENT into the article builder.
2. Run npm run build.
3. Pass URL parity, prerender, SEO, indexability, image, architecture, WhatsApp, and green-identity audits.
4. Deploy to Production.
5. Smoke-test the live domain and key URLs.

## P1 — content quality
Audit the existing ~94 articles for structural overlap. Prioritize:
- Uses: approved-medical-uses-misoprostol, not-all-uses-are-alike, off-label-use-meaning, misoprostol-in-clinical-references.
- Safety: general-safety-warnings, common-side-effects, mild-symptoms-not-always-safe, when-symptoms-are-emergencies, rare-serious-complications.
- Pregnancy: warning-signs-in-pregnancy, bleeding-in-early-pregnancy, pregnancy-and-medicines-faq, education-vs-individual-treatment, pregnancy-follow-up-care.
- Evidence: how-to-evaluate-medical-evidence, clinical-studies-vs-anecdotes, reading-a-paper-as-non-specialist, limits-of-online-medical-info, why-medical-recommendations-change.

Review existing medical claims in enrich.ts for source support and remove/adjust unsupported or overly categorical claims. Do not add dosing, regimens, self-treatment steps, or procurement instructions.

## P1 — city pages
Review the five city pages after deployment. Keep them only if they provide genuine local value; do not create additional city pages merely by swapping city names.

## P1 — Search Console
Baseline previously recorded for 2026-08-31 through 2026-09-27:
- 10 clicks
- 52 impressions
- 1 query/page position in 4–10
- 14 in 11–20
- 25 in 21+

After deployment: inspect URLs, submit sitemap, wait for recrawl, then optimize pages with impressions but weak clicks and pages ranking around positions 8–20.

## P1 — performance
Measure Core Web Vitals (LCP, INP, CLS), mobile rendering, JavaScript size, image weight, and prerender/static delivery.

## P1 — structured data
Validate Article, Breadcrumb, Organization, WebPage/CollectionPage and ensure structured data matches visible content. FAQ content remains useful for users, but Google removed FAQ rich-result display in 2026.

## P2 — trust and architecture
Review About, Privacy, Medical Disclaimer, Contact, and Medical Sources pages. Author/reviewer/licensing claims must be real and verifiable.

## P2 — internal links
After Phase 2 integration, check related slugs, cornerstone links, previous/next links, and remove keyword-only links.

## P2 — images
Verify approved images only, valid alt text, image sitemap consistency, and absence of legacy assets.

## Do not do now
- Do not create dozens of new articles.
- Do not create city pages with duplicated content.
- Do not keyword-stuff.
- Do not add medical dosing/procedures/self-treatment instructions.
- Do not add seller numbers or purchasing routes.
- Do not treat llms.txt as an SEO requirement.

## Definition of Done
- [ ] Phase 2 wired into the builder
- [ ] Build passes
- [ ] All audits pass
- [ ] Production deployment succeeds
- [ ] Live domain is on the intended commit
- [ ] Sitemap/robots/canonicals verified
- [ ] Article structured data validated
- [ ] No broken internal links
- [ ] No legacy data in production
- [ ] Article-overlap review completed
- [ ] Medical-claim review completed
- [ ] City-page review completed
- [ ] Search Console checked after recrawl
- [ ] Positions 8–20 optimized before adding new content
