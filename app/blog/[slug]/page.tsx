import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleShell } from "../../../components/content/ArticleShell";
import { FaqSection } from "../../../components/content/FaqSection";
import { JsonLd } from "../../../components/content/JsonLd";
import { RelatedPosts } from "../../../components/content/RelatedPosts";
import {
  getBlogPost,
  listPublishedPosts,
  relatedPosts,
} from "../../../lib/content";
import { contentMetadata } from "../../../lib/content-metadata";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  graphJsonLd,
} from "../../../lib/json-ld";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await listPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Note not found" };
  }

  return contentMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    path: `/blog/${post.slug}`,
    datePublished: post.frontmatter.datePublished,
    dateModified: post.frontmatter.dateModified,
    keywords: post.frontmatter.keywords,
    tags: post.frontmatter.tags,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([
    getBlogPost(slug),
    listPublishedPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const related = relatedPosts(posts, post.slug).map((item) => ({
    slug: item.slug,
    title: item.frontmatter.title,
    description: item.frontmatter.description,
  }));

  const jsonLd = graphJsonLd([
    articleJsonLd({
      headline: post.frontmatter.title,
      description: post.frontmatter.description,
      path: `/blog/${post.slug}`,
      datePublished: post.frontmatter.datePublished,
      dateModified: post.frontmatter.dateModified,
      image: post.frontmatter.image,
      keywords: post.frontmatter.keywords,
      wordCount: post.wordCount,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Journal", path: "/blog" },
      { name: post.frontmatter.title, path: `/blog/${post.slug}` },
    ]),
    ...(post.frontmatter.faq ? [faqJsonLd(post.frontmatter.faq)] : []),
  ]);

  const Content = post.Content;

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleShell
        kicker={post.frontmatter.kicker}
        title={post.frontmatter.title}
        datePublished={post.frontmatter.datePublished}
        readingMinutes={post.readingMinutes}
        image={post.frontmatter.image}
        imageAlt={post.frontmatter.imageAlt}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Journal", href: "/blog" },
          { name: post.frontmatter.title },
        ]}
        backHref="/blog"
      >
        <Content />
        <FaqSection items={post.frontmatter.faq ?? []} />
        <RelatedPosts posts={related} />
      </ArticleShell>
    </>
  );
}
