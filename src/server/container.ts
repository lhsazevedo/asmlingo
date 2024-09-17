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

import { AuthContract } from "@/server/core/contracts/AuthContract";
import { HashContract } from "@/server/core/contracts/HashContract";
import { SessionContract } from "@/server/core/contracts/SessionContract";
// import { UnitRepositoryContract } from "@/server/core/contracts/UnitRepositoryContract";
// import { UserRepositoryContract } from "@/server/core/contracts/UserRepositoryContract";

import FinishLessonAction from "@/server/core/actions/FinishLessonAction";
import GetRoadmapAction from "@/server/core/actions/GetRoadmapAction";
import SignInAction from "@/server/core/actions/SignInAction";
import SignOutAction from "@/server/core/actions/SignOutAction";
import SignUpAction from "@/server/core/actions/SignUpAction";

import DatabaseAuthProvider from "@/server/providers/DatabaseAuthProvider";
import Argon2IdHashProvider from "@/server/providers/Argon2IdHashProvider";
import { IronSessionProvider } from "@/server/providers/IronSessionProvider";

import UnitRepository from "@/server/core/repositories/UnitRepository";
import UserRepository from "@/server/core/repositories/UserRepository";

import { UserService } from "@/server/core/services/UserService";

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
