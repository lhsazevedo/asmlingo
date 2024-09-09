import { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["primary", "secondary"],
      control: { type: "select" },
    },
  },
  args: {
    children: "Choose me!",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

// export const Selected: Story = {
//   args: {
//     state: ButtonState.Selected,
//   },
// };

// export const Correct: Story = {
//   args: {
//     state: ButtonState.Correct,
//   },
// };

// export const Wrong: Story = {
//   args: {
//     state: ButtonState.Wrong,
//   },
// };
