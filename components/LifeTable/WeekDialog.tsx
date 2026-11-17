"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import * as stylex from "@stylexjs/stylex";
import type { LifeWeekDetail } from "../../lib/life-week";
import { breakpoints } from "../../styles/breakpoints.stylex";
import { tokens } from "../../styles/tokens.stylex";
import { WeekNotesField } from "./WeekNotesField";

const styles = stylex.create({
  root: {
    position: "fixed",
    inset: 0,
    zIndex: 60,
    display: {
      default: "flex",
      [breakpoints.print]: "none",
    },
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "color-mix(in oklab, #000 42%, transparent)",
  },
  panel: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "34rem",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: tokens.accent,
    backgroundColor: tokens.surface,
    padding: "1.25rem",
  },
  close: {
    position: "absolute",
    top: "0.75rem",
    right: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2rem",
    height: "2rem",
    borderWidth: 0,
    backgroundColor: "transparent",
    padding: 0,
    fontFamily: tokens.fontDisplay,
    fontSize: "1.5rem",
    lineHeight: 1,
    fontWeight: 400,
    color: tokens.secondary,
    cursor: "pointer",
  },
  span: {
    marginTop: "0.875rem",
    marginBottom: 0,
    fontFamily: tokens.fontMono,
    fontSize: "0.875rem",
    lineHeight: 1.4,
    fontWeight: 500,
    color: tokens.primary,
    fontVariantNumeric: "tabular-nums",
  },
  title: {
    margin: 0,
    fontFamily: tokens.fontDisplay,
    fontSize: "2.25rem",
    lineHeight: 0.95,
    fontWeight: 400,
    fontStyle: "italic",
    letterSpacing: "-0.025em",
    color: tokens.primary,
    paddingRight: "1.75rem",
  },
  age: {
    marginTop: "0.875rem",
    marginBottom: 0,
    fontFamily: tokens.fontMono,
    fontSize: "0.875rem",
    lineHeight: 1.4,
    fontWeight: 500,
    color: tokens.accent,
    fontVariantNumeric: "tabular-nums",
  },
  stampBlock: {
    marginTop: "1.5rem",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: tokens.line,
    paddingTop: "0.875rem",
  },
  stampLabel: {
    margin: 0,
    fontFamily: tokens.fontDisplay,
    fontSize: tokens.kicker,
    lineHeight: 1,
    fontWeight: 600,
    letterSpacing: tokens.trackingLabel,
    textTransform: "uppercase",
    color: tokens.secondary,
  },
  stamp: {
    marginTop: "0.5rem",
    marginBottom: 0,
    fontFamily: tokens.fontMono,
    fontSize: "0.75rem",
    lineHeight: 1.5,
    color: tokens.secondary,
    overflowWrap: "anywhere",
  },
});

export function WeekDialog({
  detail,
  lifeYear,
  weekIndex,
  onClose,
}: {
  detail: LifeWeekDetail | null;
  lifeYear: number | null;
  weekIndex: number | null;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={detail !== null}
      onClose={onClose}
      {...stylex.props(styles.root)}
    >
      <DialogBackdrop {...stylex.props(styles.backdrop)} />
      {detail ? (
        <DialogPanel {...stylex.props(styles.panel)} data-cy="week-dialog">
          <button
            type="button"
            {...stylex.props(styles.close)}
            onClick={onClose}
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
          <DialogTitle {...stylex.props(styles.title)}>
            {detail.label}
          </DialogTitle>
          <p {...stylex.props(styles.age)}>{detail.ageLabel}</p>
          <p {...stylex.props(styles.span)}>{detail.span}</p>
          {lifeYear !== null && weekIndex !== null ? (
            <WeekNotesField
              key={`${lifeYear}-${weekIndex}`}
              lifeYear={lifeYear}
              weekIndex={weekIndex}
            />
          ) : null}
          <div {...stylex.props(styles.stampBlock)}>
            <p {...stylex.props(styles.stampLabel)}>Stamp</p>
            <p {...stylex.props(styles.stamp)}>
              <time dateTime={detail.stamp}>{detail.stamp}</time>
            </p>
          </div>
        </DialogPanel>
      ) : null}
    </Dialog>
  );
}
