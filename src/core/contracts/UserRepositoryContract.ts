import type { Prisma, User } from "@prisma/client";

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
  create(data: Prisma.UserCreateInput): Promise<User | null>;

  /**
   * Update an existing user.
   */
  update(id: number, data: Prisma.UserUpdateInput): Promise<User | null>;
}
