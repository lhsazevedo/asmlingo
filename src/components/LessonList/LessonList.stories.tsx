import { Meta, StoryObj } from "@storybook/react";
import { LessonList } from './';

const meta = {
  title: "UI/LessonList",
  component: LessonList,
  tags: ["autodocs"],
} satisfies Meta<typeof LessonList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add your props here
  },
};
