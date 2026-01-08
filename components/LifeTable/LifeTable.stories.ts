import type { Meta, StoryObj } from "@storybook/nextjs";
import { LifeTable } from "./LifeTable";

const meta: Meta<typeof LifeTable> = {
  title: "Components/LifeTable",
  component: LifeTable,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    dob: {
      control: "text",
      description: "Date of birth in YYYY-MM-DD format",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dob: "1986-11-25",
  },
};

export const YoungPerson: Story = {
  args: {
    dob: "2010-06-15",
  },
};

export const MiddleAged: Story = {
  args: {
    dob: "1975-03-20",
  },
};
