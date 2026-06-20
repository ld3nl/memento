# SEO Audit Report: Memento Mori Life Calendar

**Site:** https://memento-mori.vercel.app
**Type:** Web Application (Lifestyle Tool)
**Audit Date:** June 19, 2026
**Framework:** Next.js 16.2.9 + React 19.2.7 + Tailwind 4.3.1

---

## Executive Summary

**Overall Health:** **Good** (Estimated Score: 82/100)

The app has strong technical foundations — proper metadata on every route, structured data (WebApplication, FAQPage, Article, BreadcrumbList), canonical tags, an XML sitemap with dynamic routes, and a clean robots.txt. Previous critical issues (missing canonicals, broken robots rewrite, thin dynamic pages) have been resolved.

Remaining work is primarily around **analytics misconfiguration, semantic HTML fixes, performance optimisation, missing error boundaries, and content expansion**.

### Top 5 Priority Issues

1. **🔴 GTM ID misconfigured** — `G-` prefix used with `GoogleTagManager` (should be `GTM-` or use `GoogleAnalytics`)
2. **🔴 Nested `<main>` elements** — layout.tsx wraps children in `<main>`, about page has its own `<main>`
3. **🟡 Artificial 500 ms delay** on both dynamic routes hurts TTFB
4. **🟡 No custom error pages** — missing `not-found.tsx`, `error.tsx`, `global-error.tsx`
5. **🟡 OG image hosted externally** — relying on utfs.io; no local fallback or generated OG image

### Quick Wins

- Fix GTM → `GoogleAnalytics` component swap (1 line)
- Remove `<main>` from about page (nested landmark)
- Delete `public/manifest.json` (superseded by `app/manifest.ts`)
- Remove artificial `setTimeout(500)` on dynamic routes

---

## Previous Audit — Status Tracker

| # | Issue | Status |
|---|-------|--------|
| 1 | Missing canonical tags | ✅ Fixed — all pages now have `alternates.canonical` |
| 2 | Robots.txt rewrite misconfigured | ✅ Fixed — rewrite removed, using `app/robots.ts` |
| 3 | Sitemap missing dynamic routes | ✅ Fixed — 9 sample birth years × 2 views = 18 dynamic URLs |
| 4 | No structured data on About page | ✅ Fixed — Article JSON-LD added |
| 5 | GTM misconfigured (`G-` vs `GTM-`) | ❌ **Still broken** — see §1 below |
| 6 | Meta descriptions not compelling | ✅ Fixed — emotional hooks added |
| 7 | Missing breadcrumb navigation | ✅ Fixed — BreadcrumbList JSON-LD on `[...params]` route |
| 8 | Manifest.json missing fields | ✅ Fixed — full PWA manifest via `app/manifest.ts` |
| 9 | Thin content on dynamic pages | ✅ Partially fixed — contextual stats on `[...params]` route |
| 10 | Missing H1 on calendar pages | ✅ Fixed — unique H1 on every page |
| 11 | Homepage keyword targeting | ✅ Improved — keywords array in layout metadata |
| 12 | No blog/content hub | ❌ Not started — empty `app/api/blog/` directory |
| 13 | Limited internal linking | ✅ Partially fixed — Footer has 4 nav links |

---

## New Findings

### 🔴 Critical Issues

#### 1. Google Analytics / Tag Manager Misconfigured

**Impact:** High — analytics data may not be tracking
**Evidence:** `app/layout.tsx` line 201:
```tsx
<GoogleTagManager gtmId="G-CYT1S2EC6W" />
```
**Issue:** `GoogleTagManager` expects a `GTM-` prefixed ID. `G-CYT1S2EC6W` is a GA4 Measurement ID.
**Fix:**
```tsx
// Option A: Use the correct component for GA4
import { GoogleAnalytics } from '@next/third-parties/google'
<GoogleAnalytics gaId="G-CYT1S2EC6W" />

// Option B: If you have a real GTM container, use:
<GoogleTagManager gtmId="GTM-XXXXXXX" />
```
**Priority:** 1 — Immediate

