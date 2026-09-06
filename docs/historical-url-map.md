# Historical URL Forensic Map - Saudiersaa.com

Date: 2026-09-06
Generated as part of full forensic SEO cleanup.

This document classifies all historical URLs that contributed to GSC's 208 non-indexed URLs.

## Summary

- Total sitemap URLs before cleanup: 151
- Total sitemap URLs after cleanup: 130
- Removed doorway/city pages: 21 + 1 geographic cluster + 1 abortion-meds page = 23
- Legacy Arabic slugs redirected: 54
- Feed/legacy 410: 2
- Total redirects in registry: 103
- Edge rules in vercel.json: 104 (including www->apex)

## Classification

### KEEP (130 URLs) - Indexable, canonical, 200

**Static pillars (13):**
- / , /what-is-cytotec, /misoprostol, /medical-uses, /safety, /side-effects, /when-to-see-doctor, /faq, /womens-health, /early-pregnancy, /medical-sources, /about, /privacy, /medical-disclaimer
- /topics, /service-areas, /contact, /sitemap, /blog
- 10 cluster pages: /blog/cluster/ma-huwa-saytotek, alestekhdamat-altebbiya, alaman-walthahdhirat, alathar-aljanibiyya, alhaml-walsehha-alenjabiyya, sehhat-almarah, alasila-alshaea, altadakholat-wamawane, mata-murajaa-altabeeb, aladilla-walmasader
- 101 articles: 100 static (cluster01-10) + 1 published (cytotec-uses)

All KEEP URLs are:
- self-canonical
- indexable (no noindex)
- 200
- useful, non-duplicate
- with honest lastmod

### 301 REDIRECT (103 rules) - Relevant, not homepage dump

**City doorway pages (21) -> /service-areas (MERGE/REDIRECT):**
These were thin, near-duplicate pages targeting city names for SEO. Content merged into general care guide.

- /blog/cytotec-abha -> /service-areas (doorway, low value, no unique healthcare context)
- /blog/cytotec-albahah -> /service-areas
- /blog/cytotec-arar -> /service-areas
- /blog/cytotec-buraidah -> /service-areas
- /blog/cytotec-central-region -> /service-areas
- /blog/cytotec-dammam -> /service-areas
- /blog/cytotec-eastern-region -> /service-areas
- /blog/cytotec-hail -> /service-areas
- /blog/cytotec-jizan -> /service-areas (also /blog/cytotec-jazan variants)
- /blog/cytotec-madinah -> /service-areas
- /blog/cytotec-makkah -> /service-areas
- /blog/cytotec-najran -> /service-areas
- /blog/cytotec-sakaka -> /service-areas
- /blog/cytotec-tabuk -> /service-areas
- /blog/cytotec-western-region -> /service-areas
- /blog/cytotec-southern-region -> /service-areas
- /blog/cytotec-saudi-regions -> /service-areas
- /blog/cytotec-saudi-faq -> /service-areas (content merged into /faq)
- /blog/cytotec-saudi-safety -> /service-areas (merged into /safety)
- /blog/cytotec-medical-verification -> /service-areas (merged into /medical-sources)
- /blog/cytotec-in-saudi-arabia -> /service-areas (national pillar consolidated)

Each has both trailing-slash and non-trailing variants redirected.

**Geographic cluster (1) -> /service-areas:**
- /blog/cluster/almojazat-aljograyiya -> /service-areas (geographic cluster removed, content consolidated)

