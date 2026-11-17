"use client";

import * as stylex from "@stylexjs/stylex";
import { useParams, useSearchParams } from "next/navigation";
import { breakpoints } from "../styles/breakpoints.stylex";
import { tokens } from "../styles/tokens.stylex";

const styles = stylex.create({
  title: {
    marginTop: 0,
    marginBottom: {
      default: "2.5rem",
      [breakpoints.sm]: "3rem",
      [breakpoints.print]: "0.2rem",
    },
    fontFamily: tokens.fontDisplay,
    fontSize: {
      default: "1.875rem",
      [breakpoints.sm]: "2.25rem",
      [breakpoints.lg]: "3rem",
      [breakpoints.print]: "0.95rem",
    },
    lineHeight: {
      default: 1.25,
      [breakpoints.print]: 1.15,
    },
    letterSpacing: "-0.025em",
    fontStyle: "italic",
    fontWeight: 400,
    textAlign: "center",
    color: tokens.primary,
  },
  viewName: {
    display: {
      default: "block",
      [breakpoints.print]: "inline",
    },
    marginTop: {
      default: "0.5rem",
      [breakpoints.print]: 0,
    },
    marginInlineStart: {
      default: 0,
      [breakpoints.print]: "0.5rem",
    },
    fontFamily: tokens.fontSans,
    fontSize: {
      default: "0.875rem",
      [breakpoints.sm]: "1rem",
      [breakpoints.print]: "0.55rem",
    },
    lineHeight: {
      default: "calc(1.25 / 0.875)",
      [breakpoints.sm]: 1.5,
      [breakpoints.print]: 1,
    },
    fontWeight: 600,
    fontStyle: {
      default: null,
      [breakpoints.print]: "normal",
    },
    letterSpacing: tokens.trackingLabel,
    textTransform: "uppercase",
    color: tokens.secondary,
  },
});

/**
 * Reads name/view from the URL on the client so the heading matches the
 * address bar immediately — no Suspense fallback flash of the wrong title.
 */
export function CalendarHeading() {
  const params = useParams<{ view?: string }>();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const view = params.view === "burst" ? "burst" : "table";

  return (
    <h1 {...stylex.props(styles.title)}>
      {name ? `${name}’s life in weeks` : "Your Life in Weeks"}
      <span {...stylex.props(styles.viewName)}>
        {view === "table" ? "Table View" : "Burst View"}
      </span>
    </h1>
  );
}
