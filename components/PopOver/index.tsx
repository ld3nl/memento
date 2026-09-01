"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";

import { cn } from "../../lib/utils";

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

  const handleBeforeToggle = (
    event: React.ToggleEvent<HTMLDialogElement>,
  ) => {
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
        className={cn(
          "relative size-2 cursor-pointer border text-zinc-500 transition-colors outline-none",
          {
            "border-zinc-950 bg-zinc-950 dark:border-red-700 dark:bg-red-700":
              isFilled,
            "border-red-600 dark:border-red-500": !isFilled,
            "hover:border-red-600 hover:bg-red-600 dark:hover:border-red-500 dark:hover:bg-red-500":
              isFilled,
            "hover:border-red-700 hover:bg-red-600/10 dark:hover:border-red-400 dark:hover:bg-red-500/10":
              !isFilled,
            "ml-auto": weekIndex && weekIndex > 26,
          },
          "focus-visible:ring-2 focus-visible:ring-red-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-zinc-400 dark:focus-visible:ring-offset-zinc-950",
          triggerClassName,
        )}
        style={{ anchorName }}
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
        style={{
          positionAnchor: anchorName,
        }}
        className={cn(
          "fixed inset-auto z-50 m-0 max-w-none border-0 bg-transparent p-0 opacity-0 transition-opacity duration-200 [&::backdrop]:bg-black/30 [&::backdrop]:backdrop-blur-sm [&:popover-open]:opacity-100",
          // Position classes
          position === "auto" && "popover-auto",
          position === "left_top" && "popover-left-top",
          position === "center_top" && "popover-center-top",
          position === "right_top" && "popover-right-top",
          position === "left_center" && "popover-left-center",
          position === "center_center" && "popover-center-center",
          position === "right_center" && "popover-right-center",
          position === "left_bottom" && "popover-left-bottom",
          position === "center_bottom" && "popover-center-bottom",
          position === "right_bottom" && "popover-right-bottom",
          className,
        )}
      >
        {children}
      </dialog>
    </>
  );
}
