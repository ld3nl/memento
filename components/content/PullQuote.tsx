import * as stylex from "@stylexjs/stylex";
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { breakpoints } from "../../styles/breakpoints.stylex";
import { tokens } from "../../styles/tokens.stylex";

const styles = stylex.create({
  quote: {
    marginTop: "2.5rem",
    marginBottom: "2.5rem",
    marginLeft: 0,
    marginRight: 0,
    borderLeftWidth: 3,
    borderLeftStyle: "solid",
    borderLeftColor: `color-mix(in oklab, ${tokens.accent} 40%, transparent)`,
    paddingLeft: "1.5rem",
  },
  text: {
    fontFamily: tokens.fontDisplay,
    fontSize: {
      default: "1.5rem",
      [breakpoints.sm]: "1.875rem",
    },
    lineHeight: 1.375,
    fontStyle: "italic",
    fontWeight: 400,
    color: tokens.primary,
  },
  lastBlock: {
    marginBottom: 0,
  },
  cite: {
    marginTop: "0.75rem",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: tokens.secondary,
  },
});

function withLastBlockFlush(children: ReactNode) {
  const items = Children.toArray(children);
  let lastElementIndex = -1;
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (isValidElement(items[index])) {
      lastElementIndex = index;
      break;
    }
  }
  if (lastElementIndex < 0) return children;

  return items.map((child, index) => {
    if (index !== lastElementIndex || !isValidElement(child)) return child;
    return cloneElement(
      child as ReactElement<{ className?: string }>,
      stylex.props(styles.lastBlock)
    );
  });
}

export function PullQuote({
  cite,
  children,
}: {
  cite?: string;
  children: ReactNode;
}) {
  return (
    <blockquote {...stylex.props(styles.quote)}>
      <div {...stylex.props(styles.text)}>{withLastBlockFlush(children)}</div>
      {cite ? <footer {...stylex.props(styles.cite)}>{cite}</footer> : null}
    </blockquote>
  );
}
