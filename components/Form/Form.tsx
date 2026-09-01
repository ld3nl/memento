"use client";

import { createFormHook } from "@tanstack/react-form-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFormattedAge } from "../../lib/date-utils";
import { FormStorage } from "../../lib/storage";
import { generateLifeTableUrl } from "../../lib/url-utils";
import { cn } from "../../lib/utils";
import LabeledInput from "./fields/LabeledInput";
import { fieldContext, formContext, useFormContext } from "./form-hook";
import { formSchema } from "./schema";

function calculateWeeksLived(birthdate: string) {
  if (!birthdate) return null;
  const birth = new Date(birthdate);
  const now = new Date();
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor((now.getTime() - birth.getTime()) / msPerWeek);
}

// Create SubmitButton component using useFormContext
function SubmitButton() {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <button
          className={cn(
            "font-display min-h-[52px] w-full cursor-pointer rounded-none border-[3px] border-red-600 bg-white px-6 py-4 text-sm font-bold tracking-[0.25em] text-red-600 uppercase shadow-lg shadow-red-600/10 transition-all duration-200 hover:bg-red-600 hover:text-white hover:shadow-xl hover:shadow-red-600/20 focus:ring-4 focus:ring-red-600/40 focus:outline-none active:scale-[0.98] sm:w-auto sm:min-w-[240px] sm:px-8 sm:text-base dark:bg-zinc-900",
            {
              "cursor-not-allowed opacity-40 hover:bg-white hover:text-red-600 hover:shadow-lg dark:hover:bg-zinc-900":
                !canSubmit,
            },
          )}
          type="submit"
          disabled={!canSubmit}
          data-cy={"generate-table-button"}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Summoning..." : "Reveal Calendar"}
        </button>
      )}
    </form.Subscribe>
  );
}

// Create the app form hook with pre-configured components
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    LabeledInput,
  },
  formComponents: {
    SubmitButton,
  },
});

const Form = () => {
  const router = useRouter();
  const [saveData, setSaveData] = useState(false);
  const [weeksLived, setWeeksLived] = useState<number | null>(null);

  const form = useAppForm({
    defaultValues: {
      name: "",
      date: "",
    } as { name?: string; date: string },

    validators: {
      onChange: formSchema,
    },
  });

  const saveValues = async (values: { name?: string; date: string }) => {
    if (!saveData || (!values.date && !values.name)) return;

    try {
      await FormStorage.saveFormData({
        name: values.name,
        date: values.date,
        saveData: true,
      });
    } catch (error) {
      console.error("Failed to save form data:", error);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadSavedData = async () => {
      const savedData = await FormStorage.loadFormData().catch((error) => {
        console.error("Failed to load saved form data:", error);
        return null;
      });

      if (cancelled || !savedData) return;

      form.setFieldValue("name", savedData.name || "");
      form.setFieldValue("date", savedData.date || "");
      setSaveData(savedData.saveData || false);

      if (savedData.date) {
        setWeeksLived(calculateWeeksLived(savedData.date));
      }
    };

    void loadSavedData();
    return () => {
      cancelled = true;
    };
  }, [form]);

  const overEighty = weeksLived !== null && weeksLived > 81 * 52;

  return (
    <div className="flex flex-col justify-center">
      <form
        data-cy={"bday-form"}
        action={async (formData) => {
          const date = String(formData.get("date") ?? "");
          const name = String(formData.get("name") ?? "");
          const persist = formData.get("saveData") === "on";

          if (persist) {
            await FormStorage.saveFormData({
              name,
              date,
              saveData: true,
            });
          } else {
            await FormStorage.clearFormData();
          }

          if (!date) return;
          router.push(generateLifeTableUrl(date, name || undefined));
        }}
        className="space-y-6 sm:space-y-7"
        noValidate
      >
        <form.AppField name="name">
          {(field) => (
            <field.LabeledInput
              labelString="Name"
              inputId="inline-name"
              placeholder="Enter your name (optional)"
              onValueChange={(name) =>
                void saveValues({ ...form.state.values, name })
              }
            />
          )}
        </form.AppField>

        <form.AppField name="date">
          {(field) => (
            <>
              <field.LabeledInput
                labelString="Birthdate"
                inputId="birthday"
                inputType="date"
                onValueChange={(date) => {
                  void saveValues({ ...form.state.values, date });
                  setWeeksLived(calculateWeeksLived(date));
                }}
              />
              {field.state.value &&
                !field.state.meta.errors.length &&
                weeksLived !== null && (
                  <div className="mt-6 sm:mt-8">
                    <div className="border-[3px] border-red-600 bg-white p-6 shadow-2xl shadow-red-600/10 sm:p-7 lg:p-8 dark:bg-zinc-900">
                      <div
                        data-cy="age"
                        className="font-mono text-5xl font-bold tracking-tight text-red-600 tabular-nums sm:text-6xl lg:text-7xl"
                      >
                        {weeksLived.toLocaleString()}
                      </div>
                      <div className="font-display mt-3 text-[0.6875rem] font-semibold tracking-[0.25em] text-zinc-500 uppercase sm:mt-4 dark:text-zinc-400">
                        Weeks lived
                      </div>
                      {field.state.value && (
                        <div
                          data-cy="age-copy"
                          className="font-display mt-4 border-t border-zinc-200 pt-4 text-sm leading-relaxed text-zinc-500 italic dark:border-zinc-800 dark:text-zinc-400"
                        >
                          {getFormattedAge(field.state.value)}
                        </div>
                      )}
                      {overEighty && (
                        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                          The grid visualizes 80 years. Extra years are not
                          drawn, but you can still open the calendar.
                        </p>
                      )}
                    </div>
                  </div>
                )}
            </>
          )}
        </form.AppField>

        <label className="flex cursor-pointer items-start gap-3 py-2 text-sm leading-snug text-zinc-500 select-none hover:text-zinc-900 sm:text-base dark:text-zinc-400 dark:hover:text-zinc-50">
          <span className="relative mt-0.5 inline-flex h-5 w-5 flex-shrink-0">
            <input
              id="save-data-checkbox"
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-none border-2 border-zinc-200 bg-white checked:border-red-600 checked:bg-red-600 focus-visible:ring-4 focus-visible:ring-red-600/20 focus-visible:outline-none dark:border-zinc-700 dark:bg-zinc-900"
              type="checkbox"
              name="saveData"
              value="on"
              checked={saveData}
              onChange={async (e) => {
                const isChecked = e.target.checked;
                setSaveData(isChecked);

                if (isChecked) {
                  const values = form.state.values;
                  try {
                    await FormStorage.saveFormData({
                      name: values.name,
                      date: values.date,
                      saveData: true,
                    });
                  } catch (error) {
                    console.error("Failed to save form data:", error);
                  }
                } else {
                  try {
                    await FormStorage.clearFormData();
                  } catch (error) {
                    console.error("Failed to clear form data:", error);
                  }
                }
              }}
              data-cy={"input-checkbox-save"}
            />
            <svg
              className="pointer-events-none absolute inset-0 m-auto hidden h-3 w-3 text-white peer-checked:block"
              viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path
                d="M2 6.5 4.5 9 10 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </span>
          Remember my information
        </label>

        <form.AppForm>
          <form.SubmitButton />
        </form.AppForm>
      </form>
    </div>
  );
};

export default Form;
