import sharp from "sharp";
import { ORGANIZATION_NAME } from "./site";

const DESCRIPTION =
  "Life in weeks. An 80-year grid. Filled squares are weeks already lived.";

/** Opaque JPEG. Share apps drop the alpha PNG that next/og writes. */
export async function lifePictureJpeg(png: ArrayBuffer): Promise<Buffer> {
  return sharp(Buffer.from(png))
    .flatten({ background: "#09090b" })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .withMetadata({
      exif: {
        IFD0: {
          Copyright: ORGANIZATION_NAME,
          Artist: ORGANIZATION_NAME,
          ImageDescription: DESCRIPTION,
        },
      },
    })
    .toBuffer();
}
