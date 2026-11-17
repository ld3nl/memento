import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import BackButton from "../../components/BackButton";
import { Breadcrumbs } from "../../components/content/Breadcrumbs";
import { JsonLd } from "../../components/content/JsonLd";
import { listPublishedPosts } from "../../lib/content";
import { formatContentDate } from "../../lib/content-meta";
import { contentMetadata } from "../../lib/content-metadata";
import { blogJsonLd, breadcrumbJsonLd, graphJsonLd } from "../../lib/json-ld";
import { SITE_URL } from "../../lib/site";
import { breakpoints } from "../../styles/breakpoints.stylex";
import { kicker } from "../../styles/recipes/kicker.stylex";
import { prose } from "../../styles/recipes/prose.stylex";
import { tokens } from "../../styles/tokens.stylex";

const styles = stylex.create({
  page: {
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
    color: tokens.primary,
  },
  kicker: {
    marginTop: 0,
    marginBottom: "1rem",
  },
  title: {
    marginTop: 0,
    marginBottom: "1.5rem",
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
  intro: {
    marginTop: 0,
    marginBottom: "2.5rem",
    maxWidth: "36rem",
    fontSize: "1rem",
    lineHeight: 1.625,
    color: tokens.primary,
  },
  list: {
    marginTop: 0,
    marginBottom: 0,
    paddingInline: 0,
    paddingBlock: 0,
    listStyleType: "none",
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: tokens.border,
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
  },
  item: {
    paddingBlock: "2rem",
  },
  divider: {
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: tokens.border,
  },
  meta: {
    marginTop: 0,
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: tokens.secondary,
  },
  postTitle: {
    fontFamily: tokens.fontDisplay,
    fontSize: {
      default: "1.5rem",
      [breakpoints.sm]: "1.875rem",
    },
    lineHeight: 1.375,
    fontStyle: "italic",
    fontWeight: 400,
    color: {
      default: tokens.primary,
      ":hover": tokens.accent,
    },
    textDecorationLine: "none",
  },
  description: {
    marginTop: "0.75rem",
    marginBottom: 0,
    fontSize: "1rem",
    lineHeight: 1.625,
    color: tokens.secondary,
  },
  feed: {
    marginTop: "2.5rem",
    marginBottom: 0,
  },
  feedLink: {
    letterSpacing: tokens.trackingLabelTight,
    color: {
      default: tokens.secondary,
      ":hover": tokens.accent,
    },
    textDecorationLine: "none",
  },
});

export const ensureStatic = "navigation";

export const metadata: Metadata = {
  ...contentMetadata({
    title: "Stoicism and Life in Weeks",
    description:
      "Read about memento mori, Stoicism, and life in weeks, with simple ways to make time for what matters to you.",
    path: "/blog",
    keywords: [
      "memento mori",
      "stoicism",
      "steve jobs",
      "life in weeks",
      "stoic practice",
    ],
    ogType: "website",
  }),
  alternates: {
    canonical: `${SITE_URL}/blog`,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
};

export default async function BlogIndexPage() {
  "use cache";
  cacheLife("max");
  const posts = await listPublishedPosts();

  const jsonLd = graphJsonLd([
    blogJsonLd(
      posts.map(post => ({
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        slug: post.slug,
      }))
    ),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Journal", path: "/blog" },
    ]),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <BackButton href="/" />
      <div {...stylex.props(prose.column, styles.page)}>
        <Breadcrumbs
          items={[{ name: "Home", href: "/" }, { name: "Journal" }]}
        />
        <p {...stylex.props(kicker.base, styles.kicker)}>Journal</p>
        <h1 {...stylex.props(styles.title)}>
          Notes on life, time, and Stoicism
        </h1>
        <p {...stylex.props(styles.intro)}>
          Thoughts on memento mori, Stoicism, and life in weeks. A place to
          reflect on how you spend your time and what matters to you.
        </p>
        <ul {...stylex.props(styles.list)}>
          {posts.map((post, index) => (
            <li
              key={post.slug}
              {...stylex.props(styles.item, index > 0 && styles.divider)}
            >
              <p {...stylex.props(styles.meta)}>
                <time dateTime={post.frontmatter.datePublished}>
                  {formatContentDate(post.frontmatter.datePublished)}
                </time>
                <span aria-hidden="true"> · </span>
                <span>{post.readingMinutes} min read</span>
              </p>
              <Link
                href={`/blog/${post.slug}`}
                {...stylex.props(styles.postTitle)}
              >
                {post.frontmatter.title}
              </Link>
              <p {...stylex.props(styles.description)}>
                {post.frontmatter.description}
              </p>
            </li>
          ))}
        </ul>
        <p {...stylex.props(styles.feed)}>
          <Link
            href="/feed.xml"
            {...stylex.props(kicker.base, styles.feedLink)}
          >
            RSS feed
          </Link>
        </p>
      </div>
    </>
  );
}
