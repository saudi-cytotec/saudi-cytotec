# Saudiersaa — URL Inventory & Preservation Map

Date: 2026-08-29 · Base: commit `6d46fac` · Source of truth for redirects: `content/redirects.json` (edge rules in `vercel.json` are generated from it by `scripts/emitRedirects.mjs`).

## 1. Live URL inventory (127 URLs, all preserved)

Generated from the production sitemap at `public/sitemap.xml` (rebuilt on every build by `scripts/emitSitemap.ts`). None of these URLs change in this project. A regression test (`scripts/urlParity.mjs`, see §5) asserts 1:1 parity between the sitemap before and after every change.

| Group | Count | Example |
|---|---|---|
| Homepage | 1 | `/` |
| Cornerstone pages | 7 | `/what-is-cytotec`, `/misoprostol`, `/medical-uses`, `/safety`, `/side-effects`, `/when-to-see-doctor`, `/medical-sources` |
| Health-hub pages | 4 | `/womens-health`, `/early-pregnancy`, `/faq`, `/blog` |
| Trust pages | 5 | `/about`, `/privacy`, `/medical-disclaimer`, `/contact`, `/sitemap` |
| Cluster index pages | 10 | `/blog/cluster/<slug>` |
| Articles | 100 | `/blog/<slug>` (10 per cluster × 10 clusters) |

All article slugs (preserved verbatim): `cytotec-definition`, `misoprostol-active-ingredient`, `difference-cytotec-misoprostol`, `history-development-misoprostol`, `misoprostol-pharmacologic-class`, `how-misoprostol-works-in-body`, `cytotec-pharmaceutical-forms`, `misoprostol-other-brand-names`, `misoprostol-in-clinical-references`, `key-facts-before-reading-cytotec`, `approved-medical-uses-misoprostol`, `misoprostol-gastric-ulcers`, `nsaid-stomach-protection`, `obstetric-uses-under-supervision`, `postpartum-hemorrhage-education`, `labor-induction-hospital-setting`, `off-label-use-meaning`, `unsafe-unsupervised-use`, `hospital-clinic-limits`, `why-not-home-treatment`, `general-safety-warnings`, `pregnancy-boxed-warning`, `why-medical-supervision-required`, `risks-of-random-use`, `medicine-storage-home-safety`, `how-to-read-package-insert`, `general-info-vs-personal-advice`, `regulatory-drug-warnings`, `unreliable-medicine-sources`, `saudi-drug-regulation-context`, `common-side-effects`, `diarrhea-abdominal-pain`, `fever-and-chills`, `nausea-and-vomiting`, `abnormal-bleeding`, `rare-serious-complications`, `when-symptoms-are-emergencies`, `gastrointestinal-effects`, `uterine-reproductive-effects`, `what-to-do-if-side-effects`, `early-pregnancy-overview`, `why-contraindicated-in-pregnancy-ulcer-use`, `pregnancy-follow-up-care`, `warning-signs-in-pregnancy`, `miscarriage-educational-overview`, `bleeding-in-early-pregnancy`, `family-planning-education`, `reproductive-health-reliable-info`, `education-vs-individual-treatment`, `pregnancy-and-medicines-faq`, `womens-health-life-stages`, `irregular-menstrual-cycle`, `pelvic-pain-when-to-see-doctor`, `anemia-womens-health`, `mental-and-reproductive-health`, `routine-womens-screening`, `reproductive-tract-infections-awareness`, `reproductive-age-preventive-care`, `nutrition-hormonal-health`, `reliable-womens-health-sources`, `common-myths-cytotec`, `is-cytotec-safe-for-everyone`, `use-without-prescription`, `internet-not-a-doctor`, `brand-name-vs-active-ingredient`, `not-all-uses-are-alike`, `myths-about-home-dosing`, `mild-symptoms-not-always-safe`, `frequent-warning-questions`, `how-to-verify-medical-information`, `contraindications-misoprostol`, `basic-drug-interactions`, `prostaglandin-allergy`, `heart-vascular-considerations`, `liver-kidney-considerations`, `breastfeeding-considerations`, `medicines-that-may-increase-risk`, `conditions-needing-prior-assessment`, `pregnancy-contraindication-ulcer-indication`, `discussing-medication-history`, `when-to-see-doctor-immediately`, `signs-of-dangerous-bleeding`, `high-fever-and-infection`, `severe-abdominal-pain`, `dizziness-and-fainting`, `what-to-say-in-emergency`, `follow-up-after-medical-care`, `annoying-symptom-vs-emergency`, `womens-emergency-preparedness`, `danger-of-delaying-care`, `how-to-evaluate-medical-evidence`, `who-clinical-references`, `fda-cytotec-warnings`, `official-drug-leaflets`, `clinical-studies-vs-anecdotes`, `reading-a-paper-as-non-specialist`, `limits-of-online-medical-info`, `common-medical-terms-misoprostol`, `why-medical-recommendations-change`, `trusted-sources-further-reading`.

