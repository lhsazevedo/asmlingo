import { describe, it, expect, beforeEach } from "vitest";
import { mock, mockDeep, MockProxy, DeepMockProxy } from "vitest-mock-extended";
import GetRoadmapUseCase, { Roadmap } from "./GetRoadmapUseCase";
import { AuthContract } from "../contracts/AuthContract";
import { PrismaClient, User, Lesson, Unit } from "@prisma/client";
import UnitRepository from "../repositories/UnitRepository";

describe("GetRoadmapUseCase", () => {
  let getRoadmapUseCase: GetRoadmapUseCase;
  const auth: MockProxy<AuthContract> = mock<AuthContract>();
  const db: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();
  const unitRepository: MockProxy<UnitRepository> = mock<UnitRepository>();

  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    password: "hashedpassword",
    name: "Test User",
    isGuest: false,
    currentUnitId: 1,
    currentLessonId: 2,
    createdAt: new Date(),
  };

  const mockUnits: (Unit & { lessons: Lesson[] })[] = [
    {
      id: 1,
      title: "Unit 1",
      order: 0,
      lessons: [
        {
          id: 1,
          title: "Lesson 1.1",
          description: "Description 1.1",
          challenges: "{}",
          order: 0,
          unitId: 1,
        },
        {
          id: 2,
          title: "Lesson 1.2",
          description: "Description 1.2",
          challenges: "{}",
          order: 1,
          unitId: 1,
        },
      ],
    },
    {
      id: 2,
      title: "Unit 2",
      order: 1,
      lessons: [
        {
          id: 3,
          title: "Lesson 2.1",
          description: "Description 2.1",
          challenges: "{}",
          order: 0,
          unitId: 2,
        },
        {
          id: 4,
          title: "Lesson 2.2",
          description: "Description 2.2",
          challenges: "{}",
          order: 1,
          unitId: 2,
        },
      ],
    },
  ];

  beforeEach(() => {
    getRoadmapUseCase = new GetRoadmapUseCase(auth, db, unitRepository);
    unitRepository.getWithLessons.mockResolvedValue(mockUnits);
    db.unit.findUniqueOrThrow.mockResolvedValue(mockUnits[0]);
    db.lesson.findUniqueOrThrow.mockResolvedValue(mockUnits[0].lessons[1]);
  });

  it("should return initial roadmap for session-only guest user", async () => {
    auth.user.mockResolvedValue(null);

    const result = await getRoadmapUseCase.execute();

    expect(result).toEqual([
      {
        ...mockUnits[0],
        lessons: [
          { ...mockUnits[0].lessons[0], isCurrent: true, isFinished: false },
          { ...mockUnits[0].lessons[1], isCurrent: false, isFinished: false },
        ],
      },
      {
        ...mockUnits[1],
        lessons: [
          { ...mockUnits[1].lessons[0], isCurrent: false, isFinished: false },
          { ...mockUnits[1].lessons[1], isCurrent: false, isFinished: false },
        ],
      },
    ]);
  });

  it("should return roadmap for logged-in guest user", async () => {
    const mockGuestUser: User = {
      id: 1,
      email: null,
      password: null,
      name: null,
      isGuest: true,
      currentUnitId: 1,
      currentLessonId: 2,
      createdAt: new Date(),
    };
    auth.user.mockResolvedValue(mockGuestUser);

    const result = await getRoadmapUseCase.execute();

    expect(result).toEqual([
      {
        ...mockUnits[0],
        lessons: [
          { ...mockUnits[0].lessons[0], isCurrent: false, isFinished: true },
          { ...mockUnits[0].lessons[1], isCurrent: true, isFinished: false },
        ],
      },
      {
        ...mockUnits[1],
        lessons: [
          { ...mockUnits[1].lessons[0], isCurrent: false, isFinished: false },
          { ...mockUnits[1].lessons[1], isCurrent: false, isFinished: false },
        ],
      },
    ]);
  });

  it("should return roadmap for logged-in user", async () => {
    auth.user.mockResolvedValue(mockUser);

    const result = await getRoadmapUseCase.execute();

    expect(result).toEqual([
      {
        ...mockUnits[0],
        lessons: [
          { ...mockUnits[0].lessons[0], isCurrent: false, isFinished: true },
          { ...mockUnits[0].lessons[1], isCurrent: true, isFinished: false },
        ],
      },
      {
        ...mockUnits[1],
        lessons: [
          { ...mockUnits[1].lessons[0], isCurrent: false, isFinished: false },
          { ...mockUnits[1].lessons[1], isCurrent: false, isFinished: false },
        ],
      },
    ]);
  });

  it("should handle user on a later unit", async () => {
    const laterUser = { ...mockUser, currentUnitId: 2, currentLessonId: 3 };
    auth.user.mockResolvedValue(laterUser);
    db.unit.findUniqueOrThrow.mockResolvedValue(mockUnits[1]);
    db.lesson.findUniqueOrThrow.mockResolvedValue(mockUnits[1].lessons[0]);

    const result = await getRoadmapUseCase.execute();

    const expected: Roadmap = mockUnits;
    expected[0].lessons[0].isCurrent = false;
    expected[0].lessons[0].isFinished = true;
    expected[0].lessons[1].isCurrent = false;
    expected[0].lessons[1].isFinished = true;
    expected[1].lessons[0].isCurrent = true;
    expected[1].lessons[0].isFinished = false;
    expected[1].lessons[1].isCurrent = false;
    expected[1].lessons[1].isFinished = false;

    expect(result).toEqual([
      {
        ...mockUnits[0],
        lessons: [
          { ...mockUnits[0].lessons[0], isCurrent: false, isFinished: true },
          { ...mockUnits[0].lessons[1], isCurrent: false, isFinished: true },
        ],
      },
      {
        ...mockUnits[1],
        lessons: [
          { ...mockUnits[1].lessons[0], isCurrent: true, isFinished: false },
          { ...mockUnits[1].lessons[1], isCurrent: false, isFinished: false },
        ],
      },
    ]);
  });

  it("should throw an error if current unit is not found", async () => {
    auth.user.mockResolvedValue({ ...mockUser, currentUnitId: 999 });
    db.unit.findUniqueOrThrow.mockRejectedValue(
      new Error("Unit not found (Prisma)"),
    );

    await expect(getRoadmapUseCase.execute()).rejects.toThrow("Unit not found");
  });

  it("should throw an error if current lesson is not found", async () => {
    auth.user.mockResolvedValue({ ...mockUser, currentLessonId: 999 });
    db.lesson.findUniqueOrThrow.mockRejectedValue(
      new Error("Lesson not found (Prisma)"),
    );

    await expect(getRoadmapUseCase.execute()).rejects.toThrow(
      "Lesson not found",
    );
  });
});
