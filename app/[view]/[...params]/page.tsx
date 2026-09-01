import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackButton from "../../../components/BackButton";
import { BurstSceneLazy } from "../../../components/BurstScene/BurstSceneLazy";
import { LifeTable } from "../../../components/LifeTable/LifeTable";
import { calculateFullAge } from "../../../lib/date-utils";
import { serializeJsonLd } from "../../../lib/json-ld";
import { OG_IMAGE, SITE_URL } from "../../../lib/site";
import {
  birthDateFromPathSegments,
  extractNameFromUrl,
} from "../../../lib/url-utils";

type ViewMode = "table" | "burst";

interface Props {
  params: Promise<{ view: string; params: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function isViewMode(view: string): view is ViewMode {
  return view === "table" || view === "burst";
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const awaitedParams = await params;
  const view = awaitedParams.view;
  const dateParams = awaitedParams.params ?? [];
  const birthDate = birthDateFromPathSegments(dateParams);
  const urlPath = dateParams.join("/");
  const query = await searchParams;
  const name = extractNameFromUrl(
    new URLSearchParams(
      Object.entries(query).flatMap(([key, value]) =>
        value === undefined
          ? []
          : Array.isArray(value)
            ? value.map((item) => [key, item] as [string, string])
            : [[key, value] as [string, string]],
      ),
    ),
  );

  if (!birthDate) {
    return {
      title: "Your Life in Weeks - Memento Mori",
      description: "Visualize your life in weeks with Memento Mori.",
    };
  }

  const ageData = calculateFullAge(birthDate);
  const age = ageData?.years ?? 0;
  const weeksLived = age * 52 + Math.floor((ageData?.days ?? 0) / 7);
  const potentialYearsLeft = Math.max(80 - age, 0);
  const viewTitle = view === "burst" ? "Burst View" : "Table View";
  const canonicalUrl = `${SITE_URL}/${view}/${urlPath}`;
  const titleName = name ? `${name} · ` : "";

  return {
    title: `${titleName}Your Life in Weeks - Age ${age} - ${viewTitle} - Memento Mori`,
    description: `How many weeks have you lived? At ${age} years old, you've lived approximately ${weeksLived} weeks. Visualize your life ${view === "burst" ? "as a radial burst" : "in a table grid"} with ${potentialYearsLeft} years potentially remaining. Make every week count.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${titleName}Your Life in Weeks - Age ${age} - ${viewTitle}`,
      description: `At ${age} years old, you've lived approximately ${weeksLived} weeks. Visualize your life ${view === "burst" ? "as a radial burst" : "in a table grid"}, with approximately ${potentialYearsLeft} years potentially left.`,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 730,
          height: 548,
          alt: "Memento Mori Life Calendar Visualization",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleName}Your Life in Weeks - Age ${age} - ${viewTitle}`,
      description: `At ${age} years old, you've lived approximately ${weeksLived} weeks. Visualize your life ${view === "burst" ? "as a radial burst" : "in a table grid"}.`,
      images: [OG_IMAGE],
    },
  };
}

const ViewPage = async ({ params, searchParams }: Props) => {
  const awaitedParams = await params;
  const view = awaitedParams.view;
  const dateParams = awaitedParams.params ?? [];

  if (!isViewMode(view)) {
    notFound();
  }

  const birthDate = birthDateFromPathSegments(dateParams);
  const urlPath = dateParams.join("/");

  if (!birthDate) {
    notFound();
  }

  const query = await searchParams;
  const name = extractNameFromUrl(
    new URLSearchParams(
      Object.entries(query).flatMap(([key, value]) =>
        value === undefined
          ? []
          : Array.isArray(value)
            ? value.map((item) => [key, item] as [string, string])
            : [[key, value] as [string, string]],
      ),
    ),
  );

  const ageData = calculateFullAge(birthDate);
  const age = ageData?.years ?? 0;
  const weeksLived = age * 52 + Math.floor((ageData?.days ?? 0) / 7);
  const weeksRemaining = Math.max((80 - age) * 52, 0);
  const otherView: ViewMode = view === "table" ? "burst" : "table";
  const nameQuery = name ? `?name=${encodeURIComponent(name)}` : "";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${view === "table" ? "Table" : "Burst"} View`,
        item: `${SITE_URL}/${view}/${urlPath}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is serialized into a script tag.
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <div className="group m-auto p-4 sm:p-6 lg:p-8">
        <BackButton />
        <div className="mb-8 flex justify-end">
          <Link
            href={`/${otherView}/${urlPath}${nameQuery}`}
            className="border-border font-display text-primary rounded-full border px-4 py-2 text-sm font-medium hover:border-red-600"
          >
            Switch to {otherView === "table" ? "table" : "burst"} view
          </Link>
        </div>
        <h1 className="font-display mb-10 text-center text-3xl leading-tight tracking-tight text-zinc-900 italic sm:mb-12 sm:text-4xl lg:text-5xl dark:text-zinc-50">
          {name ? `${name}’s life in weeks` : "Your Life in Weeks"}
          <span className="mt-2 block font-sans text-sm font-semibold tracking-[0.25em] text-zinc-500 uppercase sm:text-base dark:text-zinc-400">
            {view === "table" ? "Table View" : "Burst View"}
          </span>
        </h1>

        {view === "table" ? (
          <LifeTable dob={birthDate} />
        ) : (
          <div className="relative h-[80vh] w-full">
            <BurstSceneLazy
              dob={birthDate}
              shape="circle"
              itemSizeRem={0.28}
              itemSpacingRem={0.18}
            />
          </div>
        )}

        <section className="mx-auto mt-16 max-w-3xl border-t-2 border-red-600/20 px-4 pt-16 sm:mt-20 sm:pt-20">
          <div className="border-l-[3px] border-red-600 pl-6 sm:pl-8">
            <div className="font-mono text-5xl font-bold text-red-600 tabular-nums sm:text-6xl lg:text-7xl">
              {weeksLived.toLocaleString()}
            </div>
            <div className="font-display mt-3 text-xs font-semibold tracking-[0.25em] text-zinc-500 uppercase sm:text-sm dark:text-zinc-400">
              Weeks lived
            </div>

            {weeksRemaining > 0 && (
              <>
                <div className="mt-10 font-mono text-4xl font-bold text-zinc-900 tabular-nums sm:mt-12 sm:text-5xl lg:text-6xl dark:text-zinc-50">
                  {weeksRemaining.toLocaleString()}
                </div>
                <div className="font-display mt-3 text-xs font-semibold tracking-[0.25em] text-zinc-500 uppercase sm:text-sm dark:text-zinc-400">
                  Weeks remaining (est.)
                </div>
              </>
            )}
          </div>

          <p className="mt-12 font-sans text-base leading-relaxed text-zinc-500 sm:mt-16 sm:text-lg dark:text-zinc-400">
            Each square is a week. The filled ones are gone. Make the empty ones
            count.
          </p>
        </section>
      </div>
    </>
  );
};

export default ViewPage;
