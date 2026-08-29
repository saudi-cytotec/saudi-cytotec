# Geographic Coverage Strategy — Saudi Arabia (primary) + GCC (secondary)

Date: 2026-08-29 · Machine-readable: `content/geo-coverage.json` (rendered inside the CMS under SEO → Geographic Coverage).

## Policy (from the Master Plan, applied strictly)

1. **No thin city pages. No duplicate city pages. No doorway pages.** A city page is created only when *real local search intent* exists **and** the page carries unique, useful information. For an educational (non-transactional) platform, that condition is essentially never met by "سايتوتك في الرياض" — the searcher's real need is identical in every city, and the only honest answer is the same answer.
2. **Cities appear inside content where genuinely useful** — e.g. care-pathway articles that mention how to reach licensed care, regional emergency numbers, or officially published health-system context.
3. **Country-level pages appear only where the health system actually differs** — regulatory authority, vigilance reporting channel, official health hotline, care pathway. Each must cite that country's own official sources; no cross-border generalisation.

## Where local information genuinely changes content

| Level | What changes | Where applied |
|---|---|---|
| Saudi Arabia | SFDA as the drug regulator, 937 health line, 997 ambulance, licensed-facility pathway, pharmacy-only dispensing rules | `saudi-drug-regulation-context` (published), map topics #7, #48, #54, #75 |
| UAE | MOHAP/DHA/DoH structure, 998/999 emergency, 8001717 MOHAP line | map topics #49 (UAE healthcare context), #96 (GCC medication safety) |
| Kuwait | Ministry of Health regulation, 112 emergency | map topic #93 (Kuwait healthcare context) |
| Bahrain | NHRA regulation, 999 emergency | map topic #94 (Bahrain healthcare context) |
| All GCC | "no cross-country legal claims" editorial rule | AI pipeline system prompt + editorial policy |

## City-intent evaluation (the cities named in the Master Plan)

Evaluated per city: is there unique educational content that changes by city? For an educational platform the answer is **no** for every city — the medical facts, warnings, and the correct next step (licensed facility) are identical. Each city is therefore covered by:

- the country-level context (above), and
- **in-content mentions** where useful (e.g. "in Riyadh, Jeddah or any other Saudi city, the pathway is the same: a licensed facility, not a seller"), never as standalone URL targets.

| City | Doorway page decision | Coverage |
|---|---|---|
| Riyadh | ❌ no page | in-content + Saudi care-pathway context |
| Jeddah | ❌ no page | in-content |
| Makkah | ❌ no page | in-content |
| Madinah | ❌ no page | in-content |
| Dammam | ❌ no page | in-content |
| Khobar | ❌ no page | in-content |
| Dhahran | ❌ no page | in-content |
| Taif | ❌ no page | in-content |
| Tabuk | ❌ no page | in-content |
| Abha | ❌ no page | in-content |
| Khamis Mushait | ❌ no page | in-content |
| Jazan | ❌ no page | in-content |
| Najran | ❌ no page | in-content |
| Al Ahsa | ❌ no page | in-content |
| Hail | ❌ no page | in-content |
| Buraidah | ❌ no page | in-content |
| Yanbu | ❌ no page | in-content |
| Jubail | ❌ no page | in-content |
| Dubai | ❌ no page | UAE country context |
| Abu Dhabi | ❌ no page | UAE country context |
| Sharjah | ❌ no page | UAE country context |
| Kuwait City | ❌ no page | Kuwait country context |
| Hawalli | ❌ no page | Kuwait country context |
| Salmiya | ❌ no page | Kuwait country context |
| Manama | ❌ no page | Bahrain country context |
| Riffa | ❌ no page | Bahrain country context |
| Muharraq | ❌ no page | Bahrain country context |

**Note on the legacy city URLs:** the WordPress era created `/سايتوتك_الرياض/`, `/سايتوتك_في_جدة/` and similar seller pages. They are 301-redirected to the single educational equivalent (`/what-is-cytotec`) — see `content/redirects.json`. No new city pages are created.

## Emergency & hotline coverage

- `src/data/contact.ts` `HEALTH_LINES` carries official lines per country (SA: 997 ambulance / 937 MoH; UAE, Kuwait, Bahrain) and is the single source rendered by `CareReferral` and the homepage.
- Emergency warning content (cluster I + existing emergency cluster) is country-agnostic medical guidance + the official numbers.
