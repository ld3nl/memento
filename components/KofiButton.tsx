"use client";

import * as stylex from "@stylexjs/stylex";
import Image from "next/image";
import Link from "next/link";

interface KofiButtonProps {
  /** Escape hatch for tests / one-off markers. Not for Tailwind strings. */
  className?: string;
  size?: "small" | "medium" | "large";
}

/** Display height in CSS pixels. Width follows the 580×146 file. */
const displayHeight = {
  small: 32,
  medium: 36,
  large: 48,
} as const;

const styles = stylex.create({
  link: {
    display: "inline-block",
    transitionProperty: "transform",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transform: {
      default: "scale(1)",
      ":hover": "scale(1.05)",
    },
  },
});

export const KofiButton = ({
  className = "",
  size = "medium",
}: KofiButtonProps) => {
  const stylexProps = stylex.props(styles.link);
  const mergedClassName = [stylexProps.className, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href="https://ko-fi.com/P5P81RSX2O"
      target="_blank"
      rel="noopener noreferrer"
      {...stylexProps}
      className={mergedClassName}
    >
      <Image
        src="/kofi4.png"
        alt="Buy Me a Coffee at ko-fi.com"
        width={580}
        height={146}
        style={{ width: "auto", height: displayHeight[size] }}
        priority={false}
      />
    </Link>
  );
};
