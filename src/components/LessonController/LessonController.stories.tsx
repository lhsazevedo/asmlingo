import { Meta, StoryObj } from "@storybook/react";
import { LessonController } from './';
import { ChallengeData } from "@/types";

const meta = {
  title: "Lesson/LessonController",
  component: LessonController,
  tags: ["autodocs"],
} satisfies Meta<typeof LessonController>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    challenges: [
      {
        type: "gap-fill",
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
      {
        type: "gap-fill",
        translation: "Copy the value from R8 to R0",
        prompt: [
          {
            value: "mov",
            type: "operation",
            hint: "MOV Rm Rn: Copy value from Rm to Rn.",
          },
          { value: "r8", type: "register", hint: "Register r0" },
          { value: "r0", type: "register", hint: "Register r4" },
        ],
        choices: ["r8", "r0", "fr0"],
        fillableIndex: 2,
        correctIndex: 1,
      },
    ],
  },
};
