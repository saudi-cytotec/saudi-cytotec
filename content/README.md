# Content store (source of truth)

Published articles live here as JSON, one file per article. This directory — not
`localStorage` — is what ships to production.

```
content/
  published/   live articles, bundled into the build
  scheduled/   articles waiting for their publishAt date
```

## How publishing works

1. `POST /api/publish` (admin only) writes `content/published/<slug>.json` and
   commits it to this repository.
2. The commit triggers a Vercel redeploy.
3. `src/cms/contentSource.ts` bundles every file in `content/published/*.json`
   at build time via `import.meta.glob`.
4. `scripts/buildSitemap.mjs` regenerates `public/sitemap.xml` during the build,
   so a newly published article enters the sitemap with no manual step.

Scheduled articles are written to `content/scheduled/` and promoted to
`content/published/` by the daily Vercel Cron calling `POST /api/release`.

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

Files with an invalid slug, a missing title, or no valid `blocks` are skipped at
build time and logged as a warning — they cannot silently break the site.

## Rules

- Never put a phone number, WhatsApp handle, or vendor contact in content.
- Never add `Drug`, `Product`, `Offer`, `Review`, or `AggregateRating` schema;
  this site sells nothing and has no ratings.
