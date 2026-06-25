"use client";

import { cn } from "../lib/utils";

type ViewMode = "table" | "burst";

type ViewToggleProps = {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
};

function ViewToggle({ currentView, onViewChange, className }: ViewToggleProps) {
  const targetView = currentView === "table" ? "burst" : "table";
  const icon = targetView === "table" ? "▦" : "◯";
  const label = targetView === "table" ? "Table view" : "Burst view";

  return (
    <button
      type="button"
      onClick={() => onViewChange(targetView)}
      className={cn(
        "flex items-center gap-2 rounded-full border border-zinc-900 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-lg transition-all hover:bg-zinc-100 hover:shadow-xl dark:border-zinc-200 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800",
        className,
      )}
      aria-label={`Switch to ${label}`}
      title={`Switch to ${label}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default ViewToggle;
