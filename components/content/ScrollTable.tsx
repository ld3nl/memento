const scrollTableClassName = [
  "@container -mx-4 my-10 overflow-x-auto overscroll-x-contain px-4",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  "sm:-mx-6 sm:px-6",
  "[&_table]:w-max [&_table]:min-w-full [&_table]:border-separate [&_table]:border-spacing-0 [&_table]:text-left [&_table]:text-sm",
  "[&_caption]:caption-top [&_caption]:sticky [&_caption]:left-0 [&_caption]:z-1 [&_caption]:mb-4 [&_caption]:w-[100cqi]",
  "[&_caption]:text-left [&_caption]:font-display [&_caption]:text-base [&_caption]:text-primary [&_caption]:italic",
  "[&_th]:border-border [&_th]:border-b-2 [&_th]:bg-surface [&_th]:py-3 [&_th]:pr-8",
  "[&_th]:font-display [&_th]:text-kicker [&_th]:font-semibold [&_th]:tracking-label",
  "[&_th]:whitespace-nowrap [&_th]:text-secondary [&_th]:uppercase",
  "[&_th:first-child]:sticky [&_th:first-child]:left-0 [&_th:first-child]:z-1",
  "[&_th:last-child]:pr-0",
  "[&_td]:border-border [&_td]:border-b [&_td]:bg-surface [&_td]:py-3 [&_td]:pr-8",
  "[&_td]:font-mono [&_td]:whitespace-nowrap [&_td]:text-primary [&_td]:tabular-nums",
  "[&_td:first-child]:sticky [&_td:first-child]:left-0 [&_td:first-child]:z-1",
  "[&_td:last-child]:pr-0",
  "[&_tbody_tr:hover_td]:bg-surface-raised",
  "[&_tbody_tr:hover_td:first-child]:bg-surface-raised",
].join(" ");

export function ScrollTable({ children }: { children: React.ReactNode }) {
  return (
    <section
      className={scrollTableClassName}
      aria-label="Scrollable table"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a wide table scrolls on its own, so the region needs a tab stop
      tabIndex={0}
    >
      {children}
    </section>
  );
}
