# Tailwind CSS 4.x implementation notes (prior to StyleX)

**Date opened:** 2026-11-16  
**Date closed (StyleX cutover):** 2026-11-16  
**Purpose:** Keep a durable record of the Tailwind v4 setup, the pre-migration benchmark, the StyleX migration work (`plan_migration.md`), and the post-migration comparison.  
**Filename note:** Keeps the historical typo `taiwindcss_…` so older chat links keep resolving.

---

## Stack

### Baseline (Tailwind 4.x — before migration)

| Package / tool         | Installed                                     |
| ---------------------- | --------------------------------------------- |
| `tailwindcss`          | **4.3.5**                                     |
| `@tailwindcss/postcss` | **4.3.5**                                     |
| `cnfast`               | **0.2.0**                                     |
| `next`                 | **16.4.6** (Turbopack, `reactCompiler: true`) |
| `react` / `react-dom`  | **19.3.1**                                    |
| Node                   | **v24.20.0**                                  |
| Bun                    | **1.4.4**                                     |

### After Phase 5 (StyleX)

| Package / tool             | Installed         |
| -------------------------- | ----------------- |
| `@stylexjs/stylex`         | **0.19.2**        |
| `@stylexjs/babel-plugin`   | **0.19.2**        |
| `@stylexjs/postcss-plugin` | **0.19.2**        |
| `autoprefixer`             | **10.6.2**        |
| `postcss`                  | **8.5.33** (kept) |
| Tailwind / cnfast          | **removed**       |

**Machine note:** Benchmarks are wall-clock on this host. Treat deltas as directional.

---

## 1. How Tailwind 4 was wired (baseline)

There was no `tailwind.config.*`. Tailwind 4 was CSS-first.

| Piece            | Path                                          | Role                                   |
| ---------------- | --------------------------------------------- | -------------------------------------- |
| Entry            | `app/globals.css` → `@import "tailwindcss"`   | Utility generation                     |
| Tokens           | `@theme inline { … }`                         | Semantic colors, type, tracking, fonts |
| Custom utilities | `@utility stroke` / `stroke-l` / `stroke-b`   | 3px borders                            |
| PostCSS          | only `@tailwindcss/postcss`                   | Build pipeline                         |
| Class merge      | `lib/utils.ts` → `cn()` via `cnfast`          | Conditional class strings              |
| Design lint      | `bun run lint:design` + Biome Tailwind domain | Ban off-scale classes                  |
| Non-utility CSS  | Same `globals.css`                            | Popover anchor, life-table scale       |

Dark mode was the v4 default `@media (prefers-color-scheme: dark)`. Semantic colors used `light-dark()`. Fonts stayed on `next/font`.

### Source inventory (baseline)

| Metric                        | Value    |
| ----------------------------- | -------- |
| Files with `className`        | **37**   |
| `className` mentions          | **276**  |
| Approx. distinct class tokens | **~456** |

---

## 2. Pre-migration benchmark (Tailwind 4.3.5)

Method: `bun run build` (= `bun clean && next build`). Two consecutive clean builds. CSS from `.next/static/chunks/*.css`. Gzip = Python `gzip.compress(..., 9)`.

### Build time

| Run      | Compiled (Turbopack) | TypeScript | Static gen | Wall (`real`) |
| -------- | -------------------- | ---------- | ---------- | ------------- |
| 1        | 11.2s                | 1686ms     | 1546ms     | **17.56s**    |
| 2        | 9.9s                 | 1253ms     | 1508ms     | **15.56s**    |
| **Mean** | **~10.6s**           | **~1.5s**  | **~1.5s**  | **~16.6s**    |

### CSS payload

| Metric                   | Value                         |
| ------------------------ | ----------------------------- |
| Files                    | **1**                         |
| Raw bytes                | **78,036** (~76.2 KiB)        |
| Gzip-9                   | **12,493** (~12.2 KiB)        |
| Approx. rule opens (`{`) | **878**                       |
| `color-mix(`             | 83                            |
| Tailwind `--tw-*` reset  | present (`@layer properties`) |

### JS chunks (context)

| Metric | Value     |
| ------ | --------- |
| Files  | 15        |
| Raw    | 1,863,848 |
| Gzip-9 | 524,774   |

---

## 3. Migration log

Followed `plan_migration.md`.

### Phase 0 — Spike — **PASS**

