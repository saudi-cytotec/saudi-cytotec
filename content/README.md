# Content store (source of truth)

Published articles live here as JSON, one file per article. This directory — not
`localStorage` — is what ships to production.

```
content/
  published/   live articles, bundled into the build
```

## How publishing works

1. `POST /api/publish` (admin only, explicit editor action) writes
   `content/published/<slug>.json` and commits it to this repository.
2. The commit triggers a Vercel redeploy.
3. `src/cms/contentSource.ts` bundles every file in `content/published/*.json`
   at build time via `import.meta.glob`.
4. `scripts/emitSitemap.ts` (Vite plugin) regenerates `public/sitemap.xml`
   during the build, so a newly published article enters the sitemap with no
   manual step.

There is **no scheduled or automatic publishing**: no cron, no `/api/release`,
no background promotion. Publishing happens only when an administrator clicks
«نشر» in the CMS. AI generation (explicit generator click) always creates an
editable draft and never publishes.

## File shape

The JSON is a serialized `ManagedArticle` (see `src/types.ts`). Minimum viable
file:

```json
{
  "slug": "example-topic",
  "title": "…",
  "h1": "…",
  "metaDescription": "…",
  "cluster": "pregnancy",
  "excerpt": "…",
  "publishedAt": "2026-08-29",
  "references": ["who"],
  "blocks": [{ "type": "p", "text": "…" }]
}
```

Articles carry **no image fields**. Only the three owner-approved assets exist
(logo, homepage banner, article WhatsApp banner) and they are wired directly in
the UI; an article with no selected image simply renders without one and emits
no `og:image`/`twitter:image`.

Files with an invalid slug, a missing title, or no valid `blocks` are skipped at
build time and logged as a warning — they cannot silently break the site.

## Rules

- Never put a phone number, WhatsApp handle, or vendor contact in content.
- Never add `Drug`, `Product`, `Offer`, `Review`, or `AggregateRating` schema;
  this site sells nothing and has no ratings.
- Never add image fields to article JSON; the approved assets are the only
  images the site serves.
