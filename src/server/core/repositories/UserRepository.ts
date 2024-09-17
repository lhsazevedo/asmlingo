import {
  PrismaClient,
  Prisma,
  User,
  LessonProgress,
  UnitProgress,
} from "@prisma/client";

export default class UserRepository {
  constructor(private db: PrismaClient) {}

  /**
   * Find a user by their ID.
   */
  find(id: number): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  /**
   * Find a user by their email.
   */
  findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  /**
   * Create a new user.
   */
  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({ data });
  }

  /**
   * Update an existing user.
   */
  update(id: number, data: Prisma.UserUncheckedUpdateInput): Promise<User> {
    return this.db.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Get progress for a given user
   */
  async getProgress(userId: number): Promise<{
    lessonProgress: LessonProgress[];
    unitProgress: UnitProgress[];
  }> {
    const [lessonProgress, unitProgress] = await Promise.all([
      this.db.lessonProgress.findMany({
        where: {
          userId,
          finishedAt: { not: null },
        },
      }),
      this.db.unitProgress.findMany({
        where: {
          userId,
          finishedAt: { not: null },
        },
      }),
    ]);

    return {
      lessonProgress,
      unitProgress,
    };
  }
}
