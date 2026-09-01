import type { MetadataRoute } from "next";
import { getAboutPage, listPublishedPosts } from "../lib/content";
import { toIsoDateTime } from "../lib/content-meta";
import { SITE_UPDATED, SITE_URL } from "../lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fallbackDate = new Date(toIsoDateTime(SITE_UPDATED));
  const [about, posts] = await Promise.all([
    getAboutPage(),
    listPublishedPosts(),
  ]);

  const aboutDate = new Date(
    toIsoDateTime(about.frontmatter.dateModified ?? about.frontmatter.datePublished),
  );

  const newestPostDate = posts[0]
    ? new Date(
        toIsoDateTime(
          posts[0].frontmatter.dateModified ?? posts[0].frontmatter.datePublished,
        ),
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

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(
      toIsoDateTime(
        post.frontmatter.dateModified ?? post.frontmatter.datePublished,
      ),
    ),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const sampleBirthYears = [
    2006, 2000, 1995, 1990, 1985, 1980, 1975, 1970, 1965,
  ];
  const dynamicRoutes: MetadataRoute.Sitemap = sampleBirthYears.flatMap(
    (year) => [
      {
        url: `${SITE_URL}/table/${year}/1/1`,
        lastModified: fallbackDate,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
      {
        url: `${SITE_URL}/burst/${year}/1/1`,
        lastModified: fallbackDate,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
    ],
  );

  return [...staticRoutes, ...postRoutes, ...dynamicRoutes];
}
