import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LessonController } from "./";
import { ChallengeData } from "@/types";

vi.mock("server-only", () => {
  return {};
});

vi.mock("next/navigation", () => {
  const useRouterMock = vi.fn();

  return {
    useRouter: useRouterMock,
  };
});

const challenges: ChallengeData[] = [
  {
    type: "gap-fill",
    translation: "Copy the value from R11 to R12",
    prompt: [
      {
        value: "mov",
        type: "operation",
        hint: "MOV Rm Rn: Copy value from Rm to Rn.",
      },
      {
        value: "r11",
        type: "register",
        hint: "Register r11",
      },
      {
        value: "r12",
        type: "register",
        hint: "Register r12",
      },
    ],
    choices: ["r11", "r13", "mach"],
    fillableIndex: 1,
    correctIndex: 0,
  },
  {
    type: "gap-fill",
    translation: "Copy the value from R0 to R11",
    prompt: [
      {
        value: "mov",
        type: "operation",
        hint: "MOV Rm Rn: Copy value from Rm to Rn.",
      },
      {
        value: "r0",
        type: "register",
        hint: "Register r0",
      },
      {
        value: "r11",
        type: "register",
        hint: "Register r11",
      },
    ],
    choices: ["r13", "r11", "r10"],
    fillableIndex: 2,
    correctIndex: 1,
  },
];

it("renders the lesson", () => {
  render(<LessonController lessonId={42} challenges={challenges} />);

  expect(screen.getByText("Fill the gap:")).toBeDefined();
  expect(screen.getByText("Copy the value from R11 to R12")).toBeDefined();
  expect(screen.getByRole("radio", { name: "r11" })).toBeDefined();
  expect(screen.getByRole("radio", { name: "r13" })).toBeDefined();
  expect(screen.getByRole("radio", { name: "mach" })).toBeDefined();
});
