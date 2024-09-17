import { Prisma, Lesson, PrismaClient, Unit } from "@prisma/client";
import { UnitRepositoryContract } from "../contracts/UnitRepositoryContract";
import { AuthContract } from "../contracts/AuthContract";

interface RoadmapLesson extends Lesson {
  isFinished?: boolean;
  isCurrent?: boolean;
}

interface RoadmapUnit extends Unit {
  lessons: RoadmapLesson[];
}

export type Roadmap = RoadmapUnit[];

export default class GetRoadmapAction {
  constructor(
    private auth: AuthContract,
    private db: PrismaClient,
    private unitRepository: UnitRepositoryContract,
  ) {}

  async execute() {
    const user = await this.auth.user();
    const units = await this.unitRepository.getWithLessons();

    if (user && user.currentUnitId && user.currentLessonId) {
      return this.getRoadmapForUser(
        units,
        user.currentUnitId,
        user.currentLessonId,
      );
    }

    return this.getInitialRoadmap(units);
  }

  private async getRoadmapForUser(
    units: Prisma.UnitGetPayload<{ include: { lessons: true } }>[],
    currentUnitId: number,
    currentLessonId: number,
  ) {
    const [currentUnit, currentLesson] = await Promise.all([
      this.db.unit.findUniqueOrThrow({ where: { id: currentUnitId } }),
      this.db.lesson.findUniqueOrThrow({ where: { id: currentLessonId } }),
    ]);

    return units.map((unit) => ({
      ...unit,
      lessons: unit.lessons.map((lesson) => ({
        ...lesson,
        isCurrent: unit.id === currentUnit.id,
        isFinished: this.isLessonFinished(
          unit,
          lesson,
          currentUnit,
          currentLesson,
        ),
      })),
    }));
  }

  private getInitialRoadmap(
    units: Prisma.UnitGetPayload<{ include: { lessons: true } }>[],
  ) {
    return units.map((unit) => ({
      ...unit,
      lessons: unit.lessons.map((lesson) => ({
        ...lesson,
        isCurrent: unit.order === 0 && lesson.order === 0,
        isFinished: false,
      })),
    }));
  }

  /**
   * Determines if a lesson is finished based on the user's current unit and lesson.
   */
  private isLessonFinished(
    unit: Unit,
    lesson: Lesson,
    currentUnit: Unit,
    currentLesson: Lesson,
  ): boolean {
    return (
      currentUnit.order > unit.order ||
      (currentUnit.order === unit.order && currentLesson.order > lesson.order)
    );
  }
}
