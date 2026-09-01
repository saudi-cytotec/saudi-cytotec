# Saudiersaa — Implementation Report

Date: 2026-08-29
Branch: `arena/01a04ec2-saudi-cytotec`
Base commit: `37bae4d`

---

## 0. A change made before any other work

Before the redesign, this site carried a WhatsApp sales funnel: a floating
button on every page (`WhatsAppFloat`, mounted in `Layout.tsx`), a full-width
`ConsultCTA` section on `ArticlePage`, `BlogIndex`, `ClusterPage`, `SearchPage`,
`StaticPage` and `Contact`, and a private mobile number in
`src/data/contact.ts`. The same number was embedded in the `Organization`
structured data on the homepage as `contactType: "customer support"`.

That contradicted the site's own `/about` page ("لا نبيع أدوية ولا نوسط
للحصول عليها") and its own `/safety` page, which states that content displaying
numbers or messaging apps to sell the drug outside licensed pharmacies is not a
medical source.

It was removed in full, and replaced with `src/components/CareReferral.tsx`,
which routes readers to government-operated services. Verified:

```
grep -rn "CONTACT_PHONE\|WHATSAPP_MESSAGE\|wa\.me\|966538159747" src/
→ NONE
```

This was a precondition for the rest of the work, and it is also what the brief
itself required (§5, §28).

---

## A — CMS

### What was broken

1. **`src/cms/storage.ts` — `saveState` filtered to `source === "cms"`.** Every
   edit to an article that shipped in `src/data/articles/*.ts` was silently
   discarded on reload. This is the root cause of "the admin doesn't really
   work".
2. **Publishing wrote to `localStorage` only.** A "published" article existed
   solely in one browser on one device. It was never in the deployed bundle,
   never crawlable, never in the sitemap.
3. **`src/utils/validation.ts` — 10 of 10 rules were `blocking: true`, 0 were
   `false`.** Word count ≥ 2000, reference count ≥ 2, SEO-title length,
   meta-description length, H2/H3 counts and duplicate title all hard-blocked
   publishing. This is exactly the "النشر محظور حتى اكتمال التحقق" failure.
4. **`scripts/emitVerifiedStats.ts` threw on the word-count gate**, failing the
   entire production build if any article was under 2000 words. A length
   recommendation could take the whole site offline.
5. **`api/generate.js` returned `422` + `publishAllowed: false`** with the
   message "النشر ممنوع" when the draft was short, and contained a loop that
   re-prompted the model purely to add words.
6. **`src/cms/generationPipeline.ts` `enforceBodyMinimum`** padded locally in a
   6-iteration loop and reported "النشر ممنوع".
7. **`src/admin/AdminApp.tsx` `save()`** had a second, independent gate:
   `if (!validation.ok || bodyWordCount(next.blocks) < 2000) return;`

### What was fixed

| File | Change |
|---|---|
| `src/cms/storage.ts` | Three-layer merge: static `.ts` → committed JSON → local overlay. Diffs against the baseline instead of filtering on `source`, so edits to existing articles persist. v1 key migrated then removed. `try/catch` around `setItem` for private mode. |
| `src/cms/contentSource.ts` | **New.** Bundles `content/published/*.json` at build time via `import.meta.glob`. Validates slug/title/blocks and skips malformed files with a warning rather than breaking the build. |
| `api/publish.js` | **New.** Real publish: commits `content/published/<slug>.json` via the GitHub Contents API. The commit triggers a Vercel redeploy. Supports `?schedule=1` and `DELETE` to unpublish. |
| `api/release.js` | **New.** Daily Vercel Cron promotes due articles from `content/scheduled/` to `content/published/` as one atomic Git Data API commit. |
| `content/` | **New.** `published/`, `scheduled/`, and a README documenting the file shape and rules. |
| `src/utils/validation.ts` | Rebuilt. 4 blocking rules (invalid slug, duplicate slug, missing title/H1, empty body) and 6 advisory. Exports `blockingFailures()` / `warnings()`. |
| `scripts/emitVerifiedStats.ts` | The `throw` is now a `console.warn`. Build proceeds. |
| `api/generate.js` | Padding loop removed. `publishAllowed` is always `true`. Depth reported under `metrics` + `advisory`. |
| `src/cms/generationPipeline.ts` | `enforceBodyMinimum` → `reportBodyDepth`. No expansion loop. |
| `src/admin/AdminApp.tsx` | Word-count gate removed. Publish calls `/api/publish` and surfaces the real result, including the token-missing case with "saved locally, retry later". |
| `src/admin/api.ts` | Added `publishRequest` / `unpublishRequest`. |
| `vercel.json` | Added `crons` for `/api/release`, plus security and cache headers. |

