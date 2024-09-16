import { AuthContract } from "@/core/contracts/AuthContract";
import { UserService } from "@/core/services/UserService";
import { UserRepositoryContract } from "../contracts/UserRepositoryContract";
import { PrismaClient } from "@prisma/client";
import { UnitRepositoryContract } from "../contracts/UnitRepositoryContract";

/**
 * Finish a lesson.
 * 
 * This action updates the user's current lesson, advancing to the next unit when appropriate.
 */
export default class FinishLessonAction {
  constructor(
    private auth: AuthContract,
    private db: PrismaClient,
    private unitRepository: UnitRepositoryContract,
    private userRepository: UserRepositoryContract,
    private userService: UserService,
  ) {}

  async execute(lessonId: number) {
    let user = await this.auth.user();

    // Create a guest user if no user is logged in.
    // This way we let new users finish lessons without having to log in.
    if (!user) {
      user = await this.userService.createGuest();
      await this.auth.login(user);
    }

    const { lessonProgress } = await this.userRepository.getProgress(user.id);

    // Do nothing if the lesson is already finished
    if (lessonProgress.some((lp) => lp.lessonId === lessonId)) {
      return;
    }

    // TODO: Everything from now on should be wrapped in a transaction.

    // Create lesson progress
    await this.db.lessonProgress.create({
      data: {
        userId: user.id,
        lessonId,
        finishedAt: new Date().toISOString(),
      },
    });

    const lesson = await this.db.lesson.findUniqueOrThrow({ where: { id: lessonId } });
    const unit = await this.unitRepository.findWithLessons(lesson.unitId);
    if (!unit) {
      throw new Error("Unit not found");
    }
    const lastLesson = unit.lessons[unit.lessons.length - 1];

    // If the lesson is not the last one in the unit, update the user's current lesson.
    if (lessonId !== lastLesson.id) {
      const nextLesson = unit.lessons[lesson.order + 1];
      await this.userRepository.update(user.id, {
        currentLessonId: nextLesson.id,
      });

      return;
    }

    // Advance to the next unit.
    await this.db.unitProgress.create({
      data: {
        userId: user.id,
        unitId: unit.id,
        finishedAt: new Date().toISOString(),
      },
    });

    const nextUnit = await this.unitRepository.findByOrderWithLessons(unit.order + 1);
    const nextLesson = nextUnit?.lessons[0];

    // Fail silently if this was the last unit.
    if (!nextLesson) {
      return;
    }

    await this.userRepository.update(user.id, {
      currentUnitId: nextUnit.id,
      currentLessonId: nextLesson.id,
    });
  }
}
