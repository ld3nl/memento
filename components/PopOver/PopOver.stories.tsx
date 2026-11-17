// components/PopOver/PopOver.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "../../styles/tokens.stylex";
import { Week } from "../Week/Week";
import Popover from "./";
import { MementoCard } from "./MementoCard";

const styles = stylex.create({
  row: {
    display: "flex",
    gap: "0.75rem",
  },
  yearGrid: {
    marginInline: "auto",
    display: "grid",
    width: "52rem",
    gridTemplateColumns: "repeat(52, minmax(0, 1fr))",
  },
  frame: {
    display: "grid",
    height: "37.5rem",
    width: "50rem",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gridTemplateRows: "repeat(3, minmax(0, 1fr))",
    gap: "1rem",
  },
  cell: {
    display: "flex",
  },
  alignStart: {
    alignItems: "flex-start",
  },
  alignCenter: {
    alignItems: "center",
  },
  alignEnd: {
    alignItems: "flex-end",
  },
  justifyStart: {
    justifyContent: "flex-start",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    padding: "2rem",
  },
  center: {
    textAlign: "center",
  },
  heading: {
    marginTop: 0,
    marginBottom: "1rem",
    fontSize: "1.125rem",
    lineHeight: "calc(1.75 / 1.125)",
    fontWeight: 700,
  },
  hint: {
    margin: 0,
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: tokens.secondary,
  },
  cluster: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  groups: {
    display: "flex",
    gap: "2rem",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
});

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
- **Smart positioning**: Uses position-try-order for space-based fallbacks
- Position options: auto (smart), or explicit (left_top, center_top, right_top, etc.)
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
    position: "auto",
    children: (
      <MementoCard weekNumber="WEEK 1,477" age="Age 28 years, 4 months" />
    ),
  },
};

export const WithMilestone: Story = {
  args: {
    label: "",
    children: (
      <MementoCard
        weekNumber="WEEK 1,477"
        age="Age 28 years, 4 months"
        milestone={{
          title: "Graduated University",
          date: "June 10, 2017",
        }}
      />
    ),
  },
};

export const WithCustomQuote: Story = {
  args: {
    label: "",
    children: (
      <MementoCard
        weekNumber="WEEK 1,880"
        age="Age 36 years, 1 month"
        quote="The impediment to action advances action. What stands in the way becomes the way."
        author="MARCUS AURELIUS"
      />
    ),
  },
};

export const MultipleWeeks: Story = {
  args: { label: "", children: null },
  render: () => (
    <div {...stylex.props(styles.row)}>
      <Popover label="">
        <MementoCard weekNumber="WEEK 1,164" age="Age 22 years, 4 months" />
      </Popover>

      <Popover label="">
        <MementoCard
          weekNumber="WEEK 1,960"
          age="Age 37 years, 8 months"
          milestone={{
            title: "Started New Career",
            date: "July 22, 2005",
          }}
        />
      </Popover>

      <Popover label="">
        <MementoCard weekNumber="WEEK 2,498" age="Age 48 years, 0 months" />
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
  args: { label: "", children: null },
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
          weekNumber: "WEEK 2,347",
          age: "Age 45 years, 1 month",
          milestone: {
            title: "Started new job",
            date: "February 5, 1990",
          },
        },
      ],
      [
        18,
        {
          weekNumber: "WEEK 2,360",
          age: "Age 45 years, 4 months",
          milestone: {
            title: "Met someone special",
            date: "May 7, 1990",
          },
        },
      ],
      [
        34,
        {
          weekNumber: "WEEK 2,376",
          age: "Age 45 years, 8 months",
          milestone: {
            title: "Vacation planned",
            date: "August 27, 1990",
          },
        },
      ],
      [
        45,
        {
          weekNumber: "WEEK 2,387",
          age: "Age 45 years, 10 months",
          milestone: {
            title: "Big presentation",
            date: "November 12, 1990",
          },
        },
      ],
    ]);

    return (
      <div data-cy="year-grid" {...stylex.props(styles.yearGrid)}>
        {weeks.map(weekIndex => {
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
                  weekNumber={milestone.weekNumber}
                  age={milestone.age}
                  milestone={milestone.milestone}
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
  args: { label: "", children: null },
  render: () => (
    <div {...stylex.props(styles.frame)}>
      <div
        {...stylex.props(styles.cell, styles.alignStart, styles.justifyStart)}
      >
        <Popover label="" position="right_bottom">
          <MementoCard weekNumber="WEEK 1" age="Age 0 years, 0 months" />
        </Popover>
      </div>
      <div
        {...stylex.props(styles.cell, styles.alignStart, styles.justifyCenter)}
      >
        <Popover label="" position="center_bottom">
          <MementoCard weekNumber="WEEK 261" age="Age 5 years, 0 months" />
        </Popover>
      </div>
      <div {...stylex.props(styles.cell, styles.alignStart, styles.justifyEnd)}>
        <Popover label="" position="left_bottom">
          <MementoCard weekNumber="WEEK 521" age="Age 10 years, 0 months" />
        </Popover>
      </div>

      <div
        {...stylex.props(styles.cell, styles.alignCenter, styles.justifyStart)}
      >
        <Popover label="" position="right_center">
          <MementoCard weekNumber="WEEK 781" age="Age 15 years, 0 months" />
        </Popover>
      </div>
      <div
        {...stylex.props(styles.cell, styles.alignCenter, styles.justifyCenter)}
      >
        <Popover label="" position="right_center">
          <MementoCard weekNumber="WEEK 1,041" age="Age 20 years, 0 months" />
        </Popover>
      </div>
      <div
        {...stylex.props(styles.cell, styles.alignCenter, styles.justifyEnd)}
      >
        <Popover label="" position="left_center">
          <MementoCard weekNumber="WEEK 1,301" age="Age 25 years, 0 months" />
        </Popover>
      </div>

      <div {...stylex.props(styles.cell, styles.alignEnd, styles.justifyStart)}>
        <Popover label="" position="right_top">
          <MementoCard weekNumber="WEEK 1,561" age="Age 30 years, 0 months" />
        </Popover>
      </div>
      <div
        {...stylex.props(styles.cell, styles.alignEnd, styles.justifyCenter)}
      >
        <Popover label="" position="center_top">
          <MementoCard weekNumber="WEEK 1,821" age="Age 35 years, 0 months" />
        </Popover>
      </div>
      <div {...stylex.props(styles.cell, styles.alignEnd, styles.justifyEnd)}>
        <Popover label="" position="left_top">
          <MementoCard weekNumber="WEEK 2,081" age="Age 40 years, 0 months" />
        </Popover>
      </div>
    </div>
  ),
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Tests all 9 position options at screen edges. Trigger week stays visible.",
      },
    },
  },
};

