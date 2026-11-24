import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { type ReactNode, Suspense } from "react";
import BackButton from "../../../components/BackButton";
import { BurstSceneLazy } from "../../../components/BurstScene/BurstSceneLazy";
import { CalendarHeading } from "../../../components/CalendarHeading";
import { LifeSharePicture } from "../../../components/LifeSharePicture";
import { LifeTable } from "../../../components/LifeTable/LifeTable";
import { SwitchViewLink } from "../../../components/SwitchViewLink";
import { calculateFullAge, calculateLifeWeeks } from "../../../lib/date-utils";
import {
  graphJsonLd,
  lifeImageObject,
  serializeJsonLd,
} from "../../../lib/json-ld";
import {
  LIFE_OG_CONTENT_TYPE,
  LIFE_OG_SIZE,
  lifeImageAlt,
  speakBirthDate,
} from "../../../lib/life-og";
import { SITE_URL } from "../../../lib/site";
import {
  birthDateFromPathSegments,
  extractNameFromUrl,
  lifeImagePath,
} from "../../../lib/url-utils";
import { breakpoints } from "../../../styles/breakpoints.stylex";
import { kicker } from "../../../styles/recipes/kicker.stylex";
import { tokens } from "../../../styles/tokens.stylex";

const styles = stylex.create({
  shell: {
    marginInline: "auto",
    paddingInline: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
      [breakpoints.lg]: "2rem",
      [breakpoints.print]: 0,
    },
    paddingBlock: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
      [breakpoints.lg]: "2rem",
      [breakpoints.print]: 0,
    },
    backgroundColor: {
      default: null,
      [breakpoints.print]: tokens.white,
    },
    colorScheme: {
      default: null,
      [breakpoints.print]: "light",
    },
    printColorAdjust: "exact",
    WebkitPrintColorAdjust: "exact",
  },
  switcher: {
    display: {
      default: "flex",
      [breakpoints.print]: "none",
    },
    justifyContent: "flex-end",
    marginBottom: "2rem",
  },
  switchLink: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: tokens.border,
      ":hover": tokens.accent,
    },
    borderRadius: 9999,
    paddingInline: "1rem",
    paddingBlock: "0.5rem",
    fontFamily: tokens.fontDisplay,
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    fontWeight: 500,
    color: tokens.primary,
    textDecorationLine: "none",
  },
  titleSpacer: {
    marginBottom: {
      default: "2.5rem",
      [breakpoints.sm]: "3rem",
      [breakpoints.print]: "0.2rem",
    },
    minHeight: {
      default: "4.75rem",
      [breakpoints.sm]: "5.75rem",
      [breakpoints.print]: "1.1rem",
    },
  },
  tableFit: {
    printColorAdjust: "exact",
    WebkitPrintColorAdjust: "exact",
  },
  tableSlot: {
    // Reserves table height in the Suspense fallback so the shell does not jump.
    minHeight: {
      default: "50vh",
      [breakpoints.print]: "auto",
    },
  },
  tablePrintOnly: {
    display: {
      default: "none",
      [breakpoints.print]: "block",
    },
  },
  burst: {
    position: "relative",
    width: "100%",
    height: "80vh",
    display: {
      default: "block",
      [breakpoints.print]: "none",
    },
  },
  summary: {
    display: {
      default: "block",
      [breakpoints.print]: "none",
    },
    width: "100%",
    maxWidth: "48rem",
    marginInline: "auto",
    marginTop: {
      default: "4rem",
      [breakpoints.sm]: "5rem",
    },
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: `color-mix(in oklab, ${tokens.accent} 20%, transparent)`,
    paddingInline: "1rem",
    paddingTop: {
      default: "4rem",
      [breakpoints.sm]: "5rem",
    },
  },
  stats: {
    borderLeftWidth: 3,
    borderLeftStyle: "solid",
    borderLeftColor: tokens.accent,
    paddingLeft: {
      default: "1.5rem",
      [breakpoints.sm]: "2rem",
    },
  },
  lived: {
    fontFamily: tokens.fontMono,
    fontSize: {
      default: "3rem",
      [breakpoints.smOnly]: "3.75rem",
      [breakpoints.lg]: "4.5rem",
    },
    lineHeight: 1,
    fontWeight: 700,
    color: tokens.accent,
    fontVariantNumeric: "tabular-nums",
  },
  statLabel: {
    marginTop: "0.75rem",
    marginBottom: 0,
    fontSize: {
      default: "0.75rem",
      [breakpoints.sm]: "0.875rem",
    },
  },
  remaining: {
    marginTop: {
      default: "2.5rem",
      [breakpoints.sm]: "3rem",
    },
    fontFamily: tokens.fontMono,
    fontSize: {
      default: "2.25rem",
      [breakpoints.smOnly]: "3rem",
      [breakpoints.lg]: "3.75rem",
    },
    lineHeight: 1,
    fontWeight: 700,
    color: tokens.primary,
    fontVariantNumeric: "tabular-nums",
  },
  note: {
    marginTop: {
      default: "3rem",
      [breakpoints.sm]: "4rem",
    },
    marginBottom: 0,
    fontFamily: tokens.fontSans,
    fontSize: {
      default: "1rem",
      [breakpoints.sm]: "1.125rem",
    },
    lineHeight: 1.625,
    color: tokens.secondary,
  },
});

