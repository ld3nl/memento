"use client";

import * as stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";
import { useCallback, useLayoutEffect, useState } from "react";
import { trackGenerateCalendar } from "../../lib/analytics";
import { calculateLifeWeeks, getFormattedAge } from "../../lib/date-utils";
import { FormStorage, readFormDataSync } from "../../lib/storage";
import {
  birthDateFromPathSegments,
  generateLifeTableUrl,
} from "../../lib/url-utils";
import { writeCalendarWeeksPreference } from "../../lib/week-count-mode";
import { clearWeekNotes } from "../../lib/week-notes";
import { breakpoints } from "../../styles/breakpoints.stylex";
import { kicker } from "../../styles/recipes/kicker.stylex";
import { tokens } from "../../styles/tokens.stylex";
import { formSchema } from "./schema";
import { useAppForm } from "./use-app-form";

type BirthValues = {
  name?: string;
  date: string;
  saveData: boolean;
  calendarWeeks: boolean;
};

function lifeWeeksForInput(birthdate: string, calendarWeeks?: boolean) {
  const birth = birthDateFromPathSegments(birthdate.split("-"));
  if (!birth) return null;
  return calculateLifeWeeks(
    birth,
    new Date(),
    calendarWeeks ? "calendar" : "birthday-grid"
  );
}

const styles = stylex.create({
  shell: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: {
      default: "1.5rem",
      [breakpoints.sm]: "1.75rem",
    },
  },
  preview: {
    marginTop: {
      default: 0,
      [breakpoints.sm]: "0.25rem",
    },
    width: "100%",
  },
  previewCard: {
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: tokens.accent,
    backgroundColor: {
      default: tokens.surface,
      [breakpoints.dark]: tokens.surfaceRaised,
    },
    padding: {
      default: "1.5rem",
      [breakpoints.sm]: "1.75rem",
      [breakpoints.lg]: "2rem",
    },
    boxShadow: `0 25px 50px -12px color-mix(in oklab, ${tokens.red600} 10%, transparent)`,
  },
  weeks: {
    fontFamily: tokens.fontMono,
    fontSize: {
      default: "3rem",
      [breakpoints.smOnly]: "3.75rem",
      [breakpoints.lg]: "4.5rem",
    },
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: "-0.025em",
    color: tokens.accent,
    fontVariantNumeric: "tabular-nums",
  },
  weeksLabel: {
    marginTop: {
      default: "0.75rem",
      [breakpoints.sm]: "1rem",
    },
  },
  ageCopy: {
    marginTop: "1rem",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: tokens.line,
    paddingTop: "1rem",
    fontFamily: tokens.fontDisplay,
    fontSize: "0.875rem",
    lineHeight: 1.625,
    fontStyle: "italic",
    color: tokens.secondary,
  },
  beyond: {
    marginTop: "0.75rem",
    marginBottom: 0,
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: tokens.secondary,
  },
});

