/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach } from "vitest";
import {
  mock,
  mockDeep,
  MockProxy,
  DeepMockProxy,
  mockReset,
} from "vitest-mock-extended";
import FinishLessonUseCase from "./FinishLessonUseCase";
import { AuthContract } from "../contracts/AuthContract";
import { UserService } from "../services/UserService";
import { PrismaClient, User, Lesson, Unit } from "@prisma/client";
import UnitRepository from "../repositories/UnitRepository";
import UserRepository from "../repositories/UserRepository";

describe("FinishLessonUseCase", () => {
  let finishLessonUseCase: FinishLessonUseCase;
  const auth: MockProxy<AuthContract> = mock<AuthContract>();
  const db: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();
  const unitRepository: MockProxy<UnitRepository> = mock<UnitRepository>();
  const userRepository: MockProxy<UserRepository> = mock<UserRepository>();
  const userService: MockProxy<UserService> = mock<UserService>();

  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    password: "hashedpassword",
    name: "Test User",
    isGuest: false,
    currentUnitId: 1,
    currentLessonId: 1,
    createdAt: new Date(),
  };

  const mockLesson: Lesson = {
    id: 1,
    title: "Test Lesson",
    description: "This is a test lesson",
    challenges: '{ "test": "challenge" }',
    order: 0,
    unitId: 1,
  };

  const mockUnit: Unit & { lessons: Lesson[] } = {
    id: 1,
    title: "Test Unit",
    order: 0,
    lessons: [mockLesson],
  };

  beforeEach(() => {
    mockReset(auth);
    mockReset(db);
    mockReset(unitRepository);
    mockReset(userRepository);
    mockReset(userService);

    finishLessonUseCase = new FinishLessonUseCase(
      auth,
      db,
      unitRepository,
      userRepository,
      userService,
    );

    // Default mocks
    auth.user.mockResolvedValue(mockUser);
    userRepository.getProgress.mockResolvedValue({
      unitProgress: [],
      lessonProgress: [],
    });
    db.lesson.findUniqueOrThrow.mockResolvedValue(mockLesson);
    unitRepository.findWithLessons.mockResolvedValue(mockUnit);
  });

  it("should create lesson progress for a logged-in user", async () => {
    await finishLessonUseCase.execute(1);

    expect(db.lessonProgress.create).toHaveBeenCalledWith({
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      data: expect.objectContaining({
        userId: mockUser.id,
        lessonId: 1,
        finishedAt: expect.any(String),
      }),
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    });
  });

  it("should create a guest user if no user is logged in", async () => {
    auth.user.mockResolvedValue(null);
    userService.createGuest.mockResolvedValue({ ...mockUser, isGuest: true });

    await finishLessonUseCase.execute(1);

    expect(userService.createGuest).toHaveBeenCalled();
    expect(auth.login).toHaveBeenCalledWith(
      expect.objectContaining({ isGuest: true }),
    );
  });

  it("should not create lesson progress if the lesson is already finished", async () => {
    userRepository.getProgress.mockResolvedValue({
      unitProgress: [],
      lessonProgress: [
        {
          id: 1,
          userId: 1,
          lessonId: 1,
          finishedAt: new Date(),
        },
      ],
    });

    await finishLessonUseCase.execute(1);

    expect(userRepository.getProgress).toHaveBeenCalledWith(mockUser.id);
    expect(db.lessonProgress.create).not.toHaveBeenCalled();
  });

  it("should update current lesson if it is not the last in the unit", async () => {
    const nextLesson: Lesson = { ...mockLesson, id: 2, order: 1 };
    unitRepository.findWithLessons.mockResolvedValue({
      ...mockUnit,
      lessons: [mockLesson, nextLesson],
    });

    await finishLessonUseCase.execute(1);

    expect(db.lessonProgress.create).toHaveBeenCalled();
    expect(userRepository.update).toHaveBeenCalledWith(mockUser.id, {
      currentLessonId: nextLesson.id,
      currentUnitId: mockUnit.id,
    });
  });

  it("should advance to the next unit if the lesson is the last in the current unit", async () => {
    const nextUnit: Unit & { lessons: Lesson[] } = {
      ...mockUnit,
      id: 2,
      order: 1,
      lessons: [{ ...mockLesson, id: 2, unitId: 2 }],
    };
    unitRepository.findByOrderWithLessons.mockResolvedValue(nextUnit);

    await finishLessonUseCase.execute(1);

    expect(db.lessonProgress.create).toHaveBeenCalled();
    expect(db.unitProgress.create).toHaveBeenCalledWith({
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      data: expect.objectContaining({
        userId: mockUser.id,
        unitId: mockUnit.id,
        finishedAt: expect.any(String),
      }),
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    });
    expect(userRepository.update).toHaveBeenCalledWith(mockUser.id, {
      currentUnitId: nextUnit.id,
      currentLessonId: nextUnit.lessons[0].id,
    });
  });

  it("should do nothing if there is no next unit", async () => {
    unitRepository.findByOrderWithLessons.mockResolvedValue(null);

    await finishLessonUseCase.execute(1);

    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
