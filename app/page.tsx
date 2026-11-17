import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "../components/content/JsonLd";
import Form from "../components/Form/Form";
import { listPublishedPosts } from "../lib/content";
import { formatContentDate } from "../lib/content-meta";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "../lib/site";
import { FORM_DATA_STORAGE_KEY } from "../lib/storage";
import { breakpoints } from "../styles/breakpoints.stylex";
import { kicker } from "../styles/recipes/kicker.stylex";
import { textLink } from "../styles/recipes/textLink.stylex";
import { tokens } from "../styles/tokens.stylex";

/** Quoted once, outside the markup, so the boot script stays a constant. */
const SAVED_DATE_BOOT_KEY = JSON.stringify(FORM_DATA_STORAGE_KEY);

const styles = stylex.create({
  hero: {
    width: "100%",
    maxWidth: "80rem",
    marginInline: "auto",
    paddingInline: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
      [breakpoints.lg]: "2rem",
    },
    paddingBlock: {
      default: "2rem",
      [breakpoints.sm]: "3rem",
      [breakpoints.lg]: "4rem",
      [breakpoints.xl]: "5rem",
    },
  },
  heroGrid: {
    display: "grid",
    gap: {
      default: "2.5rem",
      [breakpoints.lg]: "3rem",
      [breakpoints.xl]: "4rem",
    },
    gridTemplateColumns: {
      default: "1fr",
      [breakpoints.lg]: "repeat(2, minmax(0, 1fr))",
    },
  },
  heroCopy: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heroMark: {
    position: "relative",
  },
  skull: {
    display: "block",
    marginBottom: {
      default: "1rem",
      [breakpoints.sm]: "1.25rem",
    },
    height: "auto",
    width: {
      default: "8rem",
      // Exclusive band: StyleX value-sort otherwise lets sm `9rem` beat lg `11rem`.
      [breakpoints.smOnly]: "9rem",
      [breakpoints.lg]: "11rem",
    },
    opacity: 0.9,
    filter: "contrast(1.25) grayscale(1)",
  },
  title: {
    marginTop: 0,
    marginBottom: 0,
    fontFamily: tokens.fontDisplay,
    fontSize: {
      default: tokens.display,
      [breakpoints.smOnly]: "3rem",
      [breakpoints.lgOnly]: "3.75rem",
      [breakpoints.xl]: "4.5rem",
    },
    lineHeight: tokens.leadingDisplay,
    letterSpacing: "-0.025em",
    fontStyle: "italic",
    fontWeight: 400,
    color: tokens.primary,
  },
  lede: {
    marginTop: {
      default: "1.25rem",
      [breakpoints.sm]: "1.5rem",
    },
    marginBottom: 0,
    maxWidth: "28rem",
    fontSize: {
      default: "1rem",
      [breakpoints.sm]: "1.125rem",
    },
    lineHeight: 1.625,
    color: tokens.secondary,
  },
  lower: {
    width: "100%",
    maxWidth: "80rem",
    marginInline: "auto",
    paddingInline: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
      [breakpoints.lg]: "2rem",
    },
    paddingBottom: {
      default: "3rem",
      [breakpoints.sm]: "4rem",
    },
  },
  lowerGrid: {
    display: "grid",
    gap: {
      default: "2rem",
      [breakpoints.lg]: "3rem",
      [breakpoints.xl]: "4rem",
    },
    gridTemplateColumns: {
      default: "1fr",
      [breakpoints.lg]: "repeat(2, minmax(0, 1fr))",
    },
  },
  linkColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  navLink: {
    display: "inline-block",
    width: "fit-content",
    borderBottomWidth: 3,
    borderBottomStyle: "solid",
    borderBottomColor: {
      default: `color-mix(in oklab, ${tokens.accent} 30%, transparent)`,
      ":hover": tokens.accent,
    },
    paddingBottom: "0.375rem",
    fontFamily: tokens.fontDisplay,
    fontSize: {
      default: "0.75rem",
      [breakpoints.sm]: "0.875rem",
    },
    fontWeight: 700,
    letterSpacing: tokens.trackingLabel,
    textTransform: "uppercase",
    color: {
      default: tokens.primary,
      ":hover": tokens.accent,
    },
    textDecorationLine: "none",
    transitionProperty: "color, border-color",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  how: {
    gridColumnStart: {
      default: "auto",
      [breakpoints.lg]: "2",
    },
  },
  howHeading: {
    marginTop: 0,
    marginBottom: 0,
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
    paddingBottom: "0.75rem",
    fontSize: {
      default: "0.75rem",
      [breakpoints.sm]: tokens.kicker,
    },
    fontWeight: 700,
  },
  copy: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: {
      default: "1.25rem",
      [breakpoints.sm]: "1.5rem",
    },
    fontFamily: tokens.fontSans,
    fontSize: {
      default: "0.875rem",
      [breakpoints.sm]: "1rem",
    },
    lineHeight: 1.625,
    color: tokens.secondary,
  },
  copyParagraph: {
    marginTop: 0,
    marginBottom: 0,
  },
  strong: {
    fontWeight: 600,
  },
  inlineLink: {
    textDecorationColor: {
      default: `color-mix(in oklab, ${tokens.accent} 30%, transparent)`,
      ":hover": tokens.accent,
    },
  },
  journal: {
    width: "100%",
    maxWidth: "80rem",
    marginInline: "auto",
    paddingInline: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
      [breakpoints.lg]: "2rem",
    },
    paddingBottom: {
      default: "4rem",
      [breakpoints.sm]: "5rem",
    },
  },
  journalHeading: {
    marginTop: 0,
    marginBottom: 0,
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  journalList: {
    marginTop: "1.5rem",
    marginBottom: 0,
    paddingInline: 0,
    paddingBlock: 0,
    listStyleType: "none",
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: tokens.border,
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
  },
  journalItem: {
    paddingBlock: "1.5rem",
  },
  journalDivider: {
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: tokens.border,
  },
  meta: {
    marginTop: 0,
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: tokens.secondary,
  },
  postTitle: {
    fontFamily: tokens.fontDisplay,
    fontSize: "1.5rem",
    lineHeight: "calc(2 / 1.5)",
    fontStyle: "italic",
    fontWeight: 400,
    color: {
      default: tokens.primary,
      ":hover": tokens.accent,
    },
    textDecorationLine: "none",
  },
  postDescription: {
    marginTop: "0.5rem",
    marginBottom: 0,
    maxWidth: "42rem",
    fontSize: {
      default: "0.875rem",
      [breakpoints.sm]: "1rem",
    },
    lineHeight: 1.625,
    color: tokens.secondary,
  },
  allNotes: {
    display: "inline-block",
    marginTop: "1.5rem",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: tokens.accent,
    textDecorationLine: "none",
  },
});

