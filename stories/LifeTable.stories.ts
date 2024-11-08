import type { Meta, StoryObj } from "@storybook/react";

import LifeTable from "../components/LifeTable";

// Suggestions for using Storybook 8.3.5:
// 1. Use the new Component Story Format (CSF) 3.0
// 2. Leverage improved TypeScript support
// 3. Utilize auto-generated controls
// 4. Implement story playback for interaction testing
// 5. Use the new Docs page for better documentation
// 6. Implement the new Storybook Addon API
// 7. Use improved performance features

const meta: Meta = {
  title: "Components/LifeTable",
  component: LifeTable,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    layout: "centered",
    // ... other parameters
  },
  // ... other meta properties
};

export default meta;

type Story = StoryObj<typeof meta>;

export const from: Story = {
  args: {
    dob: "1986-11-25",
  },
};
