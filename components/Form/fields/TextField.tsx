"use client";

import { Input } from "@headlessui/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { breakpoints } from "../../../styles/breakpoints.stylex";
import { tokens } from "../../../styles/tokens.stylex";
import { FormField } from "./Field";

const styles = stylex.create({
  input: {
    minHeight: {
      default: "3rem",
      [breakpoints.sm]: "3.25rem",
    },
    width: "100%",
    appearance: "none",
    borderRadius: 0,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: {
      default: tokens.border,
      ":hover": tokens.border,
      ":focus": tokens.accent,
    },
    backgroundColor: tokens.surfaceRaised,
    paddingInline: {
      default: "1rem",
      [breakpoints.sm]: "1.25rem",
    },
    paddingBlock: "0.875rem",
    fontFamily: "var(--font-inter)",
    fontSize: {
      default: "1rem",
      [breakpoints.sm]: "1.125rem",
    },
    lineHeight: 1.25,
    color: tokens.primary,
    boxShadow: {
      default: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      ":focus": `0 0 0 4px color-mix(in oklab, ${tokens.accent} 20%, transparent), 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`,
    },
    outlineStyle: {
      default: null,
      ":focus": "none",
    },
    transitionProperty:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    "::placeholder": {
      color: tokens.secondary,
    },
  },
  inputError: {
    borderColor: {
      default: tokens.accent,
      ":hover": tokens.accent,
      ":focus": tokens.accent,
    },
    boxShadow: {
      default: null,
      ":focus": `0 0 0 4px color-mix(in oklab, ${tokens.accent} 30%, transparent), 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`,
    },
  },
});

type SharedProps = {
  label: ReactNode;
  error?: string;
  testId?: string;
};

export type TextFieldProps = ComponentPropsWithoutRef<"input"> & SharedProps;

export function TextField({
  label,
  error,
  testId,
  id,
  ...props
}: TextFieldProps) {
  const fieldId = id ?? props.name;
  if (!fieldId) throw new Error("TextField requires an id or name");
  const input = stylex.props(styles.input, Boolean(error) && styles.inputError);

  return (
    <FormField
      id={fieldId}
      label={label}
      error={error}
      testId={testId}
      disabled={props.disabled}
    >
      <Input
        {...input}
        id={fieldId}
        invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        data-cy={testId ? `${testId}-input` : undefined}
        {...props}
      />
    </FormField>
  );
}

export function DateField(
  props: Omit<TextFieldProps, "type" | "autoComplete">
) {
  return <TextField type="date" autoComplete="bday" {...props} />;
}