export const ensureStatic = "navigation";

const pageTitle = "How many weeks have I lived? | Memento Mori";
const pageDescription =
  "How many weeks have I lived? Count them on a life-in-weeks calendar. Enter a birthdate and see an 80-year grid of the weeks behind you and ahead.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
};

export default async function Page() {
  "use cache";
  cacheLife("max");
  const posts = await listPublishedPosts();
  const featured = posts.slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: SITE_NAME,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        url: SITE_URL,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "A free calendar that shows your life in weeks, using an 80-year span as a rough guide.",
        featureList:
          "Calculate life in weeks, Visual grid of 80 years, Persistent bookmarkable URL",
        screenshot: OG_IMAGE,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is a Memento Mori calendar?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A Memento Mori calendar is a visual tool used to track life in weeks, helping users reflect on mortality and prioritize time. This one draws an 80-year grid from your birthdate.",
            },
          },
          {
            "@type": "Question",
            name: "How does this tool work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Enter a birthdate. The calendar counts weeks lived and weeks remaining on a working span of 80 years, then gives you a bookmarkable URL for the table or burst view.",
            },
          },
          {
            "@type": "Question",
            name: "What does memento mori mean?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Memento mori is Latin for remember that you will die. It is a Stoic habit of keeping mortality close enough that it changes what you do this week.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <section {...stylex.props(styles.hero)}>
        <div {...stylex.props(styles.heroGrid)}>
          <div {...stylex.props(styles.heroCopy)}>
            <div {...stylex.props(styles.heroMark)}>
              <Image
                src="https://utfs.io/f/vfxFGWyJBql9xCI1QO2QPvwdGrZoHIKXJqsfUxy6C9SDnN7b"
                alt="Memento Mori skull illustration"
                width={177}
                height={141}
                {...stylex.props(styles.skull)}
                priority
              />
              <h1 {...stylex.props(styles.title)}>
                Your life
                <br />
                in weeks
              </h1>
              <p {...stylex.props(styles.lede)}>
                Enter your birthdate to see how many weeks you&apos;ve lived.
                Take a moment to think about how you&apos;d like to spend the
                weeks ahead.
              </p>
            </div>
          </div>
          {/* Runs while the HTML is parsing, before the preview can push content. */}
          <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: boot script interpolates a constant storage key, not user HTML.
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var raw=localStorage.getItem(${SAVED_DATE_BOOT_KEY});if(!raw)return;var data=JSON.parse(raw);if(data&&typeof data.date==="string"&&data.date)document.documentElement.setAttribute("data-memento-saved","");}catch(e){}})();`,
            }}
          />
          <Form />
        </div>
      </section>
      <div {...stylex.props(styles.lower)}>
        <div {...stylex.props(styles.lowerGrid)}>
          <div {...stylex.props(styles.linkColumn)}>
            <Link href="/about" {...stylex.props(styles.navLink)}>
              About this Calendar
            </Link>
            <Link href="/blog" {...stylex.props(styles.navLink)}>
              Journal
            </Link>
          </div>

          <section {...stylex.props(styles.how)} aria-labelledby="how-it-works">
            <h2
              id="how-it-works"
              {...stylex.props(kicker.base, styles.howHeading)}
            >
              How it works
            </h2>
            <div {...stylex.props(styles.copy)}>
              <p {...stylex.props(styles.copyParagraph)}>
                A{" "}
                <strong {...stylex.props(styles.strong)}>
                  Memento Mori calendar
                </strong>{" "}
                shows your life as a grid of weeks. Each square is one week in
                an 80-year life. The filled squares show the weeks you&apos;ve
                lived.
              </p>
              <p {...stylex.props(styles.copyParagraph)}>
                You can see your calendar as a grid or a circle, then save its
                link to come back later. It&apos;s free, and you don&apos;t need
                an account.
              </p>
              <p {...stylex.props(styles.copyParagraph)}>
                The 80-year span is a rough guide, not a prediction of how long
                you&apos;ll live. Read{" "}
                <Link
                  href="/blog/life-in-weeks"
                  {...stylex.props(textLink.base, styles.inlineLink)}
                >
                  how the life in weeks calendar works
                </Link>
                .
              </p>
              <p {...stylex.props(styles.copyParagraph)}>
                {"The name "}
                <Link
                  href="/blog/what-is-memento-mori"
                  {...stylex.props(textLink.base, styles.inlineLink)}
                >
                  memento mori
                </Link>
                {
                  " means “remember that you will die.” It’s a reminder to make time for the people and things that matter to you. Our "
                }
                <Link
                  href="/blog"
                  {...stylex.props(textLink.base, styles.inlineLink)}
                >
                  journal
                </Link>{" "}
                has more on this idea and ways to use it in everyday life.
              </p>
            </div>
          </section>
        </div>
      </div>
      {featured.length > 0 ? (
        <section
          {...stylex.props(styles.journal)}
          aria-labelledby="journal-heading"
        >
          <h2
            id="journal-heading"
            {...stylex.props(kicker.base, styles.journalHeading)}
          >
            From the journal
          </h2>
          <ul {...stylex.props(styles.journalList)}>
            {featured.map((post, index) => (
              <li
                key={post.slug}
                {...stylex.props(
                  styles.journalItem,
                  index > 0 && styles.journalDivider
                )}
              >
                <p {...stylex.props(styles.meta)}>
                  <time dateTime={post.frontmatter.datePublished}>
                    {formatContentDate(post.frontmatter.datePublished)}
                  </time>
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  {...stylex.props(styles.postTitle)}
                >
                  {post.frontmatter.title}
                </Link>
                <p {...stylex.props(styles.postDescription)}>
                  {post.frontmatter.description}
                </p>
              </li>
            ))}
          </ul>
          <Link href="/blog" {...stylex.props(kicker.base, styles.allNotes)}>
            All notes
          </Link>
        </section>
      ) : null}
    </>
  );
}
