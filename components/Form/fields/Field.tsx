"use client";

import { Description, Field, Label } from "@headlessui/react";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { breakpoints } from "../../../styles/breakpoints.stylex";
import { kicker } from "../../../styles/recipes/kicker.stylex";
import { tokens } from "../../../styles/tokens.stylex";

const styles = stylex.create({
  field: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: {
      default: "0.5rem",
      [breakpoints.sm]: "0.75rem",
    },
  },
  label: {
    fontSize: {
      default: "0.75rem",
      [breakpoints.sm]: tokens.kicker,
    },
    lineHeight: "calc(1 / 0.75)",
  },
  errorText: {
    fontSize: {
      default: "0.875rem",
      [breakpoints.sm]: "1rem",
    },
    lineHeight: {
      default: "calc(1.25 / 0.875)",
      [breakpoints.sm]: 1.5,
    },
    fontWeight: 500,
    color: tokens.accent,
  },
});

export function FormField({
  id,
  label,
  error,
  testId,
  disabled,
  children,
}: {
  id: string;
  label: ReactNode;
  error?: string;
  testId?: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <Field disabled={disabled} {...stylex.props(styles.field)}>
      <Label
        {...stylex.props(kicker.base, styles.label)}
        htmlFor={id}
        data-cy={testId ? `${testId}-label` : undefined}
      >
        {label}
      </Label>
      {children}
      {error ? (
        <Description id={`${id}-error`} role="alert">
          <span {...stylex.props(styles.errorText)}>{error}</span>
        </Description>
      ) : null}
    </Field>
  );
}
