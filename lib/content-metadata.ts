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
  image,
}: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  keywords: string[];
  tags?: string[];
  ogType?: "article" | "website";
  image?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
}): Metadata {
  const url = absoluteUrl(path);
  const picture = image
    ? {
        url: image.url,
        width: image.width,
        height: image.height,
        alt: image.alt,
        type: "image/png",
      }
    : undefined;

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
      ...(picture ? { images: [picture] } : {}),
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
      ...(picture ? { images: [picture] } : {}),
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
