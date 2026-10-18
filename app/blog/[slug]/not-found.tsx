import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-3xl italic">Note not found</h1>
      <p className="text-secondary mt-4 text-sm">
        That journal entry is missing or the link is old.
      </p>
      <Link
        href="/blog"
        className="mt-8 inline-block stroke border-accent px-6 py-3 text-sm font-bold tracking-widest text-accent uppercase"
      >
        Back to the journal
      </Link>
    </div>
  );
}