function mergeClass(stylexClass: string | undefined, marker: string) {
  return [stylexClass, marker].filter(Boolean).join(" ");
}

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
  // Age/week copy uses `new Date()` — must run at request time.
  await connection();
  const awaitedParams = await params;
  const view = awaitedParams.view;
  const dateParams = awaitedParams.params ?? [];
  const birthDate = birthDateFromPathSegments(dateParams);
  const urlPath = dateParams.join("/");

  if (!isViewMode(view) || !birthDate) {
    notFound();
  }

  const query = await searchParams;
  const name = extractNameFromUrl(
    new URLSearchParams(
      Object.entries(query).flatMap(([key, value]) =>
        value === undefined
          ? []
          : Array.isArray(value)
            ? value.map(item => [key, item] as [string, string])
            : [[key, value] as [string, string]]
      )
    )
  );

  const ageData = calculateFullAge(birthDate);
  const age = ageData?.years ?? 0;
  const weeksLived = calculateLifeWeeks(birthDate)?.weeksLived ?? 0;
  const potentialYearsLeft = Math.max(80 - age, 0);
  const viewTitle = view === "burst" ? "Burst View" : "Table View";
  const canonicalUrl = `${SITE_URL}/${view}/${urlPath}`;
  const titleName = name ? `${name} · ` : "";
  const imagePath = lifeImagePath(birthDate);
  const imageAlt = lifeImageAlt(
    `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, "0")}-${String(birthDate.getDate()).padStart(2, "0")}`
  );

  return {
    title: `${titleName}Your Life in Weeks - Age ${age} - ${viewTitle}`,
    description: `How many weeks have you lived? At ${age} years old, you've lived approximately ${weeksLived} weeks. Visualize your life ${view === "burst" ? "as a radial burst" : "in a table grid"} with ${potentialYearsLeft} years potentially remaining. Make every week count.`,
    alternates: {
      canonical: canonicalUrl,
    },
    // Personal calendars stay shareable without becoming search landing pages.
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${titleName}Your Life in Weeks - Age ${age} - ${viewTitle}`,
      description: `At ${age} years old, you've lived approximately ${weeksLived} weeks. Visualize your life ${view === "burst" ? "as a radial burst" : "in a table grid"}, with approximately ${potentialYearsLeft} years potentially left.`,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: imagePath,
          width: LIFE_OG_SIZE.width,
          height: LIFE_OG_SIZE.height,
          alt: imageAlt,
          type: LIFE_OG_CONTENT_TYPE,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleName}Your Life in Weeks - Age ${age} - ${viewTitle}`,
      description: `At ${age} years old, you've lived approximately ${weeksLived} weeks. Visualize your life ${view === "burst" ? "as a radial burst" : "in a table grid"}.`,
      images: [imagePath],
    },
  };
}

function CalendarChrome({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.shell)}>{children}</div>;
}

function TitleFallback() {
  return <div {...stylex.props(styles.titleSpacer)} aria-hidden="true" />;
}

function TableFallback() {
  const slot = stylex.props(styles.tableFit, styles.tableSlot);
  return (
    <div {...slot} className={mergeClass(slot.className, "life-table-fit")}>
      <div className="life-table-frame" />
    </div>
  );
}