---

#### 2. Nested `<main>` Landmark Elements

**Impact:** Medium-High — invalid HTML, accessibility issue, confusing for screen readers
**Evidence:**
- `app/layout.tsx` line 197: `<main className="flex-1">{children}</main>`
- `app/about/page.tsx` line 79: `<main id="main-content" ...>`
**Issue:** Two nested `<main>` elements. The HTML spec requires exactly one `<main>` per page.
**Fix:** Change `about/page.tsx` to use `<div>` or `<section>` instead of `<main>`:
```tsx
// app/about/page.tsx — change <main> to <div>
<div
  id="main-content"
  aria-label="About page content"
  className="mx-auto w-full max-w-prose ..."
>
```
**Priority:** 1 — Immediate

---

### 🟡 High-Impact Issues

#### 3. Artificial 500 ms Delay on Dynamic Routes

**Impact:** High — directly increases TTFB by 500 ms on every calendar page load
**Evidence:**
- `app/[view]/page.tsx` line 78: `await new Promise((resolve) => setTimeout(resolve, 500))`
- `app/[view]/[...params]/page.tsx` line 77: identical
**Fix:** Remove both `setTimeout` calls. If a loading state is needed, use `loading.tsx` instead.
**Priority:** 2 — This week

---

#### 4. Missing Error Boundary Pages

**Impact:** Medium — poor UX for errors, missed SEO opportunity for custom 404
**Evidence:** No `not-found.tsx`, `error.tsx`, `global-error.tsx`, or `loading.tsx` files exist anywhere in `app/`.
**Fix per Next.js best practices:**
- `app/not-found.tsx` — custom 404 with internal links (recaptures lost traffic)
- `app/error.tsx` — client error boundary with retry
- `app/global-error.tsx` — root error handler (must include own `<html>` and `<body>`)
- `app/loading.tsx` — loading skeleton (replaces artificial setTimeout)
**Priority:** 2 — This week

---

#### 5. OG Image Hosted on External CDN

**Impact:** Medium — if utfs.io is slow or unavailable, social shares show no image
**Evidence:** All OG images reference `https://utfs.io/f/vfxFGWyJBql9...`
**Fix options:**
1. **Local static OG image:** Save the image to `public/og-image.jpg` and reference `/og-image.jpg`
2. **Generated OG image:** Create `app/opengraph-image.tsx` using `next/og` ImageResponse (recommended by Next.js best practices for dynamic pages)
**Priority:** 2 — This week

---

#### 6. Duplicate Manifests with Conflicting Theme Colors

**Impact:** Low-Medium — browser confusion, inconsistent PWA install experience
**Evidence:**
| Source | theme_color | background_color |
|--------|-------------|------------------|
| `app/manifest.ts` | `#EF4444` (red) | `#0A0908` |
| `public/manifest.json` | `#a855f7` (purple) | `#000000` |
| `viewport.themeColor` | `#0D0C0B` (black) | — |

**Fix:**
1. Delete `public/manifest.json` — it's superseded by `app/manifest.ts`
2. Align `theme_color` across manifest and viewport (use accent red `#dc2626` or the dark bg `#0D0C0B`)
**Priority:** 3 — Quick win

---

#### 7. No Security Headers

**Impact:** Medium — no CSP, X-Frame-Options, or HSTS configured
**Evidence:** Neither `vercel.json` nor `next.config.ts` define security headers.
**Fix:** Add headers to `next.config.ts`:
```ts
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ]
},
```
**Priority:** 3 — This month

---

### 🟢 Medium/Low-Impact Issues

#### 8. `<details>` Content May Not Be Indexed

**Impact:** Low-Medium
**Evidence:** Homepage "How it works" section is inside `<details>` (collapsed by default).
**Issue:** Google says it indexes content in collapsed `<details>`, but field data suggests it may receive lower weight.
**Fix:** Consider making this content always visible, or duplicate the key phrases elsewhere on the page.
**Priority:** 4 — Low

---

#### 9. About Page Hero Image Not Prioritised

