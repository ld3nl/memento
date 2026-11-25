import { connection } from "next/server";
import { dateLifeImage } from "../../../../../../lib/life-og";
import { lifeJpegResponse } from "../../../../../../lib/life-response";
import {
  birthDateFromPathSegments,
  lifeImageModeFromQuery,
} from "../../../../../../lib/url-utils";

type Props = {
  params: Promise<{ year: string; month: string; day: string }>;
};

export async function GET(request: Request, { params }: Props) {
  // Filled squares depend on today's date.
  await connection();
  const { year, month, day } = await params;
  const born = birthDateFromPathSegments([year, month, day]);
  if (!born) {
    return new Response(null, { status: 404 });
  }

  const mode = lifeImageModeFromQuery(
    new URL(request.url).searchParams.get("weeks")
  );
  const png = await dateLifeImage(born, new Date(), mode).arrayBuffer();
  return lifeJpegResponse(png);
}
