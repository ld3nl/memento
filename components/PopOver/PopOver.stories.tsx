// components/PopOver/PopOver.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Week } from "../Week/Week";
import Popover from "./";
import { MementoCard } from "./MementoCard";

const meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["auto", "manual"],
      description: "Native HTML popover mode",
    },
    action: {
      control: "select",
      options: ["toggle", "show", "hide"],
    },
    className: { control: "text" },
    triggerClassName: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component: `
Production-ready Popover for Memento Mori using native Popover API + CSS Anchor Positioning.

**Key features:**
- Memento gothic dark theme with blood crimson accents
- Supports \`mode\` ("auto" | "manual") and \`action\`
- Unique anchor names per instance (multiple popovers supported)
- Full accessibility (aria-expanded, focus management, keyboard)
- Callbacks: onBeforeToggle / onToggle
- Position fallbacks: right → left → bottom → top
        `,
      },
    },
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#09090b" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "",
    children: (
      <MementoCard
        date="17 Dec 1987"
        dateLabel="1987.12.17"
        weekNumber="№ 1 042"
        status="remembered"
      />
    ),
  },
};

export const WithCustomNote: Story = {
  args: {
    label: "",
    children: (
      <MementoCard
        date="25 Dec 2020"
        dateLabel="2020.12.25"
        weekNumber="№ 1 724"
        status="remembered"
        note="A pivotal moment. Some weeks hold more weight than others—a reminder to mark what matters."
      />
    ),
  },
};

export const ManualMode: Story = {
  args: {
    mode: "manual",
    label: "",
    children: (
      <MementoCard
        date="1 Jan 2024"
        dateLabel="2024.01.01"
        weekNumber="№ 1 880"
        status="forgotten"
        note="Manual mode: does not close on outside click. Requires explicit dismiss."
      />
    ),
  },
};

export const MultipleWeeks: Story = {
  render: () => (
    <div className="flex gap-3">
      <Popover label="">
        <MementoCard
          date="15 Mar 1990"
          dateLabel="1990.03.15"
          weekNumber="№ 1 164"
          status="remembered"
        />
      </Popover>

      <Popover label="">
        <MementoCard
          date="22 Jul 2005"
          dateLabel="2005.07.22"
          weekNumber="№ 1 960"
          status="remembered"
          note="Multiple popovers can coexist. Each has a unique anchor."
        />
      </Popover>

      <Popover label="">
        <MementoCard
          date="8 Nov 2015"
          dateLabel="2015.11.08"
          weekNumber="№ 2 498"
          status="forgotten"
        />
      </Popover>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Demonstrates multiple week markers with unique anchor positioning.",
      },
    },
  },
};

