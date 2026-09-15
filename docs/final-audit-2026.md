# Comprehensive SEO, Performance & Technical Audit Report — Saudiersaa.com

**Date:** 2026-09-15  
**Domain:** `https://saudiersaa.com`  
**Branch:** `arena/01a0a579-saudi-cytotec`  
**Build Status:** Clean, Typecheck: PASS, QA Suites: 100% PASS  

---

## Executive Summary

A comprehensive, forensic audit and remediation pass was conducted across all 26 mandate points on `saudiersaa.com`. The root technical defects that directly triggered Google Search Console's severe indexing anomalies—including 120 "Discovered - currently not indexed" pages, 33 "Crawled - currently not indexed" pages, and widespread Soft 404 misclassifications—have been definitively resolved.

All 128 public routes now prerender with strictly single canonical tags, single meta descriptions, unique title tags, optimized asset bundling, and valid structured data.

---

## 1. Technical Audit & Root-Cause Remediation

### 1.1 Double Canonical Elimination
* **Root Defect:** Vite's HTML output formats void tags without trailing slashes (`<link ...>`). The prerender script (`scripts/prerender.mjs`) used a regex `/<link[^>]+rel="canonical"[^>]*\/>/i` expecting `/>`, causing the shell's root canonical (`https://saudiersaa.com/`) to survive alongside each article's page-specific canonical.
* **Fix:** Updated regex to `/<link[^>]+rel="canonical"[^>]*\/?>/gi`.
* **Verification:** Automated audit across all 128 HTML files confirms **zero** pages with multiple canonical tags. Every canonical tag points strictly to self.

### 1.2 Double Meta Description & Title Deduplication
* **Root Defect:** Shell `<meta name="description">` tags were similarly preserved across all prerendered pages. In addition, `Seo.tsx` unconditionally appended ` | صحة المرأة السعودية` even when titles already contained the brand string.
* **Fix:** Fixed shell stripping in `scripts/prerender.mjs` and made brand appending conditional on substring absence in `src/components/Seo.tsx`.
* **Verification:** Exactly 1 description and 1 title tag per prerendered HTML file across all 128 public routes.

### 1.3 Soft 404 Elimination & Edge Routing
* **Root Defect:** `vercel.json` used a catch-all rewrite `"/(.*)" -> "/index.html"` returning HTTP 200 with client-side 404 views, causing Googlebot to treat missing or retired URLs as Soft 404s.
* **Fix:** Restricted rewrites to SPA endpoints (`/admin`, `/search`), prerendered a dedicated static `dist/404.html` with `<meta name="robots" content="noindex,nofollow">`, and set `trailingSlash: false` and `cleanUrls: true`.
* **Status:** Non-existent routes return true HTTP 404; obsolete scraper URLs return HTTP 410 Gone.

### 1.4 Legacy URL 301 & 410 Redirects
* Added 15 critical edge rules to `content/redirects.json` and generated 130 rules in `vercel.json`:
  - `301` from `/my-account` -> `/contact`
  - `301` from `/category-all.html` -> `/topics`
  - `301` from `/article-hubool-sitetok-saudi.html` -> `/what-is-cytotec`
  - `301` from `/cytotec-gulf-medical-information` -> `/medical-sources`
  - `301` from `/سايتوتك-2` -> `/what-is-cytotec`
  - `410` for legacy 2020-2021 Blogger/WordPress spam scrapers.

---

## 2. Performance & Core Web Vitals Optimization

### 2.1 Asset Code Splitting & Caching
* **Change:** Removed `viteSingleFile()` from `vite.config.ts`.
* **Result:** Separated HTML shell, vendor chunks, and styles into `dist/assets/index-*.js` and `dist/assets/index-*.css` with 1-year immutable caching (`max-age=31536000, immutable`), reducing HTML document size from 1.17 MB to 6 KB.

### 2.2 Image Asset Optimization
* Optimized the 3 approved permanent images via ImageMagick with optimal compression and WebP/PNG formats:
  - `public/images/لوجو.png`: Reduced from 1,223 KB to 40 KB (96.7% reduction).
  - `public/images/Bannerrr.png`: Reduced from 1,602 KB to 313 KB (80.5% reduction).
  - `public/images/saudiersaa-social-share.png`: Reduced from 1,614 KB to 295 KB (81.7% reduction).
