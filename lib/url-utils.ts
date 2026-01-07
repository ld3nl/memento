/**
 * URL generation and manipulation utilities
 */

/**
 * Generates a URL for the life table or burst view page
 */
export const generateLifeTableUrl = (
  date: string | null,
  name?: string,
  view: "table" | "burst" = "table",
): string => {
  const basePath = `/${view}`;

  // Handle date path segment
  const datePath = date ? `/${date.split("-").join("/")}` : "";

  // Handle name query parameter
  const nameParam =
    name && name.trim() ? `?name=${encodeURIComponent(name.trim())}` : "";

  return `${basePath}${datePath}${nameParam}`;
};

/**
 * Parses date from URL path segments
 */
export const parseDateFromUrl = (pathSegments: string[]): string | null => {
  if (pathSegments.length < 3) return null;

  const [year, month, day] = pathSegments;

  // Basic validation
  if (!year || !month || !day) return null;

  // Ensure proper formatting (YYYY-MM-DD)
  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  return formattedDate;
};

/**
 * Extracts name from URL search params
 */
export const extractNameFromUrl = (
  searchParams: URLSearchParams,
): string | null => {
  const name = searchParams.get("name");
  return name && name.trim() ? name.trim() : null;
};
