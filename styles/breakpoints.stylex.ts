import * as stylex from "@stylexjs/stylex";

/**
 * Shared media queries — use as nested keys inside stylex.create.
 *
 * StyleX atomic CSS sorts rules by property value, not by breakpoint size.
 * Overlapping `min-width` steps on the same property can therefore resolve
 * wrong (e.g. `9rem` at sm beats `11rem` at lg). Use the `*Only` bands when
 * a property has two or more size steps whose values do not sort ascending.
 */
export const breakpoints = stylex.defineConsts({
  sm: "@media (min-width: 40rem)",
  md: "@media (min-width: 48rem)",
  lg: "@media (min-width: 64rem)",
  xl: "@media (min-width: 80rem)",
  xl2: "@media (min-width: 96rem)",
  /** 40rem–64rem — use between default and `lg` when values can mis-sort. */
  smOnly: "@media (min-width: 40rem) and (max-width: 63.999rem)",
  /** 64rem–80rem — use between `smOnly`/`sm` and `xl` when values can mis-sort. */
  lgOnly: "@media (min-width: 64rem) and (max-width: 79.999rem)",
  print: "@media print",
  dark: "@media (prefers-color-scheme: dark)",
});
