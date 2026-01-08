"use client";
"use no memo";

import {
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form-nextjs";
import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormStorage } from "../../lib/storage";
import { getFormattedAge } from "../../lib/date-utils";
import { generateLifeTableUrl } from "../../lib/url-utils";
import { cn } from "../../lib/utils";
import LabeledInput from "./fields/LabeledInput";
import { formSchema } from "./schema";

// Create form contexts and hooks
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

// Create SubmitButton component using useFormContext
function SubmitButton() {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
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

  const form = useAppForm({
    defaultValues: {
      name: "",
      date: "",
    } as { name?: string; date: string },

    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      // Save form data if save checkbox is checked
      if (saveData) {
        await FormStorage.saveFormData({
          name: value.name,
          date: value.date,
          saveData: true,
        });
      } else {
        // Clear saved data if save is unchecked
        await FormStorage.clearFormData();
      }

      // Navigate to the life table page
      const url = generateLifeTableUrl(value.date, value.name);
      router.push(url);
    },
  });

  // Load saved form data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await FormStorage.loadFormData();
        if (savedData) {
          form.setFieldValue("name", savedData.name || "");
          form.setFieldValue("date", savedData.date || "");
          setSaveData(savedData.saveData || false);
        }
      } catch (error) {
        console.error("Failed to load saved form data:", error);
      }
    };

    loadSavedData();
  }, [form]);

  // Save form data when values change and save is enabled
  useEffect(() => {
    const saveFormDataOnChange = async () => {
      if (saveData) {
        const values = form.state.values;
        if (values.date || values.name) {
          try {
            await FormStorage.saveFormData({
              name: values.name,
              date: values.date,
              saveData: true,
            });
          } catch (error) {
            console.error("Failed to save form data:", error);
          }
        }
      }
    };

    saveFormDataOnChange();
  }, [form.state.values, saveData, form]);

  return (
    <section className="md:px-md-0 m-auto max-w-sm sm:px-4 md:max-w-lg px-4">
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
        <form.AppField
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

              <field.LabeledInput labelString="Name" inputId="inline-name" />
            </>
          )}
        />

        <form.AppField
          name="date"
          children={(field) => (
            <>
              <field.LabeledInput
                labelString="Birthday"
                inputId="birthday"
                inputType="date"
              />
              {field.state.value && !field.state.meta.errors.length && (
                <div className="mb-6 transition-discrete duration-500 md:flex md:items-center starting:translate-y-2 starting:opacity-0">
                  <div className="md:w-1/3">
                    <span className="mb-1 block pr-4 font-bold text-gray-500 transition-all md:mb-0 md:text-right">
                      You are:
                    </span>
                  </div>

                  <div className="md:w-2/3 dark:text-white" data-cy={"age"}>
                    {`${getFormattedAge(field.state.value)} of life experience! Make every week count! 🌟`}
                  </div>
                </div>
              )}
            </>
          )}
        />

        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3" />
          <label className="block font-bold text-gray-500 md:w-2/3">
            <input
              className="mr-2 leading-tight"
              type="checkbox"
              checked={saveData}
              onChange={async (e) => {
                const isChecked = e.target.checked;
                setSaveData(isChecked);

                if (isChecked) {
                  // Save current form data
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
                  // Clear saved data
                  try {
                    await FormStorage.clearFormData();
                  } catch (error) {
                    console.error("Failed to clear form data:", error);
                  }
                }
              }}
              data-cy={"input-checkbox-save"}
            />
            <span className="text-sm">Save</span>
          </label>
        </div>

        <form.AppForm>
          <div className="md:flex md:items-center">
            <div className="md:w-1/3" />
            <div className="md:w-2/3">
              <form.SubmitButton />
            </div>
          </div>
        </form.AppForm>
      </form>
    </section>
  );
};

export default Form;
