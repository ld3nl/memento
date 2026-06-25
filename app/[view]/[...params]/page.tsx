import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackButton from "../../../components/BackButton";
import { BurstScene } from "../../../components/BurstScene/BurstScene";
import { LifeTable } from "../../../components/LifeTable/LifeTable";
import { calculateFullAge } from "../../../lib/date-utils";
import { isValidDate } from "../../../lib/validation";

type ViewMode = "table" | "burst";

// Define the structure for your route params
interface Props {
  params: Promise<{ view: string; params: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Extract the birth date from params
  const awaitedParams = await params;
  const view = awaitedParams?.view as ViewMode;
  const dateParams = awaitedParams?.params;

  // For URLs like /table/1987/12/17 or /burst/1987/12/17
  const urlDateParam = dateParams?.join(",") || "";
  const urlPath = dateParams?.join("/") || "";

  const ageData = calculateFullAge(urlDateParam, "yyyy,MM,dd");

  // Handle invalid date
  if (!ageData) {
    return {
      title: "Your Life in Weeks - Memento Mori",
      description: "Visualize your life in weeks with Memento Mori.",
    };
  }

  const age = ageData.years;
  const weeksLived = ageData.years * 52 + Math.floor(ageData.days / 7);
  const potentialYearsLeft = Math.max(80 - age, 0);
  const viewTitle = view === "burst" ? "Burst View" : "Table View";

  const baseUrl = "https://memento-mori.vercel.app";
  const canonicalUrl = `${baseUrl}/${view}/${urlPath}`;

  return {
    title: `Your Life in Weeks - Age ${age} - ${viewTitle} - Memento Mori`,
    description: `How many weeks have you lived? At ${age} years old, you've lived approximately ${weeksLived} weeks. Visualize your life ${view === "burst" ? "as a radial burst" : "in a table grid"} with ${potentialYearsLeft} years potentially remaining. Make every week count.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Your Life in Weeks - Age ${age} - ${viewTitle}`,
      description: `At ${age} years old, you've lived approximately ${weeksLived} weeks. Visualize your life ${view === "burst" ? "as a radial burst" : "in a table grid"}, with approximately ${potentialYearsLeft} years potentially left.`,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: "https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3",
          width: 730,
          height: 548,
          alt: "Memento Mori Life Calendar Visualization",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Your Life in Weeks - Age ${age} - ${viewTitle}`,
      description: `At ${age} years old, you've lived approximately ${weeksLived} weeks. Visualize your life ${view === "burst" ? "as a radial burst" : "in a table grid"}.`,
      images: [
        "https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3",
      ],
    },
  };
}

const ViewPage = async ({ params }: Props) => {
  // A small delay to simulate fetching or some async operations
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Await params before using its properties to avoid errors
  const awaitedParams = await params;
  const view = awaitedParams?.view as ViewMode;
  const dateParams = awaitedParams?.params;

  // Validate view parameter
  if (!view || !["table", "burst"].includes(view)) {
    notFound();
  }

  // Extract birth date from remaining params (e.g., ["1987", "12", "17"])
  const urlDateParam = dateParams?.join(",") || "";
  const urlPath = dateParams?.join("/") || "";
  const birthDate = new Date(urlDateParam);

  if (!isValidDate(birthDate)) {
    notFound();
  }

  // Calculate age data for contextual content
  const ageData = calculateFullAge(urlDateParam, "yyyy,MM,dd");
  const age = ageData?.years || 0;
  const weeksLived = age * 52 + Math.floor((ageData?.days || 0) / 7);
  const weeksRemaining = Math.max((80 - age) * 52, 0);

  const baseUrl = "https://memento-mori.vercel.app";

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${view === "table" ? "Table" : "Burst"} View`,
        item: `${baseUrl}/${view}/${urlPath}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is serialized into a script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="group m-auto p-4 sm:p-6 lg:p-8">
        <BackButton />
        <h1 className="font-display mb-10 text-center text-3xl leading-tight tracking-tight text-zinc-900 italic sm:mb-12 sm:text-4xl lg:text-5xl dark:text-zinc-50">
          Your Life in Weeks
          <span className="font-body mt-2 block text-sm font-semibold tracking-[0.25em] text-zinc-500 uppercase sm:text-base dark:text-zinc-400">
            {view === "table" ? "Table View" : "Burst View"}
          </span>
        </h1>

        {view === "table" ? (
          <LifeTable dob={birthDate} />
        ) : (
          <div className="relative h-[80vh] w-full">
            <BurstScene
              dob={birthDate}
              shape="circle"
              itemSizeRem={0.25}
              itemSpacingRem={0.1}
            />
          </div>
        )}

        {/* Contextual Content */}
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

          <p className="font-body mt-12 text-base leading-relaxed text-zinc-500 sm:mt-16 sm:text-lg dark:text-zinc-400">
            Each square is a week. The filled ones are gone. Make the empty ones
            count.
          </p>
        </section>
      </div>
    </>
  );
};

export default ViewPage;
