# Phase 3 — Country cornerstone implementation

Date: **2026-09-06**

- Working branch: `arena/01a076c3-saudi-cytotec`. No branch switch, commit, push, pull request, or production deployment was made.
- Verified stable-main baseline: `f1c3e4655f229dda40ea5582bd9d2f1d8f817401`.
- Four hand-authored Arabic educational pages were implemented from the clean baseline, after inspecting routing, content, sitemap generation, internal links, relevant medical articles, and official sources.
- A local production-build preview is available on port **4173**. The production URLs below are canonical targets, not a claim that this work has been deployed.

## Pages, SEO titles, H1s and FAQs

The existing `Seo` component appends ` | صحة المرأة السعودية - سعودي إرساء` to each SEO title below. That behavior was preserved. The new renderer emits `MedicalWebPage` (a subtype of `WebPage`), `FAQPage`, and the existing visible breadcrumb / `BreadcrumbList` pair.

| Country | Path | SEO title before the existing site-name suffix | FAQs |
|---|---|---|---:|
| السعودية | `/abortion-pills-saudi-arabia` | أدوية إجهاض الحمل وحبوب سايتوتك في السعودية | 12 |
| الإمارات | `/abortion-pills-uae` | أدوية إجهاض الحمل وحبوب سايتوتك في الإمارات | 10 |
| الكويت | `/abortion-pills-kuwait` | أدوية إجهاض الحمل وحبوب سايتوتك في الكويت | 10 |
| البحرين | `/abortion-pills-bahrain` | أدوية إجهاض الحمل وحبوب سايتوتك في البحرين | 10 |

### السعودية

- **H1:** أدوية إجهاض الحمل وحبوب سايتوتك في السعودية: الفهم الطبي والرعاية الآمنة
- **Rendered title:** أدوية إجهاض الحمل وحبوب سايتوتك في السعودية | صحة المرأة السعودية - سعودي إرساء
- **Self-canonical:** `https://saudiersaa.com/abortion-pills-saudi-arabia`
- **Primary intents:** أدوية إجهاض الحمل في السعودية / حبوب سايتوتك في السعودية.
- **Editorial content:** approximately 1,904 words; 15 distinct cited references; 13 contextual internal links.

### الإمارات

- **H1:** أدوية إجهاض الحمل وحبوب سايتوتك في الإمارات: المعلومات الطبية والضوابط المحلية
- **Rendered title:** أدوية إجهاض الحمل وحبوب سايتوتك في الإمارات | صحة المرأة السعودية - سعودي إرساء
- **Self-canonical:** `https://saudiersaa.com/abortion-pills-uae`
- **Primary intents:** أدوية إجهاض الحمل في الإمارات / حبوب سايتوتك في الإمارات.
- **Editorial content:** approximately 1,504 words; 11 distinct cited references; 9 contextual internal links.

### الكويت

- **H1:** أدوية إجهاض الحمل وحبوب سايتوتك في الكويت: التقييم الصحي ومصادر الدواء
- **Rendered title:** أدوية إجهاض الحمل وحبوب سايتوتك في الكويت | صحة المرأة السعودية - سعودي إرساء
- **Self-canonical:** `https://saudiersaa.com/abortion-pills-kuwait`
- **Primary intents:** أدوية إجهاض الحمل في الكويت / حبوب سايتوتك في الكويت.
- **Editorial content:** approximately 1,456 words; 11 distinct cited references; 10 contextual internal links.

### البحرين

- **H1:** أدوية إجهاض الحمل وحبوب سايتوتك في البحرين: دليل الفهم والمتابعة الصحية
- **Rendered title:** أدوية إجهاض الحمل وحبوب سايتوتك في البحرين | صحة المرأة السعودية - سعودي إرساء
- **Self-canonical:** `https://saudiersaa.com/abortion-pills-bahrain`
- **Primary intents:** أدوية إجهاض الحمل في البحرين / حبوب سايتوتك في البحرين.
- **Editorial content:** approximately 1,606 words; 11 distinct cited references; 11 contextual internal links.

Word counts include direct-answer paragraphs, section prose/lists and visible FAQs, not navigation, table of contents, source notes or bibliography. Length was not used to pad the pages.

## Distinct country coverage

- **Saudi Arabia:** the most extensive guide, separating drug identity, medical uses, assessment, pregnancy loss, ectopic pregnancy, urgent symptoms, MOH/SFDA roles, unregulated products and follow-up. Local references include Saudi MOH pregnancy-loss/ectopic material, 937, SFDA registration/warnings, and the official ambulance reference.
- **UAE:** distinguishes EDE product regulation from clinical/health-authority decisions; explains the scope of Cabinet Resolution 44/2024, consent/privacy limits and why a general summary cannot establish individual eligibility. Includes interpretation of bilingual reports and continuity when transferring care.
- **Kuwait:** focuses on MOH registration/quality responsibilities, the official Salem health-record and appointment service, reports requiring clinical interpretation, and the distinction between routine follow-up and emergency care. No UAE/Saudi legal rules are presented as Kuwaiti rules.
- **Bahrain:** focuses on MOH general-practice appointments, Sehati, the applicable family-doctor program, continuity between hospital and health centre, and NHRA product-quality regulation. Appointment access is not represented as approval or availability of a specific procedure.
- Each guide independently explains Cytotec/misoprostol, broad medical uses, important contraindications/assessment factors, miscarriage, ectopic pregnancy, urgent warning signs and counterfeit/unregulated-product risks.
- The 42 questions and answers are individually authored. Country-normalized seven-word overlap is **0.00%–0.69%** between page pairs; this is a scoped duplication check, not a search-ranking guarantee.
- No doses, administration routes, medication-use steps, prices, sellers, sales phone numbers, WhatsApp sales CTAs, delivery promises or commercial referral links were introduced.

