import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "../components/content/JsonLd";
import Form from "../components/Form/Form";
import { listPublishedPosts } from "../lib/content";
import { formatContentDate } from "../lib/content-meta";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "../lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
};

export default async function Page() {
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
          "A Memento Mori calendar is a visual tool used to track life in weeks, helping users reflect on mortality and prioritize time.",
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
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 xl:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col justify-center space-y-5 sm:space-y-6 lg:space-y-8">
            <div className="relative">
              <Image
                src="https://utfs.io/f/vfxFGWyJBql9xCI1QO2QPvwdGrZoHIKXJqsfUxy6C9SDnN7b"
                alt="Memento Mori skull illustration"
                width={177}
                height={141}
                className="mb-4 h-auto w-32 opacity-90 contrast-125 grayscale sm:mb-5 sm:w-36 lg:w-44"
                priority
              />
              <h1 className="font-display text-[2.5rem] leading-[0.95] tracking-tight text-zinc-900 italic sm:text-5xl lg:text-6xl xl:text-7xl dark:text-zinc-50">
                Memento
                <br />
                Mori
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-500 sm:mt-6 sm:text-lg dark:text-zinc-400">
                Every week is numbered. Enter your birthdate to see yours.
              </p>
            </div>
          </div>
          <Form />
        </div>
      </section>
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col gap-4">
            <Link
              href="/about"
              className="border-accent/30 font-display text-primary hover:border-accent hover:text-accent inline-block w-fit border-b-[3px] pb-1.5 text-xs font-bold tracking-[0.25em] uppercase transition-colors duration-200 sm:text-sm"
            >
              About this Calendar
            </Link>
            <Link
              href="/blog"
              className="border-accent/30 font-display text-primary hover:border-accent hover:text-accent inline-block w-fit border-b-[3px] pb-1.5 text-xs font-bold tracking-[0.25em] uppercase transition-colors duration-200 sm:text-sm"
            >
              Journal
            </Link>
          </div>

          <section className="lg:col-start-2" aria-labelledby="how-it-works">
            <h2
              id="how-it-works"
              className="border-border font-display text-secondary border-b-2 pb-3 text-xs font-bold tracking-[0.25em] uppercase sm:text-[0.6875rem]"
            >
              How it works
            </h2>
            <div className="text-secondary mt-5 space-y-4 font-sans text-sm leading-relaxed sm:mt-6 sm:text-base">
              <p>
                A{" "}
                <strong className="font-semibold">
                  Memento Mori calendar
                </strong>{" "}
                is a grid of weeks. You mark the ones already lived. The empty
                cells are the ones you still have, if you get something like 80
                years.
              </p>
              <p>
                Enter a birthdate. The result is a bookmarkable 80-year picture,
                as a table or a burst. It will not tell you what to value. It
                will make the container visible.
              </p>
              <p>
                The habit behind it is{" "}
                <Link
                  href="/blog/what-is-memento-mori"
                  className="text-accent underline decoration-red-600/30 underline-offset-4 hover:decoration-red-600"
                >
                  memento mori
                </Link>
                : remember that you will die, closely enough that this week
                stops being a rehearsal. The{" "}
                <Link
                  href="/blog"
                  className="text-accent underline decoration-red-600/30 underline-offset-4 hover:decoration-red-600"
                >
                  journal
                </Link>{" "}
                has the longer notes on Stoics, Steve Jobs, and the practice.
              </p>
            </div>
          </section>
        </div>
      </div>
      {featured.length > 0 ? (
        <section
          className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8"
          aria-labelledby="journal-heading"
        >
          <h2
            id="journal-heading"
            className="font-display text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase"
          >
            From the journal
          </h2>
          <ul className="divide-border border-border mt-6 divide-y-2 border-y-2">
            {featured.map((post) => (
              <li key={post.slug} className="py-6">
                <p className="text-secondary mb-2 text-sm">
                  <time dateTime={post.frontmatter.datePublished}>
                    {formatContentDate(post.frontmatter.datePublished)}
                  </time>
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-display text-primary hover:text-accent text-2xl italic"
                >
                  {post.frontmatter.title}
                </Link>
                <p className="text-secondary mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">
                  {post.frontmatter.description}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/blog"
            className="font-display text-accent mt-6 inline-block text-xs font-bold tracking-[0.25em] uppercase"
          >
            All notes
          </Link>
        </section>
      ) : null}
    </>
  );
}
