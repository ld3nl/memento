import { contentOgImage, OG_CONTENT_TYPE, OG_SIZE } from "../../lib/og-image";

export const alt = "Memento Mori journal";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function BlogOgImage() {
  return contentOgImage({
    title: "Notes on a finite life",
    kicker: "Journal",
  });
}
