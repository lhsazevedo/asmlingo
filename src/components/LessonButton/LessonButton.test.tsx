import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LessonButton } from "./";

it("accepts button attributes", () => {
  render(<LessonButton variant="default" aria-labelledby="label" />);

  expect(screen.getByRole("button").getAttribute("aria-labelledby")).toBe(
    "label",
  );
});
