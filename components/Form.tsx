"use client";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

import { generateUrl, getYearsAlive } from "../lib/common";
import { cn } from "../lib/utils";

import LabeledInput from "./LabeledInput";

const Form = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(null);

  return (
    <>
      <section className="md:px-md-0 m-auto w-full max-w-md sm:px-4">
        <header>
          <Image
            src="https://utfs.io/f/vfxFGWyJBql9xCI1QO2QPvwdGrZoHIKXJqsfUxy6C9SDnN7b"
            alt="Memento Mori Skull"
            width={177}
            height={141}
            className="mx-auto my-6"
          />
        </header>
        <form
          // className=""
          data-cy={"bday-form"}
          action={`${generateUrl(date, name)}`}
        >
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3" />
            <h1 className="mb-8 pr-4 font-serif text-2xl font-semibold text-black sm:text-center md:mb-0 md:w-2/3 lg:text-left dark:text-purple-500">
              Memento mori form {name && `for ${name}`}
            </h1>
          </div>

          <LabeledInput
            labelString={"Name"}
            inputId={"inline-name"}
            inputType={"text"}
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
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <span
                className={cn(
                  "mb-1 block pr-4 font-bold text-gray-500 transition-all md:mb-0 md:text-right",
                  { "opacity-0": !date },
                )}
              >
                Are you:
              </span>
            </div>

            <div className="md:w-2/3 dark:text-white" data-cy={"age"}>
              {date && `${getYearsAlive(date)} young?`}
            </div>
          </div>
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3" />
            <label className="block font-bold text-gray-500 md:w-2/3">
              <input
                className="mr-2 leading-tight"
                type="checkbox"
                data-cy={"input-checkbox-save"}
              />
              <span className="text-sm">Save</span>
            </label>
          </div>
          <div className="md:flex md:items-center">
            <div className="md:w-1/3" />
            <div className="md:w-2/3">
              <button
                className={cn(
                  "focus:shadow-outline rounded bg-purple-500 px-4 py-2 font-bold text-white shadow hover:bg-purple-400 focus:outline-none",
                  {
                    "cursor-not-allowed focus:outline-none disabled:opacity-75":
                      !date,
                  },
                )}
                type="submit"
                disabled={!date}
                data-cy={"generate-table-button"}
              >
                Generate Table
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Form;
