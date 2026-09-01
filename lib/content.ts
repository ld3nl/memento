import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { type ComponentType, cache } from "react";
import { ZodError } from "zod";
import {
  type ContentFrontmatter,
  countMdxWords,
  estimateReadingMinutes,
  isValidSlug,
  parseFrontmatter,
  pickRelated,
} from "./content-meta";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const ABOUT_PATH = path.join(process.cwd(), "content/about.mdx");

export type LoadedContent = {
  frontmatter: ContentFrontmatter;
  Content: ComponentType;
  wordCount: number;
  readingMinutes: number;
};

export type LoadedPost = LoadedContent & {
  slug: string;
};

function toLoadedContent(
  mod: { default: ComponentType; frontmatter: unknown },
  source: string,
  label: string,
): LoadedContent {
  try {
    const frontmatter = parseFrontmatter(mod.frontmatter);
    const wordCount = countMdxWords(source);

    return {
      frontmatter,
      Content: mod.default,
      wordCount,
      readingMinutes: estimateReadingMinutes(wordCount),
    };
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid frontmatter in ${label}: ${error.message}`);
    }
    throw error;
  }
}

export const getBlogSlugs = cache(async (): Promise<string[]> => {
  const files = await readdir(BLOG_DIR);

  const slugs: string[] = [];
  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;
    const slug = file.slice(0, -4);
    if (isValidSlug(slug)) slugs.push(slug);
  }
  return slugs.toSorted();
});

export const getBlogPost = cache(
  async (slug: string): Promise<LoadedPost | null> => {
    if (!isValidSlug(slug)) {
      return null;
    }

    try {
      const [mod, source] = await Promise.all([
        import(`../content/blog/${slug}.mdx`),
        readFile(path.join(BLOG_DIR, `${slug}.mdx`), "utf8"),
      ]);
      const loaded = toLoadedContent(
        mod,
        source,
        `content/blog/${slug}.mdx`,
      );

      if (loaded.frontmatter.draft) {
        return null;
      }

      return { ...loaded, slug };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith("Invalid frontmatter")
      ) {
        throw error;
      }

      if (
        error instanceof Error &&
        (error.message.includes("Cannot find module") ||
          error.message.includes("Module not found"))
      ) {
        return null;
      }

      throw error;
    }
  },
);

export const listPublishedPosts = cache(async (): Promise<LoadedPost[]> => {
  const slugs = await getBlogSlugs();
  const posts = await Promise.all(slugs.map((slug) => getBlogPost(slug)));

  return posts
    .filter((post): post is LoadedPost => post !== null)
    .toSorted((left, right) =>
      right.frontmatter.datePublished.localeCompare(
        left.frontmatter.datePublished,
      ),
    );
});

export function relatedPosts(posts: LoadedPost[], slug: string, limit = 3) {
  return pickRelated(
    posts.map((post) => ({
      ...post,
      tags: post.frontmatter.tags,
    })),
    slug,
    limit,
  );
}

export const getAboutPage = cache(async (): Promise<LoadedContent> => {
  const [mod, source] = await Promise.all([
    import("../content/about.mdx"),
    readFile(ABOUT_PATH, "utf8"),
  ]);

  return toLoadedContent(mod, source, "content/about.mdx");
});
