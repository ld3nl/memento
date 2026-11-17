import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

const styles = stylex.create({
  root: {
    marginInline: "auto",
    maxWidth: "32rem",
    paddingInline: "1rem",
    paddingBlock: "4rem",
    textAlign: "center",
  },
  title: {
    fontFamily: "var(--font-garamond), serif",
    fontSize: "1.875rem",
    fontStyle: "italic",
  },
  body: {
    color: "var(--color-secondary)",
    marginTop: "1rem",
    fontSize: "0.875rem",
  },
  actions: {
    marginTop: "2rem",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1rem",
  },
  primaryLink: {
    display: "inline-block",
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "var(--color-accent)",
    paddingInline: "1.5rem",
    paddingBlock: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "var(--color-accent)",
    textTransform: "uppercase",
  },
  secondaryLink: {
    display: "inline-block",
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "var(--color-border)",
    paddingInline: "1.5rem",
    paddingBlock: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "var(--color-quiet)",
    textTransform: "uppercase",
  },
});

export default function NotFound() {
  return (
    <div {...stylex.props(styles.root)}>
      <h1 {...stylex.props(styles.title)}>Page not found</h1>
      <p {...stylex.props(styles.body)}>
        That page is missing, or the calendar date is invalid.
      </p>
      <div {...stylex.props(styles.actions)}>
        <Link href="/" {...stylex.props(styles.primaryLink)}>
          Back to calendar
        </Link>
        <Link href="/blog" {...stylex.props(styles.secondaryLink)}>
          Journal
        </Link>
      </div>
    </div>
  );
}
