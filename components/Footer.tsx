import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { KofiButton } from "./KofiButton";

async function copyrightYear() {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

export const Footer = async () => {
  const currentYear = await copyrightYear();

  return (
    <footer className="mt-auto border-t-2 border-line bg-surface py-10 sm:py-12 dark:border-line dark:bg-surface print:hidden">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Support Section */}
        <div className="mb-8 text-center sm:mb-10">
          <KofiButton size="small" />
          <p className="font-display mt-3 text-kicker font-semibold tracking-label text-secondary uppercase sm:text-xs dark:text-secondary">
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
            className="font-display font-bold tracking-label text-secondary uppercase transition-colors duration-200 hover:text-accent focus:text-accent focus:ring-2 focus:ring-accent/40 focus:outline-none dark:text-secondary"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="font-display font-bold tracking-label text-secondary uppercase transition-colors duration-200 hover:text-accent focus:text-accent focus:ring-2 focus:ring-accent/40 focus:outline-none dark:text-secondary"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="font-display font-bold tracking-label text-secondary uppercase transition-colors duration-200 hover:text-accent focus:text-accent focus:ring-2 focus:ring-accent/40 focus:outline-none dark:text-secondary"
          >
            Journal
          </Link>
          <Link
            href="/table/1990/1/1"
            className="font-display font-bold tracking-label text-secondary uppercase transition-colors duration-200 hover:text-accent focus:text-accent focus:ring-2 focus:ring-accent/40 focus:outline-none dark:text-secondary"
          >
            Example: 1990
          </Link>
          <Link
            href="/burst/1985/6/15"
            className="font-display font-bold tracking-label text-secondary uppercase transition-colors duration-200 hover:text-accent focus:text-accent focus:ring-2 focus:ring-accent/40 focus:outline-none dark:text-secondary"
          >
            Burst View
          </Link>
        </nav>

        {/* Description */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="font-body mx-auto max-w-2xl text-xs leading-relaxed text-secondary sm:text-sm dark:text-secondary">
            Memento Mori Life Calendar visualizes life in weeks. Rooted in Stoic
            philosophy, it transforms abstract time into tangible perspective.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-center gap-3 border-t-2 border-line pt-6 sm:pt-8 dark:border-line">
          <div className="flex items-center gap-2">
            <Link
              href="https://www.echoflow.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised transition-colors duration-200 hover:bg-accent/10 focus:ring-2 focus:ring-accent/40 focus:outline-none sm:h-10 sm:w-10 dark:bg-surface-raised"
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
            <span className="font-display text-kicker font-semibold tracking-label-tight text-secondary uppercase sm:text-xs dark:text-secondary">
              Echo Flow Canada © {currentYear}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
