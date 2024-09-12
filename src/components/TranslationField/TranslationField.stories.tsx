import { Meta, StoryObj } from "@storybook/react";
import { TranslationField } from './';

const meta = {
  title: "Lesson/TranslationField",
  component: TranslationField,
  tags: ["autodocs"],
} satisfies Meta<typeof TranslationField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    words: ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"],
    readonly: false,
    onClick: (index: number) => {},
  },
};
