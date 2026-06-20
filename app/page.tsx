import type { Metadata } from 'next'
import Link from 'next/link'
import Form from '../components/Form/Form'

export const metadata: Metadata = {
  title: 'Memento Mori Life Calendar - Visualize Your Life in Weeks',
  description:
    'How many weeks have you lived? How many remain? Visualize your entire life in weeks with our powerful Memento Mori calendar. A life in weeks calculator that helps you reflect on mortality and make every week count.',
  alternates: {
    canonical: 'https://memento-mori.vercel.app',
  },
  openGraph: {
    title: 'Memento Mori Life Calendar - Visualize Your Life in Weeks',
    description:
      'How many weeks have you lived? How many remain? Visualize your entire life in weeks with our Memento Mori calendar. Make every week count.',
    url: 'https://memento-mori.vercel.app',
    type: 'website',
    images: [
      {
        url: 'https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3',
        width: 730,
        height: 548,
        alt: 'Memento Mori Life Calendar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memento Mori Life Calendar - Visualize Your Life in Weeks',
    description:
      'How many weeks have you lived? How many remain? Visualize your entire life in weeks. Make every week count.',
    images: [
      'https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3',
    ],
  },
}

const Page = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Memento Mori Life Calendar',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'A Memento Mori calendar is a visual tool used to track life in weeks, helping users reflect on mortality and prioritize time.',
    featureList:
      'Calculate life in weeks, Visual grid of 80 years, Persistent bookmarkable URL',
    screenshot:
      'https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3',
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a Memento Mori calendar?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Memento Mori calendar is a visual tool used to track life in weeks, helping users reflect on mortality and prioritize time.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does this tool work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'This tool is a high-precision Memento Mori life-in-weeks generator. It calculates exact weeks lived based on birthdate and provides a persistent, bookmarkable URL for tracking.',
          },
        },
      ],
    },
  }
  const serializedJsonLd = JSON.stringify(jsonLd).replace(/</g, '\\u003c')

  return (
    <>
      <script type="application/ld+json">{serializedJsonLd}</script>
      <Form />
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <Link
            href="/about"
            className="group inline-block border-b-[3px] border-accent/30 pb-1.5 font-display text-xs font-bold uppercase tracking-[0.25em] text-primary transition-all duration-200 hover:border-accent hover:text-accent sm:text-sm"
          >
            About this Calendar
          </Link>

          <section className="lg:col-start-2">
            <details className="group">
              <summary className="cursor-pointer list-none border-b-2 border-border pb-3 font-display text-xs font-bold uppercase tracking-[0.25em] text-secondary transition-colors hover:text-primary sm:text-[0.6875rem]">
                How it works
              </summary>
              <div className="mt-5 space-y-4 font-body text-sm leading-relaxed text-secondary sm:mt-6 sm:text-base">
                <p>
                  A{' '}
                  <strong className="font-semibold">
                    Memento Mori calendar
                  </strong>{' '}
                  visualizes life in weeks—a tool for reflection on mortality
                  and intentional living.
                </p>
                <p>
                  Enter your birthdate to calculate weeks lived. The result: a
                  personalized 80-year grid that transforms abstract time into
                  something tangible.
                </p>
                <p>
                  Rooted in{' '}
                  <strong className="font-semibold">Stoic philosophy</strong>,
                  this calendar serves as a reminder to make deliberate choices.
                  Each week counts.
                </p>
              </div>
            </details>
          </section>
        </div>
      </div>
    </>
  )
}

export default Page