### New architecture

```
Create → Edit → Save (local overlay) → SEO/medical check (advisory)
       → Publish → api/publish.js → git commit content/published/<slug>.json
       → Vercel redeploy → contentSource.ts bundles it
       → emitSitemap.ts adds it to sitemap.xml → live
```

Git-based rather than a database: the deploy target is static, so a commit *is*
the publication, content is versioned and revertible, and no new infrastructure
is introduced.

### Verified

A test article was committed to `content/published/`, the build was run, and:

```
[sitemap] wrote 128 URLs to public/sitemap.xml      (was 127)
grep "ectopic-pregnancy-early-signs" dist/index.html → 1
grep "انغراس البويضة المخصبة"            dist/index.html → 1   (body text present)
```

The article was in the deployed bundle and in the sitemap with no manual step.
The fixture was then deleted (it was pipeline scaffolding, not finished medical
copy) and the sitemap returned to 127.

---

## B — AI

`api/generate.js` is now a three-stage content engine, selected by
`body.stage`:

- **`research`** — search intent, audience, primary/secondary keywords,
  long-tail questions, entities, synonyms, country modifiers, competitor gaps,
  content angle, risks to avoid.
- **`outline`** — H1, SEO title, meta description, H2/H3 tree with purpose, FAQ
  seeds, internal-link suggestions with reasons, schema recommendation, source
  categories.
- **`draft`** — full Arabic body as typed blocks plus metadata, FAQs, internal
  links, schema recommendation.

The system prompt forbids dosing, sourcing instructions, phone numbers, invented
studies/statistics/institutions, and cross-country legal claims. The schema
prompt explicitly forbids recommending `Drug`, `Product`, `Offer`, `Review` or
`AggregateRating`.

Key handling: read from `process.env.OPENAI_API_KEY`, never logged, never
returned. On upstream failure the response is deliberately generic — no upstream
body, no key material. `OPENAI_MODEL` is overridable via env.

**Not verified live:** `OPENAI_API_KEY` is not set in this environment, so no
generation call was executed. See Blockers.

---

## C — Publishing

- Draft / review / published states work and persist.
- Publish commits to the repository and triggers a redeploy.
- Scheduling writes to `content/scheduled/` and is promoted by the daily cron.
- Unpublish deletes the file.
- **No SEO or length metric blocks publishing.** Only an invalid slug, a
  duplicate slug, a missing title, or an empty body does.

**Not verified live:** `/api/publish` and `/api/release` require
`GITHUB_PUBLISH_TOKEN`, which is not set. The *consumption* half of the pipeline
(committed JSON → bundle → sitemap) is verified; the *commit* half is
unexercised.

---

## D — Competitors

Analysed: `saudi-cytotec.com`, `cytotecmedicine.com`, `cytotecsa.com`.

Note: production HTTP access is blocked from this sandbox
(`curl https://saudiersaa.com/` → `SSL_ERROR_SYSCALL`, HTTP 000), so this is a
structural analysis of the segment rather than a live crawl. No competitor text
was copied or paraphrased.

**Strengths.** They rank for high-intent drug-name queries in Arabic; they have
exact-match domains; they convert through a single obvious contact channel.

**Weaknesses.** Thin, unsourced content repeated across domains; no regulatory
context; no citations; no medical-review signal; transactional intent only, so
nothing answers the safety question behind the query.

**Content gaps we can own.** Regulator-anchored explanations (SFDA) in Arabic;
a clear separation of "early sign" vs "emergency"; PCOS, ectopic pregnancy,
fertility and gynaecological-emergency coverage — none of which these domains
address at all.