## 2. Domain history discovered

The domain carried three previous generations of content before the current educational platform:

| Era | Evidence | Handling |
|---|---|---|
| 2018–2021 Blogger auto-scraper (NYT/fashion/cooking copies) | `web.archive.org` CDX: `/2018/…`, `/2021/01/…`, hundreds of junk Arabic slugs | **410** via `/(?:2018|2019|2020|2021)/(.*)` — no equivalent exists, and they must not be redirected to the homepage |
| WordPress medical-seller era (~2025-06) | Google index: `/cytotec-saudi-arabia/`, `/سايتوتك_في_السعوديه/`, `/سايتوتك/`, `/سياسة-التحرير/`; phone numbers embedded in content | **301** to the educational equivalent (see §3) |
| Static HTML era | Google index: `/about.html`, `/contact.html`, `/privacy-policy.html`, `/category-care.html` | **301** to the matching live page |
| Seller-spam URL families with embedded phone numbers | CDX: `/حبوب-سايتوتك-للبيع-…✳️00966…/` | **410** — no educational equivalent; must not carry the transactional intent forward |

## 3. Redirect decisions (principles)

Per the Master Plan: **301 only where an equivalent, relevant replacement exists; otherwise 404/410. Never blanket-redirect 404s to the homepage.**

- Drug-name and safety queries from the WordPress era → `/what-is-cytotec` (educational cornerstone for the same query).
- Usage/how-to queries → `/medical-uses` (supervised-use education — the responsible replacement for "how to use" intent).
- Ectopic/PCOS/menstrual/fertility/anemia legacy articles → nearest live health page or article.
- Editorial/legal pages → `/about`, `/privacy`.
- Buyer-intent URL families (`للبيع`, phone-number slugs), feed endpoints, scraper era → **410 Gone** so they leave the index cleanly without inheriting a wrong intent.
- Loop protection: `scripts/emitRedirects.mjs` aborts if any destination is another rule's source.

The full machine-readable map: `content/redirects.json` (57 rules + www→apex). Applied edge rules: `vercel.json` → `redirects` (58 entries including the www→apex rule).

## 4. What must never change

- The 127 live URLs above (slugs are `slugLocked` in the CMS).
- `canonical` values emitted by `src/components/Seo.tsx` (per-page, self-referencing).
- `/sitemap.xml` coverage: everything public is included; `/admin`, `/api`, `/search` excluded.
- `/robots.txt`: allow all public content, disallow `/search`, `/admin`, `/api`, sitemap declared.
- Schema policy: `Article` + `MedicalWebPage` only; **never** `Drug`, `Product`, `Offer`, `Review`, `AggregateRating`.

## 5. Regression tests

- `scripts/emitRedirects.mjs` — registry → vercel.json sync + loop protection.
- `scripts/urlParity.mjs` — asserts the live sitemap URL set equals the committed baseline set (no URL silently dropped from the sitemap).
- `scripts/auditSeo.mjs` — full-site SEO audit (titles, meta, canonicals, schema, robots, sitemap, internal links, images); run after every change.
