import { Meta, StoryObj } from "@storybook/react";
import { LessonList } from "./";

const meta = {
  title: "UI/LessonList",
  component: LessonList,
  tags: ["autodocs"],
} satisfies Meta<typeof LessonList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleUnit: Story = {
  args: {
    units: [
      {
        id: 1,
        order: 0,
        title: "Unit 1",
        unitProgress: [],
        lessons: [
          {
            id: 1,
            title: "Lesson 1",
            description: "Description 1",
            challenges: "",
            unitId: 1,
            order: 0,
            lessonProgress: [],
          },
          {
            id: 2,
            title: "Lesson 2",
            description: "Description 2",
            challenges: "",
            unitId: 1,
            order: 1,
            lessonProgress: [],
          },
        ],
      },
    ]
  },
};

export const MultiUnit: Story = {
  args: {
    units: [
      {
        id: 1,
        order: 0,
        title: "Unit 1",
        unitProgress: [],
        lessons: [
          {
            id: 1,
            title: "Lesson 1",
            description: "Description 1",
            challenges: "",
            unitId: 1,
            order: 0,
            lessonProgress: [],
          },
          {
            id: 2,
            title: "Lesson 2",
            description: "Description 2",
            challenges: "",
            unitId: 1,
            order: 1,
            lessonProgress: [],
          },
        ],
      },
      {
        id: 2,
        order: 1,
        title: "Unit 2",
        unitProgress: [],
        lessons: [
          {
            id: 3,
            title: "Lesson 3",
            description: "Description 3",
            challenges: "",
            unitId: 2,
            order: 0,
            lessonProgress: [],
          },
          {
            id: 4,
            title: "Lesson 4",
            description: "Description 4",
            challenges: "",
            unitId: 2,
            order: 1,
            lessonProgress: [],
          },
        ],
      },
    ]
  },
};
