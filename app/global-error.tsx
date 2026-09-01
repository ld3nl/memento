"use client";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-white px-4 py-16 text-center text-zinc-900 scheme-light-dark dark:bg-zinc-950 dark:text-zinc-50">
        <h1 className="text-3xl italic">Something went wrong</h1>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          {error.message || "The application failed to load."}
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-8 border-[3px] border-red-600 px-6 py-3 text-sm font-bold tracking-widest text-red-600 uppercase"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
