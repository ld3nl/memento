import type { Metadata } from "next";
import Image from "next/image";
import BackButton from "../../components/BackButton";

const DATE_PUBLISHED = "2024-01-01T00:00:00.000Z";

// Add metadata for SEO
export const metadata: Metadata = {
  title:
    "About Memento Mori Calendar | Daily Stoic Life in Weeks Visualization",
  description:
    "Discover our unique digital calendar that combines Stoic wisdom with Memento Mori philosophy, helping you live each day with purpose and mindfulness. Learn about the philosophy behind visualizing life in weeks.",
  alternates: {
    canonical: "https://memento-mori.vercel.app/about",
  },
  openGraph: {
    title: "About Memento Mori Calendar | Daily Stoic Life Visualization",
    description:
      "Discover our unique digital calendar that combines Stoic wisdom with Memento Mori philosophy, helping you live each day with purpose.",
    url: "https://memento-mori.vercel.app/about",
    type: "article",
    images: [
      {
        url: "https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3",
        width: 730,
        height: 548,
        alt: "Memento Mori Skull with Flowers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Memento Mori Calendar",
    description:
      "Discover our unique digital calendar that combines Stoic wisdom with Memento Mori philosophy.",
    images: [
      "https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3",
    ],
  },
};

const Page = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "About Daily Stoic Memento Mori Calendar",
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_PUBLISHED,
    author: {
      "@type": "Organization",
      name: "Daily Stoic Memento Mori Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Memento Mori",
      logo: {
        "@type": "ImageObject",
        url: "https://memento-mori.vercel.app/favicon.ico",
      },
    },
    image: {
      "@type": "ImageObject",
      url: "https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3",
      width: 730,
      height: 548,
    },
    description:
      "Discover our unique digital calendar that combines Stoic wisdom with Memento Mori philosophy, helping you live each day with purpose and mindfulness.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is serialized into a script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackButton />
      <main
        id="main-content"
        aria-label="About page content"
        className="text-primary mx-auto w-full max-w-prose px-4 py-10 text-base leading-relaxed sm:px-6 sm:py-12 lg:py-16"
      >
        <article>
          <Image
            src="https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3"
            alt="A human skull is centrally placed, adorned with a wreath of red, pink, and white flowers, surrounded by green foliage. A white bird, possibly a dove or egret, stands to the left among the flowers. The background is dark, framed by a decorative border, enhancing the contrast with the vibrant flowers."
            width={730}
            height={548}
            className="mb-8 w-full rounded-none opacity-90 grayscale sm:mb-10"
            priority={false}
          />

          <h1 className="font-display text-accent mb-8 text-[2.5rem] leading-tight tracking-tight italic sm:mb-10 sm:text-5xl">
            About Memento Mori
          </h1>

          <p className="text-primary mb-6">
            The Daily Stoic Memento Mori Calendar intertwines timeless Stoic
            wisdom with the poignant reminder of mortality. Each day is an
            opportunity to live with intention, virtue, and resilience.
          </p>

          <h2 className="font-display text-accent mt-10 mb-4 text-2xl italic sm:mt-12 sm:text-3xl">
            Thoughtful Design
          </h2>

          <p className="text-primary mb-6">
            Every element reflects tranquility—the quiet beauty of sunrise, the
            reflective calm of sunset. Soothing colors and natural imagery
            create a sanctuary for daily reflection.
          </p>

          <p className="text-primary mb-4">
            Design philosophy embraces both form and function:
          </p>

          <ul className="text-secondary mb-6 list-disc space-y-3 pl-6 sm:mb-8">
            <li>
              <strong className="text-primary font-semibold">
                Aesthetically Pleasing:
              </strong>{" "}
              Inspired by nature's peace to calm your mind as you start or end
              your day.
            </li>
            <li>
              <strong className="text-primary font-semibold">
                Seamless Experience:
              </strong>{" "}
              Intuitive interface on any device makes Stoic wisdom easily
              accessible.
            </li>
          </ul>

          <section aria-label="Stoicism and Memento Mori">
            <h2 className="font-display text-accent mt-10 mb-4 text-2xl italic sm:mt-12 sm:text-3xl">
              Stoicism and Memento Mori
            </h2>

            <p className="text-primary mb-6">
              Stoicism is a way of life that has inspired giants like Steve Jobs
              and Leo Tolstoy. Journey with teachings of Marcus Aurelius,
              Seneca, and Epictetus. Their words serve as a bridge between
              ancient wisdom and contemporary living.
            </p>
          </section>

          <section aria-label="Inspiration and Purpose">
            <h2 className="font-display text-accent mt-10 mb-4 text-2xl italic sm:mt-12 sm:text-3xl">
              Inspiration and Purpose
            </h2>

            <Image
              className="float-right ms-4 mb-6 w-40 rounded-none opacity-90 grayscale sm:ms-6 sm:w-48 lg:w-56"
              src={
                "https://utfs.io/f/vfxFGWyJBql9iPL0zzmHfGMqUKyTLPZcjQwxsDBOXp4J2bCo"
              }
              width={1125}
              height={1192}
              alt="A serene forest scene with tall trees and sunlight filtering through the canopy, creating a warm glow and dappled light effect on lush green foliage."
              priority={false}
            />
            <p className="text-primary mb-6">
              This calendar emerged from contemplative walks in nature, where
              life's fleeting beauty becomes starkly apparent. It's crafted for
              those who seek intentional living, who remember life's brevity,
              and who make each day count.
            </p>

            <Image
              src={
                "https://utfs.io/f/vfxFGWyJBql9tA8n5LA6EWr7SI90xRVulwdUhnPDQs8kcH3y"
              }
              width={730}
              height={548}
              className="float-left me-4 mb-6 w-40 rounded-none opacity-90 grayscale sm:me-6 sm:w-48 lg:w-56"
              alt="A serene beach scene with the sun setting or rising over the ocean, casting a warm glow on the waves and the sandy shore. The sky is filled with orange, pink, and blue hues with scattered clouds, and a silhouette of hills on the left side."
              priority={false}
            />
            <p className="text-primary">
              In our fast-paced world, the Daily Stoic Memento Mori Calendar
              stands as your personal guide to mindfulness. Let it inspire you
              to pause, reflect, and live with purpose. Join this journey of
              self-discovery, where every day is an opportunity to live deeply
              and cultivate a life of serenity and significance.
            </p>
          </section>
        </article>
      </main>
    </>
  );
};

export default Page;
