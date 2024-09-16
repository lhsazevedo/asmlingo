import { UserRepositoryContract } from "../contracts/UserRepositoryContract";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export default class UserRepository implements UserRepositoryContract {
  find(id: number) {
    return db.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  }

  create(data: Prisma.UserCreateInput) {
    return db.user.create({ data });
  }

  update(id: number, data: Prisma.UserUncheckedUpdateInput) {
    return db.user.update({
      where: { id },
      data,
    });
  }

  async getProgress(userId: number) {
    const [lessonProgress, unitProgress] = await Promise.all([
      db.lessonProgress.findMany({
        where: {
          userId,
          finishedAt: { not: null },
        },
      }),
      db.unitProgress.findMany({
        where: {
          userId,
          finishedAt: { not: null },
        },
      })
    ]);

    return {
      lessonProgress,
      unitProgress
    }
  }
}
