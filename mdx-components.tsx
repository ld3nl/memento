import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { ContentImage } from "./components/content/ContentImage";
import { PullQuote } from "./components/content/PullQuote";
import { TryCalendar } from "./components/content/TryCalendar";

const linkClassName =
  "text-accent underline decoration-red-600/30 underline-offset-4 hover:decoration-red-600";

const components = {
  ContentImage,
  PullQuote,
  TryCalendar,
  h1: ({ children, id, ...props }) => (
    <h1
      id={id}
      className="font-display text-accent mb-8 text-[2.5rem] leading-tight tracking-tight italic sm:mb-10 sm:text-5xl"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2
      id={id}
      className="font-display text-accent mt-10 mb-4 text-2xl italic sm:mt-12 sm:text-3xl"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3
      id={id}
      className="font-display text-primary mt-8 mb-3 text-xl italic sm:text-2xl"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-primary mb-6" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="text-secondary mb-6 list-disc space-y-3 pl-6 sm:mb-8"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="text-secondary mb-6 list-decimal space-y-3 pl-6 sm:mb-8"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="text-primary font-semibold" {...props}>
      {children}
    </strong>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-accent/40 text-primary my-8 border-l-[3px] pl-6 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props) => <hr className="border-border my-12 border-t-2" {...props} />,
  code: ({ children, ...props }) => (
    <code
      className="font-mono text-[0.9em] text-zinc-700 dark:text-zinc-300"
      {...props}
    >
      {children}
    </code>
  ),
  a: ({ href, children, ...props }) => {
    if (!href) {
      return <span {...props}>{children}</span>;
    }

    const external = href.startsWith("http://") || href.startsWith("https://");

    if (!external && href.startsWith("/")) {
      return (
        <Link href={href} className={linkClassName}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className={linkClassName}
        rel={external ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
