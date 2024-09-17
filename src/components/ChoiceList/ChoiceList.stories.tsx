import { Meta, StoryObj } from "@storybook/react";
import { ChoiceList, ChoiceListProps } from "./ChoiceList";
// import { userEvent, within } from "@storybook/test";
import { useArgs } from "@storybook/preview-api";

const meta = {
  title: "Lesson/ChoiceList",
  component: ChoiceList,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "300px" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  parameters: { docs: { story: { autoplay: true } } },
  render(args) {
    const [{ value }, updateArgs] = useArgs<ChoiceListProps>();

    return (
      <ChoiceList
        {...args}
        value={value}
        onChange={(newValue) => updateArgs({ value: newValue })}
      />
    );
  },
} satisfies Meta<typeof ChoiceList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    choices: ["mov", "nop", "mov.l"],
    correctIndex: 0,
    reveal: false,
    value: undefined,
  },
};

export const Selected: Story = {
  args: {
    choices: ["mov", "nop", "mov.l"],
    correctIndex: 0,
    reveal: false,
    value: 0,
  },
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);

  //   await userEvent.click(canvas.getByText("mov"));
  // },
};

export const Correct: Story = {
  args: {
    choices: ["mov", "nop", "mov.l"],
    correctIndex: 0,
    reveal: true,
    value: 0,
  },
};

export const Wrong: Story = {
  args: {
    choices: ["mov", "nop", "mov.l"],
    correctIndex: 0,
    reveal: true,
    value: 1,
  },
};
