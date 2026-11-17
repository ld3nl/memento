"use client";

import * as stylex from "@stylexjs/stylex";
import { button } from "../styles/recipes/button.stylex";
import { tokens } from "../styles/tokens.stylex";

const styles = stylex.create({
  root: {
    marginInline: "auto",
    maxWidth: "32rem",
    paddingInline: "1rem",
    paddingBlock: "4rem",
    textAlign: "center",
  },
  title: {
    marginTop: 0,
    marginBottom: 0,
    fontFamily: tokens.fontDisplay,
    fontSize: "1.875rem",
    lineHeight: 1.2,
    fontStyle: "italic",
    fontWeight: 400,
  },
  message: {
    marginTop: "1rem",
    marginBottom: 0,
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: tokens.secondary,
  },
  action: {
    marginTop: "2rem",
    fontFamily: "inherit",
  },
});

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div {...stylex.props(styles.root)}>
      <h1 {...stylex.props(styles.title)}>Something went wrong</h1>
      <p {...stylex.props(styles.message)}>
        {error.message || "The calendar could not be rendered."}
      </p>
      <button
        type="button"
        onClick={() => retry()}
        {...stylex.props(button.base, styles.action)}
      >
        Try again
      </button>
    </div>
  );
}
