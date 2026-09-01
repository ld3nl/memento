import Link from "next/link";

export function RelatedPosts({
  posts,
}: {
  posts: Array<{ slug: string; title: string; description: string }>;
}) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      className="border-border mt-16 border-t-2 pt-10"
      aria-labelledby="related-heading"
    >
      <h2
        id="related-heading"
        className="font-display text-accent text-2xl italic"
      >
        Keep reading
      </h2>
      <ul className="mt-6 space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="font-display text-primary text-xl italic hover:text-red-600"
            >
              {post.title}
            </Link>
            <p className="text-secondary mt-1 text-sm leading-relaxed">
              {post.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
