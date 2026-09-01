import { contentOgImage, OG_CONTENT_TYPE, OG_SIZE } from "../lib/og-image";

export const alt = "Memento Mori life calendar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function RootOgImage() {
  return contentOgImage({
    title: "Visualize your life in weeks",
    kicker: "Memento Mori",
  });
}
