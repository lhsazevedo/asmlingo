import type {
  Prisma,
  User,
  LessonProgress,
  UnitProgress,
} from "@prisma/client";

export interface UserRepositoryContract {
  /**
   * Find a user by their ID.
   */
  find(id: number): Promise<User | null>;

  /**
   * Find a user by their email.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Create a new user.
   */
  create(data: Prisma.UserCreateInput): Promise<User>;

  /**
   * Update an existing user.
   */
  update(id: number, data: Prisma.UserUncheckedUpdateInput): Promise<User>;

  /**
   * Get progress for a given user
   */
  getProgress(
    userId: number,
  ): Promise<{
    lessonProgress: LessonProgress[];
    unitProgress: UnitProgress[];
  }>;
}
