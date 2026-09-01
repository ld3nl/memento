import { getAboutPage } from "../../lib/content";
import { contentOgImage, OG_CONTENT_TYPE, OG_SIZE } from "../../lib/og-image";

export const alt = "About the Memento Mori life calendar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function AboutOgImage() {
  const about = await getAboutPage();
  return contentOgImage({
    title: about.frontmatter.title,
    kicker: "About",
  });
}
