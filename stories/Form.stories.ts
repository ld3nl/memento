import type { Meta, StoryObj } from "@storybook/react";

import Form from "../components/Form";

const meta = {
  title: "Components/Form",
  component: Form,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const from: Story = {
  args: {},
};
