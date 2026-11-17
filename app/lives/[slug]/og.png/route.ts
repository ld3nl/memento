import { lifeOgImage } from "../../../../lib/life-og";
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

  const image = lifeOgImage(life);
  image.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"
  );
  return image;
}
