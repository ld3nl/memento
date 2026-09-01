import Image from "next/image";

type ContentImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  float?: "left" | "right";
};

const floatClassName = {
  left: "float-left me-4 mb-6 w-40 rounded-none opacity-90 grayscale sm:me-6 sm:w-48 lg:w-56",
  right:
    "float-right ms-4 mb-6 w-40 rounded-none opacity-90 grayscale sm:ms-6 sm:w-48 lg:w-56",
};

export function ContentImage({
  src,
  alt,
  width,
  height,
  priority = false,
  float,
}: ContentImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={
        float
          ? floatClassName[float]
          : "mb-8 h-auto w-full rounded-none opacity-90 grayscale sm:mb-10"
      }
      sizes={
        float
          ? "(max-width: 640px) 45vw, 224px"
          : "(max-width: 640px) 100vw, 65ch"
      }
    />
  );
}
