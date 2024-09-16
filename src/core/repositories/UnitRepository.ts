import type { PrismaClient } from "@prisma/client";
import { UnitRepositoryContract } from "../contracts/UnitRepositoryContract";

export class UnitRepository implements UnitRepositoryContract {
  constructor(private readonly db: PrismaClient) {}

  get() {
    return this.db.unit.findMany({
      orderBy: {
        order: "asc",
      },
    });
  }

  getWithLessons() {
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

  findWithLessons(id: number) {
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

  findByOrder(order: number) {
    return this.db.unit.findUnique({ where: { order } });
  }

  findByOrderWithLessons(order: number) {
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