**Impact:** Low-Medium — affects LCP on about page
**Evidence:** `app/about/page.tsx` line 91: `priority={false}`
**Fix:** Set `priority={true}` on the hero image (it's the largest contentful paint element on that page).
**Priority:** 4 — Quick win

---

#### 10. Font Weight Over-loading

**Impact:** Low — increases font download size
**Evidence:** `lib/fonts.ts` — EB_Garamond loads weights `['400','500','600','700','800']`
**Fix:** Audit which weights are actually used. Likely only `400` (normal) and `700` (bold) are needed. Remove unused weights to reduce font file size.
**Priority:** 5 — Low

---

#### 11. `lastModified: new Date()` in Sitemap

**Impact:** Low — gives Google incorrect modification signals
**Evidence:** `app/sitemap.tsx` always returns the current timestamp for `lastModified`.
**Fix:** Use actual content modification dates:
```ts
// Static routes
{ url: baseUrl, lastModified: new Date('2026-06-19'), ... }
// Dynamic routes — omit lastModified or use a fixed recent date
```
**Priority:** 5 — Low

---

#### 12. JSON-LD Serialisation Inconsistency

**Impact:** Low — both approaches work, but inconsistency is a code smell
**Evidence:**
- `app/page.tsx` uses `{serializedJsonLd}` as text children of `<script>`
- `app/about/page.tsx` and `app/[view]/[...params]/page.tsx` use `dangerouslySetInnerHTML`
**Fix:** Standardise on `dangerouslySetInnerHTML` (the Next.js convention) across all pages.
**Priority:** 5 — Low

---

#### 13. `[view]/page.tsx` H1 Uses `font-serif` Instead of `font-display`

**Impact:** Low — visual inconsistency, not directly SEO
**Evidence:** `app/[view]/page.tsx` line 102: `font-serif` vs the rest of the app using `font-display`
**Fix:** Change to `font-display` for consistency.
**Priority:** 5 — Low

---

#### 14. Placeholder Dark Color Token

**Impact:** None (code quality)
**Evidence:** `styles/globals.css`: `--color-PLACEHOLDER_DARK_COLOR: #171514;`
**Fix:** Remove if unused, or replace with a semantically named token.
**Priority:** 5 — Cleanup

---

## Content Strategy Recommendations

### Blog / Content Hub (Long-term, High-value)

The `app/api/blog/` directory exists but is empty. A content hub targeting informational queries would significantly expand organic reach.

**Recommended articles:**
- "What is Memento Mori? A Complete Guide to the Stoic Practice"
- "Your Life in Weeks: The Psychology of Time Visualisation"
- "How to Use a Life Calendar for Goal Setting and Prioritisation"
- "Famous Stoics and Their Views on Mortality"
- "Memento Mori vs Other Life Calendars — What Makes This Different"

**Target keywords:**
- `memento mori meaning` (high volume)
- `life in weeks` (medium volume)
- `stoic philosophy tools` (low competition)
- `life calendar calculator` (buying intent)
- `visualize life expectancy` (informational)

---

### Internal Linking Improvements

Current internal links: Homepage ↔ About, Footer → 4 links. This is minimal.

**Recommendations:**
- Add "Try it yourself" CTAs on About page → homepage
- Cross-link table/burst views ("See this in burst view" / "See this as a table")
- Add related-age links on dynamic pages ("See age 30 | 40 | 50")
- About page → link to specific example calendars

---

### AI Search Optimisation (llms.txt)

**Current:** `public/llms.txt` exists but is a single line.
**Recommendation:** Expand to include:
- Clear tool description
- Usage instructions
- Key features
- Link to `llms-full.txt` for comprehensive info

---

## Technical Checklist — What's Working Well

| Area | Status | Notes |
|------|--------|-------|
| `lang="en"` on `<html>` | ✅ | Correct |
| Title template (`%s \| Memento Mori`) | ✅ | Good pattern |
| Unique titles per page | ✅ | All pages have distinct titles |
| Meta descriptions | ✅ | Compelling, keyword-rich |
| Canonical tags | ✅ | On all pages via `alternates.canonical` |
| Open Graph tags | ✅ | Full OG on all pages |
| Twitter Card tags | ✅ | `summary_large_image` on all pages |
| JSON-LD structured data | ✅ | WebApplication, FAQPage, Article, BreadcrumbList |
| Robots.txt | ✅ | Proper Next.js convention |
| XML Sitemap | ✅ | Static + 18 dynamic URLs |
| Google Site Verification | ✅ | Token present |
| Viewport meta | ✅ | Mobile-first, allows zoom |
| `next/font` with `display: swap` | ✅ | Zero layout shift |
| `next/image` throughout | ✅ | Optimised images |
| Hero image `priority` | ✅ | On homepage Form component |
| Semantic HTML | ✅ | `<article>`, `<section>`, `<nav>` with `aria-label` |
| PWA manifest | ✅ | Full `app/manifest.ts` |
| HTTPS | ✅ | Vercel default |
| Clean URL structure | ✅ | `/table/YYYY/MM/DD`, `/burst/YYYY/MM/DD` |
| AI SEO (llms.txt) | ✅ | Present (could be expanded) |
| `formatDetection` | ✅ | Prevents unwanted phone/email linking |

---

## Prioritised Action Plan

### 🔴 Immediate (Do Now)

| # | Task | Effort |
|---|------|--------|
| 1 | Fix GTM → `GoogleAnalytics` component | 5 min |
| 2 | Fix nested `<main>` on about page | 5 min |
| 3 | Delete `public/manifest.json` | 1 min |
| 4 | Remove `setTimeout(500)` from both dynamic routes | 2 min |

### 🟡 This Week

| # | Task | Effort |
|---|------|--------|
| 5 | Create `not-found.tsx` with branded 404 + internal links | 30 min |
| 6 | Create `error.tsx` and `global-error.tsx` | 30 min |
| 7 | Create `loading.tsx` skeleton | 15 min |
| 8 | Add local OG image or `opengraph-image.tsx` | 1 hr |
| 9 | Align theme_color across manifest + viewport | 10 min |
| 10 | Set `priority={true}` on About hero image | 1 min |

### 🟢 This Month

| # | Task | Effort |
|---|------|--------|
| 11 | Add security headers to `next.config.ts` | 15 min |
| 12 | Standardise JSON-LD serialisation pattern | 15 min |
| 13 | Fix sitemap `lastModified` dates | 10 min |
| 14 | Trim EB_Garamond font weights | 10 min |
| 15 | Expand `llms.txt` for better AI search visibility | 30 min |
| 16 | Clean up `--color-PLACEHOLDER_DARK_COLOR` token | 5 min |
| 17 | Add cross-view links on dynamic pages | 1 hr |

### 🔵 Long-Term (1–3 Months)

| # | Task | Effort |
|---|------|--------|
| 18 | Build `/blog` section with educational content | 1–2 weeks |
| 19 | Create comparison pages (life calendar alternatives) | 2–3 days |
| 20 | Add `generateStaticParams` for most popular calendar URLs | 2 hrs |
| 21 | Dynamic import three.js for burst view (`ssr: false`) | 1 hr |
| 22 | Consider `opengraph-image.tsx` with dynamic age-based OG images | 2 hrs |

---

## Validation Tools

| Tool | URL | Use |
|------|-----|-----|
| Google Search Console | https://search.google.com/search-console | Indexation, coverage, CWV |
| Rich Results Test | https://search.google.com/test/rich-results | Validate JSON-LD schema |
| PageSpeed Insights | https://pagespeed.web.dev/ | Core Web Vitals |
| Schema Validator | https://validator.schema.org/ | JSON-LD syntax |
| Lighthouse | Chrome DevTools | Full audit |

---

**Estimated Impact:** Fixing the immediate items (GTM, nested main, artificial delay) should improve data tracking and TTFB. Adding error boundaries and OG images improves user experience and social sharing. The blog/content hub is the highest-value long-term investment for organic traffic growth (est. 50–150% increase within 3–6 months).
