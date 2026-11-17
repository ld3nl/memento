"use client";

import * as stylex from "@stylexjs/stylex";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { breakpoints } from "../../styles/breakpoints.stylex";
import { tokens } from "../../styles/tokens.stylex";

type PopoverMode = "auto" | "manual";
type PopoverAction = "toggle" | "show" | "hide";
type PopoverPosition =
  | "auto"
  | "left_top"
  | "center_top"
  | "right_top"
  | "left_center"
  | "center_center"
  | "right_center"
  | "left_bottom"
  | "center_bottom"
  | "right_bottom";

interface PopoverProps {
  /** Trigger button content */
  label: ReactNode;
  /** Popover content */
  children: ReactNode;
  /** Native popover mode */
  mode?: PopoverMode;
  /** Native popovertargetaction */
  action?: PopoverAction;
  /** Popover position relative to trigger */
  position?: PopoverPosition;
  className?: string;
  triggerClassName?: string;
  /** Week index for ml-auto positioning (weeks > 26) */
  weekIndex?: number;
  /** Whether the week is filled (past) or empty (future) */
  isFilled?: boolean;
  /** Fired before the popover state changes */
  onBeforeToggle?: (event: React.ToggleEvent<HTMLDialogElement>) => void;
  /** Fired after the popover state changes */
  onToggle?: (event: React.ToggleEvent<HTMLDialogElement>) => void;
}

const positionClass: Record<PopoverPosition, string> = {
  auto: "popover-auto",
  left_top: "popover-left-top",
  center_top: "popover-center-top",
  right_top: "popover-right-top",
  left_center: "popover-left-center",
  center_center: "popover-center-center",
  right_center: "popover-right-center",
  left_bottom: "popover-left-bottom",
  center_bottom: "popover-center-bottom",
  right_bottom: "popover-right-bottom",
};

const styles = stylex.create({
  trigger: {
    position: "relative",
    width: "0.5rem",
    height: "0.5rem",
    padding: 0,
    cursor: "pointer",
    borderWidth: 1,
    borderStyle: "solid",
    color: tokens.secondary,
    transitionProperty:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    outlineStyle: "none",
    boxShadow: {
      default: null,
      ":focus-visible": `0 0 0 2px ${tokens.surface}, 0 0 0 4px color-mix(in oklab, ${tokens.accent} 50%, transparent)`,
    },
  },
  triggerFilled: {
    borderColor: {
      default: tokens.border,
      ":hover": tokens.accent,
      [breakpoints.dark]: {
        default: tokens.accent,
        ":hover": tokens.accent,
      },
    },
    backgroundColor: {
      default: tokens.card,
      ":hover": tokens.accent,
      [breakpoints.dark]: {
        default: tokens.accent,
        ":hover": tokens.accent,
      },
    },
  },
  triggerEmpty: {
    borderColor: {
      default: tokens.accent,
      ":hover": tokens.accent,
    },
    backgroundColor: {
      default: "transparent",
      ":hover": `color-mix(in oklab, ${tokens.accent} 10%, transparent)`,
    },
  },
  triggerEnd: {
    marginLeft: "auto",
  },
  dialog: {
    position: "fixed",
    inset: "auto",
    zIndex: 50,
    margin: 0,
    maxWidth: "none",
    borderWidth: 0,
    backgroundColor: "transparent",
    padding: 0,
    opacity: {
      default: 0,
      ":popover-open": 1,
    },
    transitionProperty: "opacity",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    "::backdrop": {
      backgroundColor: `color-mix(in oklab, ${tokens.black} 30%, transparent)`,
      backdropFilter: "blur(8px)",
    },
  },
});

function mergeClassName(
  stylexClassName: string | undefined,
  ...extra: Array<string | false | undefined>
) {
  return [stylexClassName, ...extra].filter(Boolean).join(" ");
}

export default function Popover({
  label,
  children,
  mode = "auto",
  action = "toggle",
  position = "auto",
  className = "",
  triggerClassName = "",
  weekIndex,
  isFilled = true,
  onBeforeToggle,
  onToggle,
}: PopoverProps) {
  const popoverId = useId();
  const anchorName = `--memento-${popoverId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const popoverRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const handleBeforeToggle = (event: React.ToggleEvent<HTMLDialogElement>) => {
    onBeforeToggle?.(event);
  };

  const handleToggle = (event: React.ToggleEvent<HTMLDialogElement>) => {
    const isOpen = event.newState === "open";
    setOpen(isOpen);
    onToggle?.(event);
  };

  useEffect(() => {
    const popoverEl = popoverRef.current;
    if (!popoverEl) return;

    if (open) {
      const frame = requestAnimationFrame(() => {
        const focusableSelector =
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const firstFocusable =
          popoverEl.querySelector<HTMLElement>(focusableSelector);
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          popoverEl.focus();
        }
      });
      return () => cancelAnimationFrame(frame);
    }

    if (
      document.activeElement instanceof HTMLElement &&
      popoverEl.contains(document.activeElement)
    ) {
      triggerRef.current?.focus();
    }
  }, [open]);

  const triggerProps = stylex.props(
    styles.trigger,
    isFilled ? styles.triggerFilled : styles.triggerEmpty,
    weekIndex != null && weekIndex > 26 && styles.triggerEnd
  );
  const dialogProps = stylex.props(styles.dialog);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={popoverId}
        popoverTargetAction={action}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={popoverId}
        {...triggerProps}
        className={mergeClassName(triggerProps.className, triggerClassName)}
        style={{ ...triggerProps.style, anchorName }}
      >
        {label}
      </button>

      <dialog
        ref={popoverRef}
        id={popoverId}
        popover={mode}
        tabIndex={-1}
        aria-label="Record details"
        onBeforeToggle={handleBeforeToggle}
        onToggle={handleToggle}
        {...dialogProps}
        className={mergeClassName(
          dialogProps.className,
          positionClass[position],
          className
        )}
        style={{
          ...dialogProps.style,
          positionAnchor: anchorName,
        }}
      >
        {children}
      </dialog>
    </>
  );
}
