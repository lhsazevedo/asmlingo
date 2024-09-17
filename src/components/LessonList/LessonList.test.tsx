import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LessonList } from "./";

vi.mock("next/navigation", () => {
  const useRouterMock = vi.fn();

  return {
    useRouter: useRouterMock,
  };
});

it("renders the list of lessons", () => {
  render(
    <LessonList
      units={[
        {
          id: 1,
          order: 0,
          title: "Unit 1",
          lessons: [
            {
              id: 1,
              title: "Lesson 1",
              description: "Description 1",
              challenges: "",
              unitId: 1,
              order: 0,
            },
            {
              id: 2,
              title: "Lesson 2",
              description: "Description 2",
              challenges: "",
              unitId: 1,
              order: 1,
            },
          ],
        },
      ]}
    />,
  );

  expect(screen.getByText("Unit 1: Unit 1")).toBeDefined();
  expect(screen.getByText("Lesson 1")).toBeDefined();
  expect(screen.getByText("Lesson 1")).toBeDefined();
});

it("renders completed, current and disabled lessons", () => {
  render(
    <LessonList
      currentLessonId={2}
      units={[
        {
          id: 1,
          order: 0,
          title: "Unit 1",
          lessons: [
            {
              id: 1,
              title: "Lesson 1",
              description: "Description 1",
              challenges: "",
              unitId: 1,
              order: 0,
              isFinished: true,
              isCurrent: false,
            },
            {
              id: 2,
              title: "Lesson 2",
              description: "Description 2",
              challenges: "",
              unitId: 1,
              order: 1,
              isFinished: false,
              isCurrent: true,
            },
            {
              id: 3,
              title: "Lesson 3",
              description: "Description 3",
              challenges: "",
              unitId: 1,
              order: 2,
              isFinished: false,
              isCurrent: false,
            },
          ],
        },
      ]}
    />,
  );

  const lesson1Button = screen.getByRole("button", { name: "Lesson 1" });
  const lesson1Parent = lesson1Button.parentElement;
  expect(lesson1Button).toBeDefined();
  expect(lesson1Parent).toBeDefined();
  expect(lesson1Parent?.className).toContain("default");

  const lesson2Button = screen.getByRole("button", { name: "Lesson 2" });
  const lesson2Parent = lesson2Button.parentElement;
  expect(lesson2Button).toBeDefined();
  expect(lesson2Parent).toBeDefined();
  expect(lesson2Parent?.className).toContain("current");

  const lesson3Button = screen.getByRole("button", { name: "Lesson 3" });
  expect(lesson3Button.hasAttribute("disabled")).toBe(true);
  const lesson3Parent = lesson3Button.parentElement;
  expect(lesson3Button).toBeDefined();
  expect(lesson3Parent).toBeDefined();
  expect(lesson3Parent?.className).toContain("disabled");
});
