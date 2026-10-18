import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-3xl italic">Page not found</h1>
      <p className="text-secondary mt-4 text-sm">
        That page is missing, or the calendar date is invalid.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-block stroke border-accent px-6 py-3 text-sm font-bold tracking-widest text-accent uppercase"
        >
          Back to calendar
        </Link>
        <Link
          href="/blog"
          className="inline-block stroke border-border px-6 py-3 text-sm font-bold tracking-widest text-quiet uppercase dark:border-border dark:text-quiet"
        >
          Journal
        </Link>
      </div>
    </div>
  );
}