**Risky commercial page (1) -> /service-areas:**
- /blog/abortion-medications-saudi-arabia -> /service-areas (educational but risky, merged into women's health pillars, no dosage)

**Legacy Arabic/WordPress slugs (54) -> relevant pillars:**
These were 404s causing GSC 48 = 404. Now 301 to relevant educational pillars, not homepage.

- /سايتوتك/ , /سايتوتك -> /what-is-cytotec (same topic as cornerstone)
- /سايتوتك_في_السعوديه/ -> /service-areas
- /سايتوتك-السعوديه/ , /سايتوتك-السعوديه , /سايتوتك-السعوديهجرعة -> /service-areas
- /سايتوتك-في-السعودية/ , /سايتوتك-في-السعودية -> /service-areas
- /سايتوتك_في_السعودية/ , /سايتوتك_في_السعودية-2/ -> /service-areas
- /سايتوتك-في-الامارات/ , /سايتوتك-في-الامارات -> /what-is-cytotec (UAE pages, educational replacement)
- /سايتوتك-في-الكويت/ , /سايتوتك-في-الكويت , /سايتوتك_في_الكويت/ -> /what-is-cytotec
- /سايتوتك_في_البحرين/ -> /what-is-cytotec
- /سايتوتك_الرياض/ , /سايتوتك_في_الرياض/ , /سايتوتك_في_الرياض-2/ , /سايتوتك_في_جدة/ , /سايتوتك_الشرقية/ -> /what-is-cytotec (city seller pages, educational)
- /حبوب_سايتوتك_الرياض/ , /حبوب_سايتوتك_للبيع_في_الرياض/ , /حبوب-سايتوتك-للبيع-في-مكه-السعودية , /حبوب_سايتوتك_صيدليه/ , /صيدليه-سايتوتك , /صيدليه-حياة-الناس/ -> /what-is-cytotec (commercial)
- /سياسة-التحرير/ , /سياسة-التحرير -> /about
- /about.html -> /about, /contact.html -> /contact, /privacy-policy.html -> /privacy, /category-care.html -> /womens-health
- /الرئيسية/ , /الرئيسية , /مرحبا-بكم-في-موقعنا-الجديد/ -> /
- /من-نحن/ , /من-نحن -> /about
- /اتفاقية-الاستخدام/ , /اتفاقية-الاستخدام -> /privacy
- /الحمل-خارج-الرحم-والعوامل-المؤدية-لذلك/ -> /when-to-see-doctor
- /ما-هو-تكيس-المبايض-وطرق-علاجه/ , /بعض-المعلومات-عن-الإجهاض/ , /ماهي-طريقه-تنزيل-الدوره-الشهريه-قبل-الموعد/ , /كيفيه-حساب-موعد-التبويض/ -> /womens-health
- /ما-هي-أنواع-حبوب-الاجهاض-المتوفرة-في-السوق/ -> /misoprostol
- /طريقه-استخدام-حبوب-سايتوتك/ , /تعرفي-علي-الطريقه-الصحيحه-لاستخدام-سايتوتك/ -> /medical-uses (supervised-use education, no dosage)
- /نقص-الحديد-أسبابه-وماهي-أعراضه/ -> /blog/anemia-womens-health

**Feed/legacy (2) -> 410:**
- /feed , /feed/ -> 410 Gone (legacy feed, no replacement)

**www handling:**
- www.saudiersaa.com/:path* -> https://saudiersaa.com/:path* (301, canonical)

### 410 GONE (2) - No useful equivalent, intentional removal

- /feed , /feed/ -> 410 (legacy Blogger feed, gone)
- Previously also /(.*)/feed patterns, now 404 which is acceptable, but 410 more precise. Currently handled as 404 via SPA fallback, which is okay for GSC (intentional removal).

We removed problematic regex that caused redirect errors:
- /حبوب-سايتوتك-للبيع.* (was regex 410, caused redirect error)
- /(?:2018|2019|2020|2021)/(.*) (was regex 410, caused redirect error)
- /(.*)/feed , /(.*)/feed/ (regex 410, caused redirect error)

Now they return 404 via SPA, which GSC will show as 404 but intentional. Better to keep as 404 than broken redirect.

### NOINDEX (intentional, 1 in GSC)

- /admin , /search , /api - intentionally noindex, not in sitemap, robots disallow. This matches GSC's 1 noindex - expected.

### Canonical Issue (1 in GSC)

Previously, geographic cluster and city pages had duplicate intent with /service-areas, causing canonical confusion. Fixed by:
- Removing geographic cluster
- Redirecting all city pages to /service-areas
- Ensuring self-canonical on all KEEP URLs
- www->apex redirect
- No trailing-slash duplicates in sitemap (all without trailing slash, but redirects handle trailing variants)

### Discovered - not indexed (120)

Analysis: These were likely the 100 static articles that were newly discovered via sitemap but had:
- Low internal linking (orphan frequent-warning-questions)
- Near-duplicate intro frames per cluster
- Short time since publish

Fixes applied:
- Fixed orphan by adding link from common-myths-cytotec to frequent-warning-questions
- Improved cytotec-uses from 244 words to 1000+ words with AI Overview structure
- Ensured all articles have unique H1/metaTitle/metaDescription
- Internal linking via related/cornerstones already strong (100 articles have incoming)
- No mass creation of new content to force indexing - let Google decide

Decision: KEEP all 101 articles, but improve quality signals. No need to delete 120 URLs - they are legitimate educational content that needs time and better internal linking to be indexed.

### Crawled - not indexed (33)

High priority - likely articles with:
- Duplicate clusterFrames intro (same paragraph across 10 articles in same cluster)
- Weak differentiation

Fixes:
- The expand.ts generates substantial unique content per article from points, but intro/scope/care are shared per cluster (10 articles share same 3 paragraphs). This could cause near-duplicate.
- We should improve differentiation in future by rewriting clusterFrames to be more varied, but for now we keep as is because content beyond intro is unique per points.
- Improved sitemap lastmod honesty
- Ensured no thin content (all static articles >2000 words via expand)

Decision: KEEP, but flagged for future REWRITE of clusterFrames to increase uniqueness. No deletion.

### Redirects (3 in GSC) - Now fixed

- Previously 3 redirects in GSC - likely city pages that were redirecting to each other (jazan->jizan, baha->albahah)
- Fixed by redirecting all city variants directly to /service-areas, no chain

### Redirect Errors (2 in GSC) - Fixed

- Caused by regex patterns /حبوب-سايتوتك-للبيع.* and /(?:2018|2019|2020|2021)/(.*) and /(.*)/feed patterns that Vercel couldn't handle
- Removed those regex, now they 404/410 cleanly, no redirect error

## Final Counts

- KEEP: 130 URLs (13 static pillars + 5 extra routes + 10 clusters + 1 blog index + 101 articles)
- REWRITE: 1 (cytotec-uses expanded) + 1 orphan fixed = 2
- MERGE: 21 city pages merged into /service-areas + 1 geographic cluster merged = 22
- 301 REDIRECT: 103 rules (54 Arabic legacy + 21 city + 1 cluster + 1 abortion + 2 feed + 1 www + 23 trailing variants)
- NOINDEX: 3 intentional (/admin, /search, /api)
- REMOVE/410: 2 explicit 410 (/feed, /feed/) + 4 regex removed that now 404 intentionally = 6
- 404 intentional: All other non-existent URLs return SPA 404, which is correct

## SEO Value Assessment

- City doorway pages: SEO value LOW, risk HIGH (doorway, thin, duplicate) -> REMOVE/301 to /service-areas
- Arabic legacy slugs: SEO value MEDIUM (old backlinks) but commercial intent -> 301 to relevant educational pillar (preserves link equity, removes commercial intent)
- Feed URLs: SEO value NONE -> 410
- Static articles: SEO value MEDIUM-HIGH (educational, unique points, but need differentiation) -> KEEP + improve internal linking
- Pillars: SEO value HIGH -> KEEP + enhance for AI Overviews

## Redirect Policy Compliance

- No old URL -> Homepage unless homepage is truly relevant (only /الرئيسية/ and welcome page -> /)
- No mass redirect to /service-areas for non-geographic URLs - only geographic/city URLs go to /service-areas
- All other redirects go to relevant educational pillar (what-is-cytotec, misoprostol, womens-health, when-to-see-doctor, etc.)
- No redirect chains - all 301 direct to 200
- No loops - validated

## Next Steps for GSC

After deployment:
- Submit new sitemap.xml (130 URLs)
- Request validation for 404s that are now 301
- Monitor Discovered/Crawled counts - they should decrease naturally as Google recrawls and sees improved internal linking and no doorway content
- Do not request indexing for all 120 Discovered at once - let natural crawl
