# Tailwind CSS 4 → StyleX migration plan

> **Phase 0–6 status (2026-11-16): DONE.** Spike passed on Next 16.4.6 + Turbopack + React Compiler + StyleX 0.19.2. Tailwind packages removed. Benchmarks and gotchas (including PostCSS order: StyleX before Tailwind while dual-stack) live in `taiwindcss_4x_implementation_notes_prior_stylex.md`.

Goal: keep the current UI pixel-for-pixel and interaction-for-interaction, and express it with [StyleX](https://stylexjs.com/) instead of Tailwind utility class strings.

This was the plan. Application code moved after the toolchain spike (Phase 0) passed on Next.js 16.4, Turbopack, and the React Compiler.

## Current setup

| Piece                                     | Where                           | Role                                                   |
| ----------------------------------------- | ------------------------------- | ------------------------------------------------------ |
| `tailwindcss` `^4.3.5`                    | `devDependencies`               | Utility generation                                     |
| `@tailwindcss/postcss` `^4.3.5`           | `dependencies`                  | Only PostCSS plugin                                    |
| `postcss` `^8.5.33`                       | `devDependencies`               | Tailwind, plus `tooling/design/check.ts`               |
| `cnfast` `^0.2.0`                         | `dependencies`                  | `cn()` in `lib/utils.ts`                               |
| `@import "tailwindcss"`                   | `app/globals.css`               | Entry                                                  |
| `@theme inline`                           | `app/globals.css`               | Design tokens                                          |
| `@utility stroke`, `stroke-l`, `stroke-b` | `app/globals.css`               | 3px borders                                            |
| Biome domain `tailwind: recommended`      | `biome.json`                    | Class sorting / Tailwind syntax                        |
| Biome `css.parser.tailwindDirectives`     | `biome.json`                    | Parses `@theme`, `@utility`                            |
| Biome plugins `classes.grit`, `css.grit`  | `biome.json`, `tooling/design/` | Ban off-scale Tailwind classes                         |
| `bun run lint:design`                     | `tooling/design/check.ts`       | Same policy, walks JSX class strings and `globals.css` |

There is no `tailwind.config.*`. Tailwind 4 reads `@theme` from CSS. Dark mode is the v4 default, `@media (prefers-color-scheme: dark)`. The root element sets `scheme-light-dark`, and semantic colors use `light-dark()`, so many `dark:` utilities repeat a token that already flips.

`next/font` still owns the real font files. `--font-garamond`, `--font-inter`, and `--font-jetbrains` are set on `<html>` in `app/layout.tsx`. Tailwind only aliases them as `font-display`, `font-sans`, and `font-mono`.

## Inventory

About **279** `className` mentions across **37** source files, plus `app/globals.css`. Roughly **370** distinct class tokens. Production UI is smaller than that: Storybook position grids and the design-lint fixtures account for a large share of the arbitrary values.

### Files that must be converted

App chrome and pages:

- `app/layout.tsx`
- `app/page.tsx`
- `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`
- `app/[view]/[...params]/page.tsx`
- `app/blog/page.tsx`, `app/blog/loading.tsx`, `app/blog/[slug]/not-found.tsx`
- `app/about/loading.tsx`
- `mdx-components.tsx`
- `content/blog/how-many-weekends-do-you-have-left.mdx` (`text-right` on six cells)

Components, by size of the styling problem:

| File                                                         | Why it is not a straight map                                                                                           |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `components/content/ScrollTable.tsx`                         | One string of `[&_table]`, `[&_th]`, `[&_td]`, `@container`, `100cqi`. Cell rules move onto `th`, `td`, and `caption`  |
| `components/Week/Week.tsx`                                   | `cn()`, conditional fill, and year ticks drawn with `::after` and `content-[attr(title)]`. Ticks become a real element |
| `components/Form/Form.tsx`                                   | `cn()`, `peer` / `peer-checked` custom checkbox                                                                        |
| `components/Form/fields/LabeledInput.tsx`                    | `cn()` for error and focus rings                                                                                       |
| `components/PopOver/index.tsx`                               | `cn()` plus positioning class names from CSS                                                                           |
| `components/PopOver/MementoCard.tsx`                         | Fixed card, opacity colors (`bg-surface/10`, `text-white/95`)                                                          |
| `components/Footer.tsx`                                      | Repeated link styles, many redundant `dark:` copies                                                                    |
| `components/BackButton.tsx`                                  | Template string, `className` escape hatch, `print:hidden`                                                              |
| `components/BurstScene/BurstScene.tsx`                       | Panel chrome around the canvas                                                                                         |
| `components/content/*`                                       | Article shell, breadcrumbs, FAQ, quote, related posts, image, try-calendar                                             |
| `components/DecadeGrid.tsx`, `YearGrid.tsx`, `LifeTable.tsx` | Short layout strings (`grid-cols-52`, `w-208`, `gap-4`)                                                                |
| `components/KofiButton.tsx`                                  | `hover:scale-105` plus `className` prop                                                                                |

Storybook and tests that import the same classes:

- `components/PopOver/PopOver.stories.tsx`
- `components/Week/Week.test.tsx` (asserts a passed-through `className`)
- `lib/utils.test.ts` (tests `cnfast` merge behavior; delete with `cn`)
- `.storybook/preview.ts` and `cypress/support/component.ts` import `app/globals.css`

### CSS that stays CSS

These rules are not Tailwind utilities. StyleX does not need to own them. Keep them in `app/globals.css` after the Tailwind import is removed, and attach them with a static `className` next to `stylex.props()`.

- `@property --memento-anchor`
- `.popover-left-top` through `.popover-auto` (`position-area`, `position-try-fallbacks`, `anchor()`). LightningCSS in Next 16 already rejects `@position-try`; the current fallback comments stay valid.
- `@property --life-table-width` and `--life-table-height`
- `.life-table-fit`, `.life-table-frame`, `.life-table-scale` (`100cqi`, `transform: scale()`). The comment in the file is the constraint: `zoom` breaks the decade gap on iOS, so the transform stays.

`app/[view]/[...params]/page.tsx` and `components/PopOver/index.tsx` are the only callers.

### What is not Tailwind

Shaders, date math, MDX body copy, OG image rendering, and JSON-LD do not use utility classes. Leave them alone.

## Token map

Move `@theme inline` into one StyleX theme module, `styles/tokens.stylex.ts`, via `stylex.defineVars`. Reference the same CSS variables `next/font` already sets. Do not duplicate font files inside StyleX.

Colors (each semantic color is already light/dark through `light-dark()`):

| Token           | Value                                                      |
| --------------- | ---------------------------------------------------------- |
| `primary`       | `light-dark(var(--color-zinc-900), var(--color-zinc-50))`  |
| `secondary`     | `light-dark(var(--color-zinc-500), var(--color-zinc-400))` |
| `quiet`         | `light-dark(var(--color-zinc-700), var(--color-zinc-200))` |
| `accent`        | `var(--color-red-600)`                                     |
| `mark`          | `var(--color-amber-500)`                                   |
| `border`        | `light-dark(var(--color-zinc-200), var(--color-zinc-700))` |
| `line`          | `light-dark(var(--color-zinc-200), var(--color-zinc-800))` |
| `surface`       | `light-dark(#fff, var(--color-zinc-950))`                  |
| `surfaceRaised` | `light-dark(var(--color-zinc-100), var(--color-zinc-900))` |
| `panel`         | `light-dark(#fff, var(--color-zinc-900))`                  |
| `card`          | `var(--color-zinc-950)`                                    |
| `week`          | `light-dark(var(--color-zinc-900), var(--color-red-600))`  |
| `weekMuted`     | `light-dark(var(--color-zinc-900), var(--color-zinc-700))` |

Zinc, red, amber, and white used as raw Tailwind colors (`text-zinc-700`, `shadow-red-600/10`, `text-white`) become either a semantic token or a literal in the theme file. Do not keep a second palette.

Typography and tracking:

| Token                | Value                              | Tailwind name today                |
| -------------------- | ---------------------------------- | ---------------------------------- |
| `fontDisplay`        | `var(--font-garamond), serif`      | `font-display`                     |
| `fontSans`           | `var(--font-inter), sans-serif`    | `font-sans`                        |
| `fontMono`           | `var(--font-jetbrains), monospace` | `font-mono`                        |
| `tick`               | `0.625rem`                         | `text-tick`                        |
| `tickLg`             | `0.8125rem`                        | `text-tick-lg`                     |
| `kicker`             | `0.6875rem`                        | `text-kicker`                      |
| `display`            | `2.5rem`                           | `text-display` and `text-[2.5rem]` |
| `cardTitle`          | `27px`                             | `text-card-title`                  |
| `cardMark`           | `40px`                             | `text-card-mark`                   |
| `cardBody`           | `15px`                             | `text-card-body`                   |
| `cardCaption`        | `13px`                             | `text-card-caption`                |
| `leadingDisplay`     | `0.95`                             | `leading-display`                  |
| `trackingLabel`      | `0.25em`                           | `tracking-label`                   |
| `trackingLabelTight` | `0.2em`                            | `tracking-label-tight`             |
| `trackingMark`       | `1.75px`                           | `tracking-mark`                    |
| `trackingMarkTight`  | `1.5px`                            | `tracking-mark-tight`              |
| `trackingCard`       | `-0.03em`                          | `tracking-card`                    |
| `trackingTick`       | `0.14em`                           | `tracking-tick`                    |
| `trackingTickSoft`   | `0.02em`                           | `tracking-tick-soft`               |
| `popoverGap`         | `0.625rem`                         | `--spacing-popover`                |

Spacing, type scale, radius, and shadows that are standard Tailwind steps (`p-4`, `text-sm`, `rounded-full`, `shadow-lg`, `gap-2`) are written as literal StyleX values using the Tailwind v4 scale (spacing unit `0.25rem`). The allowed sets in `tooling/design/policy.json` are the checklist so a converted value does not drift off the scale the design lint already enforces.

Breakpoints, copied from that policy:

| Name  | Min width |
| ----- | --------- |
| `sm`  | `40rem`   |
| `md`  | `48rem`   |
| `lg`  | `64rem`   |
| `xl`  | `80rem`   |
| `2xl` | `96rem`   |

`md` and `2xl` do not appear in product UI today. `sm`, `lg`, and `xl` do.

Custom layout lengths that are not on the default type scale:

| Class today                 | Computed value               | Use                |
| --------------------------- | ---------------------------- | ------------------ |
| `w-208`                     | `52rem` (208 × 0.25rem)      | Year row width     |
| `grid-cols-52`              | `repeat(52, minmax(0, 1fr))` | Week columns       |
| `size-2`                    | `0.5rem`                     | Week cell          |
| `stroke` / `border-l-[3px]` | `3px`                        | Buttons and quotes |
| `max-w-prose`               | `65ch`                       | Articles           |
| `max-w-7xl`                 | `80rem`                      | Home               |
| `h-[80vh]`                  | `80vh`                       | Burst scene        |

Opacity modifiers (`border-accent/40`, `bg-surface/10`, `shadow-red-600/10`, `ring-accent/40`) become `color-mix(in oklab, <color> <percent>, transparent)`, which is what Tailwind 4 emits. Check one of each in DevTools against production before locking the mix.

## StyleX patterns that replace Tailwind habits

Local styles live next to the component in a `*.styles.ts` file, created with `stylex.create`. Apply them with `stylex.props(...)`.

```ts
const s = stylex.create({
  link: {
    color: tokens.secondary,
    letterSpacing: tokens.trackingLabel,
    textTransform: "uppercase",
    ":hover": { color: tokens.accent },
    "@media (min-width: 40rem)": { fontSize: "0.75rem" },
  },
});
<a {...stylex.props(s.link)} />
```

Rules while converting:

1. **No runtime class strings.** `cn()`, template literals, and `"px-4 " + flag` go away. Conditional styles are extra keys passed to `stylex.props(s.base, filled && s.filled)`.
2. **`className` props stay only as an escape hatch** for tests and one-off markers (`Week` test passes `"custom-class"`, `current-week`, popover position classes, life-table classes). Merge order: StyleX `className` first, then the explicit marker class. Do not accept Tailwind strings through these props. Call sites inside the repo pass StyleX objects or nothing.
3. **Drop redundant `dark:` copies** where the semantic token already uses `light-dark()`. Examples: `dark:bg-surface`, `dark:text-primary`, `dark:text-secondary`, `dark:border-line` when the light class is the same token. Real theme splits stay as `@media (prefers-color-scheme: dark)`:
   - week border and fill: `border-week` / `bg-week` versus `dark:border-accent`, `dark:bg-accent`, `dark:border-border`
   - year-tick label colors
   - `text-zinc-700 dark:text-zinc-300` on inline code in `mdx-components.tsx`
   - `BackButton` hover surface in dark mode
4. **`peer-checked` on the birthday checkbox** becomes a label using `:has(input:checked)` so the checkmark does not depend on the Tailwind `peer` variant. Keyboard ring stays on `:focus-visible`.
5. **Dynamic week fill** stays a number in React. Set one custom property from React (`style={{ "--week-fill": fill }}`) and read it in StyleX as `width: "var(--week-fill)"`. StyleX will reject a raw `` `${n}%` `` style value.
6. **Year ticks are an element, not `::after`.** When a week is a year mark, render a `<span>` inside the cell with the year as its text. Position it the way `::after` is positioned today (`absolute`, to the right of the square, vertically centered) so the grid track does not grow. Origin, decade, and ordinary marks are StyleX variants on that span. Drop `content-[attr(title)]`, the `after:*` utilities, and `data-[tick=…]` selectors. Keep `title` on the cell only if a tooltip or test still reads it.
7. **Table cells are styled on the cells.** `ScrollTable` keeps the scroller only: container, overflow, padding, focus outline. `[&_table]`, `[&_th]`, `[&_td]`, and `[&_caption]` move onto `table`, `th`, `td`, and `caption` in `mdx-components.tsx`. The first and last cells get those styles in the component that renders them, not through `:first-child` or `:last-child`. The StyleX authoring guide prefers that over positional pseudo-classes. Row hover sets the cell background from the `tr`. Caption width stays `100cqi` on the `caption`. No descendant utility string remains on the wrapper.
8. **`group` on the calendar page** is unused for `group-hover` in the current markup. Do not invent a group variant. Delete the class when touching that file.
9. **Print is a layout, not only `print:hidden`.** Footer and back button stay hidden with `@media print { display: "none" }`. The calendar page also gets a print layout in StyleX so a filled life table lands on one page:
   - Hide the view switcher, the burst scene, and the weeks-lived copy under the grid. Print is the table.
   - Force filled weeks to ink: `print-color-adjust: exact` on the table (and the same on `html`). Browsers drop backgrounds by default, which would print every lived week as empty.
   - Replace the screen `transform: scale()` fit for print. That scale is sized for a phone viewport and clips or spills across pages on paper. Under `@media print`, the frame uses the page box (`@page { size: letter; margin: 0.5in }`, one page) and the table scales to `min(100%, fit)` of the printable width and height. Decade gap, year gap, cell border, and fill stay in the same ratio.
   - Year-tick `<span>` labels stay visible and inside the page.
   - Dark mode is not the print palette. Print uses the light values (black or near-black filled weeks, white page) even when the screen is in dark mode, so a printed sheet matches the light table.
10. **MDX `className="text-right"`** becomes a tiny component or a shared style import. If the MDX loader does not run the StyleX transform (Phase 0 check), use a `RightCell` component compiled as TSX instead of a style import inside `.mdx`.

Shared recipes, so the same button and link are not re-typed twelve times:

- `styles/recipes/button.ts` — stroke button (`stroke`, `border-accent`, tracking-widest, uppercase)
- `styles/recipes/textLink.ts` — accent underline with 30% decoration
- `styles/recipes/kicker.ts` — display face, label tracking, uppercase
- `styles/recipes/prose.ts` — `max-w-prose` column used by blog, about, article shell

## Toolchain

Follow the Next.js install guide: [stylexjs.com/docs/learn/installation/nextjs](https://stylexjs.com/docs/learn/installation/nextjs). Install with Bun, the repo package manager (`packageManager` is `bun@1.4.0`). Do not use npm or a third-party Next plugin.

```bash
bun add @stylexjs/stylex
bun add -d @stylexjs/babel-plugin @stylexjs/postcss-plugin autoprefixer
```

`@stylexjs/stylex` is the runtime. The Next guide’s dev dependencies are `@stylexjs/babel-plugin` and `@stylexjs/postcss-plugin`. `autoprefixer` is the second plugin in that guide’s PostCSS config. Next 16.0.3 and later pick up `babel.config.js` and `postcss.config.js` for both Webpack and Turbopack, so `next.config.ts` does not gain a StyleX wrapper.

Config shape, matching the guide:

- `babel.config.js` at the repo root. `presets: ['next/babel']`. Plugin `@stylexjs/babel-plugin` with `dev` from `NODE_ENV !== 'production'`, `runtimeInjection: false`, `enableInlinedConditionalMerge: true`, `treeshakeCompensation: true`, `unstable_moduleResolution: { type: 'commonJS' }`, and `aliases` only if a path alias is added. This repo has no `paths` in `tsconfig.json` today, so leave `aliases` empty until one exists.
- `postcss.config.js` replaces `@tailwindcss/postcss` with `@stylexjs/postcss-plugin` in Phase 0, and keeps Tailwind beside it until Phase 5. Pass the same Babel plugins through `babelConfig` (`babelrc: false`, TypeScript and JSX parser plugins). `useCSSLayers: true`. `include` globs: `app/**/*.{js,jsx,ts,tsx}`, `components/**/*.{js,jsx,ts,tsx}`, `mdx-components.tsx`, and `styles/**/*.{js,jsx,ts,tsx}`.
- `@stylex;` in `app/globals.css`, which `app/layout.tsx` already imports. That directive is where the PostCSS plugin writes the atomic CSS. There is no `virtual:stylex.css` import.

While Tailwind is still installed, both PostCSS plugins stay. Order is Tailwind first, then StyleX, then `autoprefixer`. If a converted property loses to a leftover utility, fix the component. Do not flip `useCSSLayers` off to win the cascade. The install guide sets it to `true`.

Authoring follows [stylexjs.com/docs/llm-resources](https://stylexjs.com/docs/llm-resources). Read those Markdown files at the start of implementation and when a StyleX API is unclear. The copies agents should load are:

- [stylex-installation.md](https://stylexjs.com/docs/llm-resources#installation-guide)
- [stylex-authoring.md](https://stylexjs.com/docs/llm-resources#style-authoring-guide)

The same files are in [facebook/stylex `packages/docs/static/llm`](https://github.com/facebook/stylex/tree/main/packages/docs/static/llm). Where the Next.js page and the installation Markdown disagree on config, the Next.js page wins. The authoring Markdown wins for how styles are written. Rules from that guide that change this plan:

- A bare number is pixels. Every rem, em, or percent in this plan is a string (`'0.5rem'`, `'52rem'`).
- Nested conditions (`:hover`, `@media`, `@media print`) include a `default` key. Use `null` when the default sets nothing.
- Shared breakpoints use `stylex.defineConsts()`, not copied media-query strings.
- Prefer longhand properties over multi-value shorthands.
- Do not add `@stylexjs/eslint-plugin`. This repo lints with Biome, not ESLint.

Next compiles with Turbopack (`next.config.ts` sets `turbopack: {}`) and `reactCompiler: true`. Adding `babel.config.js` opts the app into Babel. Phase 0 must show that StyleX styles survive `reactCompiler` in dev and in `next build`, on a server component and a client component. If the compiler plugin strips StyleX output, record the required plugin order before any page is converted. Do not turn `reactCompiler` off to make StyleX fit without noting it here.

Consumers that compile components outside `next dev`:

| Consumer                                                 | Change                                                                                                                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Next app, `next build`                                   | `babel.config.js` and `@stylexjs/postcss-plugin`, as in the Next.js install guide                                                                            |
| Storybook 10 (`@storybook/nextjs`)                       | Same plugin, still imports `globals.css` for the plain-CSS remainder                                                                                         |
| Cypress component tests (`cypress/support/component.ts`) | Webpack/Vite rule so `stylex.create` is transformed. Cypress mounts Week, Form, LifeTable, YearGrid, DecadeGrid                                              |
| Jest (`jest.config.ts`)                                  | Transform `@stylexjs/stylex` or mock `stylex.props` to a stable class name. Component tests that only check behavior can mock. Visual checks stay in Cypress |

`postcss.config.js` stays. Phase 5 removes `@tailwindcss/postcss` from it and leaves `@stylexjs/postcss-plugin` and `autoprefixer`. `postcss` stays as well. `tooling/design/check.ts` can still be deleted in Phase 6.

Dev loop today is `bun clean && next dev`, which deletes `.next`. Storybook and Cypress already import `app/globals.css`. That file’s `@stylex;` directive is their CSS entry too, once their compilers run the same Babel and PostCSS plugins.

## Phases

Each phase ends with `bun run check`, `bun test`, a production build, and a visual pass. Cypress already has baselines for the form, life table, decade grid, and the filled home form (`cypress/snapshots/base`). Re-run component and e2e visual tests at the end of Phases 3, 4, and 5. Update a baseline only after a human compares the diff. A green rebaseline with an unreviewed diff is a failed migration.

### Phase 0 — Spike (no product UI)

1. Read the Next.js install guide and `stylex-installation.md`, then install with the `bun add` commands above. Add `babel.config.js`, point `postcss.config.js` at `@stylexjs/postcss-plugin` without removing Tailwind yet, and add `@stylex;` to `app/globals.css`.
2. Convert one server component (`app/not-found.tsx`) and one client component (`components/KofiButton.tsx`).
3. Confirm dev, `next build`, Storybook, Cypress component mount, and Jest.
4. Confirm `color-mix` output matches `border-accent/40` from the current build.
5. Confirm `@media (prefers-color-scheme: dark)` and `@media print` both compile, including `print-color-adjust`. Do not spike `::after` or `attr()`. Year ticks and table cells will be real elements.
6. Write the pass/fail note at the top of this file. Stop if the React Compiler strips StyleX.

### Phase 1 — Tokens, Tailwind still installed

1. Add `styles/tokens.stylex.ts` and the four recipes.
2. Keep `@theme` in `globals.css` so unconverted components still render.
3. Add a temporary double-read: new code uses tokens, old code uses Tailwind classes that point at the same `@theme` variables. No visual change.

### Phase 2 — Leaf components

Order is bottom-up so pages keep compiling:

1. `DecadeGrid`, `YearGrid`, `LifeTable` (layout only)
2. `BackButton`, `KofiButton`, `BurstScene` chrome, `BurstSceneLazy`
3. Content components except `ScrollTable`
4. `Footer`, loading skeletons, error and not-found pages
5. `MementoCard`
6. `LabeledInput`, then `Form` (checkbox `:has()`)
7. `PopOver` shell, still using `.popover-*` class names

### Phase 3 — Pages and MDX elements

1. `app/layout.tsx` (skip link, body column, font variables stay as `next/font`)
2. `app/page.tsx`
3. `app/blog/page.tsx`
4. `app/[view]/[...params]/page.tsx` (keep `life-table-*` classes)
5. `mdx-components.tsx` and the one MDX file’s `text-right` cells
6. Storybook stories that still use utility strings for chrome

### Phase 4 — Week grid and scroll table

These two are the regression risks. The life table is 52 columns by decades, with a 1px border, a half-cell gap, and a year label beside the first week of each year. The scroll table pins the first column. Neither case keeps a pseudo-element or a parent `[&_…]` selector.

1. Rewrite `Week.tsx` without `cn`. The square stays the cell. The year label becomes a `<span>` shown for year 1 and each later year mark, with the same absolute position, type, and color as today’s `::after`. Preserve the current-week width, the second-half `ml-auto`, and existing `data-cy` behavior. Filled and current-week colors include the dark media query and `print-color-adjust: exact`.
2. Add the one-page print layout on the calendar view: hide chrome, light palette, table scaled to the printable page, filled weeks inked. Check it in the browser print preview with a DOB that has many filled weeks, in both light and dark screen themes.
3. Rewrite `ScrollTable` as the scroll region only. Apply table, header, and cell styles directly on `table`, `caption`, `th`, and `td`. Compare a wide article table at 390px and at 1280px, including sticky first column and row hover. Print preview of that article keeps the table readable (header repeats are not required; the grid must not clip mid-cell).
4. Run `LifeTable` and `DecadeGrid` Cypress component tests and the home e2e snapshot. Cypress does not cover print or `prefers-color-scheme`, so those stay a manual preview.

### Phase 5 — Remove Tailwind

Only after `rg` shows no utility class strings in `app/`, `components/`, `content/`, and `mdx-components.tsx`.

1. Delete `@import "tailwindcss"`, `@theme inline`, and `@utility stroke` / `stroke-l` / `stroke-b` from `globals.css`. Keep `@stylex;` plus the popover and life-table CSS.
2. Remove packages: `tailwindcss`, `@tailwindcss/postcss`, `cnfast`. Keep `@stylexjs/stylex`, `@stylexjs/babel-plugin`, `@stylexjs/postcss-plugin`, `autoprefixer`, and `postcss`.
3. Remove `lib/utils.ts` `cn` export and `lib/utils.test.ts` cases that only test `cnfast`. Keep the file if other helpers still live there.
4. Leave `postcss.config.js` with `@stylexjs/postcss-plugin` and `autoprefixer` only.
5. Leave `babel.config.js` in place.
6. Production build, Storybook build, Cypress component + e2e visual, and a manual pass of: home, a filled calendar (light and dark), blog index, one article with a table and a quote, about, 404, and the form error state. Repeat the filled calendar and the article in print preview.

Dark mode check is the OS setting, not a `class="dark"` toggle. The app never adds a `dark` class. Every `dark:` split that survives (week fill and border, inline code, back-button hover) is checked in that OS dark theme, not only in light. Print preview is checked from both themes and must still render the light one-page table.

### Phase 6 — Plugin and lint cleanup

Biome (`biome.json`):

- Set the `tailwind` domain to `"none"`.
- Set `css.parser.tailwindDirectives` to `false`.
- Remove the two plugin entries that point at `tooling/design/classes.grit` and `tooling/design/css.grit`.

Design lint (`tooling/design/`):

- `classes.grit` and `css.grit` parse Tailwind class strings and `@theme` keys. They have no StyleX input. Delete them.
- `policy.json` and `baseline.json` exist to allow or ban Tailwind scales. Delete them once tokens live in `styles/tokens.stylex.ts`.
- `check.ts` and `check.test.ts` walk source for class strings. Delete them and the `lint:design` script.
- The override in `biome.json` for `tooling/design/check.test.ts` goes away with that file.

Do not replace this with a second class-name linter. The constraint moves to TypeScript: colors, font sizes, and tracking come from `tokens`.

Docs that still describe Tailwind as the system (`color_report.md`, `DESIGN_UPDATES.md`, `finding_improvements.md`, `README.md` if it mentions Tailwind) get a one-line correction when the packages are gone. They are not part of the runtime migration.

## Verification matrix

| Surface                                    | Light | Dark | Narrow (390) | Desktop       | Notes                                                                                                          |
| ------------------------------------------ | ----- | ---- | ------------ | ------------- | -------------------------------------------------------------------------------------------------------------- |
| Home form, empty and filled                | yes   | yes  | yes          | yes           | Existing e2e snapshot `form-filled`                                                                            |
| Life table, one year and a decade boundary | yes   | yes  | yes          | yes           | Scale transform, not zoom. Print preview: one page, filled weeks visible, light ink even if the screen is dark |
| Week hover popover, edge and center        | yes   | yes  | yes          | yes           | Anchor positioning CSS unchanged. Popover is hidden in print                                                   |
| Burst scene                                | yes   | yes  | yes          | yes           | Canvas untouched; chrome only. Burst view prints as the table, not the canvas                                  |
| Blog index and one article                 | yes   | yes  | yes          | yes           | Table, quote, image, FAQ. Article print keeps the scroll table readable                                        |
| Footer and back button                     | yes   | yes  | yes          | print preview | `print` hides both. Also hidden: view switcher and the weeks-lived block                                       |
| 404, error, blog not-found                 | yes   | yes  | yes          | yes           | Shared stroke button                                                                                           |
| Skip link                                  | yes   |      |              | keyboard      | Focus must un-hide it                                                                                          |

Automated: `bun run check`, `bun test`, `bun run build`, `bun run cypress:component`, Storybook build. Browser pass on the rows above for any phase that changes a page.

## Risks

- **React Compiler vs StyleX plugin.** Highest risk. Phase 0 exists only for this.
- **Turbopack CSS order.** StyleX atomic CSS and the remaining `globals.css` must both apply. Popover and life-table rules must not be dropped by the Tailwind-less pipeline.
- **Cypress and Storybook compilers** lag the Next config and render untransformed `stylex.create` calls. Wire them in Phase 0, not after Phase 4.
- **Year-tick markup and table cell styles** can shift the label or the sticky column without changing a screenshot of an empty page. Compare a decade boundary on the life table, and hover plus horizontal scroll on a wide article table. The checkbox `:has()` rewrite needs a keyboard check too.
- **Print and dark mode are untested by Cypress.** `print-color-adjust` omitted means filled weeks print as empty boxes. The screen `transform: scale()` left in place means the table clips or runs onto a second page. Preview a life with most weeks filled, from both color schemes, and confirm one page and visible fills before calling Phase 4 done.
- **Redundant `dark:` classes** look like they do work. Deleting them is correct only when both sides use the same `light-dark()` token. When they differ (`border-week` vs `dark:border-accent`), keep the media query.
- **`w-208` and `grid-cols-52`** are generated utilities, not theme keys. Hard-code `52rem` and `repeat(52, minmax(0, 1fr))` or the year row wraps.
- **Visual baselines** will shift by subpixels if `color-mix` or font smoothing differs. Diff before replacing `cypress/snapshots/base`.

## Out of scope

- Redesign, new breakpoints, or a manual theme toggle.
- Rewriting the life-table scale math.
- Moving `next/font` setup.
- Converting coverage HTML, snapshot PNGs, or historical notes under `color_report.md` beyond a status line.
