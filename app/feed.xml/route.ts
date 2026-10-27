import { cacheLife } from "next/cache";
import { listPublishedPosts } from "../../lib/content";
import { buildRssFeed } from "../../lib/rss";

async function rssDocument() {
  "use cache";
  cacheLife("hours");
  const posts = await listPublishedPosts();

  return buildRssFeed(
    posts.map(post => ({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      slug: post.slug,
      datePublished: post.frontmatter.datePublished,
      dateModified: post.frontmatter.dateModified,
    }))
  );
}

export async function GET() {
  const xml = await rssDocument();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
