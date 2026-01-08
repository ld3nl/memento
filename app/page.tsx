import Link from "next/link";
import Form from "../components/Form";

const Page = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Memento Mori Life Calendar",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "A Memento Mori calendar is a visual tool used to track life in weeks, helping users reflect on mortality and prioritize time.",
    featureList:
      "Calculate life in weeks, Visual grid of 80 years, Persistent bookmarkable URL",
    screenshot:
      "https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3",
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a Memento Mori calendar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A Memento Mori calendar is a visual tool used to track life in weeks, helping users reflect on mortality and prioritize time.",
          },
        },
        {
          "@type": "Question",
          name: "How does this tool work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "This tool is a high-precision Memento Mori life-in-weeks generator. It calculates exact weeks lived based on birthdate and provides a persistent, bookmarkable URL for tracking.",
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Form />
      <div className="mx-auto flex max-w-sm flex-col px-4 md:max-w-lg ">
        <Link
          href="/about"
          className="mt-4 text-sm text-black underline md:ml-auto md:w-2/3 dark:text-purple-500"
        >
          About this Calendar
        </Link>
        <section className="mt-8 opacity-90 md:ml-auto md:w-2/3 ">
          <details className="group text-xs text-gray-500 dark:text-gray-400">
            <summary className="cursor-pointer list-none font-bold text-gray-700 dark:text-gray-300">
              How it works
            </summary>
            <p className="mt-2 leading-relaxed text-balance">
              A <strong>Memento Mori calendar</strong> is a visual tool used to
              track life in weeks, helping users reflect on mortality and
              prioritize time.
            </p>
            <p className="mt-2 leading-relaxed text-balance">
              This tool acts as a high-precision life-in-weeks generator. Simply
              enter your birthdate to calculate the exact number of weeks you
              have lived. The result is a personalized 80-year grid that helps
              you visualize your lifespan.
            </p>
          </details>
        </section>
      </div>
    </>
  );
};

export default Page;
