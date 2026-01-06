import Image from "next/image";
import Link from "next/link";
import { KofiButton } from "./KofiButton";

export const Footer = () => {
  return (
    <footer className="mt-auto py-8 text-center print:hidden">
      <div className="mb-4">
        <KofiButton size="small" />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        If this helped you reflect on life, consider supporting the project
      </p>
      <div className="mt-4 flex items-center justify-center gap-2">

        <Link
          href="https://www.echoflow.ca/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <Image
            src="/echoflow-logo.svg"
            alt="Echo Flow"
            width={16}
            height={16}
            className="w-4 h-4"
          />
        </Link>
          <span className="text-xs text-gray-500 dark:text-gray-400">supported by Echo Flow Canada © 2026</span>
      </div>
    </footer>
  );
};
