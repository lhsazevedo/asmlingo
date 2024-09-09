import { Meta, StoryObj } from "@storybook/react";
import { PromptBox } from "./PromptBox";

const meta = {
  title: "Lesson/PromptBox",
  component: PromptBox,
  tags: ["autodocs"],
} satisfies Meta<typeof PromptBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tokens: [
      {
        value: "mov",
        type: "operation",
        hint: "MOV Rm Rn: Copy value from Rm to Rn.",
      },
      { value: "r0", type: "register", hint: "Register r0" },
      { value: "r4", type: "register", hint: "Register r4" },
    ],
    fillableIndex: 0,
  },
};

export const Selected: Story = {
  args: {
    tokens: [
      {
        value: "mov",
        type: "operation",
        hint: "MOV Rm Rn: Copy value from Rm to Rn.",
      },
      { value: "r0", type: "register", hint: "Register r0" },
      { value: "r4", type: "register", hint: "Register r4" },
    ],
    fillableIndex: 0,
    filledPrompt: "shll",
  },
};

export const ReadOnly: Story = {
  args: {
    tokens: [
      {
        value: "mov",
        type: "operation",
        hint: "MOV Rm Rn: Copy value from Rm to Rn.",
      },
      { value: "r0", type: "register", hint: "Register r0" },
      { value: "r4", type: "register", hint: "Register r4" },
    ],
  },
};

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
