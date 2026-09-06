# Article Quality Audit - 100 Static Articles

Date: 2026-09-06
Commit: c64f97f
Build: PASS (101 articles incl. 1 CMS, 130 sitemap, 0 orphans)

## Methodology

Audited 100 static articles in src/data/articles/cluster*.ts (10 clusters x 10).
Each article is generated via expand() which combines:
- Unique spec: slug, title, h1, metaTitle, metaDescription, excerpt, points[7], faqs[2-3], related[]
- Shared frame: clusterFrames[cluster] intro/scope/care (3 paragraphs shared per cluster)
- Shared closing: closings[cluster] (1 paragraph shared per cluster)
- Shared sections: Saudi regulatory context (3 paragraphs shared across ALL articles), safety warnings, emergency, practical use, etc.

Checked:
- Unique search intent (via title/h1/meta)
- Unique information (via points)
- Overlap
- Repeated paragraphs (clusterFrames)
- Repeated warnings (same emergency/warn callouts)
- Templated phrasing
- User value
- Source quality (references via edu() wrapper)

## Findings

### Duplicate Signals: PASS (no exact duplicate per duplicate-cannibalization-report)

- Exact duplicate field groups: 0
- Duplicate canonical: 0
- Primary keywords unique: 0 collisions

However, templated structure risk exists:

**Shared boilerplate per cluster (10 articles share same 3 paragraphs):**
- definition cluster: intro about "التعريف الطبي الدقيق لا يبدأ من الاسم الشائع..." (shared across 10)
- uses cluster: intro about "الاستخدام الطبي المعتمد يُقرر بعد تشخيص فردي..." (shared)
- safety, side-effects, pregnancy, womens-health, faq, interactions, emergency, evidence: each has shared intro/scope/care

**Shared across ALL 100 articles (via expand.ts):**
- Saudi regulatory context: 3 paragraphs about SFDA/MOH identical in all 100
- Safety warnings: same warn() about WhatsApp selling (identical)
- Emergency: same emergency() about ectopic (identical)
- Practical use: similar structure
- Bigger picture: similar structure
- Reading skills: 2 paragraphs identical
- Summary list: 6 bullets identical
- Disclaimer: identical

**Impact:** 
- Each article has ~992-2500 words, but ~800-1000 words are shared boilerplate
- Unique content per article is ~1200-1500 words from points + faqs expanded
- Google's scaled content abuse policy: mass templated pages with high overlap may be seen as low-value

**Mitigation already applied:**
- Modified expand.ts to inject point0 and point1 unique into intro/scope paragraphs (commit 5dcb2ac)
- This reduced duplicate but still leaves significant shared text

### Classification

**KEEP (85):**
- Articles with distinct points and clear intent, even with some boilerplate, but where unique value > shared
- All definition cluster (10): each has unique angle on brand vs active ingredient, history, forms, etc.
- Most uses cluster (8): approved uses, gastric ulcers, NSAID protection, obstetric uses, off-label meaning, etc. - 2 overlapping need merge
- Safety cluster (8): 2 overlapping
- Side-effects (8): distinct symptoms
- Pregnancy (8): distinct aspects
- Womens-health (10): distinct topics (menstrual cycle, anemia, pelvic pain, etc.)
- FAQ (8): distinct myths
- Interactions (8): distinct contraindications
- Emergency (9): distinct warning signs
- Evidence (8): distinct source types

**REWRITE (10):**
- Articles where points overlap heavily or title is too similar to another
- Cluster02: `not-all-uses-are-alike` vs `off-label-use-meaning` - similar intent, should differentiate more
- Cluster03: `general-safety-warnings` vs `regulatory-drug-warnings` - overlap, need more unique
- Cluster03: `why-medical-supervision-required` vs `risks-of-random-use` - similar
- Cluster07: `common-myths-cytotec` vs `is-cytotec-safe-for-everyone` vs `myths-about-home-dosing` - 3 myths articles overlapping, need consolidation of FAQs
- Cluster08: `basic-drug-interactions` vs `medicines-that-may-increase-risk` - overlap
- Cluster09: `when-to-see-doctor-immediately` vs `when-symptoms-are-emergencies` - similar
- Cluster04: `abnormal-bleeding` vs `bleeding-in-early-pregnancy` - need clearer differentiation

**MERGE (5):**
- 5 pairs that should be merged into 1 stronger article each, reducing count by 5
- `nsaid-stomach-protection` + `misoprostol-gastric-ulcers` -> merge into 1 comprehensive gastric protection article
- `postpartum-hemorrhage-education` + `labor-induction-hospital-setting` + `obstetric-uses-under-supervision` -> currently 3 separate but could be 2 (keep supervision separate, merge hemorrhage + induction as hospital-only examples)
- `common-myths-cytotec` + `myths-about-home-dosing` -> merge (both about myths)
- `is-cytotec-safe-for-everyone` + `frequent-warning-questions` -> merge (both about safety questions)
- `what-to-say-in-emergency` + `womens-emergency-preparedness` -> merge (both about emergency communication)

After merge: 100 -> 95 articles (reduce 5), plus KEEP 85, REWRITE 10, MERGE 5 (becoming 2-3).

