import { Meta, StoryObj } from "@storybook/react";
import { TokenButton } from './';

const meta = {
  title: "Lesson/TokenButton",
  component: TokenButton,
  tags: ["autodocs"],
  args: {
    children: "Token",
  },
} satisfies Meta<typeof TokenButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
};
