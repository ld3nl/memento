import { format } from "date-fns";

/** 16:9. Share crawlers fetch the JPEG the route makes from this. */
export const LIFE_OG_SIZE = { width: 1200, height: 675 };
export const LIFE_OG_CONTENT_TYPE = "image/jpeg";

function bornDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

export function speakBirthDate(iso: string): string {
  return format(bornDate(iso), "d MMMM yyyy");
}

export function lifeImageAlt(iso: string): string {
  return `Life in weeks for a person born ${speakBirthDate(iso)}. Each square is one week on an 80-year grid. Filled squares are weeks already lived.`;
}
