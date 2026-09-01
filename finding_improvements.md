# Memento Mori — repository audit

**Date:** 2026-08-30  
**Scope:** Read-only, repository-wide. Application source was not modified.  
**Stack (verified from `node_modules/*/package.json` and CLI, not assumed from ranges):**

| Package / tool | Installed | Declared in `package.json` |
|---|---|---|
| `react` / `react-dom` | **19.2.8** | `^19.2.8` |
| `next` | **16.3.3** | `^16.3.3` |
| `tailwindcss` / `@tailwindcss/postcss` | **4.3.3** | `^4.3.3` |
| `typescript` | **7.0.2** | `7.0.2` (pinned) |
| `@types/react` | **19.2.18** | `19.2.18` |
| `@types/react-dom` | **not installed** | — |
| Node | **v22.18.0** | engines `>=22.13.0` |
| Bun | **1.4.0** | engines `>=1.3.5`; `packageManager`: `bun@1.2.2` |

**Checks run (non-destructive):** filesystem inspection, grep, reading source and configs, `bun pm ls`, `tsc --version`, prior `bun format && bunx tsc --noEmit` and `bun run build` (pass as of this audit), homepage/about/table/burst page loads on local `next dev`. **Not run:** PageSpeed Insights / CrUX, Search Console, production security headers from the live host, full Jest/Cypress suites in this session.

**Legend:** **Defect** = verified mismatch with shipped code or official API contracts. **Suggestion** = best-practice improvement with evidence, not a runtime failure.

---

## Executive summary

This is a small, well-structured Next.js App Router product: a birthdate form, a week-grid “life table,” and a Three.js burst view, with real SEO metadata, JSON-LD, sitemap/robots/manifest, and a useful unit-test layer in `lib/`. The stack versions match what the team claimed (React 19.2.8, Next 16.3.3, Tailwind 4.3.3).

The highest-impact issues are not framework choice. They are **self-inflicted latency** (a 500ms `setTimeout` on every calendar route), **analytics mis-wiring** (GA4 `G-` ID passed to `GoogleTagManager`), **missing App Router error/404 files**, **TypeScript `strict: false`**, **test selectors that no longer exist**, and **DOM/accessibility scale** on the 80-year × 52-week grid. Several features (Popover, ViewToggle, `?name=`) are implemented but not connected to the live calendar.

The product is close to a clean static/personal tool. Tightening type safety, deleting dead routes/delays, fixing GTM vs GA, and adding `error.tsx` / `not-found.tsx` would raise quality more than any new dependency.

**Top priorities**

1. Remove the 500ms artificial delay on view routes (LCP/TTFB).  
2. Use `GoogleAnalytics` with `G-CYT1S2EC6W` or a real `GTM-` container.  
3. Add `app/error.tsx`, `app/not-found.tsx`, and optionally `app/global-error.tsx`.  
4. Restore Tailwind `@theme` so `font-display` / `text-primary` / `text-accent` actually resolve.  
5. Enable TypeScript `strict` (or at least `strictNullChecks`).  
6. Align Cypress/Jest selectors (`data-cy=age`, `bg-black`) with the current UI.

---

## Strengths worth preserving

- **Correct App Router metadata.** Root `layout.tsx` uses the Metadata API (`title.template`, Open Graph, Twitter, robots, icons, `metadataBase`). Pages add `generateMetadata` / static `metadata` rather than manual `<head>` tags.  
  Source: [Next.js Metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images).
