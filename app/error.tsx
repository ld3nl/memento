"use client";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-3xl italic">Something went wrong</h1>
      <p className="text-secondary mt-4 text-sm">
        {error.message || "The calendar could not be rendered."}
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-8 border-[3px] border-red-600 px-6 py-3 text-sm font-bold tracking-widest text-red-600 uppercase"
      >
        Try again
      </button>
    </div>
  );
}
