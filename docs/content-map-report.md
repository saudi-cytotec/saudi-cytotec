# Content Map Report

Date: 2026-09-06 · source: `content/map.json` + built `dist/seo-manifest.json`

## Search-intent ownership

| Query / role | One owning URL | Supporting layer | Policy |
|---|---|---|---|
| سايتوتك في السعودية | `/service-areas` | 20 geographic articles + regional articles | The service-area hub is the only pillar for this national query; supporting pages must not copy its title/intent wholesale. |
| ما هو سايتوتك / التعريف | `/what-is-cytotec` | definition articles | Educational definition, not a transactional or geographic substitute. |
| الأمان والتحذيرات | `/safety` | safety and emergency articles | Safety support cluster; no dosing or commercial intent. |

## Catalog snapshot

- Content-map topics: **100**
- Content-map items marked PUBLISHED/UPDATED: **36**
- Built article records: **101** (101 indexable, 0 intentional noindex)
- Geographic articles protected by the editorial plan: **20**; no city page was added or removed by this audit.
- Published/updated map targets missing from a built route: **0**
- Planning-only target paths not yet built: **64**; these are IDEA records, not live URLs or mass-publishing instructions.

| Status | Count |
|---|---:|
| IDEA | 64 |
| RESEARCH | 0 |
| OUTLINE | 0 |
| DRAFT | 0 |
| REVIEW | 0 |
| READY | 0 |
| PUBLISHED | 35 |
| UPDATED | 1 |

## Cluster pillars

| ID | Cluster | Pillar |
|---|---|---|
| A | What is Misoprostol / Cytotec | `/what-is-cytotec` |
| B | Safety, warnings and responsible care | `/safety` |
| C | Early pregnancy and ectopic-pregnancy awareness | `/early-pregnancy` |
| D | Women's health and reproductive questions | `/womens-health` |
| E | FAQ and misconception architecture | `/faq` |
| F | Medical resources and evidence literacy | `/medical-sources` |
| G | Medication interactions and contraindications | `/safety` |
| H | Saudi women's health care access - general education | `/service-areas` |
| I | Emergency signs and urgent-care pathways | `/when-to-see-doctor` |
| J | Advanced references and source verification | `/medical-sources` |

## Guardrails

- Keep `/service-areas` indexable, self-canonical and in the sitemap.
- Keep the 20 geographic articles; do not create thin city pages or doorway variants.
- Keep supporting articles informational and distinct; do not optimize every article for the national pillar query.
- Content-map IDEA items are planning records, not permission to mass-publish.
