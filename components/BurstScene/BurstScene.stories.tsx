import type { Meta, StoryObj } from "@storybook/nextjs";
import { BurstScene } from "./BurstScene";

const meta: Meta<typeof BurstScene> = {
  title: "Components/BurstScene",
  component: BurstScene,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    dob: {
      control: "text",
      description: "Date of birth in YYYY-MM-DD format",
    },
    totalWeeks: {
      control: { type: "number", min: 100, max: 5000 },
      description: "Total weeks to display",
    },
    shape: {
      control: "select",
      options: ["square", "circle"],
      description: "Shape of each item",
    },
    itemSizeRem: {
      control: { type: "number", min: 0.1, max: 2, step: 0.1 },
      description: "Base item size in rem at 1440px viewport",
    },
    itemSpacingRem: {
      control: { type: "number", min: 0.1, max: 2, step: 0.1 },
      description: "Base spacing in rem at 1440px viewport",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dob: "1986-11-25",
  },
};

export const CircleShape: Story = {
  args: {
    dob: "1986-11-25",
    shape: "circle",
  },
};

export const LargeItems: Story = {
  args: {
    dob: "1986-11-25",
    itemSizeRem: 1,
    itemSpacingRem: 0.75,
  },
};

export const SmallItems: Story = {
  args: {
    dob: "1986-11-25",
    itemSizeRem: 0.25,
    itemSpacingRem: 0.25,
  },
};

export const YoungPerson: Story = {
  args: {
    dob: "2010-06-15",
  },
};
