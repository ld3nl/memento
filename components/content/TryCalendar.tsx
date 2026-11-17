import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import type { ReactNode } from "react";
import { tokens } from "../../styles/tokens.stylex";

const styles = stylex.create({
  note: {
    marginTop: "2.5rem",
    marginBottom: "2rem",
    borderLeftWidth: 3,
    borderLeftStyle: "solid",
    borderLeftColor: tokens.accent,
    paddingLeft: "1.5rem",
  },
  link: {
    fontFamily: tokens.fontDisplay,
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    fontWeight: 700,
    letterSpacing: tokens.trackingLabelTight,
    textTransform: "uppercase",
    color: tokens.accent,
    textDecorationLine: {
      default: "none",
      ":hover": "underline",
    },
  },
});

export function TryCalendar({
  href = "/",
  children = "See your weeks on the calendar",
}: {
  href?: string;
  children?: ReactNode;
}) {
  return (
    <p {...stylex.props(styles.note)}>
      <Link href={href} {...stylex.props(styles.link)}>
        {children}
      </Link>
    </p>
  );
}
