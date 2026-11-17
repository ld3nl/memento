import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { kicker } from "../../styles/recipes/kicker.stylex";
import { tokens } from "../../styles/tokens.stylex";

export type BreadcrumbItem = {
  name: string;
  href?: string;
};

const styles = stylex.create({
  nav: {
    marginBottom: "2rem",
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: 0,
    marginBottom: 0,
    paddingInline: 0,
    paddingBlock: 0,
    listStyleType: "none",
    letterSpacing: tokens.trackingLabelTight,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  link: {
    // Explicit color — UA `a { color }` beats inheritance from the kicker ol.
    color: {
      default: tokens.secondary,
      ":hover": tokens.accent,
    },
    textDecorationLine: "none",
  },
  current: {
    color: tokens.primary,
  },
});

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" {...stylex.props(styles.nav)}>
      <ol {...stylex.props(kicker.base, styles.list)}>
        {items.map((item, index) => (
          <li key={item.href ?? item.name} {...stylex.props(styles.item)}>
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} {...stylex.props(styles.link)}>
                {item.name}
              </Link>
            ) : (
              <span {...stylex.props(styles.current)}>{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
