import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://memento-mori.vercel.app/";

  // Fetch dynamic data if needed. For example:
  //   const posts = await fetch(`${baseUrl}/api/posts`).then((res) => res.json());
  //   const categories = await fetch(`${baseUrl}/api/categories`).then((res) =>
  //     res.json()
  //   );

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    // Add other static routes as necessary
  ];

  // Dynamic routes for blog posts
  //   const postRoutes = posts.map((post: any) => ({
  //     url: `${baseUrl}/blog/${post.slug}`,
  //     lastModified: new Date(post.updatedAt),
  //     changeFrequency: 'daily',
  //     priority: 0.7,
  //   }));

  //   // Dynamic routes for categories
  //   const categoryRoutes = categories.map((category: any) => ({
  //     url: `${baseUrl}/category/${category.slug}`,
  //     lastModified: new Date(category.updatedAt),
  //     changeFrequency: 'weekly',
  //     priority: 0.6,
  //   }));

  // Combine all routes
  return [
    ...staticRoutes,
    // ...postRoutes,
    // ...categoryRoutes
  ];
}
