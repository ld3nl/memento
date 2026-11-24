import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import { getAboutPage, listPublishedPosts } from "../lib/content";
import { toIsoDateTime } from "../lib/content-meta";
import { listLives } from "../lib/lives";
import { SITE_UPDATED, SITE_URL } from "../lib/site";

async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("max");
  const fallbackDate = new Date(toIsoDateTime(SITE_UPDATED));
  const [about, posts] = await Promise.all([
    getAboutPage(),
    listPublishedPosts(),
  ]);

  const aboutDate = new Date(
    toIsoDateTime(
      about.frontmatter.dateModified ?? about.frontmatter.datePublished
    )
  );

  const newestPostDate = posts[0]
    ? new Date(
        toIsoDateTime(
          posts[0].frontmatter.dateModified ??
            posts[0].frontmatter.datePublished
        )
      )
    : fallbackDate;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: fallbackDate,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: aboutDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: newestPostDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(
      toIsoDateTime(
        post.frontmatter.dateModified ?? post.frontmatter.datePublished
      )
    ),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const lifeRoutes: MetadataRoute.Sitemap = listLives().map(life => ({
    url: `${SITE_URL}/lives/${life.slug}`,
    lastModified: new Date(toIsoDateTime(life.updated)),
    changeFrequency: "yearly" as const,
    priority: 0.6,
    images: [`${SITE_URL}/lives/${life.slug}/life-in-weeks.jpg`],
  }));

  return [...staticRoutes, ...postRoutes, ...lifeRoutes];
}

export default function sitemap() {
  return buildSitemap();
}
