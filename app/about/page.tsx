import type { Metadata } from "next";
import { ArticleShell } from "../../components/content/ArticleShell";
import { FaqSection } from "../../components/content/FaqSection";
import { JsonLd } from "../../components/content/JsonLd";
import { RelatedPosts } from "../../components/content/RelatedPosts";
import { getAboutPage, listPublishedPosts } from "../../lib/content";
import { contentMetadata } from "../../lib/content-metadata";
import {
  aboutPageJsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  graphJsonLd,
} from "../../lib/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();

  return contentMetadata({
    title: about.frontmatter.title,
    description: about.frontmatter.description,
    path: "/about",
    datePublished: about.frontmatter.datePublished,
    dateModified: about.frontmatter.dateModified,
    keywords: about.frontmatter.keywords,
    tags: about.frontmatter.tags,
  });
}

export default async function AboutPage() {
  const [about, posts] = await Promise.all([
    getAboutPage(),
    listPublishedPosts(),
  ]);
  const { Content, frontmatter, wordCount, readingMinutes } = about;

  const jsonLd = graphJsonLd([
    aboutPageJsonLd({
      name: frontmatter.title,
      description: frontmatter.description,
      datePublished: frontmatter.datePublished,
      dateModified: frontmatter.dateModified,
      image: frontmatter.image,
    }),
    articleJsonLd({
      headline: frontmatter.title,
      description: frontmatter.description,
      path: "/about",
      datePublished: frontmatter.datePublished,
      dateModified: frontmatter.dateModified,
      image: frontmatter.image,
      keywords: frontmatter.keywords,
      wordCount,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
    ...(frontmatter.faq ? [faqJsonLd(frontmatter.faq)] : []),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleShell
        kicker={frontmatter.kicker}
        title={frontmatter.title}
        datePublished={frontmatter.datePublished}
        readingMinutes={readingMinutes}
        image={frontmatter.image}
        imageAlt={frontmatter.imageAlt}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "About" },
        ]}
        backHref="/"
      >
        <Content />
        <FaqSection items={frontmatter.faq ?? []} />
        <RelatedPosts
          posts={[
            "what-is-memento-mori",
            "steve-jobs-memento-mori",
            "famous-stoics-on-mortality",
          ]
            .map((slug) => posts.find((post) => post.slug === slug))
            .filter((post) => post !== undefined)
            .map((post) => ({
              slug: post.slug,
              title: post.frontmatter.title,
              description: post.frontmatter.description,
            }))}
        />
      </ArticleShell>
    </>
  );
}
