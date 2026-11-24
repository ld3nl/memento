import { cacheLife } from "next/cache";
import { listPublishedPosts } from "../../lib/content";
import { listLives } from "../../lib/lives";
import { buildLlmsFullTxt } from "../../lib/llms";

async function llmsFullDocument() {
  "use cache";
  cacheLife("hours");
  const posts = await listPublishedPosts();

  return buildLlmsFullTxt(
    posts.map(post => ({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      slug: post.slug,
    })),
    listLives()
  );
}

export async function GET() {
  const body = await llmsFullDocument();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
