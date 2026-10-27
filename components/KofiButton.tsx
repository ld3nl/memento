import Image from "next/image";
import Link from "next/link";

interface KofiButtonProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

/** Display height in CSS pixels. Width follows the 580×146 file. */
const displayHeight = {
  small: 32,
  medium: 36,
  large: 48,
} as const;

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
        width={580}
        height={146}
        style={{ width: "auto", height: displayHeight[size] }}
        priority={false}
      />
    </Link>
  );
};
