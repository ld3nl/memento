import { formatContentDate } from "../../lib/content-meta";
import BackButton from "../BackButton";
import { type BreadcrumbItem, Breadcrumbs } from "./Breadcrumbs";
import { ContentImage } from "./ContentImage";

export function ArticleShell({
  kicker,
  title,
  datePublished,
  readingMinutes,
  image,
  imageAlt,
  breadcrumbs,
  backHref = "/",
  children,
}: {
  kicker?: string;
  title: string;
  datePublished: string;
  readingMinutes: number;
  image?: string;
  imageAlt?: string;
  breadcrumbs: BreadcrumbItem[];
  backHref?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <BackButton href={backHref} />
      <article
        aria-label={title}
        className="text-primary mx-auto w-full max-w-prose px-4 py-10 text-base leading-relaxed sm:px-6 sm:py-12 lg:py-16"
      >
        <Breadcrumbs items={breadcrumbs} />
        {image ? (
          <ContentImage
            src={image}
            alt={imageAlt ?? ""}
            width={730}
            height={548}
            priority
          />
        ) : null}
        {kicker ? (
          <p className="font-display mb-4 text-[0.6875rem] font-semibold tracking-[0.25em] text-zinc-500 uppercase">
            {kicker}
          </p>
        ) : null}
        <h1 className="font-display text-accent mb-6 text-[2.5rem] leading-tight tracking-tight italic sm:mb-8 sm:text-5xl">
          {title}
        </h1>
        <p className="text-secondary mb-10 text-sm">
          <time dateTime={datePublished}>
            {formatContentDate(datePublished)}
          </time>
          <span aria-hidden="true"> · </span>
          <span>{readingMinutes} min read</span>
        </p>
        <div className="after:clear-both after:block after:content-['']">
          {children}
        </div>
      </article>
    </>
  );
}