* **Total Image Footprint:** Dropped from 4.44 MB to 648 KB while preserving exact dimensions and passing strict image integrity audits.

### 2.3 Font Optimization
* Consolidated font loading in `index.html` and `src/index.css` from 4 font families (15 weights) to a single modern Arabic font family: **IBM Plex Sans Arabic** (weights: 400, 500, 600, 700) with `display=swap`, eliminating FOUT/CLS.

---

## 3. SEO Architecture, Content & E-E-A-T Enhancements

### 3.1 Content Consolidation (Cannibalization Merges)
* **Merge 1:** `/blog/liver-kidney-considerations` merged into `/blog/contraindications-misoprostol` with 301 redirect. Clinical points on hepatic clearance and renal clearance integrated into the contraindications guide.
* **Merge 2:** `/blog/who-clinical-references` merged into `/blog/official-drug-leaflets` with 301 redirect. Institutional guidelines on WHO Essential Medicines List integrated into the official leaflets guide.

### 3.2 New Pillar Article
* Created comprehensive hospital-alternative guide: **`/blog/cytotec-alternatives-saudi`** ("بدائل سايتوتك الطبية في المستشفيات السعودية: الخيارات العلاجية المعتمدة وتحت الإشراف الطبي").
* Covers approved gastric ulcer alternatives (Proton Pump Inhibitors: Omeprazole, Esomeprazole, Pantoprazole; H2 blockers) and licensed hospital obstetric protocols (Oxytocin, Dinoprostone, MVA), emphasizing patient safety and Ministry of Health (937) referral pathways.

### 3.3 Internal Link Graph & Contextual Anchors
* Enabled markdown contextual link parsing `[anchor](url)` in `src/components/ContentBlocks.tsx`.
* Validated 0 broken internal links across the entire catalog of 95 articles.

### 3.4 Schema Markup & E-E-A-T Hardening
* Added valid `image` array to Article JSON-LD referencing `https://saudiersaa.com/images/saudiersaa-social-share.png`.
* Removed non-functional `potentialAction: SearchAction` from `Home.tsx` to prevent search schema warnings.
* Maintained honest medical disclaimer stance: zero dosage instructions, zero sales links, preserved legacy clinic telephone (`00966599287172` - Dr. Haitham Al-Khatib) alongside official WhatsApp triage line (`00966530945626`).

### 3.5 Backlink Disavow Registry
* Created `docs/disavow.txt` containing 28 toxic domains covering legacy scraper blogs, PBN syndicates, and black-market competitor sites targeting the domain.

### 3.6 Security Headers
* Hardened edge response headers in `vercel.json`:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy`: enforced strict sources with fonts/images allowlisted and `form-action 'self' mailto:`.

---

## 4. Verification & Audit Results

| Audit Suite | Command | Result |
|---|---|---|
| **Build & Typecheck** | `npm run build && npm run typecheck` | **PASS** (0 errors, 0 warnings) |
| **Rendered HTML Verification** | `node scripts/verifyRendered.mjs` | **PASS** (214/214 checks green) |
| **SEO Audit** | `node scripts/auditSeo.mjs` | **PASS** (8/8 checks green) |
| **Article Indexability** | `node scripts/auditIndexability.mjs` | **PASS** (128 sitemap URLs, 0 noindex leaks) |
| **Image Asset Integrity** | `node scripts/auditImages.mjs` | **PASS** (3/3 approved assets resolve) |
| **Architecture & Cannibalization**| `node scripts/auditArchitecture.mjs` | **PASS** (0 blockers, 0 orphans) |
| **Prerender Audit** | `node scripts/auditPrerender.mjs` | **PASS** (10/10 checks green) |
| **WhatsApp Compliance** | `node scripts/auditWhatsApp.mjs` | **PASS** (11/11 checks green) |
| **Green Brand Identity** | `node scripts/auditGreenIdentity.mjs` | **PASS** (9/9 checks green) |
| **Legacy Clinic Phone** | `node scripts/auditLegacyClinic.mjs` | **PASS** (27/27 checks green) |
| **UI Workflow Tests** | `npm run test:ui` | **PASS** (All UI and Flow checks green) |
