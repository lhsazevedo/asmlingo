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

  update(id: number, data: Prisma.UserUpdateInput) {
    return db.user.update({
      where: { id },
      data,
    });
  }
}
