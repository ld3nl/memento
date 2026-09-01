import { listPublishedPosts } from "../../lib/content";
import { buildRssFeed } from "../../lib/rss";

export const dynamic = "force-static";

export async function GET() {
  const posts = await listPublishedPosts();
  const xml = buildRssFeed(
    posts.map((post) => ({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      slug: post.slug,
      datePublished: post.frontmatter.datePublished,
      dateModified: post.frontmatter.dateModified,
    })),
  );

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
