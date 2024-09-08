import { Meta, StoryObj } from "@storybook/react";
import { GapFillChallenge } from "./";

const meta = {
  title: "Lesson/Challenges/GapFillChallenge",
  component: GapFillChallenge,
  tags: ["autodocs"],
} satisfies Meta<typeof GapFillChallenge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    translation: "Copy the value from R0 to R4",
    prompt: [
      {
        value: "mov",
        type: "operation",
        hint: "MOV Rm Rn: Copy value from Rm to Rn.",
      },
      { value: "r0", type: "register", hint: "Register r0" },
      { value: "r4", type: "register", hint: "Register r4" },
    ],
    choices: ["nop", "mov.l", "mov"],
    fillableIndex: 0,
    correctIndex: 2,
  },
};

// export const Selected: Story = {
//   args: {
//     tokens: [
//       {
//         value: "mov",
//         type: "operation",
//         hint: "MOV Rm Rn: Copy value from Rm to Rn.",
//       },
//       { value: "r0", type: "register", hint: "Register r0" },
//       { value: "r4", type: "register", hint: "Register r4" },
//     ],
//     fillableIndex: 0,
//     filledPrompt: "shll",
//   },
// };

// export const ReadOnly: Story = {
//   args: {
//     tokens: [
//       {
//         value: "mov",
//         type: "operation",
//         hint: "MOV Rm Rn: Copy value from Rm to Rn.",
//       },
//       { value: "r0", type: "register", hint: "Register r0" },
//       { value: "r4", type: "register", hint: "Register r4" },
//     ],
//   },
// };

// export const Correct: Story = {
//   args: {
//     state: ChoiceListItemState.Correct,
//   },
// };

// export const Wrong: Story = {
//   args: {
//     state: ChoiceListItemState.Wrong,
//   },
// };
