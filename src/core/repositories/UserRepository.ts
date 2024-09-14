import { UserRepositoryContract } from "../contracts/UserRepositoryContract";
import db from "@/lib/db";
import { User } from "../entities/User";

export type CreateUserDto = Omit<User, "id">;
export type UpdateUserDto = Partial<CreateUserDto>;

export default class UserRepository implements UserRepositoryContract {
  async find(id: number) {
    return db.user.findUnique({ where: { id } }) as Promise<User | null>;
  }

  async findByEmail(email: string) {
    return db.user.findUnique({ where: { email } }) as Promise<User | null>;
  }

  async create(user: CreateUserDto) {
    return db.user.create({
      data: {
        isGuest: false,
        email: user.email,
        name: user.name,
        password: user.password,
      },
    }) as Promise<User>;
  }

  async update(id: number, data: UpdateUserDto) {
    return db.user.update({
      where: { id },
      data,
    }) as Promise<User>;
  }
}
