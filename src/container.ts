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

import { AuthContract } from "@/core/contracts/AuthContract";
import { HashContract } from "@/core/contracts/HashContract";
import { SessionContract } from "@/core/contracts/SessionContract";
import { UnitRepositoryContract } from "@/core/contracts/UnitRepositoryContract";
import { UserRepositoryContract } from "@/core/contracts/UserRepositoryContract";

import FinishLessonAction from "@/core/actions/FinishLessonAction";
import GetRoadmapAction from "@/core/actions/GetRoadmapAction";
import SignInAction from "@/core/actions/SignInAction";
import SignOutAction from "@/core/actions/SignOutAction";
import SignUpAction from "@/core/actions/SignUpAction";

import AuthProvider from "@/core/providers/AuthProvider";
import Argon2HashProvider from "@/core/providers/HashProvider";
import { SessionProvider } from "@/core/providers/SessionProvider";

import { UnitRepository } from "@/core/repositories/UnitRepository";
import UserRepository from "@/core/repositories/UserRepository";

import { UserService } from "@/core/services/UserService";

export type ContainerEntries = {
  // Providers
  auth: AuthContract;
  db: PrismaClient;
  hash: HashContract;
  pendingSession: Promise<SessionContract>; // Awiilix doesn't support async factories
  validator: typeof Zod;

  // Repositories
  userRepository: UserRepositoryContract;
  unitRepository: UnitRepositoryContract;

  // Use cases
  SignUpAction: SignUpAction;
  SignInAction: SignInAction;
  SignOutAction: SignOutAction;
  GetRoadmapAction: GetRoadmapAction;
  FinishLessonAction: FinishLessonAction;

  // Services
  userService: UserService;
};

const container = createContainer<ContainerEntries>({
  injectionMode: InjectionMode.CLASSIC,
  strict: true,
});

container.register("auth", asClass(AuthProvider).setLifetime(Lifetime.SCOPED));

container.register(
  "db",
  asFunction(() => new PrismaClient()).setLifetime(Lifetime.SINGLETON),
);

container.register(
  "pendingSession",
  asFunction(async () => SessionProvider.instance()).setLifetime(
    Lifetime.SCOPED,
  ),
);

container.register(
  "hash",
  asClass(Argon2HashProvider).setLifetime(Lifetime.SINGLETON),
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
  "SignUpAction",
  asClass(SignUpAction).setLifetime(Lifetime.TRANSIENT),
);

container.register(
  "SignInAction",
  asClass(SignInAction).setLifetime(Lifetime.TRANSIENT),
);

container.register(
  "SignOutAction",
  asClass(SignOutAction).setLifetime(Lifetime.TRANSIENT),
);

container.register(
  "GetRoadmapAction",
  asClass(GetRoadmapAction).setLifetime(Lifetime.TRANSIENT),
);

container.register(
  "FinishLessonAction",
  asClass(FinishLessonAction).setLifetime(Lifetime.TRANSIENT),
);

container.register(
  "userService",
  asClass(UserService).setLifetime(Lifetime.SINGLETON),
);

container.register("validator", asValue(Zod));

export { container };
