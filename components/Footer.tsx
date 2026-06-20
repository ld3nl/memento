import Image from 'next/image'
import Link from 'next/link'
import { KofiButton } from './KofiButton'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-10 print:hidden sm:py-12">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Support Section */}
        <div className="mb-8 text-center sm:mb-10">
          <KofiButton size="small" />
          <p className="mt-3 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 sm:text-xs">
            Support this reflection tool
          </p>
        </div>

        {/* Navigation Links */}
        <nav
          className="mb-8 flex flex-wrap justify-center gap-4 text-sm sm:mb-10 sm:gap-6"
          aria-label="Footer navigation"
        >
          <Link
            href="/"
            className="font-display font-bold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 transition-colors duration-200 hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/40"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="font-display font-bold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 transition-colors duration-200 hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/40"
          >
            About
          </Link>
          <Link
            href="/table/1990/1/1"
            className="font-display font-bold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 transition-colors duration-200 hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/40"
          >
            Example: 1990
          </Link>
          <Link
            href="/burst/1985/6/15"
            className="font-display font-bold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 transition-colors duration-200 hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/40"
          >
            Burst View
          </Link>
        </nav>

        {/* Description */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="mx-auto max-w-2xl font-body text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-sm">
            Memento Mori Life Calendar visualizes life in weeks. Rooted in Stoic
            philosophy, it transforms abstract time into tangible perspective.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-center gap-3 border-t-2 border-zinc-200 dark:border-zinc-800 pt-6 sm:pt-8">
          <div className="flex items-center gap-2">
            <Link
              href="https://www.echoflow.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 transition-colors duration-200 hover:bg-red-600/10 focus:outline-none focus:ring-2 focus:ring-red-600/40 sm:h-10 sm:w-10"
              aria-label="Echo Flow Canada"
            >
              <Image
                src="/echoflow-logo.svg"
                alt="Echo Flow"
                width={18}
                height={18}
                className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]"
              />
            </Link>
            <span className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 sm:text-xs">
              Echo Flow Canada © {currentYear}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
