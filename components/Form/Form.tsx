"use client";

import * as stylex from "@stylexjs/stylex";
import { createFormHook } from "@tanstack/react-form-nextjs";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
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
import LabeledInput from "./fields/LabeledInput";
import { fieldContext, formContext, useFormContext } from "./form-hook";
import { formSchema } from "./schema";

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
  submit: {
    alignSelf: {
      default: "stretch",
      [breakpoints.sm]: "flex-start",
    },
    minHeight: "3.25rem",
    width: {
      default: "100%",
      [breakpoints.sm]: "auto",
    },
    minWidth: {
      default: null,
      [breakpoints.sm]: "15rem",
    },
    cursor: "pointer",
    borderRadius: 0,
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: tokens.accent,
    backgroundColor: {
      default: tokens.surface,
      ":hover": tokens.accent,
      [breakpoints.dark]: {
        default: tokens.surfaceRaised,
        ":hover": tokens.accent,
      },
    },
    paddingInline: {
      default: "1.5rem",
      [breakpoints.sm]: "2rem",
    },
    paddingBlock: "1rem",
    fontFamily: tokens.fontDisplay,
    fontSize: {
      default: "0.875rem",
      [breakpoints.sm]: "1rem",
    },
    lineHeight: {
      default: "calc(1.25 / 0.875)",
      [breakpoints.sm]: 1.5,
    },
    fontWeight: 700,
    letterSpacing: tokens.trackingLabel,
    textTransform: "uppercase",
    color: {
      default: tokens.accent,
      ":hover": tokens.white,
    },
    boxShadow: {
      default: `0 10px 15px -3px color-mix(in oklab, ${tokens.red600} 10%, transparent), 0 4px 6px -4px color-mix(in oklab, ${tokens.red600} 10%, transparent)`,
      ":hover": `0 20px 25px -5px color-mix(in oklab, ${tokens.red600} 20%, transparent), 0 8px 10px -6px color-mix(in oklab, ${tokens.red600} 20%, transparent)`,
      ":focus": `0 0 0 4px color-mix(in oklab, ${tokens.accent} 40%, transparent), 0 10px 15px -3px color-mix(in oklab, ${tokens.red600} 10%, transparent), 0 4px 6px -4px color-mix(in oklab, ${tokens.red600} 10%, transparent)`,
      ":hover:focus": `0 0 0 4px color-mix(in oklab, ${tokens.accent} 40%, transparent), 0 20px 25px -5px color-mix(in oklab, ${tokens.red600} 20%, transparent), 0 8px 10px -6px color-mix(in oklab, ${tokens.red600} 20%, transparent)`,
    },
    outlineStyle: {
      default: null,
      ":focus": "none",
    },
    transform: {
      default: "scale(1)",
      ":active": "scale(0.98)",
    },
    transitionProperty: "all",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  submitDisabled: {
    cursor: "not-allowed",
    opacity: 0.4,
    backgroundColor: {
      default: null,
      ":hover": tokens.surface,
      [breakpoints.dark]: {
        default: null,
        ":hover": tokens.week,
      },
    },
    color: {
      default: null,
      ":hover": tokens.accent,
    },
    boxShadow: {
      default: null,
      ":hover": `0 10px 15px -3px color-mix(in oklab, ${tokens.red600} 10%, transparent), 0 4px 6px -4px color-mix(in oklab, ${tokens.red600} 10%, transparent)`,
      ":hover:focus": `0 0 0 4px color-mix(in oklab, ${tokens.accent} 40%, transparent), 0 10px 15px -3px color-mix(in oklab, ${tokens.red600} 10%, transparent), 0 4px 6px -4px color-mix(in oklab, ${tokens.red600} 10%, transparent)`,
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
  remember: {
    display: "flex",
    width: "100%",
    cursor: "pointer",
    alignItems: "flex-start",
    gap: "0.75rem",
    paddingBlock: "0.5rem",
    fontSize: {
      default: "0.875rem",
      [breakpoints.sm]: "1rem",
    },
    lineHeight: 1.375,
    color: {
      default: tokens.secondary,
      ":hover": tokens.primary,
    },
    userSelect: "none",
  },
  checkBox: {
    position: "relative",
    marginTop: "0.125rem",
    display: "inline-flex",
    height: "1.25rem",
    width: "1.25rem",
    flexShrink: 0,
  },
  checkbox: {
    height: "1.25rem",
    width: "1.25rem",
    margin: 0,
    cursor: "pointer",
    appearance: "none",
    borderRadius: 0,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: {
      default: tokens.line,
      ":checked": tokens.accent,
      [breakpoints.dark]: {
        default: tokens.border,
        ":checked": tokens.accent,
      },
    },
    backgroundColor: {
      default: tokens.surface,
      ":checked": tokens.accent,
      [breakpoints.dark]: {
        default: tokens.surfaceRaised,
        ":checked": tokens.accent,
      },
    },
    boxShadow: {
      default: null,
      ":focus-visible": `0 0 0 4px color-mix(in oklab, ${tokens.accent} 20%, transparent)`,
    },
    outlineStyle: {
      default: null,
      ":focus-visible": "none",
    },
  },
  check: {
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
    display: {
      default: "none",
      [stylex.when.ancestor(":has(input:checked)")]: "block",
    },
    height: "0.75rem",
    width: "0.75rem",
    color: tokens.white,
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

function SubmitButton() {
  const form = useFormContext();
  return (
    <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <button
          {...stylex.props(styles.submit, !canSubmit && styles.submitDisabled)}
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
  const [calendarWeeks, setCalendarWeeks] = useState(false);
  const [weeksLived, setWeeksLived] = useState<number | null>(null);
  const [beyondGrid, setBeyondGrid] = useState(false);

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
        calendarWeeks,
      });
    } catch (error) {
      console.error("Failed to save form data:", error);
    }
  };

  useLayoutEffect(() => {
    let cancelled = false;

    const apply = (savedData: {
      name?: string;
      date: string;
      saveData?: boolean;
      calendarWeeks?: boolean;
    }) => {
      form.setFieldValue("name", savedData.name || "");
      form.setFieldValue("date", savedData.date || "");
      setSaveData(savedData.saveData || false);
      const align = savedData.calendarWeeks === true;
      setCalendarWeeks(align);
      writeCalendarWeeksPreference(align);
      if (!savedData.date) {
        document.documentElement.removeAttribute("data-memento-saved");
        return;
      }
      document.documentElement.setAttribute("data-memento-saved", "");
      const life = lifeWeeksForInput(
        savedData.date,
        savedData.calendarWeeks === true
      );
      setWeeksLived(life?.weeksLived ?? null);
      setBeyondGrid(life?.beyondGrid ?? false);
    };

    const mirrored = readFormDataSync();
    if (mirrored) {
      apply(mirrored);
      return;
    }

    document.documentElement.removeAttribute("data-memento-saved");

    // First visit after this change may only have the IndexedDB copy.
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
  }, [form]);

  const overEighty = beyondGrid;

  return (
    <div {...stylex.props(styles.shell)}>
      <form
        data-cy={"bday-form"}
        action={async formData => {
          const date = String(formData.get("date") ?? "");
          const name = String(formData.get("name") ?? "");
          const persist = formData.get("saveData") === "on";
          const alignCalendar = formData.get("calendarWeeks") === "on";
          writeCalendarWeeksPreference(alignCalendar);

          if (persist) {
            await FormStorage.saveFormData({
              name,
              date,
              saveData: true,
              calendarWeeks: alignCalendar,
            });
          } else {
            await FormStorage.clearFormData();
          }

          if (!date) return;
          trackGenerateCalendar(date, Boolean(name.trim()));
          router.push(
            generateLifeTableUrl(date, name || undefined, "table", {
              calendarWeeks: alignCalendar,
            })
          );
        }}
        {...stylex.props(styles.form)}
        noValidate
      >
        <form.AppField name="name">
          {field => (
            <field.LabeledInput
              labelString="Name"
              inputId="inline-name"
              placeholder="Enter your name (optional)"
              onValueChange={name =>
                void saveValues({ ...form.state.values, name })
              }
            />
          )}
        </form.AppField>

        <form.AppField name="date">
          {field => (
            <>
              <field.LabeledInput
                labelString="Birthdate"
                inputId="birthday"
                inputType="date"
                onValueChange={date => {
                  void saveValues({ ...form.state.values, date });
                  const life = lifeWeeksForInput(date, calendarWeeks);
                  setWeeksLived(life?.weeksLived ?? null);
                  setBeyondGrid(life?.beyondGrid ?? false);
                  if (life) {
                    document.documentElement.setAttribute(
                      "data-memento-saved",
                      ""
                    );
                  } else {
                    document.documentElement.removeAttribute(
                      "data-memento-saved"
                    );
                  }
                }}
              />
              <BirthPreview
                date={field.state.value}
                invalid={field.state.meta.errors.length > 0}
                weeksLived={weeksLived}
                beyondGrid={overEighty}
              />
            </>
          )}
        </form.AppField>

        <label {...stylex.props(styles.remember, stylex.defaultMarker())}>
          <span {...stylex.props(styles.checkBox)}>
            <input
              {...stylex.props(styles.checkbox)}
              id="calendar-weeks-checkbox"
              type="checkbox"
              name="calendarWeeks"
              value="on"
              checked={calendarWeeks}
              onChange={async e => {
                const on = e.target.checked;
                setCalendarWeeks(on);
                writeCalendarWeeksPreference(on);
                const date = form.state.values.date;
                if (date) {
                  const life = lifeWeeksForInput(date, on);
                  setWeeksLived(life?.weeksLived ?? null);
                  setBeyondGrid(life?.beyondGrid ?? false);
                }
                try {
                  await saveValues({ ...form.state.values });
                  if (!saveData) return;
                  await FormStorage.saveFormData({
                    name: form.state.values.name,
                    date: form.state.values.date,
                    saveData: true,
                    calendarWeeks: on,
                  });
                } catch (error) {
                  console.error("Failed to save calendar weeks:", error);
                }
              }}
            />
            <svg
              {...stylex.props(styles.check)}
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
          Line each year up with the real birthday (365 or 366 days)
        </label>

        <label {...stylex.props(styles.remember, stylex.defaultMarker())}>
          <span {...stylex.props(styles.checkBox)}>
            <input
              {...stylex.props(styles.checkbox)}
              id="save-data-checkbox"
              type="checkbox"
              name="saveData"
              value="on"
              checked={saveData}
              onChange={async e => {
                const isChecked = e.target.checked;
                setSaveData(isChecked);

                if (isChecked) {
                  const values = form.state.values;
                  try {
                    await FormStorage.saveFormData({
                      name: values.name,
                      date: values.date,
                      saveData: true,
                      calendarWeeks,
                    });
                  } catch (error) {
                    console.error("Failed to save form data:", error);
                  }
                } else {
                  try {
                    await FormStorage.clearFormData();
                    await clearWeekNotes();
                  } catch (error) {
                    console.error("Failed to clear form data:", error);
                  }
                }
              }}
              data-cy={"input-checkbox-save"}
            />
            <svg
              {...stylex.props(styles.check)}
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
