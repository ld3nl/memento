import { connection } from "next/server";
import { dateLifeImage } from "../../../../../../lib/life-og";
import { lifeJpegResponse } from "../../../../../../lib/life-response";
import { birthDateFromPathSegments } from "../../../../../../lib/url-utils";

type Props = {
  params: Promise<{ year: string; month: string; day: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  // Filled squares depend on today's date.
  await connection();
  const { year, month, day } = await params;
  const born = birthDateFromPathSegments([year, month, day]);
  if (!born) {
    return new Response(null, { status: 404 });
  }

  const png = await dateLifeImage(born).arrayBuffer();
  return lifeJpegResponse(png);
}
