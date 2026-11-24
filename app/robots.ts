// filepath: /Users/denis/Documents/GitHub/memento/app/robots.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

// Function to dynamically generate robots.txt content
export default function generateRobots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Search AI Overviews use Googlebot. Gemini training uses Google-Extended.
      // Both may fetch /llms.txt and the life-in-weeks pictures.
      {
        userAgent: ["Googlebot", "Googlebot-Image", "Google-Extended"],
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
