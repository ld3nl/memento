import { cacheLife } from "next/cache";
import { getAboutPage } from "../../lib/content";
import { contentOgImage, OG_CONTENT_TYPE, OG_SIZE } from "../../lib/og-image";

export const alt = "About the Memento Mori life calendar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

async function aboutTitle() {
  "use cache";
  cacheLife("max");
  const about = await getAboutPage();
  return about.frontmatter.title;
}

export default async function AboutOgImage() {
  const title = await aboutTitle();
  return contentOgImage({
    title,
    kicker: "About",
  });
}
