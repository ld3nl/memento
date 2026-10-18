export function PullQuote({
  cite,
  children,
}: {
  cite?: string;
  children: React.ReactNode;
}) {
  return (
    <blockquote className="border-accent/40 my-10 stroke-l pl-6">
      <div className="font-display text-primary text-2xl leading-snug italic sm:text-3xl [&>p:last-child]:mb-0">
        {children}
      </div>
      {cite ? (
        <footer className="text-secondary mt-3 text-sm">{cite}</footer>
      ) : null}
    </blockquote>
  );
}
