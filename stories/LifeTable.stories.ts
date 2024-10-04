import type { Meta, StoryObj } from "@storybook/react";

import LifeTable from "../components/LifeTable";

const meta = {
  title: "Components/LifeTable",
  component: LifeTable,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const from: Story = {
  args: {
    dob: "1986-11-25",  
  },
};
