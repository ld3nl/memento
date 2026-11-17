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
    width: "10rem",
    marginBottom: "1.5rem",
    backgroundColor: tokens.border,
  },
  title: {
    height: "3rem",
    width: "75%",
    marginBottom: "1rem",
    backgroundColor: tokens.border,
  },
  line: {
    height: "1rem",
    width: "100%",
    backgroundColor: tokens.border,
  },
});

export default function AboutLoading() {
  return (
    <div {...stylex.props(prose.column, styles.page)}>
      <div {...stylex.props(styles.kicker)} />
      <div {...stylex.props(styles.title)} />
      <div {...stylex.props(styles.line)} />
    </div>
  );
}
