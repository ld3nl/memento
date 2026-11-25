"use client";

import { Checkbox, Field, Label } from "@headlessui/react";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { breakpoints } from "../../../styles/breakpoints.stylex";
import { tokens } from "../../../styles/tokens.stylex";

const styles = stylex.create({
  row: {
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
  box: {
    position: "relative",
    marginTop: "0.125rem",
    display: "inline-flex",
    height: "1.25rem",
    width: "1.25rem",
    flexShrink: 0,
    cursor: "pointer",
    borderWidth: 0,
    backgroundColor: "transparent",
    padding: 0,
  },
  face: {
    position: "absolute",
    inset: 0,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: {
      default: tokens.line,
      [stylex.when.ancestor("[data-checked]")]: tokens.accent,
      [breakpoints.dark]: {
        default: tokens.border,
        [stylex.when.ancestor("[data-checked]")]: tokens.accent,
      },
    },
    backgroundColor: {
      default: tokens.surface,
      [stylex.when.ancestor("[data-checked]")]: tokens.accent,
      [breakpoints.dark]: {
        default: tokens.surfaceRaised,
        [stylex.when.ancestor("[data-checked]")]: tokens.accent,
      },
    },
    boxShadow: {
      default: null,
      [stylex.when.ancestor("[data-focus]")]:
        `0 0 0 4px color-mix(in oklab, ${tokens.accent} 20%, transparent)`,
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
      [stylex.when.ancestor("[data-checked]")]: "block",
    },
    height: "0.75rem",
    width: "0.75rem",
    color: tokens.white,
  },
  copy: {
    cursor: "pointer",
  },
});

export function CheckboxField({
  checked,
  onChange,
  onBlur,
  label,
  disabled,
  name,
  testId,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  label: ReactNode;
  disabled?: boolean;
  name?: string;
  testId?: string;
}) {
  return (
    <Field disabled={disabled} {...stylex.props(styles.row)}>
      <Checkbox
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        data-cy={testId}
        {...stylex.props(styles.box, stylex.defaultMarker())}
      >
        <span {...stylex.props(styles.face)} />
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
      </Checkbox>
      <Label {...stylex.props(styles.copy)}>{label}</Label>
    </Field>
  );
}