- Installed `@stylexjs/stylex`, `@stylexjs/babel-plugin`, `@stylexjs/postcss-plugin`, `autoprefixer`.
- Added `babel.config.js` (`next/babel` + StyleX plugin). Next logged `Using external babel configuration`.
- Added `@stylex;` to `app/globals.css`.
- Converted canaries: `app/not-found.tsx` (RSC) and `components/KofiButton.tsx` (client).
- **React Compiler:** build succeeded with `reactCompiler: true` and StyleX Babel plugin together. Styles present in HTML + CSS. No need to disable the compiler.
- **Critical PostCSS order fix:** Plan said Tailwind then StyleX. That fails — Tailwind v4 drops unknown `@stylex`, so Babel still emits `x*` class names with **no matching CSS**. Correct order for the dual-stack window: **StyleX → Tailwind → autoprefixer**. After Phase 5 (Tailwind gone): StyleX → autoprefixer.
- `color-mix` and `@media (prefers-color-scheme: dark)` compile. Print media later confirmed in Phase 4 CSS.

### Phase 1 — Tokens + recipes — **PASS**

- `styles/tokens.stylex.ts` (`stylex.defineVars`)
- `styles/breakpoints.stylex.ts` (`stylex.defineConsts`)
- Recipes: `button`, `textLink`, `kicker`, `prose` under `styles/recipes/`

### Phase 2 — Leaf components — **PASS**

DecadeGrid, YearGrid, LifeTable, BackButton, Footer, BurstScene chrome, content components (except ScrollTable), error/loading/not-found pages.

### Phase 3 — Pages + MDX — **PASS**

`layout`, home, blog index, calendar view page, `mdx-components.tsx`, `RightCell` for MDX `text-right`.

### Phase 4 — Week + ScrollTable + print — **PASS**

- `Week.tsx`: no `cn`; year ticks are `<span>` elements; fill via `--week-fill`; dark media + `print-color-adjust`.
- `ScrollTable`: scroller only + `scroll-table` class; sticky/hover/last-cell stay plain CSS in `globals.css`.
- Calendar print: hide chrome, `@page` letter, scale to printable box, force light ink when OS is dark.

### Phase 5 — Remove Tailwind — **PASS**

- Removed `@import "tailwindcss"`, `@theme`, `@utility` from `globals.css`.
- Added explicit zinc/red/amber palette + semantic aliases on `:root` so tokens keep resolving.
- Removed packages: `tailwindcss`, `@tailwindcss/postcss`, `cnfast`.
- Removed `cn` export / `lib/utils.test.ts`.
- PostCSS: StyleX + autoprefixer only.

### Phase 6 — Lint cleanup — **PASS**

- Biome: `tailwind` domain `"none"`, `tailwindDirectives: false`, grit plugins removed.
- Deleted `tooling/design/` and `lint:design` script.
- Allowed `@stylex` via `noUnknownAtRules.ignore`.
- Added `type-check` script (`tsc --noEmit`).
- Jest/Bun StyleX mocks under `test/mocks/stylex.js` (+ bun preload).

---

## 4. Post-migration benchmark (StyleX 0.19.2)

Same method: two clean `bun run build` runs after Phase 5.

### Build time

| Run          | Compiled   | TypeScript | Static gen | Wall (`real`) |
| ------------ | ---------- | ---------- | ---------- | ------------- |
| 1            | 20.2s      | 1817ms     | 2.4s       | **28.19s**    |
| 2            | 20.2s      | 1987ms     | 2.2s       | **28.18s**    |
| Spot check   | 20.4s      | 2.8s       | 2.3s       | **29.60s**    |
| **Mean (≈)** | **~20.3s** | **~2.2s**  | **~2.3s**  | **~28.7s**    |

Babel + StyleX PostCSS cost ~**+12s** wall vs Tailwind-only Turbopack path. Acceptable for this codebase size; revisit if cold builds become painful.

### CSS / inventory

