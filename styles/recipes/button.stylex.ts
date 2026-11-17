import * as stylex from "@stylexjs/stylex";
import { tokens } from "../tokens.stylex";

/** Stroke button: 3px border, accent, wide tracking, uppercase. */
export const button = stylex.create({
  base: {
    display: "inline-block",
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: tokens.accent,
    paddingInline: "1.5rem",
    paddingBlock: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: tokens.accent,
    textTransform: "uppercase",
    textAlign: "center",
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  quiet: {
    borderColor: tokens.border,
    color: tokens.quiet,
  },
});
