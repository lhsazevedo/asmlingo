import { PrismaClient } from "@prisma/client";
import { z as Zod } from "zod";
import {
  asClass,
  asFunction,
  asValue,
  createContainer,
  InjectionMode,
  Lifetime,
} from "awilix";

import { AuthContract } from "./core/contracts/AuthContract";
import { HashContract } from "./core/contracts/HashContract";
import { SessionContract } from "./core/contracts/SessionContract";

import FinishLessonUseCase from "./core/cases/FinishLessonUseCase";
import GetRoadmapUseCase from "./core/cases/GetRoadmapUseCase";
import SignInUseCase from "./core/cases/SignInUseCase";
import SignOutUseCase from "./core/cases/SignOutUseCase";
import SignUpUseCase from "./core/cases/SignUpUseCase";

import DatabaseAuthProvider from "./providers/DatabaseAuthProvider";
import Argon2IdHashProvider from "./providers/Argon2IdHashProvider";
import { IronSessionProvider } from "./providers/IronSessionProvider";

import UnitRepository from "./core/repositories/UnitRepository";
import UserRepository from "./core/repositories/UserRepository";

import { UserService } from "./core/services/UserService";

export type ContainerEntries = {
  // Providers
  auth: AuthContract;
  db: PrismaClient;
  hash: HashContract;
  pendingSession: Promise<SessionContract>; // Awiilix doesn't support async factories
  validator: typeof Zod;

  // Repositories
  userRepository: UserRepository;
  unitRepository: UnitRepository;

  // Use cases
  SignUpUseCase: SignUpUseCase;
  SignInUseCase: SignInUseCase;
  SignOutUseCase: SignOutUseCase;
  GetRoadmapUseCase: GetRoadmapUseCase;
  FinishLessonUseCase: FinishLessonUseCase;

  // Services
  userService: UserService;
};

const container = createContainer<ContainerEntries>({
  injectionMode: InjectionMode.CLASSIC,
  strict: true,
});

container.register(
  "auth",
  asClass(DatabaseAuthProvider).setLifetime(Lifetime.SCOPED),
);

container.register(
  "db",
  asFunction(() => new PrismaClient()).setLifetime(Lifetime.SINGLETON),
);

container.register(
  "pendingSession",
  asFunction(async () => IronSessionProvider.instance()).setLifetime(
    Lifetime.SCOPED,
  ),
);

container.register(
  "hash",
  asClass(Argon2IdHashProvider).setLifetime(Lifetime.SINGLETON),
);

container.register(
  "userRepository",
  asClass(UserRepository).setLifetime(Lifetime.SINGLETON),
);

container.register(
  "unitRepository",
  asClass(UnitRepository).setLifetime(Lifetime.SINGLETON),
);

container.register(
  "SignUpUseCase",
  asClass(SignUpUseCase).setLifetime(Lifetime.TRANSIENT),
);

container.register(
  "SignInUseCase",
  asClass(SignInUseCase).setLifetime(Lifetime.TRANSIENT),
);

container.register(
  "SignOutUseCase",
  asClass(SignOutUseCase).setLifetime(Lifetime.TRANSIENT),
);

container.register(
  "GetRoadmapUseCase",
  asClass(GetRoadmapUseCase).setLifetime(Lifetime.TRANSIENT),
);

container.register(
  "FinishLessonUseCase",
  asClass(FinishLessonUseCase).setLifetime(Lifetime.TRANSIENT),
);

container.register(
  "userService",
  asClass(UserService).setLifetime(Lifetime.SINGLETON),
);

container.register("validator", asValue(Zod));

export { container };
