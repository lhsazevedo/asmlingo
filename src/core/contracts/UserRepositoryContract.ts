import { User } from "@/core/entities/User";

export interface UserRepositoryContract {
  find(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, "id">): Promise<User>;
  update(id: number, user: Partial<Omit<User, "id">>): Promise<User>;
}
