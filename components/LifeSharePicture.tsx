import * as stylex from "@stylexjs/stylex";
import { IMAGE_LICENSE_PATH } from "../lib/json-ld";
import { LIFE_OG_SIZE } from "../lib/life-picture";
import { breakpoints } from "../styles/breakpoints.stylex";
import { tokens } from "../styles/tokens.stylex";

const styles = stylex.create({
  figure: {
    width: "100%",
    maxWidth: "52rem",
    marginInline: "auto",
    marginTop: {
      default: "3rem",
      [breakpoints.sm]: "4rem",
    },
    marginBottom: 0,
  },
  link: {
    display: "block",
    textDecorationLine: "none",
  },
  image: {
    display: "block",
    width: "100%",
    height: "auto",
    backgroundColor: tokens.card,
  },
  caption: {
    marginTop: "0.75rem",
    marginBottom: 0,
    fontFamily: tokens.fontSans,
    fontSize: "0.875rem",
    lineHeight: 1.5,
    color: tokens.secondary,
  },
  credit: {
    color: tokens.primary,
    textUnderlineOffset: "0.15em",
  },
});

function mergeClass(stylexClass: string | undefined, marker: string) {
  return [stylexClass, marker].filter(Boolean).join(" ");
}

export function LifeSharePicture({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  const figure = stylex.props(styles.figure);
  return (
    <figure
      {...figure}
      className={mergeClass(figure.className, "life-share-picture")}
    >
      <a href={src} {...stylex.props(styles.link)}>
        {/* biome-ignore lint/performance/noImgElement: Google Images reads the file URL in src. next/image would rewrite it. */}
        <img
          src={src}
          alt={alt}
          width={LIFE_OG_SIZE.width}
          height={LIFE_OG_SIZE.height}
          loading="lazy"
          decoding="async"
          {...stylex.props(styles.image)}
        />
      </a>
      <figcaption {...stylex.props(styles.caption)}>
        {caption}{" "}
        <a href={IMAGE_LICENSE_PATH} {...stylex.props(styles.credit)}>
          Credit: Memento Mori. How to use this picture.
        </a>
      </figcaption>
    </figure>
  );
}