- **Fonts via `next/font/google`** with CSS variables (`--font-display`, `--font-body`, `--font-mono`) and `display: "swap"`. Matches [Next.js font optimization](https://nextjs.org/docs/app/api-reference/components/font).
- **Images use `next/image`**, not raw `<img>`, including remote `utfs.io` via `images.remotePatterns`.
- **Tailwind v4 setup is current:** `@import "tailwindcss"` in `app/globals.css` and `@tailwindcss/postcss` in `postcss.config.js`. Matches [Tailwind v4 PostCSS install](https://tailwindcss.com/docs/installation/using-postcss).
- **Async `params`:** view pages type `params: Promise<...>` and `await params`. Matches Next.js 15+ / 16 contract: [async dynamic APIs](https://nextjs.org/docs/messages/sync-dynamic-apis).
- **Form a11y basics exist:** `htmlFor` labels, `aria-invalid`, `aria-describedby`, `role="alert"` on field errors, 48px+ input height (`LabeledInput.tsx`).
- **BurstScene respects `prefers-reduced-motion`** via `useSyncExternalStore` (`usePrefersReducedMotion.ts`).
- **Unit tests around date/URL/life-table math** in `lib/*.test.ts` and component tests under `components/**`.
- **JSON-LD on home** serializes with `JSON.stringify(jsonLd).replace(/</g, "\\u003c")` — the correct XSS-safe pattern for JSON in HTML.
- **Production build compiles** (Next 16.3.3 Turbopack) after the globals.css move and LightningCSS `@position-try` workaround.

---

## Findings by category

### 1. Architecture, routing, and rendering

#### F1 — Artificial 500ms delay on calendar routes  
**Type:** Defect  
**Location:** `app/[view]/page.tsx:77-78`, `app/[view]/[...params]/page.tsx:76-77`  
**Evidence:**

```ts
// A small delay to simulate fetching or some async operations
await new Promise((resolve) => setTimeout(resolve, 500));
```

This runs **before** `notFound()` and **before** date parsing. There is no data fetch.  
**Why it matters:** Adds 500ms to TTFB and LCP on every `/table/...` and `/burst/...` request, including 404s for `/table` with no date. Conflicts with Core Web Vitals (LCP ≤ 2.5s) and Next’s guidance to avoid blocking the static shell.  
**Change:** Delete both delays. If a loading UI is desired, add `app/[view]/loading.tsx` (see F3).  
**Impact:** Immediate TTFB/LCP win on the heaviest pages.  
**Effort:** XS  
**Sources:** [Core Web Vitals](https://web.dev/articles/vitals), [Next.js loading UI](https://nextjs.org/docs/app/api-reference/file-conventions/loading).

#### F2 — Duplicate, nearly identical view pages  
**Type:** Defect (dead / confusing route) + maintainability  
**Location:** `app/[view]/page.tsx` vs `app/[view]/[...params]/page.tsx`  
**Evidence:** `[view]/page.tsx` reads `awaitedParams?.params` but that segment has **no** `params` catch-all, so `urlDateParam` is always `""`, `isValidDate` fails, and the page always `notFound()` after the 500ms wait. The real UI lives in `[...params]/page.tsx` (different heading, JSON-LD, BurstScene `itemSizeRem`). Hidden `ViewToggle` with `onViewChange={() => {}}` is only on the dead page (`app/[view]/page.tsx:106-108`).  
**Why it matters:** Two sources of truth; `/table` and `/burst` 404 slowly; BurstScene sizing already diverges (`0.15` vs `0.25` rem).  
**Change:** Delete `app/[view]/page.tsx` or make it redirect to `/` / a date picker. Keep a single page module under `[...params]` (or a shared `ViewScreen` imported by both).  
**Impact:** Less drift, faster 404s.  
**Effort:** S  
**Sources:** [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure).

#### F3 — No `error.tsx`, `not-found.tsx`, `global-error.tsx`, `loading.tsx`  
**Type:** Defect vs App Router conventions  
**Location:** `app/` (files absent; `notFound()` is called from view pages)  
**Evidence:** Repo-wide search for those filenames returns nothing. View pages call `notFound()` (`app/[view]/[...params]/page.tsx:85-95`). Users get the default Next 404/error UI.  
**Why it matters:** Official error-handling model for Next 16 is file-based boundaries. BurstScene/Three can throw; uncaught errors have no branded recovery.  
**Change:** Add `app/not-found.tsx`, `app/error.tsx` (`'use client'`, `retry()`), and `app/global-error.tsx` with its own `<html>`/`<body>`. Optional `loading.tsx` only if remaining work is actually async.  
**Impact:** Recoverable failures; on-brand 404s.  
**Effort:** S  
**Sources:** [Next.js error handling](https://nextjs.org/docs/app/getting-started/error-handling) (docs dated 2026-06-10, v16.3.3).

#### F4 — `ViewToggle` and `Popover` are unused in production routes  
**Type:** Suggestion (dead product surface)  
**Location:** `components/ViewToggle.tsx`; `components/PopOver/index.tsx`; only imported from stories and the hidden block in F2. Grep: `Popover` is imported only from `PopOver.stories.tsx`.  
**Why it matters:** Calendar users cannot switch table ↔ burst without footer example links. Weeks are 8×8px `div`s with `title` only (`Week.tsx`), not the accessible popover already built.  
**Change:** Either wire `ViewToggle` as `<Link href={otherViewUrl}>` (URL is the state) and wrap weeks in `Popover`, or delete/stop shipping unused CSS (`.popover-*` in `globals.css`).  
**Impact:** Completes the feature or shrinks CSS/JS.  
**Effort:** M  
**Sources:** [Next.js `<Link>`](https://nextjs.org/docs/app/api-reference/components/link); URL-as-state in Vercel Web Interface Guidelines.

#### F5 — `?name=` is written but never read  
**Type:** Defect (incomplete feature)  
**Location:** `lib/url-utils.ts:18-22` (`encodeURIComponent` name query); view pages never call `extractNameFromUrl` / never take `searchParams`.  
**Why it matters:** Bookmarkable “name” is dropped after navigation. `extractNameFromUrl` is dead.  
**Change:** Await `searchParams` on the view page and pass `name` into heading/JSON-LD, **or** stop appending `?name=` in `generateLifeTableUrl`.  
**Impact:** Honest URLs; less PII in query strings if you drop it.  
**Effort:** S  
**Sources:** [Next.js `searchParams`](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional).

#### F6 — Empty `app/api/blog/`  
**Type:** Suggestion  
**Location:** `app/api/blog/` (directory exists, no `route.ts` in listing)  
**Why it matters:** Implies an API that is not implemented; confuses routing and future `page.tsx`/`route.ts` conflicts.  
**Change:** Remove the empty folder or add a real `route.ts`.  
**Effort:** XS  
**Sources:** [Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route).

---

### 2. Server / Client Component boundaries

#### F7 — Entire life table is a Client Component tree  
**Type:** Suggestion (architecture)  
**Location:** `"use client"` on `LifeTable.tsx`, `DecadeGrid.tsx`, `YearGrid.tsx`, `Week.tsx`. Server page only passes `dob: Date`.  
**Evidence:** `LifeTable` does not use hooks except through children. `DecadeGrid` calls `useTransition` but never `startTransition` (`DecadeGrid.tsx:17`, `isPending` always false → `"Loading..."` never shows). `Week` is presentational.  
**Why it matters:** ~80 years × 52 weeks ≈ **4,160** client components hydrate (`YEARS_IN_LIFETIME=8` × `DECADE_LENGTH=10` × 52). That is the INP risk, not the Server Component page. [Vercel: minimize client JS](https://github.com/vercel-labs/agent-skills/blob/main/skills/vercel-react-best-practices).  
**Change:** Render `YearGrid`/`Week` as Server Components (no `'use client'`). Keep client only where events exist (Form, BurstScene, Popover). Remove unused `useTransition`.  
**Impact:** Less hydration, better INP.  
**Effort:** M  
**Sources:** [React Server Components](https://react.dev/reference/rsc/server-components); [Vercel bundle / client boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components).

#### F8 — BurstScene always in the calendar JS graph  
**Type:** Suggestion  
**Location:** `app/[view]/[...params]/page.tsx:145-151` imports `BurstScene` statically; no `next/dynamic`.  
**Why it matters:** Table view still pulls `@react-three/fiber` + `three@0.185.1` into the route module graph unless the bundler splits perfectly on the ternary. Three.js is large.  
**Change:**

```tsx
const BurstScene = dynamic(
  () => import("../../../components/BurstScene/BurstScene").then((m) => m.BurstScene),
  { ssr: false, loading: () => <p>Loading visualization…</p> },
);
```

**Impact:** Smaller table-view JS.  
**Effort:** S  
**Sources:** [next/dynamic](https://nextjs.org/docs/app/guides/lazy-loading); Vercel `bundle-dynamic-imports`.

#### F9 — React Compiler is installed but effectively off  
**Type:** Suggestion  
**Location:** `next.config.ts:3-5` `reactCompiler: { compilationMode: "annotation" }`; only `"use no memo"` appears (`Form.tsx:2`); no `"use memo"`. Dependency `babel-plugin-react-compiler@1.0.0`.  
**Evidence:** [React Compiler `compilationMode: 'annotation'`](https://react.dev/reference/react-compiler/compilationMode) compiles **only** functions marked `"use memo"`.  
**Why it matters:** Compiler cost/config with zero compiled components. Form explicitly opts out.  
**Change:** Switch to default/`infer` mode for React 19, or add `"use memo"` to hot client leaves (`Week`, `YearGrid`). Remove `"use no memo"` unless a measured compiler bug remains.  
**Impact:** Automatic memoization on the 4k-week tree.  
**Effort:** S–M  
**Sources:** [React Compiler configuration](https://react.dev/reference/react-compiler/configuration) (fetched 2026-08-30).

#### F10 — `cacheComponents` / `'use cache'` unused  
**Type:** Suggestion (not a defect; this app has almost no IO)  
**Location:** `next.config.ts` has no `cacheComponents: true`.  
**Why it matters:** Next 16.3 documents `'use cache'` as the Cache Components path ([docs lastUpdated 2026-08-25](https://nextjs.org/docs/app/api-reference/directives/use-cache)). This app computes locally; enabling cacheComponents is optional. The 500ms delay (F1) is the real caching/perf bug.  
**Change:** Do not enable Cache Components just to look modern. After removing the delay, pages can stay dynamically rendered from `params`.  
**Effort:** —  
**Sources:** [use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache).

---

### 3. TypeScript safety

#### F11 — `strict: false` on app tsconfig; Cypress is `strict: true`  
**Type:** Defect vs project quality bar  
**Location:** `tsconfig.json:7` `"strict": false`; `cypress/tsconfig.json` `"strict": true`. Tests excluded (`exclude` of `**/*.test.ts`).  
**Why it matters:** TypeScript 7.0.2 is installed but the app opts out of the checks that justify the upgrade. Client props like `dob: Date` crossing the RSC boundary are unchecked for null.  
**Change:** Enable `strict` (or incrementally `strictNullChecks`, `noImplicitAny`). Keep test tsconfig aligned.  
**Impact:** Catches F5-style unused params, invalid dates, and CSS type clashes (already seen with `positionTryOrder`).  
**Effort:** M  
**Sources:** [TSConfig `strict`](https://www.typescriptlang.org/tsconfig/#strict).

#### F12 — Missing `@types/react-dom`  
**Type:** Suggestion  
**Location:** `node_modules/@types/react-dom` not present.  
**Why it matters:** React 19 ships types in `react`, but `react-dom` APIs (`createRoot`, `hydrateRoot`) still often need `@types/react-dom` depending on tooling. Cypress mount types may paper over this.  
**Change:** Add `@types/react-dom` matching 19.2.x if `tsc` starts reporting `react-dom` module issues under `strict`.  
**Effort:** XS  
**Sources:** [React TypeScript](https://react.dev/learn/typescript).

---

### 4. Styling consistency (Tailwind 4.3.3)

#### F13 — Dual formatters with conflicting quote rules  
**Type:** Defect (DX inconsistency)  
**Location:** `biome.json` `javascript.formatter.quoteStyle: "single"`, `semicolons: "asNeeded"`; `package.json` scripts use **Prettier** for `format` (`prettier --check .`) and Biome for `lint`.  
**Why it matters:** `bun format` (Prettier) and `biome check` can disagree. Contributors will ping-pong quotes.  
**Change:** Pick one formatter. If Prettier stays the CI format gate, set `"formatter": { "enabled": false }` in Biome (lint-only).  
**Impact:** Stable `format` / `check` scripts.  
**Effort:** XS  
**Sources:** [Biome formatter](https://biomejs.dev/formatter/); [Prettier](https://prettier.io/docs/en/index.html).

#### F14 — `clsx` + `tailwind-merge` still in `dependencies` while `cn` is `cnfast`  
**Type:** Defect (dependency hygiene)  
**Location:** `lib/utils.ts` is `export { cn } from "cnfast"`; no source imports `clsx` or `tailwind-merge`. Both remain in `package.json` dependencies.  
**Why it matters:** Extra install surface; lockfile noise.  
**Change:** Remove unused `clsx` and `tailwind-merge` after confirming no transitive API use.  
**Effort:** XS

#### F15 — `@position-try` avoided because of LightningCSS 1.32  
**Type:** Suggestion (documented workaround; keep)  
**Location:** `app/globals.css:69-86`  
**Evidence:** Comment correctly states Next 16.3 Turbopack / LightningCSS 1.32 rejects `@position-try`. Installed npm `lightningcss` is **1.32.0**. Upstream added parsing in lightningcss later (PR #1238, May 2026).  
**Change:** Keep `<position-area>` fallbacks until Next bundles a LightningCSS that parses `@position-try`. Do not reintroduce the at-rule without a canary Next upgrade.  
**Sources:** [MDN `@position-try`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@position-try); [parcel-bundler/lightningcss#1238](https://github.com/parcel-bundler/lightningcss/pull/1238).

#### F16 — Autoprefixer with Tailwind 4  
**Type:** Suggestion  
**Location:** `postcss.config.js` includes `autoprefixer`; Tailwind 4’s LightningCSS already prefixes.  
**Why it matters:** Redundant PostCSS pass; possible double-processing.  
**Change:** Follow current Tailwind 4 PostCSS guide: `@tailwindcss/postcss` only, unless a specific prefix gap is measured.  
**Effort:** XS  
**Sources:** [Tailwind v4 PostCSS](https://tailwindcss.com/docs/installation/using-postcss).

---

### 5. Accessibility

#### F17 — Nested `<main>` on About  
**Type:** Defect  
**Location:** `app/layout.tsx:197` `<main className="flex-1">{children}</main>`; `app/about/page.tsx:79-82` another `<main id="main-content">`.  
**Why it matters:** One main landmark per page (HTML / APG). Nested mains confuse skip navigation and SR “main” lists.  
**Change:** Keep a single `<main>` in the root layout; About should use `<article>` only (it already wraps content in `<article>`).  
**Effort:** XS  
**Sources:** [WAI landmark roles](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/main.html).

#### F18 — No skip link  
**Type:** Suggestion  
**Location:** `app/layout.tsx` — no “Skip to content” link. About has `id="main-content"` but home/table do not share it consistently.  
**Change:** First focusable element: `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>` and put `id="main-content"` on the one `<main>`.  
**Effort:** XS  
**Sources:** Vercel Web Interface Guidelines (fetched 2026-08-30); WCAG 2.4.1.

#### F19 — Back button hidden on small viewports  
**Type:** Defect  
**Location:** `components/BackButton.tsx:12` `hidden ... md:flex`.  
**Why it matters:** Mobile users (the viewport config is mobile-first) have no in-app back control except the browser. Footer Home still exists, but the control advertised as “Go back” is gone below `md`.  
**Change:** Show it on all breakpoints; keep `print:hidden`.  
**Effort:** XS

#### F20 — Week cells are 8×8px non-interactive `div`s  
**Type:** Defect vs a11y + touch guidelines  
**Location:** `Week.tsx:21-41` `size-2` (8px), `title` for year labels, no `aria-label` for current week.  
**Why it matters:** WCAG 2.5.8 target size (24px CSS minimum for essential targets). `title` is not a reliable accessible name. 4,160 unlabeled boxes are a SR nightmare if they become buttons later.  
**Change:** Keep weeks decorative at the grid level (`role="img"` + one summary: “80-year calendar, N weeks lived”) **or** virtualize and use `Popover` with 24px+ hit area. Do not put 4k tabs in the a11y tree.  
**Effort:** M  
**Sources:** [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

#### F21 — Popover trigger is also `size-2` with `outline-none` (mitigated by `focus-visible:ring`)  
**Type:** Suggestion  
**Location:** `components/PopOver/index.tsx:111-123`  
**Evidence:** `outline-none` is paired with `focus-visible:ring-2` (acceptable). Hit area remains 8px. Component is unused in app routes (F4).  
**Change:** `min-h-6 min-w-6` (24px) before wiring into the grid.  
**Sources:** Web Interface Guidelines — never `outline-none` without replacement (already replaced).

#### F22 — Form checkbox hit target split  
**Type:** Suggestion  
**Location:** `Form.tsx:219-257` — checkbox and label are siblings; label does not wrap the control.  
**Why it matters:** Guidelines prefer one combined hit target. `htmlFor` is present, so this is usable, not broken.  
**Change:** Wrap input+text in one `<label>`.  
**Effort:** XS

#### F23 — Date input missing `autocomplete`  
**Type:** Suggestion  
**Location:** `LabeledInput` has `name={field.name}` (`date` / `name`) but no `autoComplete="bday"` / `"name"`.  
**Change:** Pass `autoComplete` through `LabeledInput`.  
**Sources:** [HTML autocomplete](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill); Web Interface Guidelines.

#### F24 — `html` `suppressHydrationWarning` unexplained  
**Type:** Suggestion  
**Location:** `app/layout.tsx:193`  
**Why it matters:** Masks real mismatches (dates, extensions). Footer `new Date().getFullYear()` is a Server Component — fine. If the warning is only for a theme script that does not exist, remove it.  
**Change:** Remove unless a documented extension/theme injector requires it.  
**Sources:** [React `suppressHydrationWarning`](https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors).

---

### 6. Security

#### F25 — Google Tag Manager given a GA4 measurement ID  
**Type:** Defect  
**Location:** `app/layout.tsx:201` `<GoogleTagManager gtmId="G-CYT1S2EC6W" />`  
**Evidence:** Official Next.js example uses `gtmId="GTM-XXXXX"` for GTM and `GoogleAnalytics gaId="G-XXXXX"` for GA4. [Next.js third-parties](https://nextjs.org/docs/app/getting-started/scripts) / skill scripts.md.  
**Why it matters:** GTM snippets load `gtm.js?id=GTM-...`. A `G-` ID will not load a GTM container; analytics may be silently dead (or load the wrong script). Also loads third-party JS on every page with no consent banner.  
**Change:** If this is GA4, use `<GoogleAnalytics gaId="G-CYT1S2EC6W" />`. If GTM, use a `GTM-` id. Add a privacy/cookie notice if the EU/UK is in scope (no privacy page exists — grep for `privacy`/`cookie` is empty).  
**Impact:** Working analytics + legal posture.  
**Effort:** S  
**Sources:** [Next.js `@next/third-parties` Google](https://nextjs.org/docs/app/guides/third-party-libraries).

#### F26 — JSON-LD via `dangerouslySetInnerHTML` without `<` escaping (About + view)  
**Type:** Defect (defense in depth; data is currently static)  
**Location:** `app/about/page.tsx:73-76`; `app/[view]/[...params]/page.tsx:128-131`  
**Evidence:** Home page **does** escape (`app/page.tsx:79`). About/view do not. `urlPath` is interpolated into JSON-LD from the URL.  
**Why it matters:** If a path segment ever contained `</script>`, it could break out of the script tag. Home already implements the fix.  
**Change:** Reuse one helper: `JSON.stringify(data).replace(/</g, "\\u003c")` everywhere. Prefer `id` on inline scripts if switching to `next/script`.  
**Effort:** XS  
**Sources:** [JSON-LD XSS](https://www.w3.org/TR/json-ld11/#security-considerations); Next inline script `id` requirement.

#### F27 — No security headers in repo  
**Type:** Suggestion (live Vercel headers **not probed** in this audit)  
**Location:** No `headers()` in `next.config.ts`; no `vercel.json` headers; no `proxy.ts`.  
**Change:** Confirm in Vercel dashboard or `curl -I`. If absent, add CSP (strict enough for GTM is hard), `Referrer-Policy`, `X-Content-Type-Options`, HSTS. Next 16 uses `proxy.ts` instead of `middleware.ts` for request interception.  
**Effort:** S  
**Sources:** [Next.js `proxy`](https://nextjs.org/docs/app/api-reference/file-conventions/proxy); [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/).

#### F28 — `localforage.clear()` fallback clears **all** `localStorage`  
**Type:** Defect  
**Location:** `lib/storage.ts:79-86` `localStorage.clear()` on forage failure.  
**Why it matters:** Wipes unrelated keys if forage throws.  
**Change:** Remove only `STORAGE_KEYS.FORM_DATA`.  
**Effort:** XS

#### F29 — Saved PII without expiry or notice  
**Type:** Suggestion  
**Location:** “Remember my information” stores `name` + `date` (`Form.tsx`, `FormStorage`). No privacy policy.  
**Change:** Document locally stored data; consider IndexedDB expiry; don’t put name in the query string (F5).  
**Effort:** S

---

### 7. Performance and Core Web Vitals

**Lab CWV (LCP/INP/CLS) from PageSpeed / CrUX: not collected.** Findings below are code-derived.

#### F30 — 4,160 DOM nodes on table view  
**Type:** Defect (scale)  
**Location:** `lib/constants.ts` `YEARS_IN_LIFETIME = 8`, `DECADE_LENGTH = 10` → 80 `YearGrid`s × 52 `Week`s. `YearGrid.tsx:20` `grid-cols-52` `w-208` (52rem).  
**Why it matters:** Large lists (>50) should virtualize or use `content-visibility` (Web Interface Guidelines; Vercel `rendering-content-visibility`). Horizontal overflow likely on phones (`w-208` ≈ 832px plus padding). INP risk from React reconciling thousands of nodes.  
**Change:** CSS `content-visibility: auto` on decade rows; or canvas/Burst for overview and paginate decades; or one `<canvas>`/`<svg>` for the grid. Test mobile overflow.  
**Impact:** INP, memory, mobile layout.  
**Effort:** M–L

#### F31 — Three Google font families, five Garamond weights  
**Type:** Suggestion  
**Location:** `lib/fonts.ts` EB_Garamond 400–800 + italic, Inter, JetBrains Mono.  
**Why it matters:** Font bytes compete with LCP (home H1 is display italic).  
**Change:** Subset weights actually used (likely 400/700 display, 400 body). Confirm `mono` usage; drop if unused.  
**Effort:** S  
**Sources:** [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts).

#### F32 — Home LCP image is remote (`utfs.io`)  
**Type:** Suggestion  
**Location:** `Form.tsx:143-150` `priority` + `loading="eager"` on 177×141 (displayed `w-32`–`w-44`). Layout OG image is a different utfs file.  
**Why it matters:** Extra connection; `priority` is correct for LCP but a local/static asset would be faster. Dev log also warned Ko-fi image width/height vs CSS (mitigated in `KofiButton` with `style={{ height: "auto", width: "auto" }}`).  
**Change:** Self-host the skull; keep `priority` on true LCP. Add `preconnect` to `utfs.io` only if remotes stay.  
**Effort:** S  
**Sources:** [next/image priority](https://nextjs.org/docs/app/api-reference/components/image#priority).

#### F33 — Footer `new Date().getFullYear()` in the root layout  
**Type:** Suggestion (low)  
**Location:** `components/Footer.tsx:6`  
**Why it matters:** Makes the root layout request-time dynamic if Next treats `Date` as dynamic (Cache Components / static rendering). Today, without `cacheComponents`, effect is small.  
**Change:** Hardcode year, or `connection()`-aware pattern, or a build-time constant.  
**Effort:** XS

#### F34 — Webpack `watchOptions` only  
**Type:** Suggestion  
**Location:** `next.config.ts:16-27` empty `turbopack: {}` plus webpack ignore for Cypress snapshots. Dev uses Turbopack (`next dev` log: Turbopack).  
**Why it matters:** Cypress watch-loop fix may not apply to Turbopack. Comment admits this silences a Next 16 warning.  
**Change:** Set equivalent Turbopack ignore if snapshot watching still loops; otherwise drop webpack config.  
**Sources:** [Turbopack vs webpack](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack).

---

### 8. SEO and metadata

#### F35 — Sitemap `lastModified: new Date()` on every generation  
**Type:** Defect (crawl signal quality)  
**Location:** `app/sitemap.tsx:10,17,30`  
**Why it matters:** Signals every URL changed at request time. Google may ignore lastmod if it is always “now.”  
**Change:** Use real content dates (git, constants like About’s `DATE_PUBLISHED`).  
**Effort:** XS  
**Sources:** [Google sitemap lastmod](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

#### F36 — Sample birth-year URLs in sitemap; infinite date URLs exist  
**Type:** Suggestion  
**Location:** `app/sitemap.tsx:22-40` lists `/table/{year}/1/1` and `/burst/...` for 9 years. Catch-all accepts any date.  
**Why it matters:** Fine for a small tool; avoid implying thousands of thin programmatic pages. robots allows `/`.  
**Change:** Keep samples; `noindex` user-specific dates if they become thin duplicates, or canonical to year-only pages.  
**Effort:** S  
**Sources:** Google thin/scaled content policies.

#### F37 — `robots.ts` disallows `/private/` which does not exist  
**Type:** Suggestion  
**Location:** `app/robots.ts:10`  
**Change:** Remove dead disallow or add the route. Confirm live `https://memento-mori.vercel.app/robots.txt` (not fetched authenticated).  
**Effort:** XS

#### F38 — About JSON-LD dates frozen at 2024-01-01  
**Type:** Suggestion  
**Location:** `app/about/page.tsx:5,47-48` `DATE_PUBLISHED` used for `dateModified` too.  
**Change:** Update `dateModified` when the article changes.  
**Effort:** XS

#### F39 — Manifest `purpose: "any maskable" as "any"`  
**Type:** Defect (type lie)  
**Location:** `app/manifest.ts:50`  
**Why it matters:** Cast hides an invalid combined purpose string. W3C purpose is `"any"` | `"maskable"` | `"monochrome"` (space-separated `any maskable` is allowed in some browsers but the `as "any"` cast is dishonest).  
**Change:** Separate icon entries for `any` and `maskable`, or `purpose: "any maskable"` with a correct type.  
**Effort:** XS  
**Sources:** [Web App Manifest icons](https://www.w3.org/TR/appmanifest/#icons-member).

#### F40 — Layout `themeColor: "#0D0C0B"` vs light-first body  
**Type:** Suggestion  
**Location:** `app/layout.tsx` viewport `themeColor: "#0D0C0B"`; body `bg-white` / `dark:bg-zinc-950`. Manifest `theme_color: "#EF4444"`, `background_color: "#0A0908"`.  
**Why it matters:** Theme-color, PWA, and page background disagree.  
**Change:** Align light/dark `themeColor` arrays with actual chrome.  
**Effort:** XS  
**Sources:** [viewport themeColor](https://nextjs.org/docs/app/api-reference/functions/generate-viewport).

---

### 9. Error handling and data fetching

#### F41 — Invalid DOB returns `null` UI with `console.error`  
**Type:** Defect  
**Location:** `LifeTable.tsx:15-38`; `BurstScene` similar validation.  
**Why it matters:** Page already `notFound()`s on invalid dates; remaining `null` render is a blank main with no explanation if a bad `Date` slips through (`new Date("1987,12,17")` vs date-fns `parse` with `yyyy,MM,dd` for metadata). **Inconsistent date parsing** between `generateMetadata` (`calculateFullAge(..., "yyyy,MM,dd")`) and the page (`new Date(urlDateParam)`).  
**Change:** Parse Y/M/D with `parse`/`new Date(y, m-1, d)` in one helper used by metadata and page.  
**Impact:** Avoids Invalid Date / timezone off-by-one.  
**Effort:** S  
**Sources:** [date-fns parse](https://date-fns.org/docs/parse).

#### F42 — Form `action={() => form.handleSubmit()}`  
**Type:** Suggestion  
**Location:** `Form.tsx:167`  
**Why it matters:** No progressive enhancement; depends on client JS. Acceptable for a calculator, but TanStack Form + Next can use server functions.  
**Change:** Keep client navigation (`router.push`) but prefer `onSubmit` preventDefault for clarity; don’t fake a server `action` that only calls the client handler.  
**Effort:** S

---

### 10. Testing and CI

#### F43 — Cypress looks for `[data-cy=age]` which is not in Form  
**Type:** Defect  
**Location:** `cypress/e2e/app.cy.ts:28-30`; `cypress/component/Form.cy.tsx:49-52`; Form UI shows weeks in a `font-mono` div **without** `data-cy="age"` (`Form.tsx:201-211`).  
**Why it matters:** These tests fail or never ran in CI. There is **no `.github/` workflows directory**.  
**Change:** Add `data-cy="age"` to the weeks/age readout **or** rewrite assertions. Add a GitHub Action: `bun format`, `bunx tsc --noEmit`, `bun run build`, `bun test`, Cypress component.  
**Impact:** Restores the only E2E coverage of the form.  
**Effort:** S

#### F44 — E2E does not submit through to `/table/...`  
**Type:** Suggestion  
**Location:** `cypress/e2e/app.cy.ts` — no `visit('/table/...')`, no BurstScene. Visual snapshot of the form only.  
**Change:** One spec: fill form → assert URL → table `data-cy="life-table"` exists; one burst visit.  
**Effort:** S

#### F45 — `jest` and `cypress-visual-regression` in `dependencies`  
**Type:** Defect (hygiene)  
**Location:** `package.json` `dependencies`  
**Change:** Move test-only packages to `devDependencies`. Production install on Vercel may still prune via `NODE_ENV`, but the manifest is wrong.  
**Effort:** XS

#### F46 — `packageManager` vs engines vs local Bun  
**Type:** Defect  
**Location:** `"packageManager": "bun@1.2.2"` vs `"bun": ">=1.3.5"` vs CLI **1.4.0**.  
**Change:** Set `packageManager` to the Bun you actually use (1.3.5+ or 1.4.0).  
**Effort:** XS

---

### 11. Maintainability and DX

#### F47 — Two `createFormHookContexts()` calls  
**Type:** Defect (likely accidental dual context)  
**Location:** `Form.tsx:19` and `LabeledInput.tsx:5`  
**Evidence:** TanStack Form requires **one** shared context object. A second `createFormHookContexts()` in the field file creates a new React context; `useFieldContext` in `LabeledInput` is not guaranteed to see the form in `Form.tsx`. Tests mounting `<Form />` may still pass if the library memoizes at module level — **not verified at runtime in this audit**.  
**Change:** Export `{ fieldContext, formContext, useFieldContext, useFormContext }` from one module (`components/Form/form-context.ts`) and import it in both files.  
**Effort:** S  
**Sources:** [TanStack Form `createFormHook`](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition).

#### F48 — Biome `noArrayIndexKey: off`  
**Type:** Suggestion  
**Location:** `biome.json`  
**Why it matters:** Life table keys on `yearIndex` / `weekIndex` are stable (index **is** identity). Off is defensible; don’t re-enable blindly.  
**Change:** Keep off; document why.

#### F49 — `app/[view]/page.tsx` still titled “Memento Mori” vs catch-all “Your Life in Weeks”  
**Type:** Suggestion (product copy drift)  
**Location:** headings in the two view files.  
**Change:** One component, one H1.

#### F50 — Webpack comment vs Turbopack default  
**Covered in F34.**

---

### 12. Additional findings (component audit, independently verified)

A follow-up read of components, tests, and BurstScene confirmed the items below. One claim was **not** reproduced: on this machine (Node v22.18.0), `new Date("1998,12,01")` **is valid** (local midnight). F41 remains an inconsistent-parser / timezone issue, not a guaranteed 404.

#### F51 — Tailwind v4 `@theme` missing; token utilities are no-ops  
**Type:** Defect  
**Location:** `app/globals.css` has only `@import "tailwindcss"` + popover rules. No `@theme`. Call sites: `app/page.tsx:89-96` `text-primary`, `text-accent`, `border-accent`, `border-border`, `font-display`; `app/about/page.tsx:82,94` `text-primary` / `text-accent`; `app/layout.tsx:196` `font-body`. `lib/fonts.ts` only defines CSS variables on `<html>`.  
**Why it matters:** Tailwind 4 emits `font-display` / `text-primary` only if those names exist in `@theme`. next/font variables do not auto-bind. Home/about “accent” and custom families likely never apply; calendar pages that use `font-serif` + zinc/red look different on purpose or by accident.  
**Change:**

```css
@import "tailwindcss";
@theme inline {
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);
  --color-primary: var(--color-zinc-900);
  --color-accent: var(--color-red-600);
  --color-secondary: var(--color-zinc-500);
  --color-border: var(--color-zinc-200);
}
```

Prefer non-circular names (`--font-sans: var(--font-body)`). Restore tokens from `color_report.md` if that file is still the design source of truth.  
**Impact:** Brand fonts and marketing colors.  
**Effort:** S  
**Sources:** [Tailwind v4 `@theme`](https://tailwindcss.com/docs/functions-and-directives#theme).

#### F52 — BurstScene `useFrame` keeps `invalidate()` forever when motion is allowed  
**Type:** Defect  
**Location:** `components/BurstScene/SceneContent.tsx:296-299`

```ts
if (activeUpdate || !isAnimationComplete || !reduceMotion) {
  mesh.instanceMatrix.needsUpdate = true;
  invalidate();
}
```

Canvas is `frameloop="demand"` (`BurstScene.tsx`). For users **without** reduced motion, `!reduceMotion` is always true → perpetual rAF, ~4160 instance matrices, shader `uTime` pulse (`fragment.ts`). `new THREE.Plane` / `Vector3` inside the frame loop (lines 195-196). Material not disposed.  
**Why it matters:** Battery, fans, INP competition on `/burst`. Reduced-motion users still get fragment pulse.  
**Change:** Invalidate only while `activeUpdate` (or hover). Hoist scratch vectors. Dispose `ShaderMaterial` on unmount. Gate pulse with a uniform when `reduceMotion`.  
**Impact:** High on burst view.  
**Effort:** M

#### F53 — `animate-in` / `fade-in` / `slide-in-from-*` with no animation plugin  
**Type:** Defect (dead classes)  
**Location:** `Form.tsx:199`, `LabeledInput.tsx:62`. No `tailwindcss-animate` / `tw-animate-css` in `package.json`.  
**Change:** Add the v4-compatible plugin, use Tailwind 4 `@utility`, or delete the classes.  
**Effort:** XS

#### F54 — Week unit/component tests still expect `bg-black`  
**Type:** Defect  
**Location:** `components/Week/Week.test.tsx:14`; `cypress/component/Week.cy.tsx` / `YearGrid.cy.tsx` (`.bg-black`). Production: `Week.tsx:32` `bg-zinc-900 dark:bg-red-600`.  
**Change:** Assert current classes.  
**Effort:** XS

#### F55 — E2E visual spec forces baseline overwrite  
**Type:** Defect  
**Location:** `cypress/e2e/app.cy.ts:47-49` `Cypress.env("visualRegressionType", "base")` then `compareSnapshot`.  
**Why it matters:** That test never fails a regression; it rewrites the baseline.  
**Change:** Use `regression` in CI; `base` only in an explicit update script.  
**Effort:** XS

#### F56 — Zod blocks dates implying age > 81  
**Type:** Defect (product)  
**Location:** `components/Form/schema.ts:43-49` `ctx.addIssue` (blocking) with celebratory copy.  
**Why it matters:** Submit stays disabled (`canSubmit`). Copy reads like a toast, behaves like a hard error. Table constants already cap visualization at 80 years (`YEARS_IN_LIFETIME * DECADE_LENGTH`).  
**Change:** Warning UI, not `addIssue`; still allow navigation.  
**Effort:** S

#### F57 — Burst item size uses `window.innerWidth`, not the measured container  
**Type:** Defect  
**Location:** `BurstScene.tsx` comment “Use container size”; `useElementSize` is called; item px derived from `window.innerWidth` (and `useSyncExternalStore` viewport).  
**Change:** Size from `size.w` of the container ref.  
**Effort:** S

#### F58 — Nested `role="dialog"` if Popover + MementoCard ship together  
**Type:** Suggestion (latent; Popover unused in app routes)  
**Location:** `PopOver/index.tsx` `role="dialog"`; `MementoCard.tsx:22` also `role="dialog"`.  
**Change:** Dialog on the popover host only; card is `article` without dialog.  
**Effort:** XS

#### F59 — Duplicate Storybook entries  
**Type:** Suggestion  
**Location:** `stories/LifeTable.stories.ts` vs `components/LifeTable/LifeTable.stories.ts`; `stories/Form.stories.ts` vs colocated stories. PopOver imports `@storybook/react`; others `@storybook/nextjs`.  
**Change:** One story per component under `components/`; delete `stories/` leftovers.  
**Effort:** S

#### F60 — “Remember my information” checkbox is color-only when checked  
**Type:** Suggestion  
**Location:** `Form.tsx:220-222` `appearance-none` + `checked:bg-red-600`, no glyph.  
**Change:** Visible check (SVG/`::after`) so state is not color-only (WCAG 1.4.1).  
**Effort:** XS

---

### 13. Additional findings (App Router architecture audit)

The RSC/routing explore agent overlapped F1–F3, F5, F7, F17, F25, F26, F51. New items below were checked in source. It also repeated “`new Date("1987,12,17")` is Invalid Date in V8”; **that is false on this Node 22.18.0** (see F41).

#### F61 — Two web manifests, conflicting theme colors  
**Type:** Defect  
**Location:** `app/manifest.ts` (`theme_color: "#EF4444"`, `background_color: "#0A0908"`) served as `/manifest.webmanifest` (`layout.tsx:179`). `public/manifest.json` (`theme_color: "#a855f7"`, `background_color: "#000000"`). Viewport `themeColor` is `#0D0C0B` (`layout.tsx:14`).  
**Why it matters:** Installable PWA chrome and browser UI disagree; crawlers/browsers may pick `/manifest.json` from the public file.  
**Change:** Delete `public/manifest.json`. One theme color aligned with the real page chrome.  
**Effort:** XS  
**Sources:** [Next.js `manifest.js`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest).

#### F62 — About hero `Image` is `priority={false}`  
**Type:** Suggestion (LCP on `/about`)  
**Location:** `app/about/page.tsx:85-91` (hero); later images also `priority={false}` which is correct. Home skull uses `priority` (`Form.tsx:143-150`).  
**Change:** `priority` (or `fetchPriority="high"`) on the first about image only.  
**Effort:** XS  
**Sources:** [next/image `priority`](https://nextjs.org/docs/app/api-reference/components/image#priority).

#### F63 — Root layout is `async` with no `await`  
**Type:** Suggestion  
**Location:** `app/layout.tsx:189`  
**Why it matters:** Unnecessary async layout can affect static/dynamic classification depending on Next version. There is no `cookies`/`headers`/`params` read.  
**Change:** `export default function RootLayout(...)`.  
**Effort:** XS

#### F64 — Home `<h1>` is inside the client `Form`  
**Type:** Suggestion  
**Location:** `components/Form/Form.tsx:152-156`; `app/page.tsx` only mounts `<Form />`.  
**Why it matters:** LCP heading hydrates with the form island; server HTML is fine but the heading is coupled to client JS and cannot be shared with metadata.  
**Change:** Move H1 + intro paragraph to the server page; leave the form as the island.  
**Effort:** S  
**Sources:** [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).

#### F65 — Sitemap home URL has a trailing slash; canonicals do not  
**Type:** Defect (canonical consistency)  
**Location:** `app/sitemap.tsx:4` `baseUrl = "https://memento-mori.vercel.app/"` so loc is `https://memento-mori.vercel.app/`; `app/page.tsx:10` canonical is `https://memento-mori.vercel.app` (no slash). Layout `metadataBase` has no trailing slash.  
**Change:** One `SITE_URL` constant; matching sitemap `url`, canonical, and OG `url`.  
**Effort:** XS  
**Sources:** [Google canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

#### F66 — FAQPage nested as `WebApplication.mainEntity`  
**Type:** Suggestion  
**Location:** `app/page.tsx:57-76`  
**Why it matters:** Google’s FAQ rich results expect FAQPage as a top-level type (or `@graph`), not buried under WebApplication. May be ignored rather than invalid HTML.  
**Change:** `@graph`: `[WebApplication, FAQPage]` or drop FAQ schema if the visible FAQ is a `<details>` with two questions only.  
**Effort:** S  
**Sources:** [Google FAQ structured data](https://developers.google.com/search/docs/appearance/structured-data/faqpage).

#### F67 — Home `metadata` duplicates the root layout  
**Type:** Suggestion  
**Location:** `app/page.tsx:5-36` vs `app/layout.tsx:17-72` (same default title/description/OG image). Layout `metadata` is untyped.  
**Change:** Keep defaults on the layout (`satisfies Metadata`); home only overrides if copy differs.  
**Effort:** XS  
**Sources:** [Metadata merging](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

---

## Prioritized action plan

### Critical

| ID | Item | Effort |
|---|---|---|
| F1 | Remove 500ms `setTimeout` on both view pages | XS |
| F25 | Fix GTM vs GA4 ID (`G-` → `GoogleAnalytics` or real `GTM-`) | S |
| F43 | Repair Cypress `data-cy=age` + add CI | S |
| F51 | Add Tailwind `@theme` (fonts + color tokens) | S |
| F52 | Stop BurstScene perpetual `invalidate()` | M |

### High

| ID | Item | Effort |
|---|---|---|
| F3 | Add `not-found.tsx`, `error.tsx`, `global-error.tsx` | S |
| F11 | Enable TypeScript `strict` | M |
| F2 | Delete or redirect dead `app/[view]/page.tsx` | S |
| F41 | Single date parser for metadata + page + LifeTable | S |
| F17 | One `<main>` landmark | XS |
| F30 | Table DOM/overflow (`content-visibility` or virtualize; mobile width) | M |
| F26 | Escape JSON-LD `<` on About and view pages | XS |

### Medium

| ID | Item | Effort |
|---|---|---|
| F7 | Move Week/YearGrid off the client bundle; drop fake `useTransition` | M |
| F8 | `next/dynamic` BurstScene | S |
| F4 / F5 | Wire ViewToggle + name param **or** delete | M |
| F19 | Show BackButton on mobile | XS |
| F20 | Grid accessibility strategy (summary vs 4k cells) | M |
| F9 | React Compiler default mode or real `"use memo"` | S |
| F13 | Biome lint-only vs Prettier format | XS |
| F47 | Shared form hook contexts | S |
| F27 | Verify/add security headers | S |
| F35 | Honest sitemap `lastModified` | XS |
| F61 | Delete duplicate `public/manifest.json` | XS |
| F65 | One SITE_URL / trailing-slash policy | XS |

### Low

| ID | Item | Effort |
|---|---|---|
| F14 F16 F45 F46 | Dependency and packageManager cleanup | XS |
| F12 | `@types/react-dom` | XS |
| F18 F22 F23 | Skip link, checkbox wrap, autocomplete | XS |
| F31 F32 | Font subset; self-host LCP image | S |
| F28 | Don’t `localStorage.clear()` | XS |
| F37 F38 F39 F40 | robots, JSON-LD dates, manifest purpose, theme-color | XS |
| F44 | E2E through calendar | S |
| F33 | Footer year dynamism | XS |
| F24 | Revisit `suppressHydrationWarning` | XS |

### Optional

| ID | Item | Effort |
|---|---|---|
| F10 | Cache Components — skip until you have IO | — |
| F15 | Restore `@position-try` after LightningCSS in Next is ≥ support | S |
| F6 | Remove empty `app/api/blog` | XS |
| F29 | Privacy copy for local storage | S |
| F42 | Real server action for form | M |
| F48 | Keep index keys | — |

---

## Quick wins (same day)

1. Delete both `await new Promise(..., 500)`.  
2. Swap `GoogleTagManager` for `GoogleAnalytics` **or** a `GTM-` container.  
3. Escape JSON-LD on About and `[...params]`.  
4. Add `data-cy="age"` on the weeks-lived readout.  
5. Remove nested `<main>`; show BackButton on mobile.  
6. Move jest/cypress-visual-regression to `devDependencies`; drop unused `clsx`/`tailwind-merge` if confirmed.  
7. Align `packageManager` with Bun ≥ 1.3.5.  
8. Disable Biome formatter **or** Prettier — not both.  
9. Restore `@theme` token mapping (F51).  
10. Fix stale `bg-black` / visual-baseline tests (F54, F55).  
11. Stop Burst `invalidate()` every frame (F52).

## Larger refactors

1. **One view route module** + `generateStaticParams` only if you want sample years pre-rendered.  
2. **Server-rendered week grid** with `content-visibility: auto` per decade; client island only for the current week tooltip/popover.  
3. **Dynamic import Three.js** on `/burst` only.  
4. **`strict` TypeScript** + shared date helper.  
5. **CI pipeline** (format, tsc, unit, component Cypress, build).  
6. **Product decision:** ship Popover + ViewToggle as Links, or delete them and the CSS.

## Suggested validation commands

```bash
bun format
bunx tsc --noEmit
bun run lint
bun test
bun run cypress:component
bun run build
bun run start   # then: curl -I http://localhost:3000 ; curl -s http://localhost:3000/robots.txt
```

After GTM/GA change, confirm network tab: `gtag/js?id=G-...` **or** `gtm.js?id=GTM-...`, not a mixed pair.

CWV: [PageSpeed Insights](https://pagespeed.web.dev/) on `/`, `/about`, `/table/1990/1/1`, `/burst/1985/6/15`. **Not run in this audit.**

JSON-LD: [Rich Results Test](https://search.google.com/test/rich-results) (renders JS). Do not trust `curl` alone for schema (SEO audit skill).

## Phased implementation roadmap

**Phase 0 — Stop the bleeding (½ day)**  
F1, F25, F26, F43, F17, F19, F46, F51, F54, F55.

**Phase 1 — App Router completeness (1–2 days)**  
F2, F3, F41, F35, F13, F14, F45, F47, F61, F63, F65, F67. Re-run `tsc`, Cypress component, build.

**Phase 2 — Performance of the grid (2–4 days)**  
F7, F8, F9, F30, F31, F32, F52, F57. Measure INP/LCP before/after (PSI + local profiler).  
Wire or delete F4/F5.

**Phase 3 — Hardening (1–2 days)**  
F11 strict mode (fix fallout), F27 headers, F20 a11y strategy, F28/F29 storage, F39–F40 PWA chrome, GitHub Actions.

**Phase 4 — Optional**  
F10, F15, F42, privacy page, E2E depth (F44).

---

## Evidence gaps (not invented)

- Live production status of `G-CYT1S2EC6W` (whether hits arrive in GA).  
- CrUX / PSI numbers for Core Web Vitals.  
- Whether `createFormHookContexts()` is a process-wide singleton (TanStack implementation not fully traced in `node_modules` this session).  
- Vercel project security-header overlay.  
- Search Console index coverage.  
- Whether Cypress E2E currently fails in CI (no CI config in repo).  
- Runtime behavior of `new Date("1990,1,1")` vs `parse(..., "yyyy,MM,dd")` on every engine — treat as **risk**, verified inconsistency in call sites (F41).

---

## Appendix: official platform delta (as of 2026-08-29)

Sourced from a bounded official-docs pass. Status of that pass was **partial**: pages were current through **2026-08-25** (Next.js 16.3.3 docs). There is no per-page snapshot labeled exactly 29 August 2026. React 19.2.8-specific patch notes are not on react.dev (only the 19.2 post). Tailwind docs are labeled **v4.3**, not 4.3.3. TypeScript **7.0 handbook URL 404s**; 7.0 behavior is described in the [TypeScript 6.0 notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html).

Repo vs that contract:

| Official expectation (Aug 2026) | This repo |
|---|---|
| Layouts/pages are Server Components; `'use client'` only for state/events/browser APIs ([S1](https://nextjs.org/docs/app/getting-started/server-and-client-components)) | Home/about/layout are RSC. The week grid is an all-client tree (F7). |
| `params` / `searchParams` / `cookies` / `headers` / `draftMode` are Promises; 15’s sync shim is gone ([upgrade to 16](https://nextjs.org/docs/app/guides/upgrading/version-16)) | View `params` are awaited. `searchParams` never read (F5). |
| Caching: opt-in `cacheComponents: true` + `'use cache'`; `experimental.ppr` removed | Not enabled (F10) — acceptable with no IO; do not treat as a defect. |
| `error.js` is a Client Component; `retry()` is stable since v16.3.0. `not-found.js` is a Server Component; streamed `notFound()` can return **200**, non-streamed **404** ([error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error)) | Files missing (F3). When adding them, use `retry` not the older `reset` name. |
| `generateMetadata` `params`/`searchParams` are Promises; metadata can stream except for listed bots ([metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)) | Implemented as async `generateMetadata` on views. |
| React Compiler: SWC-invoked on Next ≥15.3.1; React 19 `target` defaults to `'19'` (no `react-compiler-runtime` polyfill) ([compiler intro](https://react.dev/learn/react-compiler/introduction), [target](https://react.dev/reference/react-compiler/target)) | `reactCompiler.compilationMode: "annotation"` plus `babel-plugin-react-compiler` and `"use no memo"` on Form (F9) — not the default Next 16 / React 19 path. |
| Tailwind v4: `@import "tailwindcss"`; JS config is `@config` only; drop `autoprefixer` ([upgrade guide](https://tailwindcss.com/docs/upgrade-guide)) | Import is correct. Autoprefixer still present (F16). No `@theme` block (optional until custom tokens). |
| TypeScript 7: `strict` defaults **true**; `moduleResolution: "bundler"`; `--moduleResolution node` gone; `types` defaults to `[]` | `moduleResolution` is `"bundler"` (good). `strict: false` (F11). `target: "ES2017"` is older than TS 6/7 new-project `es2025`. |
| Next 16: Turbopack default; Node 20.9+; middleware → `proxy`; `next lint` and AMP removed | Turbopack in use; Node 22.18.0. No `proxy.ts`. Lint is Biome (`bun run lint`), not `next lint` — correct. Engines require Node ≥22.13.0 (stricter than Next’s 20.9). |

**Do not change based on this appendix alone:** enabling `cacheComponents` without IO; adding `@theme` with no design tokens; upgrading `target` to `es2025` without a browserslist check.
