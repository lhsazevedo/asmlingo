import { Meta, StoryObj } from "@storybook/react";
import { TranslateChallenge } from ".";
import { useArgs } from "storybook/internal/preview-api";

const meta = {
  title: "Lesson/Challenges/TranslateChallenge",
  component: TranslateChallenge,
  tags: ["autodocs"],
  render(args) {
    const [{ value }, updateArgs] = useArgs();

    return (
      <TranslateChallenge
        {...args}
        value={value}
        onChange={(v: number) => updateArgs({ value: v })}
      />
    );
  },
} satisfies Meta<typeof TranslateChallenge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    challengeData: {
      type: "translate",
      prompt: [
        {
          value: "mov",
          type: "operation",
          hint: "MOV Rm Rn: Copy value from Rm to Rn.",
        },
        { value: "r0", type: "register", hint: "Register r0" },
        { value: "r4", type: "register", hint: "Register r4" },
      ],
      words: ["The", "Copy", "r4", "dog", "value", "r0", "from", "to", "lazy" ],
      correctIndexes: [1, 4, 6, 5, 7, 2],
    },
    value: undefined,
    revealed: false,
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
//     state: ButtonState.Correct,
//   },
// };

// export const Wrong: Story = {
//   args: {
//     state: ButtonState.Wrong,
//   },
// };
