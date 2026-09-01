import { toIsoDateTime } from "./content-meta";
import {
  AUTHOR_NAME,
  JOURNAL_NAME,
  OG_IMAGE,
  ORGANIZATION_NAME,
  SITE_NAME,
  SITE_URL,
} from "./site";

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    name: ORGANIZATION_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/android-icon-192x192.png`,
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified,
  image,
  keywords,
  wordCount,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  keywords: string[];
  wordCount?: number;
}) {
  const url = absoluteUrl(path);

  return {
    "@type": "BlogPosting",
    headline,
    description,
    datePublished: toIsoDateTime(datePublished),
    dateModified: toIsoDateTime(dateModified ?? datePublished),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    image: {
      "@type": "ImageObject",
      url: image ?? OG_IMAGE,
    },
    author: {
      "@type": "Organization",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    publisher: organizationJsonLd(),
    keywords: keywords.join(", "),
    wordCount,
    isPartOf: {
      "@type": "Blog",
      name: JOURNAL_NAME,
      url: `${SITE_URL}/blog`,
    },
  };
}

export function aboutPageJsonLd({
  name,
  description,
  datePublished,
  dateModified,
  image,
}: {
  name: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@type": "AboutPage",
    name,
    description,
    url: `${SITE_URL}/about`,
    datePublished: toIsoDateTime(datePublished),
    dateModified: toIsoDateTime(dateModified ?? datePublished),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: image ?? OG_IMAGE,
    },
    publisher: organizationJsonLd(),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function faqJsonLd(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function blogJsonLd(
  posts: Array<{ title: string; description: string; slug: string }>,
) {
  return {
    "@type": "Blog",
    name: JOURNAL_NAME,
    description:
      "Notes on memento mori, Stoic practice, and seeing a whole life in weeks.",
    url: `${SITE_URL}/blog`,
    publisher: organizationJsonLd(),
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
    })),
  };
}

export function graphJsonLd(nodes: Array<Record<string, unknown>>) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
