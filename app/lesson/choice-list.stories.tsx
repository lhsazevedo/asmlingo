import { Meta, StoryObj } from "@storybook/react";
import { ChoiceList } from "./choice-list";

const meta = {
  title: "Lesson/Components/ChoiceList",
  component: ChoiceList,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "300px" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof ChoiceList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    choices: ["mov", "nop", "mov.l"],
    correctIndex: 0,
    reveal: false,
  },
};
