import { UserRepositoryContract } from "../contracts/UserRepositoryContract";
import { PrismaClient, Prisma } from "@prisma/client";

export default class UserRepository implements UserRepositoryContract {
  constructor(private db: PrismaClient) {}

  find(id: number) {
    return this.db.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  create(data: Prisma.UserCreateInput) {
    return this.db.user.create({ data });
  }

  update(id: number, data: Prisma.UserUncheckedUpdateInput) {
    return this.db.user.update({
      where: { id },
      data,
    });
  }

  async getProgress(userId: number) {
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