async function CalendarSwitcher({ params, searchParams }: Props) {
  const awaitedParams = await params;
  const view = awaitedParams.view;
  const dateParams = awaitedParams.params ?? [];

  if (!isViewMode(view)) {
    return null;
  }

  const birthDate = birthDateFromPathSegments(dateParams);
  const urlPath = dateParams.join("/");
  if (!birthDate) {
    return null;
  }

  const query = await searchParams;
  const name = extractNameFromUrl(
    new URLSearchParams(
      Object.entries(query).flatMap(([key, value]) =>
        value === undefined
          ? []
          : Array.isArray(value)
            ? value.map(item => [key, item] as [string, string])
            : [[key, value] as [string, string]]
      )
    )
  );
  const otherView: ViewMode = view === "table" ? "burst" : "table";
  const nameQuery = name ? `?name=${encodeURIComponent(name)}` : "";

  return (
    <div {...stylex.props(styles.switcher)}>
      <SwitchViewLink
        href={`/${otherView}/${urlPath}${nameQuery}`}
        view={otherView}
        {...stylex.props(styles.switchLink)}
      >
        Switch to {otherView === "table" ? "table" : "burst"} view
      </SwitchViewLink>
    </div>
  );
}

async function ViewBody({ params }: Props) {
  // Request-time gate so `new Date()` in week math is legal under Cache Components.
  await connection();
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

  const lifeWeeks = calculateLifeWeeks(birthDate);
  const weeksLived = lifeWeeks?.weeksLived ?? 0;
  const weeksRemaining = lifeWeeks?.weeksRemaining ?? 0;

  const imagePath = lifeImagePath(birthDate);
  const iso = `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, "0")}-${String(birthDate.getDate()).padStart(2, "0")}`;
  const imageAlt = lifeImageAlt(iso);
  const imageUrl = `${SITE_URL}${imagePath}`;
  const pageUrl = `${SITE_URL}/${view}/${urlPath}`;
  const structured = graphJsonLd([
    {
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
          item: pageUrl,
        },
      ],
    },
    {
      "@type": "WebPage",
      url: pageUrl,
      primaryImageOfPage: lifeImageObject({
        contentUrl: imageUrl,
        caption: imageAlt,
        width: LIFE_OG_SIZE.width,
        height: LIFE_OG_SIZE.height,
      }),
    },
    lifeImageObject({
      contentUrl: imageUrl,
      caption: imageAlt,
      width: LIFE_OG_SIZE.width,
      height: LIFE_OG_SIZE.height,
    }),
  ]);

  const tableFit = stylex.props(
    styles.tableFit,
    view === "burst" && styles.tablePrintOnly
  );

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is serialized into a script tag.
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structured) }}
      />

      <div
        {...tableFit}
        className={mergeClass(tableFit.className, "life-table-fit")}
      >
        <div className="life-table-frame">
          <div className="life-table-scale">
            <LifeTable dob={birthDate} />
          </div>
        </div>
      </div>
      {view === "burst" ? (
        <div {...stylex.props(styles.burst)}>
          <BurstSceneLazy
            dob={birthDate}
            shape="circle"
            itemSizeRem={0.28}
            itemSpacingRem={0.18}
          />
        </div>
      ) : null}

      <section {...stylex.props(styles.summary)}>
        <div {...stylex.props(styles.stats)}>
          <div {...stylex.props(styles.lived)}>
            {weeksLived.toLocaleString()}
          </div>
          <div {...stylex.props(kicker.base, styles.statLabel)}>
            Weeks lived
          </div>

          {weeksRemaining > 0 && (
            <>
              <div {...stylex.props(styles.remaining)}>
                {weeksRemaining.toLocaleString()}
              </div>
              <div {...stylex.props(kicker.base, styles.statLabel)}>
                Weeks remaining (est.)
              </div>
            </>
          )}
        </div>

        <p {...stylex.props(styles.note)}>
          Each square is a week. The filled ones are gone. Make the empty ones
          count.
        </p>
      </section>
      <LifeSharePicture
        src={imagePath}
        alt={imageAlt}
        caption={`Born ${speakBirthDate(iso)}. The picture is the same count as the grid.`}
      />
    </>
  );
}

export default function ViewPage(props: Props) {
  return (
    <CalendarChrome>
      <BackButton />
      <Suspense
        fallback={<div {...stylex.props(styles.switcher)} aria-hidden="true" />}
      >
        <CalendarSwitcher {...props} />
      </Suspense>
      {/* Title + table share a print fragment so they stay on one page. */}
      <div className="calendar-print">
        <Suspense fallback={<TitleFallback />}>
          <CalendarHeading />
        </Suspense>
        <Suspense fallback={<TableFallback />}>
          <ViewBody {...props} />
        </Suspense>
      </div>
    </CalendarChrome>
  );
}
