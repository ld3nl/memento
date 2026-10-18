import Link from "next/link";

export function TryCalendar({
  href = "/",
  children = "See your weeks on the calendar",
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <p className="border-accent mt-10 mb-8 stroke-l pl-6">
      <Link
        href={href}
        className="font-display text-accent text-sm font-bold tracking-label-tight uppercase hover:underline"
      >
        {children}
      </Link>
    </p>
  );
}
