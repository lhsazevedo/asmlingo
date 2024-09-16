import type { Prisma, Unit } from "@prisma/client";

export interface UnitRepositoryContract {
  /**
   * Get all units, sorted.
   */
  get(): Promise<Unit[]>;

  /**
   * Get all units with its lessons, both sorted.
   */
  getWithLessons(): Promise<
    Prisma.UnitGetPayload<{ include: { lessons: true } }>[]
  >;

  /**
   * Find a unit by its ID, with lessons sorted.
   */
  findWithLessons(
    id: number,
  ): Promise<Prisma.UnitGetPayload<{ include: { lessons: true } }> | null>;

  /**
   * Find a unit by its order.
   */
  findByOrder(order: number): Promise<Unit | null>;

  /**
   * Find a unit by its order, with lessons sorted.
   */
  findByOrderWithLessons(
    id: number,
  ): Promise<Prisma.UnitGetPayload<{ include: { lessons: true } }> | null>;
}
