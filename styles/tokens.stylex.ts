import * as stylex from "@stylexjs/stylex";

/**
 * Semantic design tokens. Values match `app/globals.css` `@theme inline`.
 * Palette vars (`--color-zinc-*`, etc.) come from Tailwind while it remains,
 * and from the explicit palette block in `globals.css` after Phase 5.
 */
export const tokens = stylex.defineVars({
  primary: "light-dark(var(--color-zinc-900), var(--color-zinc-50))",
  secondary: "light-dark(var(--color-zinc-500), var(--color-zinc-400))",
  quiet: "light-dark(var(--color-zinc-700), var(--color-zinc-200))",
  accent: "var(--color-red-600)",
  mark: "var(--color-amber-500)",
  border: "light-dark(var(--color-zinc-200), var(--color-zinc-700))",
  line: "light-dark(var(--color-zinc-200), var(--color-zinc-800))",
  surface: "light-dark(#fff, var(--color-zinc-950))",
  surfaceRaised: "light-dark(var(--color-zinc-100), var(--color-zinc-900))",
  panel: "light-dark(#fff, var(--color-zinc-900))",
  card: "var(--color-zinc-950)",
  week: "light-dark(var(--color-zinc-900), var(--color-red-600))",
  weekMuted: "light-dark(var(--color-zinc-900), var(--color-zinc-700))",
  white: "#fff",
  black: "#000",
  zinc300: "var(--color-zinc-300)",
  zinc700: "var(--color-zinc-700)",
  red600: "var(--color-red-600)",

  fontDisplay: "var(--font-garamond), serif",
  fontSans: "var(--font-inter), sans-serif",
  fontMono: "var(--font-jetbrains), monospace",

  tick: "0.625rem",
  tickLg: "0.8125rem",
  kicker: "0.6875rem",
  display: "2.5rem",
  cardTitle: "27px",
  cardMark: "40px",
  cardBody: "15px",
  cardCaption: "13px",
  leadingDisplay: "0.95",
  trackingLabel: "0.25em",
  trackingLabelTight: "0.2em",
  trackingMark: "1.75px",
  trackingMarkTight: "1.5px",
  trackingCard: "-0.03em",
  trackingTick: "0.14em",
  trackingTickSoft: "0.02em",
  popoverGap: "0.625rem",
});
