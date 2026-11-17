import * as stylex from "@stylexjs/stylex";
import { tokens } from "../tokens.stylex";

/** Display face, label tracking, uppercase kicker. */
export const kicker = stylex.create({
  base: {
    fontFamily: tokens.fontDisplay,
    fontSize: tokens.kicker,
    fontWeight: 600,
    letterSpacing: tokens.trackingLabel,
    textTransform: "uppercase",
    color: tokens.secondary,
  },
});
