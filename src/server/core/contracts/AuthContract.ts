import { User } from "@prisma/client";

// TODO: Move out of contracts
export class AlreadyLoggedInError extends Error {}
export class EmailAlreadyTakenError extends Error {}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthContract {
  attempt(email: string, password: string): Promise<boolean>;
  user(): Promise<User | null>;
  login(user: User): Promise<void>;
  logout(): Promise<void>;
}
