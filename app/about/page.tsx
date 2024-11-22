import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Add metadata for SEO
export const metadata: Metadata = {
  title:
    "Memento Mori Online Table Generator | About - Daily Stoic Memento Mori Calendar",
  description:
    "Discover our unique digital calendar that combines Stoic wisdom with Memento Mori philosophy, helping you live each day with purpose and mindfulness.",
};

const Page = () => {
  return (
    <main
      id="main-content"
      aria-label="About page content"
      className="dark:text-purple-500 text-base/7 leading-relaxed max-w-prose mx-auto px-4 py-8 text-justify"
    >
      <article itemScope itemType="http://schema.org/Article">
        <Image
          src="https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3"
          alt="A human skull is centrally placed, adorned with a wreath of red, pink, and white flowers, surrounded by green foliage. A white bird, possibly a dove or egret, stands to the left among the flowers. The background is dark, framed by a decorative border, enhancing the contrast with the vibrant flowers."
          width={730}
          height={548}
          className="rounded-lg mb-6"
          priority={false}
        />

        <h1 className="font-serif leading-8 font-semibold tracking-wide text-2xl mb-8">
          About Daily Stoic Memento Mori Calendar
        </h1>

        <p className="mb-6">
          Welcome to the Daily Stoic Memento Mori Calendar, a unique digital
          companion designed to intertwine the timeless wisdom of Stoicism with
          the poignant reminder of our mortality. Here, each day isn't just
          another date on the calendar; it's an opportunity to live with
          intention, virtue, and resilience.
        </p>

        <h2 className="font-serif font-semibold tracking-wide text-xl mt-10 mb-4">
          Thoughtful Design
        </h2>

        <p className="mb-6">
          We've poured our hearts into crafting this calendar, ensuring every
          pixel reflects the tranquility of nature's finest moments—like the
          quiet beauty of a sunrise or the reflective calm of a sunset over the
          ocean. With its soothing color schemes and natural imagery, this
          calendar isn't just a tool; it's a sanctuary for your daily
          reflections.
        </p>

        <p className="mb-4">
          Our design philosophy embraces both form and function:
        </p>

        <ul className="space-y-4 list-disc pl-6 mb-6">
          <li>
            <strong>Aesthetically Pleasing:</strong> Inspired by the peace found
            in nature, the visual design helps to calm your mind as you start or
            end your day.
          </li>
          <li>
            <strong>Seamless Experience:</strong> Whether you're on your phone
            or desktop, the interface is intuitive, making Stoic wisdom easily
            accessible. Dive into quotes, ponder over reflections, all within a
            beautifully crafted digital space.
          </li>
        </ul>

        <section aria-label="Stoicism and Memento Mori">
          <h2 className="font-serif font-semibold tracking-wide text-xl mt-10 mb-4">
            Stoicism and Memento Mori
          </h2>

          <p className="mb-6">
            Stoicism isn't just philosophy; it's a way of life that has inspired
            giants like Steve Jobs and Leo Tolstoy. Through our calendar, you'll
            journey with the teachings of Marcus Aurelius, Seneca, and
            Epictetus. Their words, brought to you daily, serve as a bridge
            between ancient wisdom and contemporary living, helping you navigate
            life's challenges with grace.
          </p>
        </section>

        <section aria-label="Inspiration and Purpose">
          <h2 className="font-serif font-semibold tracking-wide text-xl mt-10 mb-4">
            Inspiration and Purpose
          </h2>

          <Image
            className="rounded-lg mb-6 ms-6 size-50 float-right"
            src={
              "https://utfs.io/f/vfxFGWyJBql9iPL0zzmHfGMqUKyTLPZcjQwxsDBOXp4J2bCo"
            }
            width={1125}
            height={1192}
            alt="A serene forest scene with tall trees and sunlight filtering through the canopy, creating a warm glow and dappled light effect on lush green foliage."
            priority={false}
          ></Image>
          <p className="mb-6">
            The concept for this calendar was sparked during contemplative walks
            in nature, where the fleeting beauty of life becomes starkly
            apparent. It's crafted for those who seek to live with more
            intention, to remember life's brevity, and to make each day count.
            This calendar isn't just a reminder to live; it's an invitation to
            grow, to reflect, and to embrace the essence of Stoicism and Memento
            Mori.
          </p>

          <Image
            src={
              "https://utfs.io/f/vfxFGWyJBql9tA8n5LA6EWr7SI90xRVulwdUhnPDQs8kcH3y"
            }
            width={730}
            height={548}
            className="rounded-lg mb-6 me-6 size-50 float-left"
            alt="A serene beach scene with the sun setting or rising over the ocean, casting a warm glow on the waves and the sandy shore. The sky is filled with orange, pink, and blue hues with scattered clouds, and a silhouette of hills on the left side."
            priority={false}
          ></Image>
          <p>
            In our fast-paced world, where moments often slip by unnoticed, the
            Daily Stoic Memento Mori Calendar stands as your personal guide to
            mindfulness. Let it inspire you to pause, reflect, and live with
            purpose. Join us in this journey of self-discovery, where every day
            is an opportunity to live deeply, think profoundly, and cultivate a
            life of serenity and significance.
          </p>
        </section>

        <meta itemProp="datePublished" content={new Date().toISOString()} />
        <meta itemProp="author" content="Daily Stoic Memento Mori Team" />
      </article>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        >
          Return to Calendar
        </Link>
      </div>
    </main>
  );
};

export default Page;
