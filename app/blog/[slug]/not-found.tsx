import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { button } from "../../../styles/recipes/button.stylex";
import { tokens } from "../../../styles/tokens.stylex";

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
  },
});

export default function BlogPostNotFound() {
  return (
    <div {...stylex.props(styles.root)}>
      <h1 {...stylex.props(styles.title)}>Note not found</h1>
      <p {...stylex.props(styles.message)}>
        That journal entry is missing or the link is old.
      </p>
      <Link href="/blog" {...stylex.props(button.base, styles.action)}>
        Back to the journal
      </Link>
    </div>
  );
}
