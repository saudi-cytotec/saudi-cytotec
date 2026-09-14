# Article Content Recovery Report

Date: 2026-09-14 · branch `arena/01a09e7b-saudi-cytotec` (PR #33) · input: `docs/article-quality-audit.md`
Scope: the 100-article catalog only (homepage/commercial phase is documented separately in PR #33).

## ملخّص تنفيذي (Arabic summary)

- نُفّذت توصيات `docs/article-quality-audit.md` كاملةً: **85 KEEP · 10–15 REWRITE · 5 MERGE · 0 NOINDEX · 0 REMOVE**، فأصبح عدد المقالات **95** بدل 100.
- المتن أُعيد بناؤه ليكون مبنيّاً على نقاط كل مقال نفسها: **52.1% → 6.7%** نسبة تكرار الفقرات، و**12 فقرة كانت تظهر في 50 مقالاً أو أكثر → 0**.
- لم يُحذف أي رابط: المقالات الخمس المدموجة تُحوَّل الآن **301** إلى المقالات الباقية، وتم الحفاظ على كل الأسئلة الشائعة عبر نقلها إلى المقال الباقي.
- لم يُضَف أي محتوى عن الجرعات أو خطوات الإجراء أو أساليب الشراء؛ فحوصات السلامة كلها 0 مطابقة.
- اختبارات المشروع كاملة ناجحة: `typecheck` · `build` (كل التدقيقات PASS) · `verify` 214/214 · `test:ui`.

## 1. What was wrong with the catalog

The audit measured 100 articles that all reported 2,000+ words, but the words were largely shared:

| Signal (measured at `f598adf` before this pass) | Value |
|---|---|
| Articles | 100 |
| Body words (min / median / max) | 2,027 / 2,125 / 2,195 |
| Paragraph instances published | 2,499 |
| Distinct paragraphs | 1,220 (48.8%) |
| Repeated paragraph instances | 1,302 (**52.1%**) |
| Paragraphs appearing in ≥50 articles | 12 (worst: 100× — every article) |
| Merge pairs sharing identical paragraphs | 14 of 26 |

Every article therefore competed with ~99 siblings on the same paragraphs: duplicate-content risk, no reason for Google to index each URL separately, and a catalog that reads as one templated page repeated 100 times.

## 2. What changed in the builder (`src/data/articles/expand.ts`)

1. **Point anchoring.** Every body paragraph is now built from a sentence that belongs to that article alone (`spec.points`), so two articles can never publish the same paragraph. Body composition: opening answer → topic scope → 3 point-anchored sections → 2 explicit H2/H3 boundaries → safety section → practical close + short checklist.
2. **Headings from the article's own points.** H2/H3 come from `headline(pointN)`, so headings describe the specific subject instead of a template label.
3. **Rotating safety wording.** The pregnancy warning, source warning and emergency callout used to be identical in all 100 articles. They are now small bounded sets (4 pregnancy notices, 3 source warnings, one context-specific emergency notice per cluster), rotated per article, and they are the **only** repeated text left — deliberately, because a warning must not be watered down to be unique.
4. **Bounded, cluster-level prose** in the new `src/data/articles/expansionBanks.ts`: 5 extra elaborations per cluster, one statement per cluster for safety/practical/boundaries, a myth note and a checklist. They supply context, never the article's substance.
5. **Context bridge.** Each cluster-level elaboration is introduced by a rotating connective ("وفي سياق هذا المحور عموماً:") so context never reads as a jump away from the article's point.
6. **FAQs removed from the body** (they render once from `article.faqs` with FAQPage schema), removing the previous double publication of each Q/A.
7. **Hand-written enrichment** for the priority articles in the new `src/data/articles/enrich.ts`: `directAnswer` + 2 subject sections + extra FAQs + reviewed summary.

## 3. REWRITE execution (the audit's REWRITE list)

14 surviving articles flagged by the audit received a hand-written direct answer and two differentiating sections (+2 extra FAQs each). The 15th flag, `myths-about-home-dosing`, was absorbed by a merge (section 4).

`not-all-uses-are-alike` · `off-label-use-meaning` · `general-safety-warnings` · `regulatory-drug-warnings` · `why-medical-supervision-required` · `risks-of-random-use` · `common-myths-cytotec` · `is-cytotec-safe-for-everyone` · `basic-drug-interactions` · `medicines-that-may-increase-risk` · `when-to-see-doctor-immediately` · `when-symptoms-are-emergencies` · `abnormal-bleeding` · `bleeding-in-early-pregnancy`

Three further articles were rewritten to lift them above the thin-content floor after their boilerplate was removed: `trusted-sources-further-reading`, `official-drug-leaflets`, `routine-womens-screening`.

## 4. MERGE execution (100 → 95)

| Merged-away URL (301) | Surviving URL | Note |
|---|---|---|
| `/blog/nsaid-stomach-protection` | `/blog/misoprostol-gastric-ulcers` | one comprehensive gastric-protection article |
| `/blog/labor-induction-hospital-setting` | `/blog/postpartum-hemorrhage-education` | both are hospital-only obstetric uses (audit: keep `obstetric-uses-under-supervision` separate — done) |
| `/blog/myths-about-home-dosing` | `/blog/common-myths-cytotec` | one myths article |
| `/blog/frequent-warning-questions` | `/blog/is-cytotec-safe-for-everyone` | one safety-question article |
| `/blog/womens-emergency-preparedness` | `/blog/what-to-say-in-emergency` | one emergency-communication article |

No information was dropped: all **10 FAQ items** of the removed articles were moved onto the surviving articles, the survivors carry merge-specific sections (NSAID risk group, cervical-ripening/induction boundary, myth correction, safety questions, emergency communication + preparedness), and the survivors' own `directAnswer`/sections distinguish them from every neighbour.

URL handling (no deletion, no silent loss):

- `content/redirects.json` gained **10 rules** (with and without trailing slash) — all **301** to the surviving URL, each with a recorded reason; `vercel.json` regenerated → **114 edge rules**.
- `docs/url-baseline.txt` keeps all 130 original URLs. `scripts/urlParity.mjs` and the `Sitemap parity` check in `scripts/auditSeo.mjs` now treat a baseline URL as satisfied when it is **either** live **or** explicitly retired by a 301/308/410 rule in the canonical registry. A URL that is neither still fails both audits.
- `content/map.json`: the two self-references to the retired emergency URL were replaced with `/blog/danger-of-delaying-care`; no map row lost its target.
- Internal links: **7** `related[]` references were re-pointed to surviving (or equivalent) articles; `auditSeo` reports `related broken: 0`.

## 5. Measured result (same counting method before/after)

| Metric | Before (`f598adf`) | After | Change |
|---|---:|---:|---|
| Articles | 100 | **95** | −5 (merges) |
| Body words: min / median / max | 2,027 / 2,125 / 2,195 | 727 / **812** / 1,118 | see §6 |
| Paragraph instances published | 2,499 | 1,409 | −43.6% |
| Distinct paragraphs | 1,220 (48.8%) | 1,318 (**93.5%**) | +45 pts |
| Repeated paragraph instances | 1,302 (**52.1%**) | 95 (**6.7%**) | −87% |
| Paragraphs in ≥50 articles | 12 | **0** | eliminated |
| Worst paragraph repetition | 100× (every article) | 28× (one required pregnancy warning) | by design |
| Sitemap URLs | 134 | 129 | 5 retired with 301 |

The remaining 6.7% is exactly four pregnancy/prescription-warning variants. They are kept identical on purpose: safety text is not differentiated for the sake of a uniqueness metric. The audit itself allows this ("similar medical safety language may be intentionally repeated where changing a warning would reduce safety").

## 6. Word-count policy decision (explicit, not silent)

The audit's recommendation #4 is: *"Aim for 700–1500 words of UNIQUE content per article, not 2000+ with 50% boilerplate."* The catalog now lands at 727–1,118 body words (median 812) with 93.5% distinct paragraphs, i.e. inside the audit's own target band.

Because the 2,000-word figure was previously met **only** by publishing ~52% duplicate paragraphs, the catalog floor and the depth target are now separated explicitly:

- `CATALOG_MIN_BODY_WORDS = 700` — the enforced thin-content floor for the static catalog (`src/utils/bodyWordCount.ts`). Articles below it are reported as a warning by `scripts/auditIndexability.mjs`; all **96 published article records (95 static + `cytotec-uses`)** are above it (shortest: 727).
- `DEEP_DIVE_BODY_WORDS = 2000` — informational deep-dive target. It is reported once per build (`Body depth (informational): 96/96 below the deep-dive target`) and recorded in the generated `verified-stats.json`, instead of printing 96 per-article warnings.
- `MIN_BODY_WORDS = 2000` is unchanged and still governs the **CMS generation pipeline** (`src/cms/generationPipeline.ts`, `api/generate.js`), which builds *new* drafts and can expand them; nothing about that pipeline was relaxed.

Not lowered to hide a problem: every number above is generated by `scripts/emitVerifiedStats.ts` on each build, and `verified-stats.json` now also publishes the duplication metrics (`distinctParagraphs`, `sharedParagraphShare`) next to the word counts.

## 7. Safety compliance after the rewrite

Automated scan over all 95 article bodies + FAQs (`dose-number`, half-pill/pill-count, sublingual/vaginal how-to, procedure steps, purchase language, dosing schedule): **0 matches** in every category. Two purchase-pattern hits are negative statements ("low price is a warning sign", "reject pages that mix awareness with a WhatsApp sales number").

Still present and enforced everywhere: prescription/medical-supervision framing, prominent pregnancy warning, non-systematic-source warning, emergency referral (997 / 937 appear 19 and 9 times), and the educational disclaimer. Still absent everywhere: doses, regimens, abortion-execution steps, home protocols, purchase or acquisition routes, prescription circumvention, encouraging self-use, unproven therapeutic claims.

## 8. Verification

| Check | Result |
|---|---|
| `npm run typecheck` | PASS (0 errors) |
| `npm run build` | PASS — SEO audit PASS · Indexability PASS · Images PASS · Architecture `map=100 · articles=96 · sitemap=129 · orphans=0 · blockers=0` |
| `npm run verify` | PASS — 214/214 rendered-HTML checks |
| `npm run test:ui` | PASS — ALL FLOW CHECKS PASSED |
| `url-parity` | PASS — 130 baseline URLs, 129 live, 5 retired with a recorded 301 |
| Duplicate & cannibalization report | PASS — 0 exact duplicate fields, 0 keyword collisions |
| Orphan report | PASS — 0 article orphans |
| Bundle | 1,149.99 kB raw / 289.03 kB gzip (single-file build; +95 kB raw vs `f598adf` because all article bodies are inlined) |

## 9. Files touched by this pass

- `src/data/articles/expand.ts` (rebuilt template), `src/data/articles/enrich.ts` (new, 20 enriched articles), `src/data/articles/expansionBanks.ts` (new depth layer)
- `src/data/articles/cluster02.ts`, `cluster07.ts`, `cluster08.ts`, `cluster09.ts` (5 merges + 7 re-pointed related links)
- `content/redirects.json` (+10 rules), `vercel.json` (regenerated), `content/map.json` (2 self-references cleaned)
- `src/utils/bodyWordCount.ts`, `scripts/emitVerifiedStats.ts`, `scripts/auditIndexability.mjs` (floor vs deep-dive reporting), `scripts/urlParity.mjs`, `scripts/auditSeo.mjs` (redirect-aware parity)
- generated: `docs/seo-audit.md`, `docs/content-map-report.md`, `docs/indexing-blocker-report.md`, `docs/duplicate-cannibalization-report.md`, `docs/orphan-report.md`, `public/sitemap.xml` (129 URLs), `verified-stats.json`

## 10. Recommended next step (not done here)

The remaining 72 KEEP articles sit at 727–900 words with 100% distinct paragraphs — correct for indexing, and safely below the deep-dive target. Deepening them should be editorial, article by article, through `ARTICLE_ENRICHMENT` (the same mechanism used for the priority articles) or through the CMS generation pipeline, adding real subject matter rather than restoring shared boilerplate.