## Architecture and metadata

- Country records are appended to the existing `staticPages` registry, which supplies the existing routes, XML sitemap, HTML sitemap and SEO manifest. No new sitemap mechanism or redirect strategy was introduced.
- `CountryCornerstonePage` reuses `Seo`, `JsonLd`, `PageHero`, `ContentBlocks`, `DisclaimerBanner`, `ReferencesList`, the existing styles and breadcrumb implementation. Existing `StaticPage`, shared components, header/footer, homepage, fonts and assets were not redesigned or edited.
- Section/FAQ source notes and the bibliography resolve through the existing reference registry. Visible questions and answers and `FAQPage` entities come from the same data.
- A full-shell test exposed pre-existing homepage fallback metadata alongside React 19 / Helmet 3 hoisted metadata. The new **country-only metadata boundary** removes only the initially captured fallback tags while a country page is mounted and restores them on exit. It does not change `index.html` or the shared `Seo` component. Direct loads and client-side transitions now show one canonical/title/description on each new page.
- The site remains on its existing client-rendered architecture. Tests mount the actual built bundle with the full HTML shell; these are not claims of added SSR or guaranteed search-engine indexing/rich results.

## Internal links added

**Inbound discovery:** all four guides are linked from each of:

- `/topics`
- `/sitemap` (automatically, from the static-page registry)
- `/blog/cluster/ma-huwa-saytotek` (definition)
- `/blog/cluster/alaman-walthahdhirat` (safety)
- `/blog/cluster/alhaml-walsehha-alenjabiyya` (pregnancy)
- `/blog/cytotec-uses` (four contextual `resourceLinks`; the article body, metadata and FAQs are otherwise unchanged)

This is **24 new inbound links** across those six public pages. No global header/footer or homepage link blocks were added. Unrelated clusters do not display the country discovery component.

The guides contain **43 contextual links** to **20 distinct existing medical articles** and the Saudi care-access hub. Each also links back to the three relevant clusters and `/topics`. The CMS internal-link graph now recognizes registered cornerstone paths and counts the new resource links, while still rejecting unknown targets.

### Contextual links from السعودية

- `/blog/difference-cytotec-misoprostol`
- `/blog/cytotec-uses`
- `/blog/approved-medical-uses-misoprostol`
- `/blog/conditions-needing-prior-assessment`
- `/blog/discussing-medication-history`
- `/blog/miscarriage-educational-overview`
- `/blog/bleeding-in-early-pregnancy`
- `/blog/warning-signs-in-pregnancy`
- `/blog/signs-of-dangerous-bleeding`
- `/blog/saudi-drug-regulation-context`
- `/service-areas`
- `/blog/unreliable-medicine-sources`
- `/blog/follow-up-after-medical-care`

### Contextual links from الإمارات

- `/blog/misoprostol-active-ingredient`
- `/blog/official-drug-leaflets`
- `/blog/how-to-verify-medical-information`
- `/blog/miscarriage-educational-overview`
- `/blog/follow-up-after-medical-care`
- `/blog/severe-abdominal-pain`
- `/blog/conditions-needing-prior-assessment`
- `/blog/signs-of-dangerous-bleeding`
- `/blog/unreliable-medicine-sources`

### Contextual links from الكويت

- `/blog/pregnancy-follow-up-care`
- `/blog/difference-cytotec-misoprostol`
- `/blog/cytotec-uses`
- `/blog/how-to-verify-medical-information`
- `/blog/miscarriage-educational-overview`
- `/blog/follow-up-after-medical-care`
- `/blog/warning-signs-in-pregnancy`
- `/blog/discussing-medication-history`
- `/blog/signs-of-dangerous-bleeding`
- `/blog/unreliable-medicine-sources`

### Contextual links from البحرين

- `/blog/follow-up-after-medical-care`
- `/blog/cytotec-uses`
- `/blog/difference-cytotec-misoprostol`
- `/blog/how-to-verify-medical-information`
- `/blog/miscarriage-educational-overview`
- `/blog/mental-and-reproductive-health`
- `/blog/severe-abdominal-pain`
- `/blog/prostaglandin-allergy`
- `/blog/conditions-needing-prior-assessment`
- `/blog/high-fever-and-infection`
- `/blog/unreliable-medicine-sources`

