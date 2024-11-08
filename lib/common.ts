import { parse, intervalToDuration } from "date-fns";

export const calculateFullAge = (dob, format) => {
  const birthDate = parse(dob, format ? format : "yyyy-MM-dd", new Date());
  const { years, months, days } = intervalToDuration({
    start: birthDate,
    end: new Date(),
  });
  return { years, months, days };
};

export const yeasAlive = (dob) => {
  (!dob || dob === "") && "Enter valid date";

  const { years, months, days } = calculateFullAge(dob);

  return `${years} years, ${months} months, ${days} days`;
};

export const generateUrl = (date, name) => {
  return `/table${date ? `/${date.split("-").join("/")}` : ""}${
    name ? `?name=${encodeURIComponent(name)}` : ""
  }`;
};
