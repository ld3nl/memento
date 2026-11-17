import * as stylex from "@stylexjs/stylex";
import { tokens } from "../tokens.stylex";

/** Accent underline with ~30% decoration thickness. */
export const textLink = stylex.create({
  base: {
    color: tokens.accent,
    textDecorationLine: "underline",
    textDecorationColor: `color-mix(in oklab, ${tokens.accent} 30%, transparent)`,
    textUnderlineOffset: "0.15em",
  },
});
