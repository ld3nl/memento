import { format, parseISO } from "date-fns";
import { z } from "zod";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const WORDS_PER_MINUTE = 220;

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const contentFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  datePublished: z.string().regex(ISO_DATE_PATTERN),
  dateModified: z.string().regex(ISO_DATE_PATTERN).optional(),
  keywords: z.array(z.string()).min(1),
  tags: z.array(z.string()).min(1),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  author: z.string().optional(),
  draft: z.boolean().optional(),
  kicker: z.string().optional(),
  faq: z.array(faqItemSchema).optional(),
});

export type FaqItem = z.infer<typeof faqItemSchema>;
export type ContentFrontmatter = z.infer<typeof contentFrontmatterSchema>;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function parseFrontmatter(value: unknown): ContentFrontmatter {
  return contentFrontmatterSchema.parse(value);
}

export function stripMdxMeta(source: string): string {
  const withoutImports = source.replace(/^import\s.+$/gm, "");
  const marker = "export const frontmatter";
  const start = withoutImports.indexOf(marker);
  if (start === -1) {
    return withoutImports.trim();
  }

  const braceStart = withoutImports.indexOf("{", start);
  if (braceStart === -1) {
    return withoutImports.trim();
  }

  let depth = 0;
  let end = braceStart;
  for (; end < withoutImports.length; end += 1) {
    const character = withoutImports[end];
    if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        end += 1;
        break;
      }
    }
  }

  return `${withoutImports.slice(0, start)}${withoutImports.slice(end)}`.trim();
}

export function countMdxWords(source: string): number {
  const body = stripMdxMeta(source)
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!body) {
    return 0;
  }

  return body.split(" ").length;
}

export function estimateReadingMinutes(
  wordCount: number,
  wordsPerMinute = WORDS_PER_MINUTE,
): number {
  if (wordCount <= 0) {
    return 1;
  }

  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}

export function formatContentDate(isoDate: string): string {
  return format(parseISO(isoDate), "d MMMM yyyy");
}

export function toIsoDateTime(isoDate: string): string {
  return `${isoDate}T00:00:00.000Z`;
}

export function pickRelated<T extends { slug: string; tags: string[] }>(
  items: T[],
  slug: string,
  limit = 3,
): T[] {
  const current = items.find((item) => item.slug === slug);
  const others = items.filter((item) => item.slug !== slug);

  if (!current) {
    return others.slice(0, limit);
  }

  const currentTags = new Set(current.tags);

  return others
    .toSorted((left, right) => {
      const leftScore = left.tags.filter((tag) => currentTags.has(tag)).length;
      const rightScore = right.tags.filter((tag) =>
        currentTags.has(tag),
      ).length;
      if (rightScore !== leftScore) {
        return rightScore - leftScore;
      }
      return left.slug.localeCompare(right.slug);
    })
    .slice(0, limit);
}
