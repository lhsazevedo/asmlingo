import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChoiceList } from "./ChoiceList";
import userEvent from "@testing-library/user-event";

it("renders the list of choices", () => {
  render(
    <ChoiceList
      choices={["mov", "nop", "mov.l"]}
      correctIndex={0}
      reveal={false}
    />,
  );

  expect(screen.getByRole("radiogroup")).toBeDefined();
  expect(screen.getAllByRole("radio")).toHaveLength(3);
  expect(screen.getAllByRole("radio").map((r) => r.ariaChecked)).not.toContain(
    "true",
  );
});

it("calls onChange when a choice is clicked", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();

  render(
    <ChoiceList
      choices={["mov", "nop", "mov.l"]}
      correctIndex={0}
      reveal={false}
      onChange={onChange}
    />,
  );

  await user.click(screen.getByText("mov.l"));
  expect(onChange).toBeCalledWith(2);

  await user.click(screen.getByText("mov"));
  expect(onChange).toBeCalledWith(0);
});

it("renders the selected choice", () => {
  render(
    <ChoiceList
      choices={["mov", "nop", "mov.l"]}
      correctIndex={0}
      reveal={false}
      value={1}
    />,
  );

  const selectedChoice = screen.getByText("nop");
  expect(selectedChoice.ariaChecked).toBe("true");
  expect(selectedChoice.className).toContain("selected");
});

it("reveals the correct choice", () => {
  render(
    <ChoiceList
      choices={["mov", "nop", "mov.l"]}
      correctIndex={0}
      reveal={true}
      value={0}
    />,
  );

  const correctChoice = screen.getByText("mov");
  expect(correctChoice.ariaChecked).toBe("true");
  expect(correctChoice.className).toContain("correct");
});

it("does not call onChange when a choice is clicked after reveal", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();

  render(
    <ChoiceList
      choices={["mov", "nop", "mov.l"]}
      correctIndex={0}
      reveal={true}
      value={0}
      onChange={onChange}
    />,
  );

  await user.click(screen.getByText("mov"));
  await user.click(screen.getByText("nop"));
  await user.click(screen.getByText("mov.l"));

  expect(onChange).not.toBeCalled();
});
