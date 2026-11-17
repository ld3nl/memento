import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { tokens } from "../../styles/tokens.stylex";

const styles = stylex.create({
  section: {
    marginTop: "4rem",
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: tokens.border,
    paddingTop: "2.5rem",
  },
  heading: {
    marginTop: 0,
    marginBottom: 0,
    fontFamily: tokens.fontDisplay,
    fontSize: "1.5rem",
    lineHeight: "calc(2 / 1.5)",
    fontStyle: "italic",
    fontWeight: 400,
    color: tokens.accent,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    marginTop: "1.5rem",
    marginBottom: 0,
    paddingInline: 0,
    paddingBlock: 0,
    listStyleType: "none",
  },
  link: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.25rem",
    lineHeight: "calc(1.75 / 1.25)",
    fontStyle: "italic",
    fontWeight: 400,
    color: {
      default: tokens.primary,
      ":hover": tokens.accent,
    },
    textDecorationLine: "none",
  },
  description: {
    marginTop: "0.25rem",
    marginBottom: 0,
    fontSize: "0.875rem",
    lineHeight: 1.625,
    color: tokens.secondary,
  },
});

export function RelatedPosts({
  posts,
}: {
  posts: Array<{ slug: string; title: string; description: string }>;
}) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      {...stylex.props(styles.section)}
      aria-labelledby="related-heading"
    >
      <h2 id="related-heading" {...stylex.props(styles.heading)}>
        Keep reading
      </h2>
      <ul {...stylex.props(styles.list)}>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} {...stylex.props(styles.link)}>
              {post.title}
            </Link>
            <p {...stylex.props(styles.description)}>{post.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
