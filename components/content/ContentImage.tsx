import * as stylex from "@stylexjs/stylex";
import Image from "next/image";
import { breakpoints } from "../../styles/breakpoints.stylex";

type ContentImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  float?: "left" | "right";
};

const styles = stylex.create({
  image: {
    borderRadius: 0,
    opacity: 0.9,
    filter: "grayscale(100%)",
  },
  block: {
    marginBottom: {
      default: "2rem",
      [breakpoints.sm]: "2.5rem",
    },
    height: "auto",
    width: "100%",
  },
  floated: {
    marginBottom: "1.5rem",
    height: "auto",
    width: {
      default: "10rem",
      [breakpoints.sm]: "12rem",
      [breakpoints.lg]: "14rem",
    },
  },
  left: {
    float: "left",
    marginInlineEnd: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
    },
  },
  right: {
    float: "right",
    marginInlineStart: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
    },
  },
});

export function ContentImage({
  src,
  alt,
  width,
  height,
  priority = false,
  float,
}: ContentImageProps) {
  const imageProps = stylex.props(
    styles.image,
    float ? styles.floated : styles.block,
    float === "left" && styles.left,
    float === "right" && styles.right
  );

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={imageProps.className}
      style={imageProps.style}
      sizes={
        float
          ? "(max-width: 640px) 45vw, 224px"
          : "(max-width: 640px) 100vw, 65ch"
      }
    />
  );
}
