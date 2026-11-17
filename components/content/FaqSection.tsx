import * as stylex from "@stylexjs/stylex";
import type { FaqItem } from "../../lib/content-meta";
import { breakpoints } from "../../styles/breakpoints.stylex";
import { tokens } from "../../styles/tokens.stylex";

const styles = stylex.create({
  section: {
    marginTop: "4rem",
  },
  heading: {
    marginTop: {
      default: "2.5rem",
      [breakpoints.sm]: "3rem",
    },
    marginBottom: "1rem",
    fontFamily: tokens.fontDisplay,
    fontSize: {
      default: "1.5rem",
      [breakpoints.sm]: "1.875rem",
    },
    lineHeight: {
      default: "calc(2 / 1.5)",
      [breakpoints.sm]: "calc(2.25 / 1.875)",
    },
    fontStyle: "italic",
    fontWeight: 400,
    color: tokens.accent,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    marginTop: "1.5rem",
    marginBottom: 0,
  },
  question: {
    fontWeight: 600,
    color: tokens.primary,
  },
  answer: {
    marginTop: "0.5rem",
    marginBottom: 0,
    marginLeft: 0,
    lineHeight: 1.625,
    color: tokens.secondary,
  },
});

export function FaqSection({ items }: { items: FaqItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section {...stylex.props(styles.section)} aria-labelledby="faq-heading">
      <h2 id="faq-heading" {...stylex.props(styles.heading)}>
        Questions people ask
      </h2>
      <dl {...stylex.props(styles.list)}>
        {items.map(item => (
          <div key={item.question}>
            <dt {...stylex.props(styles.question)}>{item.question}</dt>
            <dd {...stylex.props(styles.answer)}>{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