export const MilestoneYearWithEvents: Story = {
  render: () => {
    // Milestone year: year 50, with 26 weeks completed, currently on week 27 day 4
    const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
    const currentDecadeYear = 50;
    const weeksFromLastBday = 26;
    const daysIntoCurrentWeek = 4;

    // Define milestone events at specific weeks (past and future)
    const milestoneEvents = new Map([
      [
        5,
        {
          date: "5 Feb 1990",
          dateLabel: "1990.02.05",
          weekNumber: "№ 2 347",
          note: "Started new job. A turning point.",
        },
      ],
      [
        18,
        {
          date: "7 May 1990",
          dateLabel: "1990.05.07",
          weekNumber: "№ 2 360",
          note: "Met someone special.",
        },
      ],
      [
        34,
        {
          date: "27 Aug 1990",
          dateLabel: "1990.08.27",
          weekNumber: "№ 2 376",
          note: "Vacation planned. A future moment to anticipate.",
        },
      ],
      [
        45,
        {
          date: "12 Nov 1990",
          dateLabel: "1990.11.12",
          weekNumber: "№ 2 387",
          note: "Big presentation scheduled. Preparing now.",
        },
      ],
    ]);

    return (
      <div data-cy="year-grid" className="mx-auto grid w-208 grid-cols-52">
        {weeks.map((weekIndex) => {
          const isFilled = weekIndex <= weeksFromLastBday;
          const isCurrentWeek = weekIndex === weeksFromLastBday + 1;
          // Year 50 is milestone (divisible by 5), show label at week 52
          const showYearLabel = weekIndex === 52 && currentDecadeYear % 5 === 0;
          const milestone = milestoneEvents.get(weekIndex);

          // If this week has a milestone event, wrap it in a popover
          if (milestone) {
            return (
              <Popover
                key={weekIndex}
                label=""
                weekIndex={weekIndex}
                isFilled={isFilled}
              >
                <MementoCard
                  date={milestone.date}
                  dateLabel={milestone.dateLabel}
                  weekNumber={milestone.weekNumber}
                  status={isFilled ? "remembered" : "forgotten"}
                  note={milestone.note}
                />
              </Popover>
            );
          }

          // Regular week without milestone
          return (
            <Week
              key={weekIndex}
              weekIndex={weekIndex}
              isFilled={isFilled}
              isCurrentWeek={isCurrentWeek}
              currentDayOfWeek={isCurrentWeek ? daysIntoCurrentWeek : undefined}
              {...(showYearLabel ? { yearsAlive: `${currentDecadeYear}` } : {})}
            />
          );
        })}
      </div>
    );
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Milestone year (50) with notable events. Past events (filled) and future events (border only) at weeks 5, 18, 34, and 45.",
      },
    },
  },
};

export const EdgePositioning: Story = {
  render: () => (
    <div className="grid h-[600px] w-[800px] grid-cols-3 grid-rows-3 gap-4">
      {/* Top row */}
      <div className="flex items-start justify-start">
        <Popover label="">
          <MementoCard
            date="1 Jan 1980"
            dateLabel="1980.01.01"
            weekNumber="№ 1"
            status="remembered"
          />
        </Popover>
      </div>
      <div className="flex items-start justify-center">
        <Popover label="">
          <MementoCard
            date="1 Jan 1985"
            dateLabel="1985.01.01"
            weekNumber="№ 261"
            status="remembered"
          />
        </Popover>
      </div>
      <div className="flex items-start justify-end">
        <Popover label="">
          <MementoCard
            date="1 Jan 1990"
            dateLabel="1990.01.01"
            weekNumber="№ 521"
            status="remembered"
          />
        </Popover>
      </div>

      {/* Middle row */}
      <div className="flex items-center justify-start">
        <Popover label="">
          <MementoCard
            date="1 Jan 1995"
            dateLabel="1995.01.01"
            weekNumber="№ 781"
            status="remembered"
          />
        </Popover>
      </div>
      <div className="flex items-center justify-center">
        <Popover label="">
          <MementoCard
            date="1 Jan 2000"
            dateLabel="2000.01.01"
            weekNumber="№ 1 041"
            status="remembered"
          />
        </Popover>
      </div>
      <div className="flex items-center justify-end">
        <Popover label="">
          <MementoCard
            date="1 Jan 2005"
            dateLabel="2005.01.01"
            weekNumber="№ 1 301"
            status="remembered"
          />
        </Popover>
      </div>

      {/* Bottom row */}
      <div className="flex items-end justify-start">
        <Popover label="">
          <MementoCard
            date="1 Jan 2010"
            dateLabel="2010.01.01"
            weekNumber="№ 1 561"
            status="remembered"
          />
        </Popover>
      </div>
      <div className="flex items-end justify-center">
        <Popover label="">
          <MementoCard
            date="1 Jan 2015"
            dateLabel="2015.01.01"
            weekNumber="№ 1 821"
            status="remembered"
          />
        </Popover>
      </div>
      <div className="flex items-end justify-end">
        <Popover label="">
          <MementoCard
            date="1 Jan 2020"
            dateLabel="2020.01.01"
            weekNumber="№ 2 081"
            status="remembered"
          />
        </Popover>
      </div>
    </div>
  ),
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Tests automatic position fallbacks at screen edges (right → left → bottom → top).",
      },
    },
  },
};
