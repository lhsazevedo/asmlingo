import { Meta, StoryObj } from "@storybook/react";
import { WordBank } from './';

const meta = {
  title: "Lesson/WordBank",
  component: WordBank,
  tags: ["autodocs"],
} satisfies Meta<typeof WordBank>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    words: ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"],
    value: [],
    onChange: (value: number[]) => {},
  },
};
