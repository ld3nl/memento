import * as stylex from "@stylexjs/stylex";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { breakpoints } from "../styles/breakpoints.stylex";
import { kicker } from "../styles/recipes/kicker.stylex";
import { tokens } from "../styles/tokens.stylex";
import { KofiButton } from "./KofiButton";

const styles = stylex.create({
  root: {
    marginTop: "auto",
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: tokens.line,
    backgroundColor: tokens.surface,
    paddingBlock: {
      default: "2.5rem",
      [breakpoints.sm]: "3rem",
    },
    display: {
      default: null,
      [breakpoints.print]: "none",
    },
  },
  container: {
    width: "100%",
    marginInline: "auto",
    maxWidth: {
      default: null,
      [breakpoints.sm]: "40rem",
      [breakpoints.md]: "48rem",
      [breakpoints.lg]: "64rem",
      [breakpoints.xl]: "80rem",
      [breakpoints.xl2]: "96rem",
    },
    paddingInline: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
      [breakpoints.lg]: "2rem",
    },
  },
  support: {
    marginBottom: {
      default: "2rem",
      [breakpoints.sm]: "2.5rem",
    },
    textAlign: "center",
  },
  supportLabel: {
    marginTop: "0.75rem",
    marginBottom: 0,
    fontSize: {
      default: tokens.kicker,
      [breakpoints.sm]: "0.75rem",
    },
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
    },
    marginBottom: {
      default: "2rem",
      [breakpoints.sm]: "2.5rem",
    },
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
  },
  navLink: {
    fontFamily: tokens.fontDisplay,
    fontWeight: 700,
    letterSpacing: tokens.trackingLabel,
    textTransform: "uppercase",
    textDecorationLine: "none",
    color: {
      default: tokens.secondary,
      ":hover": tokens.accent,
      ":focus": tokens.accent,
    },
    transitionProperty:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: {
      default: null,
      ":focus": `0 0 0 2px color-mix(in oklab, ${tokens.accent} 40%, transparent)`,
    },
    outlineStyle: {
      default: null,
      ":focus": "none",
    },
  },
  descriptionWrap: {
    marginBottom: {
      default: "2rem",
      [breakpoints.sm]: "2.5rem",
    },
    textAlign: "center",
  },
  description: {
    marginTop: 0,
    marginBottom: 0,
    marginInline: "auto",
    maxWidth: "42rem",
    fontFamily: tokens.fontSans,
    fontSize: {
      default: "0.75rem",
      [breakpoints.sm]: "0.875rem",
    },
    lineHeight: 1.625,
    color: tokens.secondary,
  },
  bottom: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: tokens.line,
    paddingTop: {
      default: "1.5rem",
      [breakpoints.sm]: "2rem",
    },
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  brandLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: {
      default: "2.25rem",
      [breakpoints.sm]: "2.5rem",
    },
    width: {
      default: "2.25rem",
      [breakpoints.sm]: "2.5rem",
    },
    borderRadius: 9999,
    backgroundColor: {
      default: tokens.surfaceRaised,
      ":hover": `color-mix(in oklab, ${tokens.accent} 10%, transparent)`,
    },
    textDecorationLine: "none",
    transitionProperty:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: {
      default: null,
      ":focus": `0 0 0 2px color-mix(in oklab, ${tokens.accent} 40%, transparent)`,
    },
    outlineStyle: {
      default: null,
      ":focus": "none",
    },
  },
  brandMark: {
    height: {
      default: "1rem",
      [breakpoints.sm]: "1.125rem",
    },
    width: {
      default: "1rem",
      [breakpoints.sm]: "1.125rem",
    },
  },
  copyright: {
    letterSpacing: tokens.trackingLabelTight,
    fontSize: {
      default: tokens.kicker,
      [breakpoints.sm]: "0.75rem",
    },
  },
});

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} {...stylex.props(styles.navLink)}>
      {children}
    </Link>
  );
}

async function copyrightYear() {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

export const Footer = async () => {
  const currentYear = await copyrightYear();
  const brandMark = stylex.props(styles.brandMark);

  return (
    <footer {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.support)}>
          <KofiButton size="small" />
          <p {...stylex.props(kicker.base, styles.supportLabel)}>
            Support this reflection tool
          </p>
        </div>

        <nav {...stylex.props(styles.nav)} aria-label="Footer navigation">
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/blog">Journal</FooterLink>
          <FooterLink href="/lives/elon-musk">Elon Musk</FooterLink>
          <FooterLink href="/table/1990/1/1">Example: 1990</FooterLink>
          <FooterLink href="/burst/1985/6/15">Burst View</FooterLink>
        </nav>

        <div {...stylex.props(styles.descriptionWrap)}>
          <p {...stylex.props(styles.description)}>
            Memento Mori Life Calendar visualizes life in weeks. Rooted in Stoic
            philosophy, it transforms abstract time into tangible perspective.
          </p>
        </div>

        <div {...stylex.props(styles.bottom)}>
          <div {...stylex.props(styles.brandRow)}>
            <Link
              href="https://www.echoflow.ca/"
              target="_blank"
              rel="noopener noreferrer"
              {...stylex.props(styles.brandLink)}
              aria-label="Echo Flow Canada"
            >
              <Image
                src="/echoflow-logo.svg"
                alt="Echo Flow"
                width={18}
                height={18}
                className={brandMark.className}
                style={brandMark.style}
              />
            </Link>
            <span {...stylex.props(kicker.base, styles.copyright)}>
              Echo Flow Canada © {currentYear}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
