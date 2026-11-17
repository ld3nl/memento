import sharp from "sharp";
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

  const png = Buffer.from(await lifeOgImage(life).arrayBuffer());
  const jpeg = await sharp(png)
    .flatten({ background: "#09090b" })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
