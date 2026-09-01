import { toIsoDateTime } from "./content-meta";
import { JOURNAL_NAME, SITE_NAME, SITE_URL } from "./site";

export type RssPost = {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
};

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function toRfc822(isoDate: string): string {
  return new Date(toIsoDateTime(isoDate)).toUTCString();
}

export function buildRssFeed(posts: RssPost[]): string {
  const newest = posts[0]?.dateModified ?? posts[0]?.datePublished;
  const lastBuildDate = newest ? toRfc822(newest) : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = toRfc822(post.datePublished);

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(JOURNAL_NAME)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(`${SITE_NAME} notes on Stoicism, memento mori, and a life in weeks.`)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
