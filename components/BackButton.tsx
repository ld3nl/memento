import Link from "next/link";

interface BackButtonProps {
  href?: string;
  className?: string;
}

const BackButton = ({ href = "/", className = "" }: BackButtonProps) => {
  return (
    <Link
      href={href}
      className={`fixed top-4 left-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border-2 border-line bg-surface-raised shadow-lg shadow-red-600/5 backdrop-blur-sm transition-transform duration-200 hover:scale-105 hover:border-accent hover:bg-surface hover:shadow-xl hover:shadow-red-600/10 focus-visible:ring-4 focus-visible:ring-accent/40 focus-visible:outline-none dark:border-border dark:bg-surface-raised dark:hover:bg-surface-raised print:hidden ${className}`}
      aria-label="Go back"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary dark:text-primary"
      >
        <title>Go back</title>
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    </Link>
  );
};

export default BackButton;
