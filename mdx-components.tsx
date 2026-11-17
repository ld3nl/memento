import * as stylex from "@stylexjs/stylex";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import {
  Children,
  type CSSProperties,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { ContentImage } from "./components/content/ContentImage";
import { PullQuote } from "./components/content/PullQuote";
import {
  SCROLL_TABLE_RIGHT,
  ScrollTable,
} from "./components/content/ScrollTable";
import { TryCalendar } from "./components/content/TryCalendar";
import { breakpoints } from "./styles/breakpoints.stylex";
import { kicker } from "./styles/recipes/kicker.stylex";
import { textLink } from "./styles/recipes/textLink.stylex";
import { tokens } from "./styles/tokens.stylex";

const styles = stylex.create({
  h1: {
    marginTop: 0,
    marginBottom: {
      default: "2rem",
      [breakpoints.sm]: "2.5rem",
    },
    fontFamily: tokens.fontDisplay,
    fontSize: {
      default: tokens.display,
      [breakpoints.sm]: "3rem",
    },
    lineHeight: 1.25,
    letterSpacing: "-0.025em",
    fontStyle: "italic",
    fontWeight: 400,
    color: tokens.accent,
  },
  h2: {
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
  h3: {
    marginTop: "2rem",
    marginBottom: "0.75rem",
    fontFamily: tokens.fontDisplay,
    fontSize: {
      default: "1.25rem",
      [breakpoints.sm]: "1.5rem",
    },
    lineHeight: {
      default: "calc(1.75 / 1.25)",
      [breakpoints.sm]: "calc(2 / 1.5)",
    },
    fontStyle: "italic",
    fontWeight: 400,
    color: tokens.primary,
  },
  p: {
    marginTop: 0,
    marginBottom: "1.5rem",
    color: tokens.primary,
  },
  list: {
    marginTop: 0,
    marginBottom: {
      default: "1.5rem",
      [breakpoints.sm]: "2rem",
    },
    paddingLeft: "1.5rem",
    color: tokens.secondary,
  },
  disc: {
    listStyleType: "disc",
  },
  decimal: {
    listStyleType: "decimal",
  },
  li: {
    lineHeight: 1.625,
  },
  itemGap: {
    marginTop: "0.75rem",
  },
  table: {
    width: "max-content",
    minWidth: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    textAlign: "left",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
  },
  caption: {
    captionSide: "top",
    position: "sticky",
    left: 0,
    zIndex: 1,
    marginTop: 0,
    marginBottom: "1rem",
    width: "100cqi",
    textAlign: "left",
    fontFamily: tokens.fontDisplay,
    fontSize: "1rem",
    lineHeight: 1.5,
    fontStyle: "italic",
    fontWeight: 400,
    color: tokens.primary,
  },
  th: {
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
    backgroundColor: tokens.surface,
    paddingTop: "0.75rem",
    paddingBottom: "0.75rem",
    paddingRight: "2rem",
    whiteSpace: "nowrap",
    textAlign: "left",
  },
  td: {
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
    backgroundColor: tokens.surface,
    paddingTop: "0.75rem",
    paddingBottom: "0.75rem",
    paddingRight: "2rem",
    fontFamily: tokens.fontMono,
    whiteSpace: "nowrap",
    color: tokens.primary,
    textAlign: "left",
    fontVariantNumeric: "tabular-nums",
  },
  right: {
    textAlign: "right",
  },
  strong: {
    fontWeight: 600,
    color: tokens.primary,
  },
  blockquote: {
    marginTop: "2rem",
    marginBottom: "2rem",
    borderLeftWidth: 3,
    borderLeftStyle: "solid",
    borderLeftColor: `color-mix(in oklab, ${tokens.accent} 40%, transparent)`,
    paddingLeft: "1.5rem",
    color: tokens.primary,
    fontStyle: "italic",
  },
  hr: {
    marginTop: "3rem",
    marginBottom: "3rem",
    borderWidth: 0,
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: tokens.border,
  },
  code: {
    fontFamily: tokens.fontMono,
    fontSize: "0.9em",
    color: {
      default: tokens.zinc700,
      [breakpoints.dark]: tokens.zinc300,
    },
  },
  link: {
    textDecorationColor: {
      default: `color-mix(in oklab, ${tokens.accent} 30%, transparent)`,
      ":hover": tokens.accent,
    },
  },
});

type CellProps = {
  className?: string;
  style?: CSSProperties;
};

function isCell(child: ReactNode): child is ReactElement<CellProps> {
  return isValidElement(child);
}

function wantsRight(className?: string) {
  return className?.split(/\s+/).includes("text-right") ?? false;
}

function withItemGap(children: ReactNode) {
  const gap = stylex.props(styles.itemGap);
  let seenItem = false;

  return Children.map(children, child => {
    if (!isCell(child)) {
      return child;
    }

    if (!seenItem) {
      seenItem = true;
      return child;
    }

    const className = [child.props.className, gap.className]
      .filter(Boolean)
      .join(" ");

    return cloneElement(child, {
      className,
      style: { ...gap.style, ...child.props.style },
    });
  });
}

export function RightCell({
  header = false,
  scope,
  children,
}: {
  header?: boolean;
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  children: ReactNode;
}) {
  if (header) {
    const props = stylex.props(kicker.base, styles.th, styles.right);
    return (
      <th
        scope={scope}
        {...props}
        className={[props.className, SCROLL_TABLE_RIGHT]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </th>
    );
  }

  const props = stylex.props(styles.td, styles.right);
  return (
    <td
      {...props}
      className={[props.className, SCROLL_TABLE_RIGHT]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </td>
  );
}

const components = {
  ContentImage,
  PullQuote,
  RightCell,
  ScrollTable,
  TryCalendar,
  h1: ({ children, id, ...props }) => (
    <h1 id={id} {...props} {...stylex.props(styles.h1)}>
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2 id={id} {...props} {...stylex.props(styles.h2)}>
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 id={id} {...props} {...stylex.props(styles.h3)}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p {...props} {...stylex.props(styles.p)}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul {...props} {...stylex.props(styles.list, styles.disc)}>
      {withItemGap(children)}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol {...props} {...stylex.props(styles.list, styles.decimal)}>
      {withItemGap(children)}
    </ol>
  ),
  li: ({ children, className, ...props }) => {
    const item = stylex.props(styles.li);
    const merged = [item.className, className].filter(Boolean).join(" ");

    return (
      <li {...props} {...item} className={merged}>
        {children}
      </li>
    );
  },
  table: ({ children, ...props }) => (
    <table {...props} {...stylex.props(styles.table)}>
      {children}
    </table>
  ),
  caption: ({ children, ...props }) => (
    <caption {...props} {...stylex.props(styles.caption)}>
      {children}
    </caption>
  ),
  th: ({ children, className, ...props }) => (
    <th
      {...props}
      {...stylex.props(
        kicker.base,
        styles.th,
        wantsRight(className) && styles.right
      )}
    >
      {children}
    </th>
  ),
  td: ({ children, className, ...props }) => (
    <td
      {...props}
      {...stylex.props(styles.td, wantsRight(className) && styles.right)}
    >
      {children}
    </td>
  ),
  strong: ({ children, ...props }) => (
    <strong {...props} {...stylex.props(styles.strong)}>
      {children}
    </strong>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote {...props} {...stylex.props(styles.blockquote)}>
      {children}
    </blockquote>
  ),
  hr: props => <hr {...props} {...stylex.props(styles.hr)} />,
  code: ({ children, ...props }) => (
    <code {...props} {...stylex.props(styles.code)}>
      {children}
    </code>
  ),
  a: ({ href, children, ...props }) => {
    if (!href) {
      return <span {...props}>{children}</span>;
    }

    const external = href.startsWith("http://") || href.startsWith("https://");
    const linkProps = stylex.props(textLink.base, styles.link);

    if (!external && href.startsWith("/")) {
      return (
        <Link href={href} {...props} {...linkProps}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        {...props}
        rel={external ? "noopener noreferrer" : undefined}
        {...linkProps}
      >
        {children}
      </a>
    );
  },
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
