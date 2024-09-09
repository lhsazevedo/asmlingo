import { Meta, StoryObj } from "@storybook/react";
import { LessonButton } from './';

const meta = {
  title: "UI/LessonButton",
  component: LessonButton,
  tags: ["autodocs"],
} satisfies Meta<typeof LessonButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
  },
};

export const Current: Story = {
  args: {
    variant: "current",
  },
};

export const disabled: Story = {
  args: {
    variant: "disabled",
  }
};