**NOINDEX (0):**
- No article is intentionally noindex currently. All 101 are indexable.

**REMOVE (0):**
- No article is pure commercial or doorway. All have educational value.
- City doorway articles already removed (23 files deleted).

## Recommendation

**Do NOT create new articles until:**
1. Rewrite 10 flagged articles to increase uniqueness (remove shared Saudi regulatory context from being identical, make it cluster-specific)
2. Merge 5 overlapping pairs (reduce to 95)
3. Further reduce shared boilerplate in expand.ts: make Saudi context, warnings, reading skills, summary more unique per article or per cluster, not identical across 100
4. Aim for 700-1500 words of UNIQUE content per article, not 2000+ with 50% boilerplate

**Goal:** Maximize percentage of pages that deserve indexing, not maximize count.
- Current: 101 indexable, 0 orphans, 0 broken, but ~40% boilerplate
- Target: 95 indexable, 100% unique value, 0 templated risk

## Competitor Gaps (saudi-cytotec.com)

Analyzed https://saudi-cytotec.com/ (transactional):
- Queries: "سايتوتك للبيع", "حبوب سايتوتك الرياض", "سايتوتك جدة", etc. (commercial) + "ما هو سايتوتك", "اعراض سايتوتك", "جرعة سايتوتك" (informational but with dosage)
- Topical coverage: what is, uses, safety 6 points, FAQ, products, cities
- Entities: Cytotec, Misoprostol, Pfizer, NSAID, ectopic, Rh-, hCG, ultrasound
- Headings: H1 commercial, H2 safety, H3 FAQ
- FAQs: dosage, timing, side effects, price, delivery - many unsafe
- Sources: none cited (no FDA/SFDA/MOH links)
- Internal links: city pages interlinked (doorway)
- Gaps: No regulatory Saudi context, no medical disclaimer, no editorial policy, no E-E-A-T, no distinction between educational vs personal advice, no anemia/womens-health broader context, no misinformation literacy, no official sources
- Weaknesses: Commercial bias, no trust signals, no sources, doorway, dosage instructions (unsafe), fake authenticity claims
- Opportunities for Saudiersaa: Provide neutral educational source with official references, broader womens-health context, emergency literacy, misinformation detection, no sales

## Topic Authority Architecture (Existing, to be enhanced)

Already exists:
- Pillars: /what-is-cytotec, /misoprostol, /medical-uses, /safety, /side-effects, /when-to-see-doctor, /faq, /womens-health, /early-pregnancy, /medical-sources, /about, /medical-disclaimer, /service-areas, /topics
- Clusters: 10 clusters (ma-huwa-saytotek, alestekhdamat-altebbiya, alaman-walthahdhirat, alathar-aljanibiyya, alhaml-walsehha-alenjabiyya, sehhat-almarah, alasila-alshaea, altadakholat-wamawane, mata-murajaa-altabeeb, aladilla-walmasader)
- Internal linking: 101 slugs, 0 broken, 0 orphans

To be enhanced in Phase 2 (after production verified):
- A. Women's health: expand /womens-health with anemia, pelvic pain, menstrual cycle, screening
- B. Early pregnancy: /early-pregnancy + cluster alhaml-walsehha-alenjabiyya
- C. Pregnancy loss: miscarriage-educational-overview
- D. Ectopic: warning-signs, severe-abdominal-pain, when-to-see-doctor
- E. Medication safety: /safety + alaman-walthahdhirat
- F. Misoprostol: /misoprostol + ma-huwa-saytotek
- G. Cytotec: /what-is-cytotec + ma-huwa-saytotek
- H. Emergency: mata-murajaa-altabeeb + side-effects
- I. Saudi official sources: /medical-sources, SFDA, MOH, 937, 997
- J. Misinformation: aladilla-walmasader + how-to-verify

## AI Overview Readiness (Current + Improvements Needed)

Current:
- Direct answer at top: cytotec-uses has "الإجابة المباشرة" - good, but other 100 articles start with excerpt + shared intro, not direct answer
- Definitions: present but mixed with boilerplate
- Headings: H2/H3 present but repetitive
- FAQs: present (2-3 per article) but some repetitive
- Sources: via references (fdaLabel, sfda, moh) but not inline citations
- Internal links: good
- Saudi context: identical across all, not genuinely useful per page

Improvements for Phase 2:
- Add direct answer paragraph to each priority pillar (what-is, misoprostol, medical-uses, safety, side-effects, when-to-see-doctor, womens-health, early-pregnancy)
- Make definitions concise and entity-focused
- Make H2/H3 more specific per article, not generic "الإطار العام"
- Make FAQs more specific, not generic
- Add inline source mentions (e.g., "وفق نشرة FDA...")
- Provide Saudi-specific context only when genuinely useful (e.g., 937/997 for emergency, SFDA for regulation)
- Reduce boilerplate, avoid repetition
- Avoid commercial CTAs (already done)
- Each page answer one clear user need (needs rewrite for some overlapping)

## Counts

- Audited: 100 static + 1 CMS = 101 articles
- KEEP: 85
- REWRITE: 10
- MERGE: 5 pairs (10 articles -> 5)
- NOINDEX: 0
- REMOVE: 0 (doorway already removed)
- After merge: 95 articles recommended
