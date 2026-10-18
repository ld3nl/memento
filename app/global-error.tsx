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
      <body className="bg-surface px-4 py-16 text-center text-primary scheme-light-dark dark:bg-surface dark:text-primary">
        <h1 className="text-3xl italic">Something went wrong</h1>
        <p className="mt-4 text-sm text-secondary dark:text-secondary">
          {error.message || "The application failed to load."}
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-8 stroke border-accent px-6 py-3 text-sm font-bold tracking-widest text-accent uppercase"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
