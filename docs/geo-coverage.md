# Geographic Coverage Strategy — Saudi pillar + 20 supporting articles

Date: 2026-09-01. Scope: Saudi Arabia only.

## Policy

- `/service-areas` is the authoritative Saudi geographic hub and is now titled **"سايتوتك في السعودية"**.
- City pages are published only when they add real informational value such as travel, pilgrimage, distance-to-care, or referral-planning context.
- No thin city templates with swapped names.
- No sales, pricing, delivery, availability, provider directories, fake reviews, or unsafe dosing instructions.
- Every city page must link back to the Saudi hub plus safety, FAQ, and care-pathway content.

## Implemented architecture

### Primary hub

- `/service-areas`
- H1/SEO focus: `سايتوتك في السعودية`
- Role: national geographic information hub that explains the Saudi medical/regulatory context, warning signs, official lines, and links to all priority cities.

### Protected geographic article set — exactly 20

All published through the existing CMS build path (`content/published/*.json`) and routed at `/blog/<english-slug>`. The set is intentionally retained as 20 articles; it is not a license to generate thin city pages:

1. `/blog/cytotec-makkah` — مكة المكرمة
2. `/blog/cytotec-madinah` — المدينة المنورة
3. `/blog/cytotec-buraidah` — بريدة
4. `/blog/cytotec-dammam` — الدمام
5. `/blog/cytotec-abha` — أبها
6. `/blog/cytotec-tabuk` — تبوك
7. `/blog/cytotec-hail` — حائل
8. `/blog/cytotec-arar` — عرعر
9. `/blog/cytotec-jizan` — جيزان
10. `/blog/cytotec-najran` — نجران
11. `/blog/cytotec-albahah` — الباحة
12. `/blog/cytotec-sakaka` — سكاكا
13. `/blog/cytotec-saudi-regions` — مناطق السعودية
14. `/blog/cytotec-western-region` — المنطقة الغربية
15. `/blog/cytotec-eastern-region` — المنطقة الشرقية
16. `/blog/cytotec-central-region` — المنطقة الوسطى
17. `/blog/cytotec-southern-region` — المنطقة الجنوبية
18. `/blog/cytotec-saudi-faq` — الأسئلة الجغرافية الشائعة
19. `/blog/cytotec-saudi-safety` — السلامة والتنظيم الدوائي
20. `/blog/cytotec-medical-verification` — التحقق من المعلومة والمزود

### Supporting records kept separate from the geographic set

- `/blog/cytotec-uses` is an indexable self-canonical explainer in the definition cluster; it supports medical understanding and does not own the national geographic query.
- `/blog/cytotec-in-saudi-arabia` is an intentional noindex shadow record consolidated to `/service-areas`; it is not a second pillar.

## Why these pages are not doorway pages

Each page contains unique local context, for example:

- مكة المكرمة والمدينة المنورة: visitor / pilgrimage / short-stay considerations.
- بريدة: movement from nearby Qassim governorates.
- الدمام: cross-city access within the Eastern Province.
- أبها، نجران، تبوك، عرعر، سكاكا، الباحة: time-and-distance planning for licensed care.
- جيزان: city and nearby coastal-governorate care routing.
- حائل: avoiding overnight delay when warning signs are present.

The medical facts remain consistent; the unique value is in local care-access framing, emergency planning, and decision timing.

## Official context preserved site-wide

- Saudi Food and Drug Authority (SFDA)
- Saudi Ministry of Health
- 937 for general health guidance
- 997 for emergencies

## Editorial guardrails

- Informational content only.
- No buying instructions.
- No commercial claims.
- No prescription implication through WhatsApp.
- WhatsApp remains editorial/informational only.
