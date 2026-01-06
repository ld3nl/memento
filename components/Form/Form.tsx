"use client";
"use no memo";

import { useForm } from "@tanstack/react-form";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { getFormattedAge } from "../../lib/date-utils";
import { generateLifeTableUrl } from "../../lib/url-utils";
import { cn } from "../../lib/utils";
import LabeledInput from "./fields/LabeledInput";
import { formSchema } from "./schema";

const Form = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      date: "",
    } as { name?: string; date: string },

    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      // Navigate to the life table page
      const url = generateLifeTableUrl(value.date, value.name);
      router.push(url);
    },
  });

  return (
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
        data-cy={"bday-form"}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="name"
          children={(field) => (
            <>
              <div className="mb-6 md:flex md:items-center">
                <div className="md:w-1/3" />
                <h1 className="mb-8 pr-4 font-serif text-2xl font-semibold text-black sm:text-center md:mb-0 md:w-2/3 lg:text-left dark:text-purple-500">
                  Memento mori form{" "}
                  {field.state.value && `for ${field.state.value}`}
                </h1>
              </div>

              <LabeledInput
                labelString="Name"
                inputId="inline-name"
                field={field}
              />
            </>
          )}
        />

        <form.Field
          name="date"
          children={(field) => (
            <>
              <LabeledInput
                labelString="Birthday"
                inputId="birthday"
                inputType="date"
                field={field}
              />
              <div className="mb-6 md:flex md:items-center">
                <div className="md:w-1/3">
                  <span
                    className={cn(
                      "mb-1 block pr-4 font-bold text-gray-500 transition-all md:mb-0 md:text-right",
                      { "opacity-0": !field.state.value },
                    )}
                  >
                    Are you:
                  </span>
                </div>

                <div className="md:w-2/3 dark:text-white" data-cy={"age"}>
                  {field.state.value &&
                    !field.state.meta.errors.length &&
                    `${getFormattedAge(field.state.value)} young?`}
                </div>
              </div>
            </>
          )}
        />

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
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  className={cn(
                    "focus:shadow-outline rounded bg-purple-500 px-4 py-2 font-bold text-white shadow transition-all hover:bg-purple-400 focus:outline-none",
                    {
                      "cursor-not-allowed bg-slate-400 hover:bg-slate-400 focus:outline-none disabled:opacity-75":
                        !canSubmit,
                    },
                  )}
                  type="submit"
                  disabled={!canSubmit}
                  data-cy={"generate-table-button"}
                >
                  {isSubmitting ? "Generating..." : "Generate Table"}
                </button>
              )}
            />
          </div>
        </div>
      </form>
    </section>
  );
};

export default Form;