function BirthPreview({
  date,
  invalid,
  weeksLived,
  beyondGrid,
}: {
  date: string;
  invalid: boolean;
  weeksLived: number | null;
  beyondGrid: boolean;
}) {
  const preview = stylex.props(styles.preview);
  const show = Boolean(date) && !invalid && weeksLived !== null;

  return (
    <div
      {...preview}
      className={[preview.className, "birth-preview-slot"]
        .filter(Boolean)
        .join(" ")}
    >
      {show ? (
        <div {...stylex.props(styles.previewCard)}>
          <div data-cy="age" {...stylex.props(styles.weeks)}>
            {weeksLived.toLocaleString()}
          </div>
          <div {...stylex.props(kicker.base, styles.weeksLabel)}>
            Weeks lived
          </div>
          <div data-cy="age-copy" {...stylex.props(styles.ageCopy)}>
            {getFormattedAge(date)}
          </div>
          {beyondGrid ? (
            <p {...stylex.props(styles.beyond)}>
              The grid visualizes 80 years. Extra years are not drawn, but you
              can still open the calendar.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

async function persistBirth(values: BirthValues) {
  if (!values.saveData || (!values.date && !values.name)) return;
  await FormStorage.saveFormData({
    name: values.name,
    date: values.date,
    saveData: true,
    calendarWeeks: values.calendarWeeks,
  });
}

const Form = () => {
  const router = useRouter();
  const [weeksLived, setWeeksLived] = useState<number | null>(null);
  const [beyondGrid, setBeyondGrid] = useState(false);

  const form = useAppForm({
    defaultValues: {
      name: "",
      date: "",
      saveData: false,
      calendarWeeks: false,
    } as BirthValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      writeCalendarWeeksPreference(value.calendarWeeks);
      try {
        if (value.saveData) {
          await FormStorage.saveFormData({
            name: value.name,
            date: value.date,
            saveData: true,
            calendarWeeks: value.calendarWeeks,
          });
        } else {
          await FormStorage.clearFormData();
        }
      } catch (error) {
        console.error("Failed to store the birth form:", error);
      }
      if (!value.date) return;
      trackGenerateCalendar(value.date, Boolean(value.name?.trim()));
      router.push(
        generateLifeTableUrl(value.date, value.name || undefined, "table", {
          calendarWeeks: value.calendarWeeks,
        })
      );
    },
  });

  const showWeeks = useCallback((date: string, calendarWeeks: boolean) => {
    const life = lifeWeeksForInput(date, calendarWeeks);
    setWeeksLived(life?.weeksLived ?? null);
    setBeyondGrid(life?.beyondGrid ?? false);
    if (life) {
      document.documentElement.setAttribute("data-memento-saved", "");
    } else {
      document.documentElement.removeAttribute("data-memento-saved");
    }
  }, []);

  useLayoutEffect(() => {
    let cancelled = false;

    const apply = (savedData: {
      name?: string;
      date: string;
      saveData?: boolean;
      calendarWeeks?: boolean;
    }) => {
      const calendarWeeks = savedData.calendarWeeks === true;
      form.setFieldValue("name", savedData.name || "");
      form.setFieldValue("date", savedData.date || "");
      form.setFieldValue("saveData", Boolean(savedData.saveData));
      form.setFieldValue("calendarWeeks", calendarWeeks);
      writeCalendarWeeksPreference(calendarWeeks);
      if (!savedData.date) {
        document.documentElement.removeAttribute("data-memento-saved");
        return;
      }
      showWeeks(savedData.date, calendarWeeks);
    };

    const mirrored = readFormDataSync();
    if (mirrored) {
      apply(mirrored);
      return;
    }

    document.documentElement.removeAttribute("data-memento-saved");

    void FormStorage.loadFormData()
      .then(savedData => {
        if (cancelled || !savedData) return;
        apply(savedData);
        return FormStorage.saveFormData(savedData);
      })
      .catch(error => {
        console.error("Failed to load saved form data:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [form, showWeeks]);

  return (
    <div {...stylex.props(styles.shell)}>
      <form
        data-cy="bday-form"
        noValidate
        {...stylex.props(styles.form)}
        action={() => {
          void form.handleSubmit();
        }}
      >
        <form.AppField name="name">
          {field => (
            <field.AppTextField
              label="Name"
              testId="inline-name"
              id="inline-name"
              placeholder="Enter your name (optional)"
              autoComplete="name"
              onValueChange={name => {
                void persistBirth({ ...form.state.values, name }).catch(
                  error => {
                    console.error("Failed to save form data:", error);
                  }
                );
              }}
            />
          )}
        </form.AppField>

        <form.AppField name="date">
          {field => (
            <>
              <field.AppDateField
                label="Birthdate"
                testId="birthday"
                id="birthday"
                onValueChange={date => {
                  showWeeks(date, form.state.values.calendarWeeks);
                  void persistBirth({ ...form.state.values, date }).catch(
                    error => {
                      console.error("Failed to save form data:", error);
                    }
                  );
                }}
              />
              <BirthPreview
                date={field.state.value}
                invalid={field.state.meta.errors.length > 0}
                weeksLived={weeksLived}
                beyondGrid={beyondGrid}
              />
            </>
          )}
        </form.AppField>

        <form.AppField name="calendarWeeks">
          {field => (
            <field.AppCheckboxField
              label="Line each year up with the real birthday (365 or 366 days)"
              testId="calendar-weeks-checkbox"
              onValueChange={on => {
                writeCalendarWeeksPreference(on);
                const values = { ...form.state.values, calendarWeeks: on };
                if (values.date) showWeeks(values.date, on);
                if (!values.saveData) return;
                void persistBirth(values).catch(error => {
                  console.error("Failed to save calendar weeks:", error);
                });
              }}
            />
          )}
        </form.AppField>

        <form.AppField name="saveData">
          {field => (
            <field.AppCheckboxField
              label="Remember my information"
              testId="input-checkbox-save"
              onValueChange={on => {
                const values = { ...form.state.values, saveData: on };
                void (async () => {
                  try {
                    if (on) {
                      await persistBirth(values);
                      return;
                    }
                    await FormStorage.clearFormData();
                    await clearWeekNotes();
                  } catch (error) {
                    console.error("Failed to update saved form data:", error);
                  }
                })();
              }}
            />
          )}
        </form.AppField>

        <form.AppForm>
          <form.AppSubmitButton />
        </form.AppForm>
      </form>
    </div>
  );
};

export default Form;
