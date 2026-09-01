import Link from "next/link";

export type BreadcrumbItem = {
  name: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="font-display flex flex-wrap items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
        {items.map((item, index) => (
          <li
            key={item.href ?? item.name}
            className="flex items-center gap-2"
          >
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-red-600">
                {item.name}
              </Link>
            ) : (
              <span className="text-primary">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
