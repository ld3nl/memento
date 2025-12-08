import Link from "next/link";

interface BackButtonProps {
  href?: string;
  className?: string;
}

const BackButton = ({ href = "/", className = "" }: BackButtonProps) => {
  return (
    <Link
      href={href}
      className={`fixed top-4 left-4 z-50 hidden md:flex items-center justify-center w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-700 ${className}`}
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
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    </Link>
  );
};

export default BackButton;