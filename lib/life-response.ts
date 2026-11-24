import { lifePictureJpeg } from "./life-jpeg";
import { LIFE_OG_CONTENT_TYPE } from "./life-og";

export async function lifeJpegResponse(png: ArrayBuffer): Promise<Response> {
  const jpeg = await lifePictureJpeg(png);

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": LIFE_OG_CONTENT_TYPE,
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
