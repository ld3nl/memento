import type { Metadata } from "next";
import { toIsoDateTime } from "./content-meta";
import { absoluteUrl } from "./json-ld";
import { SITE_NAME } from "./site";

export function contentMetadata({
  title,
  description,
  path,
  datePublished,
  dateModified,
  keywords,
  tags,
  ogType = "article",
}: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  keywords: string[];
  tags?: string[];
  ogType?: "article" | "website";
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords,
    authors: [{ name: SITE_NAME, url: absoluteUrl("/") }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: ogType,
      siteName: SITE_NAME,
      locale: "en_US",
      ...(ogType === "article" && datePublished
        ? {
            publishedTime: toIsoDateTime(datePublished),
            modifiedTime: toIsoDateTime(dateModified ?? datePublished),
            authors: [SITE_NAME],
            section: "Stoicism",
            tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
