"use client";

import { cn } from "../lib/utils";

type ViewMode = "table" | "burst";

type ViewToggleProps = {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
};

export function ViewToggle({
  currentView,
  onViewChange,
  className,
}: ViewToggleProps) {
  const targetView = currentView === "table" ? "burst" : "table";
  const icon = targetView === "table" ? "▦" : "◯";
  const label = targetView === "table" ? "Table view" : "Burst view";

  return (
    <button
      onClick={() => onViewChange(targetView)}
      className={cn(
        "flex items-center gap-2 rounded-full border border-black bg-white px-4 py-2 text-sm font-medium shadow-lg transition-all hover:bg-black/5 hover:shadow-xl dark:border-purple-500 dark:bg-black dark:text-purple-500 dark:hover:bg-purple-500/10",
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