export const AllPositions: Story = {
  args: { label: "", children: null },
  render: () => (
    <div {...stylex.props(styles.stack)}>
      <div {...stylex.props(styles.center)}>
        <h2 {...stylex.props(styles.heading)}>All 9 Position Options</h2>
        <p {...stylex.props(styles.hint)}>
          Click each week to test positioning. Trigger stays visible.
        </p>
      </div>

      <div {...stylex.props(styles.cluster)}>
        <div {...stylex.props(styles.groups)}>
          <div {...stylex.props(styles.column)}>
            <Popover label="" position="left_top">
              <MementoCard weekNumber="WEEK 100" age="Age 1 year, 11 months" />
            </Popover>
            <Popover label="" position="left_center">
              <MementoCard weekNumber="WEEK 200" age="Age 3 years, 10 months" />
            </Popover>
            <Popover label="" position="left_bottom">
              <MementoCard weekNumber="WEEK 300" age="Age 5 years, 9 months" />
            </Popover>
          </div>

          <div {...stylex.props(styles.column)}>
            <Popover label="" position="center_top">
              <MementoCard weekNumber="WEEK 400" age="Age 7 years, 8 months" />
            </Popover>
            <Popover label="" position="center_center">
              <MementoCard weekNumber="WEEK 500" age="Age 9 years, 7 months" />
            </Popover>
            <Popover label="" position="center_bottom">
              <MementoCard weekNumber="WEEK 600" age="Age 11 years, 6 months" />
            </Popover>
          </div>

          <div {...stylex.props(styles.column)}>
            <Popover label="" position="right_top">
              <MementoCard weekNumber="WEEK 700" age="Age 13 years, 5 months" />
            </Popover>
            <Popover label="" position="right_center">
              <MementoCard weekNumber="WEEK 800" age="Age 15 years, 4 months" />
            </Popover>
            <Popover label="" position="right_bottom">
              <MementoCard weekNumber="WEEK 900" age="Age 17 years, 3 months" />
            </Popover>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Comprehensive test of all 9 position options in a centered layout.",
      },
    },
  },
};

export const AutoPositioning: Story = {
  args: { label: "", children: null },
  render: () => (
    <div {...stylex.props(styles.frame)}>
      <div
        {...stylex.props(styles.cell, styles.alignStart, styles.justifyStart)}
      >
        <Popover label="" position="auto">
          <MementoCard weekNumber="WEEK 1" age="Age 0 years, 0 months" />
        </Popover>
      </div>
      <div
        {...stylex.props(styles.cell, styles.alignStart, styles.justifyCenter)}
      >
        <Popover label="" position="auto">
          <MementoCard weekNumber="WEEK 261" age="Age 5 years, 0 months" />
        </Popover>
      </div>
      <div {...stylex.props(styles.cell, styles.alignStart, styles.justifyEnd)}>
        <Popover label="" position="auto">
          <MementoCard weekNumber="WEEK 521" age="Age 10 years, 0 months" />
        </Popover>
      </div>

      <div
        {...stylex.props(styles.cell, styles.alignCenter, styles.justifyStart)}
      >
        <Popover label="" position="auto">
          <MementoCard weekNumber="WEEK 781" age="Age 15 years, 0 months" />
        </Popover>
      </div>
      <div
        {...stylex.props(styles.cell, styles.alignCenter, styles.justifyCenter)}
      >
        <Popover label="" position="auto">
          <MementoCard weekNumber="WEEK 1,041" age="Age 20 years, 0 months" />
        </Popover>
      </div>
      <div
        {...stylex.props(styles.cell, styles.alignCenter, styles.justifyEnd)}
      >
        <Popover label="" position="auto">
          <MementoCard weekNumber="WEEK 1,301" age="Age 25 years, 0 months" />
        </Popover>
      </div>

      <div {...stylex.props(styles.cell, styles.alignEnd, styles.justifyStart)}>
        <Popover label="" position="auto">
          <MementoCard weekNumber="WEEK 1,561" age="Age 30 years, 0 months" />
        </Popover>
      </div>
      <div
        {...stylex.props(styles.cell, styles.alignEnd, styles.justifyCenter)}
      >
        <Popover label="" position="auto">
          <MementoCard weekNumber="WEEK 1,821" age="Age 35 years, 0 months" />
        </Popover>
      </div>
      <div {...stylex.props(styles.cell, styles.alignEnd, styles.justifyEnd)}>
        <Popover label="" position="auto">
          <MementoCard weekNumber="WEEK 2,081" age="Age 40 years, 0 months" />
        </Popover>
      </div>
    </div>
  ),
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Tests automatic viewport-aware positioning. Default: right-center. Fallbacks: left, top, bottom. Uses position-try-order: most-width to choose position with most horizontal space available.",
      },
    },
  },
};
