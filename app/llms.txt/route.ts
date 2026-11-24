import { cacheLife } from "next/cache";
import { listPublishedPosts } from "../../lib/content";
import { listLives } from "../../lib/lives";
import { buildLlmsTxt } from "../../lib/llms";

async function llmsDocument() {
  "use cache";
  cacheLife("hours");
  const posts = await listPublishedPosts();

  return buildLlmsTxt(
    posts.map(post => ({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      slug: post.slug,
    })),
    listLives()
  );
}

export async function GET() {
  const body = await llmsDocument();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
