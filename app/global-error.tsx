"use client";

import * as stylex from "@stylexjs/stylex";
import { button } from "../styles/recipes/button.stylex";
import { tokens } from "../styles/tokens.stylex";
import "./globals.css";

const styles = stylex.create({
  body: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    backgroundColor: tokens.surface,
    paddingInline: "1rem",
    paddingBlock: "4rem",
    textAlign: "center",
    color: tokens.primary,
    colorScheme: "light dark",
  },
  title: {
    marginTop: 0,
    marginBottom: 0,
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

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body {...stylex.props(styles.body)}>
        <h1 {...stylex.props(styles.title)}>Something went wrong</h1>
        <p {...stylex.props(styles.message)}>
          {error.message || "The application failed to load."}
        </p>
        <button
          type="button"
          onClick={() => retry()}
          {...stylex.props(button.base, styles.action)}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
