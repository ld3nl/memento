import Image from "next/image";
import Link from "next/link";

interface KofiButtonProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

const sizeClasses = {
  small: "h-8",
  medium: "h-9",
  large: "h-12",
};

export const KofiButton = ({
  className = "",
  size = "medium",
}: KofiButtonProps) => {
  return (
    <Link
      href="https://ko-fi.com/P5P81RSX2O"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block transition-transform hover:scale-105 ${className}`}
    >
      <Image
        src="/kofi4.png"
        alt="Buy Me a Coffee at ko-fi.com"
        width={size === "small" ? 120 : size === "medium" ? 150 : 180}
        height={size === "small" ? 32 : size === "medium" ? 36 : 48}
        className={`${sizeClasses[size]} w-auto`}
        priority={false}
      />
    </Link>
  );
};
