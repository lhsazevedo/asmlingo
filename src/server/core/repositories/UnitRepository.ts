import type { Prisma, PrismaClient, Unit } from "@prisma/client";

export default class UnitRepository {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Get all units, sorted.
   */
  get(): Promise<Unit[]> {
    return this.db.unit.findMany({
      orderBy: {
        order: "asc",
      },
    });
  }

  /**
   * Get all units with its lessons, both sorted.
   */
  getWithLessons(): Promise<
    Prisma.UnitGetPayload<{ include: { lessons: true } }>[]
  > {
    return this.db.unit.findMany({
      orderBy: {
        order: "asc",
      },
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }

  /**
   * Find a unit by its ID, with lessons sorted.
   */
  findWithLessons(
    id: number,
  ): Promise<Prisma.UnitGetPayload<{ include: { lessons: true } }> | null> {
    return this.db.unit.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }

  /**
   * Find a unit by its order.
   */
  findByOrder(order: number): Promise<Unit | null> {
    return this.db.unit.findUnique({ where: { order } });
  }

  /**
   * Find a unit by its order, with lessons sorted.
   */
  findByOrderWithLessons(
    order: number,
  ): Promise<Prisma.UnitGetPayload<{ include: { lessons: true } }> | null> {
    return this.db.unit.findUnique({
      where: { order },
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }
}
