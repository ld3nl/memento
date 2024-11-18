"use client";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

import { generateUrl, yeasAlive } from "../lib/common";

import LabeledInput from "./LabeledInput";

const Form = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(null);

  return (
    <>
      <section className="w-full max-w-md m-auto sm:px-4 md:px-md-0">
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
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3"></div>

            <h1 className="md:w-2/3 block text-gray-500 font-bold lg:text-left mb-1 md:mb-0 pr-4 text-3xl sm:text-center">
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
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <span
                className={`block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 transition-all ${
                  !date && "opacity-0"
                }`}
              >
                Are you:
              </span>
            </div>

            <div className="md:w-2/3 dark:text-white" data-cy={`age`}>
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
                className={`shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${
                  !date &&
                  "cursor-not-allowed focus:outline-none disabled:opacity-75"
                }`}
                type="submit"
                disabled={!date}
                data-cy={`generate-table-button`}
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
