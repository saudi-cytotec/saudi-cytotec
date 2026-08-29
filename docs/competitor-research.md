# Competitor Research — Saudi / GCC Women's Health & Misoprostol SERPs

Date: 2026-08-29 · Method: live review of the named competitors + Google-Saudi SERP discovery (via web search). No competitor text was copied or paraphrased; all findings are structural. Machine-readable gap matrix: `content/competitors.json` (also rendered inside the CMS).

## 1. The SERP landscape

The Saudi SERP for drug-name queries (`سايتوتك`, `سايتوتك في السعودية`, `حبوب سايتوتك`) is dominated by **transactional seller funnels** (e.g. `cytotec-saudi.com`, `hayatannas.com`) that promise "توصيل سري، تغليف سري، دفع عند الاستلام" with WhatsApp numbers, plus a layer of **doctor-branded funnel sites** and **awareness platforms**. Google also still surfaces **legacy saudiersaa.com URLs** from the WordPress era — handled in `docs/url-inventory.md` with 301/410 rules.

Three named competitors were reviewed in depth:

## 2. taxiporteu.com — awareness platform (closest positioning)

**What it is.** An Arabic awareness platform with the same editorial stance saudiersaa adopted: "لا نبيع دواءً ولا نوفّره"، emergency-first framing (997/911), six-point "exam decides, not a website" checklist.

**Architecture observations (build better, don't copy):**
- `/guides` hub + per-topic long-form guides (misoprostol guide, "9-week limit explained", "emergency signs") — hub-and-spoke done well.
- `/cities` directory: ~12 Saudi city pages (Riyadh, Jeddah, Makkah, Madinah, Dammam, Khobar, Taif, Abha, Khamis Mushait, Tabuk, Qassim/Buraidah, Al-Ahsa/Jubail) + `/countries` for GCC. Each city page is a **care-pathway page**: neighborhoods commonly named, emergency numbers, "book via a licensed facility" — no "availability" claims.
- A pregnancy-dates calculator (explicitly non-diagnostic), a seller-pattern checker ("ست علامات تُعرّفك على عرض دوائي خارج النظام"), FAQ with tab filters.
- Weaknesses: a WhatsApp contact channel that contradicts its own "we store what you send" warnings (the channel is a funnel risk), no medical-review byline signal beyond "فريق التوعية الصحية", no article-level schema surfacing in the homepage crawl, city pages risk becoming near-duplicate boilerplate.

**What saudiersaa can own instead:** article-level `Article`+`MedicalWebPage` schema, per-article references with dates, SFDA-anchored regulatory cluster (already shipped: `saudi-drug-regulation-context`), a genuinely differentiated 404/redirect system, and zero contact-funnel ambiguity (CareReferral routes to government lines only).

## 3. femseha.com — doctor-branded women's-health platform

**What it is.** Next.js site branded around "د. هيثم الخطيب" with ~40 articles and a WhatsApp consultation funnel. Broad real women's-health coverage: pelvic inflammatory disease, endometrial polyps, polyhydramnios, nuchal cord, IUGR, PCOS, delayed period, ovulation window — topics that match saudiersaa's planned expansion clusters exactly.

**Patterns:** Arabic slug URLs for some articles, English slugs for others; "دليل شامل عن…" title pattern; 8–12 minute read labels; category taxonomy (الحمل والإجهاض والطوارئ / الصحة الإنجابية / صحة الرحم والخصوبة / مضاعفات الحمل); doctor photo + byline on every card.

**Weaknesses:** seller-adjacent framing survives in titles ("حبوب سايتوتك الأصلية… الجرعات… بدائل التوفر"), the doctor persona is the entire E-E-A-T layer with no visible reference lists per article, and the consultation funnel (WhatsApp) is the business model — medical info is acquisition for a channel saudiersaa cannot and must not have.

**Gap we own:** sourced, reference-backed articles on the same topics **without** a sales channel, with explicit medical-review transparency statements (if no review happened, say so — like sehaher does).

## 4. sehaher.com — "دليل صحة المرأة" with review transparency

**What it is.** Doctor-branded (د. نيرمين الخالدي) educational platform: sections for womens-health, pregnancy, delayed-period, medications, cytotec, misoprostol, abortion-medications, ectopic-pregnancy, ultrasound. Strong transparency section: "لا ندّعي مراجعة طبية لم تحدث فعلًا" and a named medical-review policy page, plus a sources page (WHO/FDA/SFDA/ACOG/RCOG/NHS).

**Weaknesses:** article URLs are opaque IDs (`/articles/art-1787991110851` — zero keyword signal, zero readability), titles are seller-pattern hybrids ("توصيل سري، أصلي 100%، والدفع عند الاستلام"), and the funnel is a WhatsApp number on a doctor card. Mixed messages between "لا نبيع" and the transactional title set.

**Gap we own:** clean, keyword-carrying slugs (already the saudiersaa architecture), consistent title patterns that never carry buyer intent, and the same honesty about medical review *without* the WhatsApp funnel.

## 5. Keyword / topic gaps we build against

| Gap | Evidence | Our move |
|---|---|---|
| Ectopic pregnancy in Arabic: "early sign" vs "emergency" separation is scarce | SERP dominated by seller pages; femseha has one overview | P0 cluster C (12 topics) with emergency-warning framing |
| PCOS, fertility, menstrual health as sustained clusters | femseha touches them; no site owns the cluster in Arabic | Clusters D–F (40 topics) |
| SFDA / GCC regulatory context in Arabic | No competitor publishes regulator-anchored drug regulation explainers | `saudi-drug-regulation-context` + cluster H topics |
| Medication safety during pregnancy | Only superficial coverage | Cluster H (10 topics) |
| "When to go to the emergency department" decision support | taxiporteu's six-point checklist only | Cluster I (8 topics) + existing emergency cluster |
| Medical-evidence literacy | Nobody teaches "how to verify a medical claim" | Cluster J (4 topics) + existing evidence cluster |

## 6. Gap matrix

Stored in `content/competitors.json`: keyword → competitor → competitor URL → search intent → content quality → missing information → our opportunity → priority. Priorities are assigned by relevance × demand × intent × competition × our ability to create genuinely better content. The CMS renders this matrix (SEO → Competitors).
