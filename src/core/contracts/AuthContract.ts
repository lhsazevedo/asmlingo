import { User } from "@prisma/client";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthContract {
  attempt(credentials: AuthCredentials): Promise<boolean>;
  user(): Promise<User | null>;
  login(user: User): Promise<void>;
  logout(): Promise<void>;
}
