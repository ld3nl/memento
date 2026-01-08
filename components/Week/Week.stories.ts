import type { Meta, StoryObj } from "@storybook/nextjs";
import { Week } from "./Week";

const meta: Meta<typeof Week> = {
  title: "Components/Week",
  component: Week,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    weekIndex: {
      control: { type: "number", min: 1, max: 52 },
      description: "Week number (1-52)",
    },
    isFilled: {
      control: "boolean",
      description: "Whether the week has been lived",
    },
    isCurrentWeek: {
      control: "boolean",
      description: "Whether this is the current week",
    },
    currentDayOfWeek: {
      control: { type: "number", min: 1, max: 7 },
      description: "Day within current week (1-7)",
    },
    yearsAlive: {
      control: "text",
      description: "Year label to display",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    weekIndex: 1,
    isFilled: false,
  },
};

export const Filled: Story = {
  args: {
    weekIndex: 1,
    isFilled: true,
  },
};

export const CurrentWeek: Story = {
  args: {
    weekIndex: 10,
    isFilled: false,
    isCurrentWeek: true,
    currentDayOfWeek: 4,
  },
};

export const WithYearLabel: Story = {
  args: {
    weekIndex: 52,
    isFilled: true,
    yearsAlive: "25",
  },
};

export const RightAligned: Story = {
  args: {
    weekIndex: 30,
    isFilled: false,
  },
};
