import { Meta, StoryObj } from "@storybook/react";
import { TranslationArea } from './';

const meta = {
  title: "Lesson/TranslationArea",
  component: TranslationArea,
  tags: ["autodocs"],
  args: {
    words: ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"],
  }
} satisfies Meta<typeof TranslationArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
};
