import type { StoryObj } from "@storybook/react";

import Page from "../app/page";

const meta = {
  title: "Components/Form",
  component: Page,
  parameters: {
    nextjs: {
      appDirectory: true, // 👈 Set this
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const from: Story = {
  args: {},
};
