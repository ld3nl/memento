import Link from "next/link";

interface BackButtonProps {
  href?: string;
  className?: string;
}

const BackButton = ({ href = "/", className = "" }: BackButtonProps) => {
  return (
    <Link
      href={href}
      className={`fixed top-4 left-4 z-50 hidden h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl md:flex dark:border-gray-700 dark:bg-gray-800/80 print:hidden ${className}`}
      aria-label="Go back"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-700 dark:text-gray-300"
      >
        <title>Go back</title>
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    </Link>
  );
};

export default BackButton;
