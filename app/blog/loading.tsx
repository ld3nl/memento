import * as stylex from "@stylexjs/stylex";
import { prose } from "../../styles/recipes/prose.stylex";
import { tokens } from "../../styles/tokens.stylex";

const styles = stylex.create({
  page: {
    width: "100%",
    paddingInline: "1rem",
    paddingBlock: "4rem",
  },
  kicker: {
    height: "0.75rem",
    width: "8rem",
    marginBottom: "1.5rem",
    backgroundColor: tokens.border,
  },
  title: {
    height: "3rem",
    width: "66.666667%",
    marginBottom: "2.5rem",
    backgroundColor: tokens.border,
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  block: {
    height: "6rem",
    width: "100%",
    backgroundColor: tokens.border,
  },
});

export default function BlogLoading() {
  return (
    <div {...stylex.props(prose.column, styles.page)}>
      <div {...stylex.props(styles.kicker)} />
      <div {...stylex.props(styles.title)} />
      <div {...stylex.props(styles.stack)}>
        <div {...stylex.props(styles.block)} />
        <div {...stylex.props(styles.block)} />
        <div {...stylex.props(styles.block)} />
      </div>
    </div>
  );
}