| Metric                                            | Tailwind 4.3.5    | StyleX 0.19.2         | Delta                                     |
| ------------------------------------------------- | ----------------- | --------------------- | ----------------------------------------- |
| Mean clean build `real`                           | ~16.6s            | ~28.7s                | **+73%** (slower)                         |
| Compile time                                      | ~10.6s            | ~20.3s                | **+92%**                                  |
| CSS files                                         | 1                 | 1                     | —                                         |
| CSS raw                                           | 78,036            | **38,313**            | **−51%**                                  |
| CSS gzip-9                                        | 12,493            | **8,822**             | **−29%**                                  |
| Approx. CSS `{` rules                             | 878               | **634**               | **−28%**                                  |
| `className` mentions (app/components/mdx/content) | 276               | **56**                | mostly escape hatches / plain CSS markers |
| Files with `stylex.create`                        | 0                 | **38**                | —                                         |
| Styling packages                                  | Tailwind + cnfast | StyleX + autoprefixer | —                                         |
| Tailwind `--tw-*` leftover                        | yes               | **no**                | —                                         |

### JS chunks (context)

| Metric | Tailwind  | StyleX    |
| ------ | --------- | --------- |
| Files  | 15        | 16        |
| Raw    | 1,863,848 | 1,832,927 |
| Gzip-9 | 524,774   | 517,257   |

Slightly smaller JS despite StyleX runtime — consistent with dropping utility-string churn / cnfast.

### Automated checks (post Phase 6)

| Check                            | Result                                                                                                          |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `bun run build`                  | pass                                                                                                            |
| `bun run type-check`             | pass                                                                                                            |
| `bunx biome ci` on product paths | pass (`@stylex` allowed)                                                                                        |
| `bun test`                       | **155 pass / 0 fail**                                                                                           |
| `bun run test` (Jest)            | happy-dom ESM/require issue on this Node — pre-existing Jest/ESM friction; Bun runner is green with StyleX mock |

### Qualitative (manual still recommended)

- Visual parity (home, filled calendar light/dark, blog + table, 404, form): not fully eyeballed in this session; Cypress baselines not rebaselined.
- Print one-page life table + `print-color-adjust`: CSS present (`@page`, print scale, dark→light ink override).
- Popover anchor CSS: retained in `globals.css`.
- Design lint / Biome Tailwind domain: removed.

---

## 5. Decisions and gotchas

1. **Benchmark before code.** Baseline locked before any StyleX install.
2. **PostCSS order:** StyleX **before** Tailwind while both exist. Documented deviation from `plan_migration.md`.
3. **Palette after Tailwind:** `:root` in `globals.css` owns zinc/red/amber + semantic aliases. Tokens still reference `var(--color-zinc-*)`.
4. **Year ticks are elements**, not `::after` / `content-[attr(title)]`.
5. **Week fill** uses `--week-fill` custom property, not a template string in StyleX.
6. **Scroll sticky/hover** stays unlayered plain CSS (`.scroll-table …`) — StyleX authoring prefers avoiding `:first-child`.
7. **Jest/Bun:** StyleX throws at runtime without Babel. Mock at `test/mocks/stylex.js`; Bun preload in `bunfig.toml`.
8. **Build slower, CSS smaller.** Primary win is payload (−29% gzip CSS) and typed tokens; cost is Babel compile time.
9. **`bun run check` over full repo** still trips on pre-existing `.agents/skills/**` format drift — out of scope. Product paths are clean.
10. **Visual regression vs Vercel (`/table/1987/12/17`, 2026-11-16):** Removing Tailwind also removed its preflight `box-sizing: border-box`. Week cells became content-box → 10px outer instead of 8px → life table **1488px vs 1328px**, denser mid-year gap. Fix: restore `*, *::before, *::after { box-sizing: border-box }` in `globals.css`. After fix, local matches prod heights (life 1328, decade 152, cell 8, gaps 8/16). Decade tick text in dark mode also matched prod cascade (`secondary`, not `accent`).
11. **Blog table (`/blog/how-many-weekends-do-you-have-left`):** Raw `<table>`/`<th>`/`<td>` inside `<ScrollTable>` JSX bypass the MDX component map, so StyleX never applied to the Age column — table collapsed to ~166px, caption lost italic/display face, first cells used UA defaults. Fix: move full table chrome into unlayered `.scroll-table …` CSS (same place as sticky/hover). Breadcrumb links were UA purple because `color.default: null` lost to the user-agent `a` rule — set `tokens.secondary` explicitly. Right-align needs a plain `.scroll-table-right` marker because unlayered CSS beats StyleX layers.

---

## 6. Commands

```bash
# Baseline / post metrics
/usr/bin/time -p bun run build   # twice
python3 -c '...'                 # raw + gzip-9 for .next/static/chunks/*.css

# After migration
bun run type-check
bunx biome ci app components styles mdx-components.tsx lib …
bun test
```
