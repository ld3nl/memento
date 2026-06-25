// Memento card content for popover - matches the design system
interface MementoCardProps {
  date: string; // e.g., "17 Dec 1987"
  dateLabel: string; // e.g., "1987.12.17"
  weekNumber: string; // e.g., "№ 1 042"
  status?: "remembered" | "forgotten";
  note?: string;
}

export function MementoCard({
  date,
  dateLabel,
  weekNumber,
  status = "remembered",
  note = "One marked square. A finite count, quietly accounted for.",
}: MementoCardProps) {
  return (
    <>
      <header className="flex items-center justify-between gap-6 border-b border-zinc-950 px-3 py-2 dark:border-red-700">
        <span className="font-mono text-[9px]/none tracking-[0.24em] text-zinc-500 uppercase">
          memento mori
        </span>
        <span className="font-mono text-[10px]/none tracking-[0.16em] text-red-600 uppercase dark:text-red-500">
          {dateLabel}
        </span>
      </header>

      <div className="space-y-3 px-3 py-3">
        <dl className="grid grid-cols-[auto_auto] gap-x-8 gap-y-1.5 font-mono text-xs">
          <dt className="text-zinc-400 dark:text-zinc-500">date</dt>
          <dd className="text-right tabular-nums">{date}</dd>

          <dt className="text-zinc-400 dark:text-zinc-500">week</dt>
          <dd className="text-right tabular-nums">{weekNumber}</dd>

          <dt className="text-zinc-400 dark:text-zinc-500">status</dt>
          <dd className="text-right text-red-600 dark:text-red-500">
            {status}
          </dd>
        </dl>

        <div className="h-px bg-zinc-950/80 dark:bg-red-700/80" />

        <p className="max-w-64 font-mono text-[10px]/relaxed text-zinc-500">
          {note}
        </p>
      </div>

      <div className="h-1 bg-red-600 dark:bg-red-700" />
    </>
  );
}
