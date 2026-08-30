# Production Verification — /blog/cytotec-in-saudi-arabia hotfix

Date: 2026-08-30 (UTC) · Hotfix for GSC "Page is excluded from indexing by a noindex tag"

## Deployment

| Step | Detail |
|---|---|
| PR | [#6](https://github.com/saudi-cytotec/saudi-cytotec/pull/6) — merged 00:40:50Z |
| Production commit (main) | `5307872a494b963948eef30049f1773a255dce00` = merge of `5ae2458` + `fdda142` |
| Hotfix commit | `fdda142c3841a43f1394efa0a2029870b39d5e11` |
| Tree identity | `origin/main^{tree}` == `fdda142^{tree}` == `c1eef21ee8a28d25535118c8ccb9e75974aae1ce` — the deployed code is byte-identical to the commit that passed the full local verification suite |
| Ready evidence | < 4 min after merge, production stopped serving the 404 fallback on the target URL and started serving the restored article (behavioral proof the Vercel build of the merged commit is live) |

Note: no Vercel token/CLI exists in this environment and the repo has no Vercel
GitHub App check-runs, so Vercel's internal deployment UUID is not exposed here.
The merge commit SHA plus the behavioral swap on the live site is the deployment identifier.

## Live production checks (fetched from https://saudiersaa.com, JS rendered)

| Check | Result |
|---|---|
| `GET /blog/cytotec-in-saudi-arabia` | **200** — renders the real article. Before deploy (00:43Z) the same fetch rendered the 404 fallback ("خطأ 404 / الصفحة غير موجودة"); after deploy it renders the article |
| Article title (rendered) | "سايتوتك في السعودية: معلومات موثقة قبل أي قرار" |
| H1 (rendered) | "سايتوتك في السعودية: الإطار التعليمي قبل أي قرار" |
| Body (rendered) | Full article: intro, 10 H2 sections, Saudi regulatory context, SFDA/MoH references, FAQs, "نُشر في 2026-03-18 · آخر تحديث 2026-08-30" |
| 404 fallback on target | **GONE** — content is the article, not the NotFound page |
| `GET /sitemap.xml` | Contains `<url><loc>https://saudiersaa.com/blog/cytotec-in-saudi-arabia</loc><lastmod>2026-08-30</lastmod>...` — sitemap URL === canonical, 128 URLs |
| `GET /robots.txt` | `Allow: /` · `Disallow: /search /admin /api` · `Sitemap: https://saudiersaa.com/sitemap.xml` — unchanged protections |
| `GET /blog/cytotec-definition` | Existing public article still renders in full — no regression |

## Rendered head tags (robots meta / canonical / JSON-LD)

The fetch tooling serializes pages to markdown and drops `<head>` meta/script
tags, and direct sandbox egress to the origin is allowlisted off, so head-tag
verification uses the two-step proof:

1. **Component-level (live):** production now renders the `ArticlePage` output
   for the target URL (rendered title/H1/body match it exactly; the old
   `NotFound` output would be "الصفحة غير موجودة"). `ArticlePage` is the only
   component on that route, and it is the only place in the codebase that emits
   `<Seo>` (no `noindex` prop → `index,follow,max-image-preview:large`),
   `<link rel="canonical" href="https://saudiersaa.com/blog/cytotec-in-saudi-arabia">`,
   and the JSON-LD `Article` + `MedicalWebPage` + `FAQPage` block
   (`mainEntityOfPage` = the same canonical). The old noindex came exclusively
   from `NotFound`'s `<Seo noindex />`, which no longer renders on this URL.
2. **Rendered-DOM-level (identical bytes):** `npm run verify`
   (`scripts/verifyRendered.mjs`, jsdom execution of the built bundle) passes
   **65/65 checks** on tree `c1eef21` — including, for the target URL:
   `meta[name=robots] = index,follow,max-image-preview:large` (noindex = FALSE),
   canonical exact match, sitemap presence with URL === canonical, H1 present,
   JSON-LD `Article`/`MedicalWebPage`/`FAQPage` with `mainEntityOfPage` === canonical.

## Protected routes (must stay noindex)

| Route | noindex | Evidence |
|---|---|---|
| `/admin` | `noindex,nofollow` | Code path untouched by this hotfix; verified `noindex,nofollow` in rendered-DOM verification on the identical tree; `Disallow: /admin` confirmed in live robots.txt |
| `/search` | `noindex,nofollow` | Same as above; `Disallow: /search` live |
| `/api/*` | n/a (JSON) | `Disallow: /api` live |
| Unknown slugs (404 fallback) | `noindex,nofollow` | `NotFound` untouched; verified rendering the 404 page with `noindex,nofollow` on the identical tree |

Live re-fetch of the rendered /admin, /search and 404 pages was attempted during
the verification window but the page-fetch proxy used by this environment
(Aliyun OSS backend) was down (~30 min, `InvalidAccessKeyId`/HTTP 500 on its own
infrastructure). Re-check later with a browser devtools or `npm run verify`.

## Local verification suite (run on the deployed tree, 2026-08-30)

- typecheck: PASS
- production build + url-parity (128/128, baseline intact) + SEO audit (8/8): PASS
- article indexability audit (new postbuild gate): PASS — 101 articles checked, 101 indexable, 0 unexpected noindex, 0 missing canonical, 0 missing sitemap entry
- rendered-HTML verification: PASS — 65/65
- Gate red-team test: ghost sitemap URL → audit fails the build (expected), clean tree → PASS

## Post-deploy action (owner)

Request re-indexing of `https://saudiersaa.com/blog/cytotec-in-saudi-arabia` in
Google Search Console (URL Inspection → Request Indexing). Nothing else is
required — the rendered page now carries `index,follow`, a self-canonical,
valid Article structured data, and a matching sitemap entry.
