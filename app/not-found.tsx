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
          className="inline-block border-[3px] border-red-600 px-6 py-3 text-sm font-bold tracking-widest text-red-600 uppercase"
        >
          Back to calendar
        </Link>
        <Link
          href="/blog"
          className="inline-block border-[3px] border-zinc-300 px-6 py-3 text-sm font-bold tracking-widest text-zinc-700 uppercase dark:border-zinc-700 dark:text-zinc-200"
        >
          Journal
        </Link>
      </div>
    </div>
  );
}
