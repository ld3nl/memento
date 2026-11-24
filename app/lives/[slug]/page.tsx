import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import BackButton from "../../../components/BackButton";
import { JsonLd } from "../../../components/content/JsonLd";
import { LifeSharePicture } from "../../../components/LifeSharePicture";
import { LifeTable } from "../../../components/LifeTable/LifeTable";
import { contentMetadata } from "../../../lib/content-metadata";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  graphJsonLd,
  lifeImageObject,
} from "../../../lib/json-ld";
import {
  LIFE_OG_CONTENT_TYPE,
  LIFE_OG_SIZE,
  speakBirthDate,
} from "../../../lib/life-og";
import { getLife, lifeSpans, listLives } from "../../../lib/lives";
import {
  formatSpanRange,
  inkPaint,
  type WeekSpan,
} from "../../../lib/week-notes";
import { breakpoints } from "../../../styles/breakpoints.stylex";
import { kicker } from "../../../styles/recipes/kicker.stylex";
import { tokens } from "../../../styles/tokens.stylex";

type Props = {
  params: Promise<{ slug: string }>;
};

async function LifeGrid({ dob, spans }: { dob: string; spans: WeekSpan[] }) {
  // The filled squares depend on today's date, so this waits for the request.
  await connection();
  const tableFit = stylex.props(styles.tableFit);
  return (
    <div
      {...tableFit}
      className={mergeClass(tableFit.className, "life-table-fit")}
    >
      <div className="life-table-frame">
        <div className="life-table-scale">
          <Suspense fallback={null}>
            <LifeTable dob={dob} preset={spans} readOnly />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

const styles = stylex.create({
  shell: {
    marginInline: "auto",
    paddingInline: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
      [breakpoints.lg]: "2rem",
    },
    paddingBlock: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
      [breakpoints.lg]: "2rem",
    },
  },
  title: {
    marginTop: 0,
    marginBottom: "0.75rem",
    fontFamily: tokens.fontDisplay,
    fontSize: {
      default: "1.875rem",
      [breakpoints.sm]: "2.25rem",
      [breakpoints.lg]: "3rem",
    },
    lineHeight: 1.25,
    letterSpacing: "-0.025em",
    fontStyle: "italic",
    fontWeight: 400,
    textAlign: "center",
    color: tokens.primary,
  },
  lede: {
    maxWidth: "36rem",
    marginInline: "auto",
    marginTop: 0,
    marginBottom: {
      default: "2.5rem",
      [breakpoints.sm]: "3rem",
    },
    fontFamily: tokens.fontSans,
    fontSize: "1rem",
    lineHeight: 1.6,
    textAlign: "center",
    color: tokens.secondary,
  },
  tableFit: {
    printColorAdjust: "exact",
    WebkitPrintColorAdjust: "exact",
  },
  key: {
    width: "100%",
    maxWidth: "52rem",
    marginInline: "auto",
    marginTop: {
      default: "3rem",
      [breakpoints.sm]: "4rem",
    },
  },
  eyebrow: {
    marginTop: 0,
    marginBottom: "0.75rem",
    textAlign: "center",
  },
  keyLabel: {
    marginTop: 0,
    marginBottom: "1rem",
  },
  chapters: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: tokens.line,
  },
  chapter: {
    display: "grid",
    gridTemplateColumns: "0.5rem minmax(0, 1fr) auto",
    alignItems: "center",
    columnGap: "0.75rem",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.line,
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
  },
  square: {
    width: "0.5rem",
    height: "0.5rem",
  },
  chapterName: {
    fontFamily: tokens.fontSans,
    fontSize: "0.875rem",
    lineHeight: 1.3,
    color: tokens.primary,
  },
  chapterWhen: {
    fontFamily: tokens.fontMono,
    fontSize: "0.75rem",
    lineHeight: 1.3,
    color: tokens.secondary,
    fontVariantNumeric: "tabular-nums",
  },
  note: {
    maxWidth: "40rem",
    marginInline: "auto",
    marginTop: "2rem",
    marginBottom: 0,
    fontFamily: tokens.fontSans,
    fontSize: "0.9375rem",
    lineHeight: 1.6,
    color: tokens.secondary,
  },
  link: {
    color: tokens.primary,
    textUnderlineOffset: "0.15em",
    whiteSpace: "nowrap",
  },
});

function mergeClass(stylexClass: string | undefined, marker: string) {
  return [stylexClass, marker].filter(Boolean).join(" ");
}

