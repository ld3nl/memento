"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { parse, intervalToDuration } from "date-fns";

import LabeledInput from "./LabeledInput";

const Form = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState(null);

  const calculateFullAge = (dob) => {
    const birthDate = parse(dob, "yyyy-MM-dd", new Date());
    const { years, months, days } = intervalToDuration({
      start: birthDate,
      end: new Date(),
    });
    return { years, months, days };
  };

  const yeasAlive = (dob) => {
    (!dob || dob === "") && "Enter valid date";

    const { years, months, days } = calculateFullAge(dob);

    return `${years} years, ${months} months, ${days} days`;
  };

  const handleClick = (e) => {
    e.preventDefault();

    // Construct the URL string manually to avoid type errors
    const url = `/table${date ? `/${date.split("-").join("/")}` : ""}${
      name ? `?name=${encodeURIComponent(name)}` : ""
    }`;

    router.push(url);
  };

  return (
    <form className="w-full max-w-md" data-cy={"bday-form"}>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3"></div>

        <h1 className="md:w-2/3 block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4">
          Memento mori form {name && `for ${name}`}
        </h1>
      </div>

      <LabeledInput
        labelString={"Name"}
        inputId={"inline-name"}
        inputType={"query"}
        inputProps={{
          onChange: ({ target }) => {
            setName(target.value);
          },
        }}
      />

      <LabeledInput
        labelString={"Birthday"}
        inputId={"birthday"}
        inputType={"date"}
        inputProps={{
          required: true,
          onChange: ({ target }) => {
            setDate(target.value);
          },
        }}
      />
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <span
            className={`block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 transition-all ${!date &&
              "opacity-0"}`}
          >
            Are you:
          </span>
        </div>

        <div className="md:w-2/3" data-cy={`age`}>
          {date && `${yeasAlive(date)} young?`}
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3"></div>
        <label className="md:w-2/3 block text-gray-500 font-bold">
          <input
            className="mr-2 leading-tight"
            type="checkbox"
            data-cy={`input-checkbox-save`}
          />
          <span className="text-sm">Save</span>
        </label>
      </div>
      <div className="md:flex md:items-center">
        <div className="md:w-1/3"></div>
        <div className="md:w-2/3">
          <button
            className={`shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${!date &&
              "cursor-not-allowed focus:outline-none disabled:opacity-75"}`}
            type="submit"
            disabled={!date}
            data-cy={`generate-table-button`}
            onClick={(e) => {
              e.preventDefault();
              handleClick(e);
            }}
          >
            Generate Table
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
