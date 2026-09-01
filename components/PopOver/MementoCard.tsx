interface MementoCardProps {
  weekNumber: string;
  age: string;
  quote?: string;
  author?: string;
  milestone?: {
    title: string;
    date: string;
  };
  prompt?: string;
}

export function MementoCard({
  weekNumber,
  age,
  quote = "You have power over your mind — not outside events. Realize this, and you will find strength.",
  author = "EPICTETUS",
  milestone,
  prompt = "What will you do with this week?",
}: MementoCardProps) {
  return (
    <article className="w-[320px] rounded-3xl bg-zinc-950 p-6 font-sans text-white">
      {/* Week Header */}
      <div className="mb-3 flex items-center gap-x-2">
        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        <span className="text-xs tracking-[1.75px] text-amber-500 uppercase">
          {weekNumber}
        </span>
      </div>

      {/* Age */}
      <h1 className="font-serif text-[27px] leading-none tracking-[-0.03em]">
        {age}
      </h1>

      {/* Divider */}
      <div className="my-5 h-px bg-white/10" />

      {/* Stoic Reflection */}
      <section className="mb-5">
        <div className="mb-2.5 text-xs tracking-[1.5px] text-amber-500">
          STOIC REFLECTION
        </div>
        <blockquote className="relative pl-6 font-serif text-white/95 italic">
          <span className="pointer-events-none absolute top-[-2px] left-0 font-serif text-[40px] leading-none text-amber-500/35 select-none">
            "
          </span>
          <p className="text-[15px] leading-snug">{quote}</p>
          <cite className="mt-2 block text-xs font-medium tracking-wider text-amber-500 not-italic">
            - {author}
          </cite>
        </blockquote>
      </section>

      {milestone && (
        <>
          {/* Divider */}
          <div className="my-4 h-px bg-white/10" />

          {/* Milestone */}
          <section>
            <div className="mb-3 text-xs tracking-[1.5px] text-amber-500">
              MILESTONE
            </div>
            <div className="flex items-start gap-x-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-amber-500/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-amber-500"
                  viewBox="0 0 256 256"
                  aria-hidden="true"
                >
                  <title>Trophy</title>
                  <line
                    x1="96"
                    y1="224"
                    x2="160"
                    y2="224"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <line
                    x1="128"
                    y1="184"
                    x2="128"
                    y2="224"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <path
                    d="M58,128H48A32,32,0,0,1,16,96V80a8,8,0,0,1,8-8H56"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <path
                    d="M198,128h10a32,32,0,0,0,32-32V80a8,8,0,0,0-8-8H200"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <path
                    d="M56,48H200v63.1c0,39.7-31.75,72.6-71.45,72.9A72,72,0,0,1,56,112Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                </svg>
              </div>
              <div>
                <div className="font-serif text-[15px] leading-tight font-semibold">
                  {milestone.title}
                </div>
                <div className="mt-0.5 text-xs tracking-wide text-white/60">
                  {milestone.date}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Bottom Prompt */}
      <div className="mt-7 border-t border-white/10 pt-4">
        <p className="text-center text-[13px] tracking-wide text-white/70">
          {prompt}
        </p>
      </div>
    </article>
  );
}
