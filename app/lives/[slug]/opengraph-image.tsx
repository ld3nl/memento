import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import {
  LIFE_OG_CONTENT_TYPE,
  LIFE_OG_SIZE,
  lifeOgImage,
} from "../../../lib/life-og";
import { getLife, listLives } from "../../../lib/lives";

export const alt = "Life in weeks";
export const size = LIFE_OG_SIZE;
export const contentType = LIFE_OG_CONTENT_TYPE;

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listLives().map(life => ({ slug: life.slug }));
}

async function loadLife(slug: string) {
  "use cache";
  cacheLife("max");
  return getLife(slug);
}

export default async function LifeOgImage({ params }: Props) {
  const { slug } = await params;
  const life = await loadLife(slug);
  if (!life) notFound();
  return lifeOgImage(life);
}
