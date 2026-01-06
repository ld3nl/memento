import type { Metadata } from "next";
import Image from "next/image";
import BackButton from "../../components/BackButton";
import { KofiButton } from "../../components/KofiButton";

// Add metadata for SEO
export const metadata: Metadata = {
  title:
    "Memento Mori Online Table Generator | About - Daily Stoic Memento Mori Calendar",
  description:
    "Discover our unique digital calendar that combines Stoic wisdom with Memento Mori philosophy, helping you live each day with purpose and mindfulness.",
};

const Page = () => {
  return (
    <>
      <BackButton />
      <main
        id="main-content"
        aria-label="About page content"
        className="mx-auto max-w-prose px-4 py-8 text-justify text-base/7 leading-relaxed dark:text-purple-500"
      >
        <article itemScope itemType="http://schema.org/Article">
          <Image
            src="https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3"
            alt="A human skull is centrally placed, adorned with a wreath of red, pink, and white flowers, surrounded by green foliage. A white bird, possibly a dove or egret, stands to the left among the flowers. The background is dark, framed by a decorative border, enhancing the contrast with the vibrant flowers."
            width={730}
            height={548}
            className="mb-6 rounded-lg"
            priority={false}
          />

          <h1 className="mb-8 font-serif text-2xl leading-8 font-semibold tracking-wide">
            About Daily Stoic Memento Mori Calendar
          </h1>

          <p className="mb-6">
            Welcome to the Daily Stoic Memento Mori Calendar, a unique digital
            companion designed to intertwine the timeless wisdom of Stoicism
            with the poignant reminder of our mortality. Here, each day
            isn&apos;t just another date on the calendar; it&apos;s an
            opportunity to live with intention, virtue, and resilience.
          </p>

          <h2 className="mt-10 mb-4 font-serif text-xl font-semibold tracking-wide">
            Thoughtful Design
          </h2>

          <p className="mb-6">
            We&apos;ve poured our hearts into crafting this calendar, ensuring
            every pixel reflects the tranquility of nature&apos;s finest
            moments—like the quiet beauty of a sunrise or the reflective calm of
            a sunset over the ocean. With its soothing color schemes and natural
            imagery, this calendar isn&apos;t just a tool; it&apos;s a sanctuary
            for your daily reflections.
          </p>

          <p className="mb-4">
            Our design philosophy embraces both form and function:
          </p>

          <ul className="mb-6 list-disc space-y-4 pl-6">
            <li>
              <strong>Aesthetically Pleasing:</strong> Inspired by the peace
              found in nature, the visual design helps to calm your mind as you
              start or end your day.
            </li>
            <li>
              <strong>Seamless Experience:</strong> Whether you&apos;re on your
              phone or desktop, the interface is intuitive, making Stoic wisdom
              easily accessible. Dive into quotes, ponder over reflections, all
              within a beautifully crafted digital space.
            </li>
          </ul>

          <section aria-label="Stoicism and Memento Mori">
            <h2 className="mt-10 mb-4 font-serif text-xl font-semibold tracking-wide">
              Stoicism and Memento Mori
            </h2>

            <p className="mb-6">
              Stoicism isn&apos;t just philosophy; it&apos;s a way of life that
              has inspired giants like Steve Jobs and Leo Tolstoy. Through our
              calendar, you&apos;ll journey with the teachings of Marcus
              Aurelius, Seneca, and Epictetus. Their words, brought to you
              daily, serve as a bridge between ancient wisdom and contemporary
              living, helping you navigate life&apos;s challenges with grace.
            </p>
          </section>

          <section aria-label="Inspiration and Purpose">
            <h2 className="mt-10 mb-4 font-serif text-xl font-semibold tracking-wide">
              Inspiration and Purpose
            </h2>

            <Image
              className="float-right ms-6 mb-6 size-50 rounded-lg"
              src={
                "https://utfs.io/f/vfxFGWyJBql9iPL0zzmHfGMqUKyTLPZcjQwxsDBOXp4J2bCo"
              }
              width={1125}
              height={1192}
              alt="A serene forest scene with tall trees and sunlight filtering through the canopy, creating a warm glow and dappled light effect on lush green foliage."
              priority={false}
            />
            <p className="mb-6">
              The concept for this calendar was sparked during contemplative
              walks in nature, where the fleeting beauty of life becomes starkly
              apparent. It&apos;s crafted for those who seek to live with more
              intention, to remember life&apos;s brevity, and to make each day
              count. This calendar isn&apos;t just a reminder to live; it&apos;s
              an invitation to grow, to reflect, and to embrace the essence of
              Stoicism and Memento Mori.
            </p>

            <Image
              src={
                "https://utfs.io/f/vfxFGWyJBql9tA8n5LA6EWr7SI90xRVulwdUhnPDQs8kcH3y"
              }
              width={730}
              height={548}
              className="float-left me-6 mb-6 size-50 rounded-lg"
              alt="A serene beach scene with the sun setting or rising over the ocean, casting a warm glow on the waves and the sandy shore. The sky is filled with orange, pink, and blue hues with scattered clouds, and a silhouette of hills on the left side."
              priority={false}
            />
            <p>
              In our fast-paced world, where moments often slip by unnoticed,
              the Daily Stoic Memento Mori Calendar stands as your personal
              guide to mindfulness. Let it inspire you to pause, reflect, and
              live with purpose. Join us in this journey of self-discovery,
              where every day is an opportunity to live deeply, think
              profoundly, and cultivate a life of serenity and significance.
            </p>
          </section>

          <meta itemProp="datePublished" content={new Date().toISOString()} />
          <meta itemProp="author" content="Daily Stoic Memento Mori Team" />
        </article>
      </main>
    </>
  );
};

export default Page;
