export function PullQuote({
  cite,
  children,
}: {
  cite?: string;
  children: React.ReactNode;
}) {
  return (
    <blockquote className="border-accent/40 my-10 border-l-[3px] pl-6">
      <p className="font-display text-primary text-2xl leading-snug italic sm:text-3xl">
        {children}
      </p>
      {cite ? (
        <footer className="text-secondary mt-3 text-sm">{cite}</footer>
      ) : null}
    </blockquote>
  );
}
