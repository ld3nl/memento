import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { breakpoints } from "../../styles/breakpoints.stylex";
import { tokens } from "../../styles/tokens.stylex";

const styles = stylex.create({
  scroller: {
    containerType: "inline-size",
    marginInline: {
      default: "-1rem",
      [breakpoints.sm]: "-1.5rem",
    },
    marginBlock: "2.5rem",
    overflowX: "auto",
    overscrollBehaviorX: "contain",
    paddingInline: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
    },
    outlineStyle: {
      default: null,
      ":focus-visible": "solid",
    },
    outlineWidth: {
      default: null,
      ":focus-visible": 2,
    },
    outlineOffset: {
      default: null,
      ":focus-visible": 2,
    },
    outlineColor: {
      default: null,
      ":focus-visible": tokens.accent,
    },
  },
});

/** Marker class for right-aligned cells. Unlayered `.scroll-table` CSS
 *  beats StyleX layers, so text-align must live in plain CSS too. */
export const SCROLL_TABLE_RIGHT = "scroll-table-right";

export function ScrollTable({ children }: { children: ReactNode }) {
  const scroller = stylex.props(styles.scroller);
  const className = [scroller.className, "scroll-table"]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      {...scroller}
      className={className}
      aria-label="Scrollable table"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a wide table scrolls on its own, so the region needs a tab stop
      tabIndex={0}
    >
      {children}
    </section>
  );
}
