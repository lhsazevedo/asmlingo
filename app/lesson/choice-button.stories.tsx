import { Meta, StoryObj } from "@storybook/react";
import { ChoiceButton, ChoiceButtonState } from "./choice-button";

const meta = {
    title: 'Lesson/Components/ChoiceButton',
    component: ChoiceButton,
    tags: ['autodocs'],
    argTypes: {
      state: {
        control: 'select',
        options: Object.values(ChoiceButtonState),
      },
    },
    args: {
      children: "Choose me!"
    },
    parameters: {
      layout: 'centered',
    },
} satisfies Meta<typeof ChoiceButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    state: ChoiceButtonState.Normal,
  }
}

export const Selected: Story = {
  args: {
    state: ChoiceButtonState.Selected,
  }
}

export const Correct: Story = {
  args: {
    state: ChoiceButtonState.Correct,
  }
}

export const Wrong: Story = {
  args: {
    state: ChoiceButtonState.Wrong,
  }
}
