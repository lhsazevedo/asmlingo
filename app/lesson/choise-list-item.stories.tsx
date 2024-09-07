import { Meta, StoryObj } from "@storybook/react";
import { ChoiceListItem, ChoiceListItemState } from "./choise-list-item";

const meta = {
  title: "Lesson/Components/ChoiceListItem",
  component: ChoiceListItem,
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: Object.values(ChoiceListItemState),
    },
  },
  args: {
    children: "Choose me!",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ChoiceListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    state: ChoiceListItemState.Normal,
  },
};

export const Selected: Story = {
  args: {
    state: ChoiceListItemState.Selected,
  },
};

export const Correct: Story = {
  args: {
    state: ChoiceListItemState.Correct,
  },
};

export const Wrong: Story = {
  args: {
    state: ChoiceListItemState.Wrong,
  },
};