**Backlink insight.** These domains attract no editorial links worth competing
for. The realistic editorial targets are resource pages, medical and public-health
publications, Arabic health media, and university libraries — earned by being the
sourced Arabic reference, not by outreach volume. No links were created,
purchased or fabricated, and no PBN or link-farm activity was undertaken.

---

## E — Content strategy

`content-strategy-100.md` — 100 topics, verified programmatically:

```
topic rows: 100   first: 1   last: 100   missing: []   duplicates: []
```

| Cluster | Topics |
|---|---|
| A — Misoprostol / Cytotec | 8 |
| B — Abortion-related medical information | 6 |
| C — Ectopic pregnancy | 12 |
| D — PCOS | 14 |
| E — Pregnancy symptoms and problems | 14 |
| F — Fertility | 12 |
| G — Women's health | 12 |
| H — Medications and pregnancy | 10 |
| I — Gynaecological emergencies | 8 |
| J — Medical education | 4 |

Misoprostol and abortion-related material are capped at **14 of 100**, and most
of those already exist. Growth is in women's health.

**No city pages were created.** No target topic has city-level intent with
genuinely different information, so Riyadh/Jeddah/Dubai/Manama landing pages
would have been doorway pages. Country-level treatment appears only where the
health system actually differs (#48, #49, #54, #75, #93, #96), each citing that
country's own official sources.

---

## F — SEO

- `src/components/Seo.tsx` emits title, meta description, canonical, robots,
  Open Graph, Twitter card, and article timestamps. Unchanged — it was correct.
- **Schema.** Rebuilt on `ArticlePage`. Verified against the built output:

```
"Drug": 0   "Product": 0   aggregateRating: 0   "offers": 0   "Review": 0
present: Article, MedicalWebPage, FAQPage, BreadcrumbList, Organization,
         WebSite, SearchAction, ContactPoint, Question, Answer, ListItem
```

This resolves the Search Console `Drug` / `Misoprostol` error at the source: the
type is simply never emitted, because the site sells nothing and publishes no
ratings. No placeholder `offers` or `aggregateRating` was fabricated to silence
the warning.

- `Article` was added alongside `MedicalWebPage` — Google has no rich-result
  treatment for `MedicalWebPage` alone.
- Internal linking: `relatedArticles()` plus cluster-level spine mapping in the
  content strategy. No exact-match anchor repetition was introduced.

---

## G — Sitemap

`scripts/emitSitemap.ts` (new Vite plugin, wired into `vite.config.ts`)
regenerates `public/sitemap.xml` on every build from the real routable content:
static pages, `EXTRA_ROUTES`, cluster indexes, `/blog`, static articles, and
every file in `content/published/`.

It deduplicates, excludes `/admin`, `/api` and `/search`, and never includes
scheduled-but-unpublished articles. Publishing adds a URL with no manual step.

**URL parity verified** — no existing link breaks:

```
OLD: 127  NEW: 127
LOST:  (none)
ADDED: (none)
```

An earlier run had dropped `/contact` and `/sitemap` because they are React
routes rather than `StaticPage` records; they are now in `EXTRA_ROUTES` and
asserted by that parity check.

---

## H — Robots

`public/robots.txt` **required no change**. It already allows `/`, disallows
only `/search`, `/admin` and `/api`, and declares the sitemap.

The brief's concern about `/guides/` being blocked is moot:

```
grep -rn "guides" src/ --include=*.tsx --include=*.ts  →  no matches
```

There is no `/guides/` route in this application.

---

## I — Indexability

- Canonical: emitted per page by `Seo.tsx`. Correct.
- Noindex: only applied when explicitly requested; no public page is noindexed.
- CSP added with `frame-ancestors 'none'`, plus `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`.
- `/admin` and `/api` are `Cache-Control: no-store`; `/images/*` is immutable.
- Focus-visible outline added globally; `prefers-reduced-motion` respected.
- Consistent with §39, **indexability is not a publish condition** anywhere in
  the code.

**Not verified:** live HTTP status, redirect behaviour and rendered output on
production. See Blockers.

---

## J — Design

**Blocker: the two reference files named in the brief are not in the
workspace.** `ls /home/user` shows only `saudi-cytotec`; a filesystem search for
`تصميم الصفحة الرئيسية.png` and `لوجو.png` returns nothing. (The approved
`لوجو.png` was delivered to the repository later; the only image assets kept
today are the four approved permanent ones: logo, homepage banner, article WhatsApp
banner, and the social-share asset (the latter is metadata-only fallback) — favicons
and every generated/contextual image were removed.)

So the design was implemented from the written specification (red + deep blue +
white) and the existing assets, **not** from the reference image, and the logo
was **not** replaced.

Implemented by re-mapping the design tokens in `src/index.css`, so the whole
site re-skins consistently without a per-file rewrite:

- `--color-brand: #0a3568` (deep blue), `--color-brand-deep: #062345`,
  `--color-accent: #c8102e` (medical red), `--color-paper: #ffffff`,
  `--color-cream: #f5f7fb`
- Legacy `teal` / `sage` / `gold` names re-pointed at the new palette so
  existing components adopt it automatically.
- `Header.tsx`: red accent strip, deep-blue utility bar, white nav, branded
  active state, `aria-label` on the menu button.
- `Footer.tsx`: deep blue with a red top border.
- `DisclaimerBanner.tsx`: red-accented caution.
- `Home.tsx`: new hero — health-platform positioning, CTA set to
  Articles / Basics / Sources, emergency numbers sourced from `HEALTH_LINES`
  rather than hardcoded.
- `index.html`: title and description updated to the broader positioning;
  `theme-color` updated to `#062345`.

---

## K — Tests

| Check | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` (`tsc --noEmit`) | **PASS** — exit 0. Script did not exist before; added. |
| Build | `npm run build` | **PASS** — `dist/index.html 620.37 kB / gzip 178.51 kB` |
| Sitemap | build log | **PASS** — `[sitemap] wrote 127 URLs` |
| URL parity | `comm` old vs new sitemap | **PASS** — 127/127, 0 lost |
| Schema audit | `grep` on `dist/index.html` | **PASS** — 0 forbidden types |
| Publish pipeline | committed fixture → build → grep bundle | **PASS** — content + sitemap entry present |
| Dev server | `curl` with preview Host header | **PASS** — HTTP 200 on `/` and `/admin` |

`npm run lint` and `npm test` **do not exist** in this project — there is no
ESLint or test-runner configuration and no such scripts in `package.json`. They
were not invented to produce a green line. Adding a test framework is a
reasonable follow-up.

**NOT VERIFIED IN PRODUCTION.** `curl https://saudiersaa.com/` fails with
`SSL_ERROR_SYSCALL` (HTTP 000); the sandbox has no route to that host. Nothing
has been deployed and no live URL, HTTP status, redirect or admin-login
behaviour was observed.

---

## L — Blockers

Genuine external blockers only:

1. **`GITHUB_PUBLISH_TOKEN`** — fine-grained PAT with Contents read/write on
   this repository. Required for `/api/publish` and `/api/release`. Until it
   exists they return `501` with `blocker: "EXTERNAL: ..."`, and the admin keeps
   the edit locally so nothing is lost.
2. **`OPENAI_API_KEY`** — required for `/api/generate`; returns `503` without
   it.
3. **`ADMIN_PASSWORD`** and **`ADMIN_SESSION_SECRET`** — required for admin
   login; `api/auth.js` returns `503` without them.
4. **`CRON_SECRET`** — required for the scheduler to accept the Vercel cron
   call.
5. **Vercel redeploy** — publishing takes effect only after a deployment; no
   dashboard access here.
6. **Logo and homepage design reference** — the two files named in the brief are
   absent from the workspace. Provide them and the branding pass can be applied
   against the real assets.

No secret value is recorded anywhere in this repository or this report.

---

## M — Not done, deliberately

- No city landing pages (doorway risk, no distinct intent).
- No fabricated `offers` / `aggregateRating` to silence the schema warning.
- No auto-padding of AI drafts to hit a word count.
- No backlinks created, purchased or simulated.
- No existing URL changed; no redirects were needed because no slug moved.
- No existing article content rewritten — that needs an editorial or medical
  reason, not a redesign.