## Validation results

| Check | Result |
|---|---|
| `npm ci` | PASS; lockfile and dependency versions unchanged |
| `npm run typecheck` | PASS |
| `npm run build` including pre/postbuild | PASS |
| `npm run audit` | PASS — SEO, content-map/architecture, indexability and images |
| Country / rendered-regression verifier | **PASS — 187 checks, 0 failures** |
| Sitemap parity | **130 → 134 URLs**, exactly the four requested additions; zero removed and zero duplicates |
| Built/public XML and HTML sitemap | All four country paths present; generated and public XML match |
| Canonicals / metadata | Each new page has one rendered self-canonical, one title/description/robots/OG URL, and one natural H1 |
| FAQ/schema parity | **42 visible FAQs** exactly match `FAQPage`; valid matching page/breadcrumb metadata |
| Internal links | All new targets/anchors resolve; all 20 distinct linked medical articles rendered successfully |
| CMS graph | Four incoming country resource links recognized; an invalid country-like target is rejected |
| Redirect regression | `content/redirects.json`, `vercel.json` and redirect generator byte-identical to stable main; 103 registry / 104 edge rules retained |
| Existing article catalog | Still 101 articles; no city/region doorway articles created |
| Architecture audit | 100 map items; zero article orphans; zero indexing blockers |
| Homepage/design | **Unchanged** source and rendered markup; **byte-identical built stylesheet** |
| Other baseline render checks | `/what-is-cytotec`, `/safety`, `/service-areas`, `/contact` and an unrelated women’s-health cluster unchanged |
| Client-side navigation | Country-to-country canonicals correct; shell restored on exit; returning home preserves the DOM |
| Preview smoke | Home, all four guides, `/topics` and `/sitemap.xml` return HTTP 200 with an `.e2b.app` host |
| Patch hygiene | `git diff --check` PASS |

### Re-run commands

```sh
npm ci
npm run typecheck
npm run build
npm run audit
npm run test:countries
```

The full baseline comparison in this workspace was run with:

```sh
PHASE3_BASE_REF=main \
PHASE3_BASELINE_DIR=node_modules/.cache/phase3 \
npm run test:countries
```

The baseline directory was captured from the clean stable-main build **before editing**. It contains `stable-index.html` and `stable-seo-manifest.json`. These and the test outputs are ignored scratch artifacts; they are not committed. Without the optional baseline variables, `test:countries` still validates the production country pages, links, FAQ/schema parity, CMS graph and SPA navigation.

### Existing advisories and scope limits

- The existing indexability audit warns that the unchanged `cytotec-uses` article body has 992 words, below its advisory 2,000-word threshold. Its body was not padded or rewritten to suppress this unrelated warning.
- `npm audit` reports two existing development-tool advisories (one high for Vite, one low for esbuild). No dependency upgrades or lockfile changes were made as part of this content task.
- Historical geo/design verification scripts and some architecture-report prose still contain assumptions about retired city pages or sales UI. They were not used to justify restoring that content. The new verifier checks the requested, non-commercial scope against the actual baseline instead.
- Official sources were reviewed through direct page retrieval and official-domain indexed content. Some Kuwait/SFDA/SRCA endpoints blocked automated retrieval. The no-broken-links result concerns **internal routes**; this report does not claim every external authority endpoint returned HTTP 200 or that a specific Cytotec product is currently registered/available.
- No medical reviewer credentials, regulatory affiliation, individual diagnosis or legal eligibility guarantee is claimed. Source notes explain each reference’s role and limits.

## Files changed

### Added (12)

- `docs/phase-3-implementation.md`
- `scripts/verifyCountryCornerstones.mjs`
- `src/components/CountryCornerstoneLinks.tsx`
- `src/data/countryCornerstones/bahrain.ts`
- `src/data/countryCornerstones/index.ts`
- `src/data/countryCornerstones/kuwait.ts`
- `src/data/countryCornerstones/references.ts`
- `src/data/countryCornerstones/saudiArabia.ts`
- `src/data/countryCornerstones/types.ts`
- `src/data/countryCornerstones/uae.ts`
- `src/pages/CountryCornerstonePage.tsx`
- `src/utils/countryPageMetadata.ts`

### Modified (13)

- `content/published/cytotec-uses.json`
- `docs/indexing-blocker-report.md`
- `docs/seo-audit.md`
- `package.json`
- `public/sitemap.xml`
- `scripts/emitSeoManifest.ts`
- `src/App.tsx`
- `src/data/pages.ts`
- `src/data/references.ts`
- `src/data/site.ts`
- `src/pages/ClusterPage.tsx`
- `src/pages/TopicsPage.tsx`
- `src/utils/internalLinks.ts`

`public/sitemap.xml`, `docs/seo-audit.md` and `docs/indexing-blocker-report.md` are generated updates reflecting the four new URLs. No other generated artifacts were added to Git.

## Final scope confirmation

**Homepage/design unchanged. Redirect strategy unchanged. No city/region doorways, commercial material, medication-use instructions, PR, or production deployment added.**
