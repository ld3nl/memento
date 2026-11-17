import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { breakpoints } from "../styles/breakpoints.stylex";
import { tokens } from "../styles/tokens.stylex";

interface BackButtonProps {
  href?: string;
  className?: string;
}

const styles = stylex.create({
  button: {
    position: "fixed",
    top: "1rem",
    left: "1rem",
    zIndex: 50,
    display: {
      default: "flex",
      [breakpoints.print]: "none",
    },
    alignItems: "center",
    justifyContent: "center",
    height: "2.75rem",
    width: "2.75rem",
    borderRadius: 9999,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: {
      default: tokens.line,
      ":hover": tokens.accent,
      [breakpoints.dark]: {
        default: tokens.border,
        ":hover": tokens.accent,
      },
    },
    backgroundColor: {
      default: tokens.surfaceRaised,
      ":hover": tokens.surface,
      [breakpoints.dark]: {
        default: null,
        ":hover": tokens.surfaceRaised,
      },
    },
    boxShadow: {
      default: `0 10px 15px -3px color-mix(in oklab, ${tokens.red600} 5%, transparent), 0 4px 6px -4px color-mix(in oklab, ${tokens.red600} 5%, transparent)`,
      ":hover": `0 20px 25px -5px color-mix(in oklab, ${tokens.red600} 10%, transparent), 0 8px 10px -6px color-mix(in oklab, ${tokens.red600} 10%, transparent)`,
      ":focus-visible": `0 0 0 4px color-mix(in oklab, ${tokens.accent} 40%, transparent), 0 10px 15px -3px color-mix(in oklab, ${tokens.red600} 5%, transparent), 0 4px 6px -4px color-mix(in oklab, ${tokens.red600} 5%, transparent)`,
      ":hover:focus-visible": `0 0 0 4px color-mix(in oklab, ${tokens.accent} 40%, transparent), 0 20px 25px -5px color-mix(in oklab, ${tokens.red600} 10%, transparent), 0 8px 10px -6px color-mix(in oklab, ${tokens.red600} 10%, transparent)`,
    },
    backdropFilter: "blur(8px)",
    outlineStyle: {
      default: null,
      ":focus-visible": "none",
    },
    transitionProperty: "transform, translate, scale, rotate",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transform: {
      default: null,
      ":hover": "scale(1.05)",
    },
  },
  icon: {
    color: tokens.primary,
  },
});

const BackButton = ({ href = "/", className = "" }: BackButtonProps) => {
  const buttonProps = stylex.props(styles.button);
  const mergedClassName = [buttonProps.className, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={href}
      {...buttonProps}
      className={mergedClassName}
      aria-label="Go back"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...stylex.props(styles.icon)}
      >
        <title>Go back</title>
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    </Link>
  );
};

export default BackButton;
