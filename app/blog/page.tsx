import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "../../components/BackButton";
import { Breadcrumbs } from "../../components/content/Breadcrumbs";
import { JsonLd } from "../../components/content/JsonLd";
import { listPublishedPosts } from "../../lib/content";
import { formatContentDate } from "../../lib/content-meta";
import { contentMetadata } from "../../lib/content-metadata";
import {
  blogJsonLd,
  breadcrumbJsonLd,
  graphJsonLd,
} from "../../lib/json-ld";
import { SITE_URL } from "../../lib/site";

export const metadata: Metadata = {
  ...contentMetadata({
    title: "Journal",
    description:
      "Notes on Stoicism, Steve Jobs's morning question, and how a life in weeks makes mortality useful instead of decorative.",
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
  const posts = await listPublishedPosts();

  const jsonLd = graphJsonLd([
    blogJsonLd(
      posts.map((post) => ({
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        slug: post.slug,
      })),
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
      <div className="text-primary mx-auto w-full max-w-prose px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
        <Breadcrumbs
          items={[{ name: "Home", href: "/" }, { name: "Journal" }]}
        />
        <p className="font-display mb-4 text-[0.6875rem] font-semibold tracking-[0.25em] text-zinc-500 uppercase">
          Journal
        </p>
        <h1 className="font-display text-accent mb-6 text-[2.5rem] leading-tight tracking-tight italic sm:text-5xl">
          Notes on a finite life
        </h1>
        <p className="text-primary mb-10 max-w-xl text-base leading-relaxed">
          Stoicism, memento mori, Steve Jobs's last-day question, and the
          arithmetic of a life in weeks. Written to be used, not collected.
        </p>
        <ul className="divide-border border-border divide-y-2 border-y-2">
          {posts.map((post) => (
            <li key={post.slug} className="py-8 first:pt-8">
              <p className="text-secondary mb-2 text-sm">
                <time dateTime={post.frontmatter.datePublished}>
                  {formatContentDate(post.frontmatter.datePublished)}
                </time>
                <span aria-hidden="true"> · </span>
                <span>{post.readingMinutes} min read</span>
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="font-display text-primary hover:text-accent text-2xl leading-snug italic sm:text-3xl"
              >
                {post.frontmatter.title}
              </Link>
              <p className="text-secondary mt-3 text-base leading-relaxed">
                {post.frontmatter.description}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <Link
            href="/feed.xml"
            className="font-display text-secondary hover:text-accent text-[0.6875rem] font-semibold tracking-[0.2em] uppercase"
          >
            RSS feed
          </Link>
        </p>
      </div>
    </>
  );
}
