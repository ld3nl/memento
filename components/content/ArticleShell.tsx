import * as stylex from "@stylexjs/stylex";
import { formatContentDate } from "../../lib/content-meta";
import { breakpoints } from "../../styles/breakpoints.stylex";
import { kicker as kickerStyle } from "../../styles/recipes/kicker.stylex";
import { prose } from "../../styles/recipes/prose.stylex";
import { tokens } from "../../styles/tokens.stylex";
import BackButton from "../BackButton";
import { type BreadcrumbItem, Breadcrumbs } from "./Breadcrumbs";
import { ContentImage } from "./ContentImage";

const styles = stylex.create({
  article: {
    width: "100%",
    paddingInline: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
    },
    paddingBlock: {
      default: "2.5rem",
      [breakpoints.sm]: "3rem",
      [breakpoints.lg]: "4rem",
    },
    fontSize: "1rem",
    lineHeight: 1.625,
    color: tokens.primary,
  },
  kicker: {
    marginTop: 0,
    marginBottom: "1rem",
  },
  title: {
    marginTop: 0,
    marginBottom: {
      default: "1.5rem",
      [breakpoints.sm]: "2rem",
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
  meta: {
    marginTop: 0,
    marginBottom: "2.5rem",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: tokens.secondary,
  },
  body: {
    display: "flow-root",
  },
});

export function ArticleShell({
  kicker,
  title,
  datePublished,
  readingMinutes,
  image,
  imageAlt,
  breadcrumbs,
  backHref = "/",
  children,
}: {
  kicker?: string;
  title: string;
  datePublished: string;
  readingMinutes: number;
  image?: string;
  imageAlt?: string;
  breadcrumbs: BreadcrumbItem[];
  backHref?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <BackButton href={backHref} />
      <article
        aria-label={title}
        {...stylex.props(prose.column, styles.article)}
      >
        <Breadcrumbs items={breadcrumbs} />
        {image ? (
          <ContentImage
            src={image}
            alt={imageAlt ?? ""}
            width={730}
            height={548}
            priority
          />
        ) : null}
        {kicker ? (
          <p {...stylex.props(kickerStyle.base, styles.kicker)}>{kicker}</p>
        ) : null}
        <h1 {...stylex.props(styles.title)}>{title}</h1>
        <p {...stylex.props(styles.meta)}>
          <time dateTime={datePublished}>
            {formatContentDate(datePublished)}
          </time>
          <span aria-hidden="true"> · </span>
          <span>{readingMinutes} min read</span>
        </p>
        <div {...stylex.props(styles.body)}>{children}</div>
      </article>
    </>
  );
}
