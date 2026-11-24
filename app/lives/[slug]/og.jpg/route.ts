import { lifeOgImage } from "../../../../lib/life-og";
import { lifeJpegResponse } from "../../../../lib/life-response";
import { getLife, listLives } from "../../../../lib/lives";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listLives().map(life => ({ slug: life.slug }));
}

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const life = getLife(slug);
  if (!life) {
    return new Response(null, { status: 404 });
  }

  const png = await lifeOgImage(life).arrayBuffer();
  return lifeJpegResponse(png);
}
