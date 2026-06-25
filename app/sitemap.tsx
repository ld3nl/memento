import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://memento-mori.vercel.app/";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];

  // Sample dynamic routes for common birth years (ages 20-60 in 2026)
  const sampleBirthYears = [
    2006, 2000, 1995, 1990, 1985, 1980, 1975, 1970, 1965,
  ];
  const dynamicRoutes: MetadataRoute.Sitemap = sampleBirthYears.flatMap(
    (year) => [
      {
        url: `${baseUrl}table/${year}/1/1`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}burst/${year}/1/1`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
    ],
  );

  // Combine all routes
  return [...staticRoutes, ...dynamicRoutes];
}
