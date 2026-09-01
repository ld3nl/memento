import { getBlogPost } from "../../../lib/content";
import { contentOgImage, OG_CONTENT_TYPE, OG_SIZE } from "../../../lib/og-image";

export const alt = "Memento Mori journal note";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostOgImage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  return contentOgImage({
    title: post?.frontmatter.title ?? "Memento Mori",
    kicker: post?.frontmatter.kicker ?? "Journal",
  });
}
