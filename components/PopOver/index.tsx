"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";

// Module augmentation for CSS Anchor Positioning properties
declare module "react" {
  interface CSSProperties {
    anchorName?: string;
    positionAnchor?: string;
    positionArea?: string;
    positionTryFallbacks?: string;
    positionTryOptions?: string;
    "--memento-anchor"?: string;
  }
}

type PopoverMode = "auto" | "manual";
type PopoverAction = "toggle" | "show" | "hide";

interface PopoverProps {
  /** Trigger button content */
  label: ReactNode;
  /** Popover content */
  children: ReactNode;
  /** Native popover mode */
  mode?: PopoverMode;
  /** Native popovertargetaction */
  action?: PopoverAction;
  className?: string;
  triggerClassName?: string;
  /** Week index for ml-auto positioning (weeks > 26) */
  weekIndex?: number;
  /** Whether the week is filled (past) or empty (future) */
  isFilled?: boolean;
  /** Fired before the popover state changes */
  onBeforeToggle?: (event: React.ToggleEvent<HTMLDivElement>) => void;
  /** Fired after the popover state changes */
  onToggle?: (event: React.ToggleEvent<HTMLDivElement>) => void;
}

export default function Popover({
  label,
  children,
  mode = "auto",
  action = "toggle",
  className = "",
  triggerClassName = "",
  weekIndex,
  isFilled = true,
  onBeforeToggle,
  onToggle,
}: PopoverProps) {
  const popoverId = useId();
  const anchorName = `--memento-${popoverId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const handleBeforeToggle = (event: React.ToggleEvent<HTMLDivElement>) => {
    onBeforeToggle?.(event);
  };

  const handleToggle = (event: React.ToggleEvent<HTMLDivElement>) => {
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
        className={[
          "relative size-2 cursor-pointer border text-zinc-500 transition-colors outline-none",
          // Border and background colors based on filled state
          isFilled
            ? "border-zinc-950 bg-zinc-950 dark:border-red-700 dark:bg-red-700"
            : "border-red-600 dark:border-red-500",
          // Hover states
          isFilled
            ? "hover:border-red-600 hover:bg-red-600 dark:hover:border-red-500 dark:hover:bg-red-500"
            : "hover:border-red-700 hover:bg-red-600/10 dark:hover:border-red-400 dark:hover:bg-red-500/10",
          // Focus states
          "focus-visible:ring-2 focus-visible:ring-red-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          "dark:text-zinc-400 dark:focus-visible:ring-offset-zinc-950",
          weekIndex && weekIndex > 26 ? "ml-auto" : "",
          triggerClassName,
        ].join(" ")}
        style={{ anchorName }}
      >
        {label}
      </button>

      <div
        ref={popoverRef}
        id={popoverId}
        popover={mode}
        tabIndex={-1}
        role="dialog"
        aria-label="Record details"
        onBeforeToggle={handleBeforeToggle}
        onToggle={handleToggle}
        style={{
          positionAnchor: anchorName,
          positionArea: "right center",
          positionTryFallbacks:
            "--memento-left, --memento-bottom, --memento-top",
        }}
        className={[
          "fixed inset-auto z-50 m-[0.625rem]",
          "w-max max-w-[calc(100vw-1.25rem)]",
          "overflow-hidden border border-zinc-950 bg-white text-zinc-950",
          "shadow-[6px_6px_0_0_rgb(24_24_27/0.16)]",
          "dark:border-red-700 dark:bg-zinc-950 dark:text-zinc-100",
          "dark:shadow-[6px_6px_0_0_rgb(220_38_38/0.22)]",
          "opacity-0 transition-opacity duration-200",
          "[&:popover-open]:opacity-100",
          "[&::backdrop]:bg-black/30 [&::backdrop]:backdrop-blur-sm",
          className,
        ].join(" ")}
      >
        {children}
      </div>
    </>
  );
}
