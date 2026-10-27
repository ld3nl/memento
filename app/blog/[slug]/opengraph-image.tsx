import { cacheLife } from "next/cache";
import { getBlogPost, listPublishedPosts } from "../../../lib/content";
import {
  contentOgImage,
  OG_CONTENT_TYPE,
  OG_SIZE,
} from "../../../lib/og-image";

export const alt = "Memento Mori journal note";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await listPublishedPosts();
  return posts.map(post => ({ slug: post.slug }));
}

async function ogCopy(slug: string) {
  "use cache";
  cacheLife("max");
  const post = await getBlogPost(slug);

  return {
    title: post?.frontmatter.title ?? "Memento Mori",
    kicker: post?.frontmatter.kicker ?? "Journal",
  };
}

export default async function BlogPostOgImage({ params }: Props) {
  const { slug } = await params;
  const copy = await ogCopy(slug);

  return contentOgImage(copy);
}
