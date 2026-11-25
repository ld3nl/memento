"use client";

import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { breakpoints } from "../../../styles/breakpoints.stylex";
import { tokens } from "../../../styles/tokens.stylex";
import { useFieldContext, useFormContext } from "../contexts";
import { normalizeErrorMessages } from "../errors";
import { CheckboxField } from "../fields/CheckboxField";
import { DateField, TextField } from "../fields/TextField";

function fieldError(errors: unknown[]): string | undefined {
  return normalizeErrorMessages(errors)[0];
}

function touchedError(
  isTouched: boolean,
  errors: unknown[],
  externalError?: string
) {
  return externalError ?? (isTouched ? fieldError(errors) : undefined);
}

export function AppTextField(
  props: Omit<
    ComponentProps<typeof TextField>,
    "name" | "value" | "onChange" | "onBlur" | "error"
  > & {
    externalError?: string;
    onValueChange?: (value: string) => void;
  }
) {
  const field = useFieldContext<string>();
  const { externalError, onValueChange, ...componentProps } = props;
  return (
    <TextField
      {...componentProps}
      name={field.name}
      value={field.state.value ?? ""}
      onChange={event => {
        const value = event.target.value;
        field.handleChange(value);
        onValueChange?.(value);
      }}
      onBlur={field.handleBlur}
      error={touchedError(
        field.state.meta.isTouched,
        field.state.meta.errors,
        externalError
      )}
    />
  );
}

export function AppDateField(
  props: Omit<
    ComponentProps<typeof DateField>,
    "name" | "value" | "onChange" | "onBlur" | "error"
  > & {
    externalError?: string;
    onValueChange?: (value: string) => void;
  }
) {
  const field = useFieldContext<string>();
  const { externalError, onValueChange, ...componentProps } = props;
  return (
    <DateField
      {...componentProps}
      name={field.name}
      value={field.state.value ?? ""}
      onChange={event => {
        const value = event.target.value;
        field.handleChange(value);
        onValueChange?.(value);
      }}
      onBlur={field.handleBlur}
      error={touchedError(
        field.state.meta.isTouched,
        field.state.meta.errors,
        externalError
      )}
    />
  );
}

export function AppCheckboxField(
  props: Omit<
    ComponentProps<typeof CheckboxField>,
    "name" | "checked" | "onChange" | "onBlur"
  > & {
    onValueChange?: (checked: boolean) => void;
  }
) {
  const field = useFieldContext<boolean>();
  const { onValueChange, ...componentProps } = props;
  return (
    <CheckboxField
      {...componentProps}
      name={field.name}
      checked={Boolean(field.state.value)}
      onChange={checked => {
        field.handleChange(checked);
        onValueChange?.(checked);
      }}
      onBlur={field.handleBlur}
    />
  );
}

const styles = stylex.create({
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
});

export function AppSubmitButton() {
  const form = useFormContext();
  return (
    <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <button
          {...stylex.props(styles.submit, !canSubmit && styles.submitDisabled)}
          type="submit"
          disabled={!canSubmit}
          data-cy="generate-table-button"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Summoning..." : "Reveal Calendar"}
        </button>
      )}
    </form.Subscribe>
  );
}
