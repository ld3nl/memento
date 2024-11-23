import { parse, intervalToDuration } from "date-fns";

export const calculateFullAge = (dob, format = "yyyy-MM-dd") => {
  const birthDate = parse(dob, format ? format : "yyyy-MM-dd", new Date());
  const { years, months, days } = intervalToDuration({
    start: birthDate,
    end: new Date(),
  });
  return { years, months, days };
};

export const get_years_alive = (dob) => {
  // Validate date of birth
  if (!dob || dob === "") {
    console.error("Enter valid date");
    return;
  }

  const { years, months, days } = calculateFullAge(dob);

  return `${years} years, ${months} months, ${days} days`;
};

export const generateUrl = (date, name) => {
  return `/table${date ? `/${date.split("-").join("/")}` : ""}${
    name ? `?name=${encodeURIComponent(name)}` : ""
  }`;
};