export async function generateStaticParams() {
  return listLives().map(life => ({ slug: life.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  "use cache";
  cacheLife("max");
  const { slug } = await params;
  const life = getLife(slug);
  if (!life) return {};
  return contentMetadata({
    title: life.name,
    description: life.summary,
    path: `/lives/${life.slug}`,
    keywords: [
      `${life.name} life in weeks`,
      "life in weeks",
      "memento mori",
      life.birthplace,
    ],
    ogType: "website",
    image: {
      url: absoluteUrl(`/lives/${life.slug}/life-in-weeks.jpg`),
      width: LIFE_OG_SIZE.width,
      height: LIFE_OG_SIZE.height,
      alt: `${life.name}, life in weeks`,
      type: LIFE_OG_CONTENT_TYPE,
    },
  });
}

export default function LifePage({ params }: Props) {
  const slot = stylex.props(styles.tableFit);
  return (
    <Suspense
      fallback={
        <div {...stylex.props(styles.shell)}>
          <div
            {...slot}
            className={mergeClass(slot.className, "life-table-fit")}
          >
            <div className="life-table-frame" />
          </div>
        </div>
      }
    >
      <LifeDocument params={params} />
    </Suspense>
  );
}

async function LifeDocument({ params }: Props) {
  const { slug } = await params;
  const life = getLife(slug);
  if (!life) notFound();

  const spans = lifeSpans(life);
  const chapters = life.marks.filter(mark => mark.kind === "chapter");
  const slot = stylex.props(styles.tableFit);
  const pictureCaption = `${life.name}, born ${speakBirthDate(life.born)}. Life in weeks. Colored squares are dated chapters. Red squares are lived weeks with no chapter. Empty squares are still ahead.`;
  const picture = lifeImageObject({
    contentUrl: absoluteUrl(`/lives/${life.slug}/life-in-weeks.jpg`),
    caption: pictureCaption,
    width: LIFE_OG_SIZE.width,
    height: LIFE_OG_SIZE.height,
  });

  return (
    <div {...stylex.props(styles.shell)}>
      <JsonLd
        data={graphJsonLd([
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: life.name, path: `/lives/${life.slug}` },
          ]),
          {
            "@type": "WebPage",
            url: absoluteUrl(`/lives/${life.slug}`),
            name: life.name,
            description: life.summary,
            primaryImageOfPage: picture,
          },
          picture,
        ])}
      />
      <BackButton />
      <p {...stylex.props(kicker.base, styles.eyebrow)}>Lives</p>
      <h1 {...stylex.props(styles.title)}>{life.name}</h1>
      <p {...stylex.props(styles.lede)}>{life.summary}</p>
      <Suspense
        fallback={
          <div
            {...slot}
            className={mergeClass(slot.className, "life-table-fit")}
          >
            <div className="life-table-frame" />
          </div>
        }
      >
        <LifeGrid dob={life.born} spans={spans} />
      </Suspense>
      <section {...stylex.props(styles.key)} aria-labelledby="life-chapters">
        <h2 {...stylex.props(kicker.base, styles.keyLabel)} id="life-chapters">
          Chapters
        </h2>
        <ul {...stylex.props(styles.chapters)}>
          {chapters.map(chapter => {
            const square = stylex.props(styles.square);
            return (
              <li key={chapter.label} {...stylex.props(styles.chapter)}>
                <span
                  {...square}
                  style={{
                    ...square.style,
                    backgroundColor: inkPaint(chapter.color),
                  }}
                  aria-hidden="true"
                />
                <span {...stylex.props(styles.chapterName)}>
                  {chapter.label}
                </span>
                <span {...stylex.props(styles.chapterWhen)}>
                  {formatSpanRange(chapter)}
                </span>
              </li>
            );
          })}
        </ul>
        <p {...stylex.props(styles.note)}>
          Color is the chapter. Red is a lived week with nothing dated. Empty is
          still ahead. A year or a month is spoken that way when the{" "}
          <a
            href={life.source}
            {...stylex.props(styles.link)}
            rel="noopener noreferrer"
          >
            {life.sourceName}
          </a>{" "}
          page does not give a day.{" "}
          <Link href={life.essay} {...stylex.props(styles.link)}>
            Read the essay
          </Link>
          .
        </p>
      </section>
      <LifeSharePicture
        src={`/lives/${life.slug}/life-in-weeks.jpg`}
        alt={pictureCaption}
        caption={`Born ${speakBirthDate(life.born)} in ${life.birthplace}.`}
      />
    </div>
  );
}
