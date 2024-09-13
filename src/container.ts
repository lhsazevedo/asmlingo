import {
  asClass,
  asFunction,
  createContainer,
  InjectionMode,
  Lifetime,
} from "awilix";
import { SessionServiceContract } from "@/core/contracts/SessionServiceContract";
import { makeSessionService } from "@/core/session/SessionService";
import { UserRepositoryContract } from "./core/contracts/UserRepositoryContract";
import UserRepository from "./core/repositories/UserRepository";

export type ContainerEntries = {
  session: SessionServiceContract;
  userRepository: UserRepositoryContract;
};

const container = createContainer<ContainerEntries>({
  injectionMode: InjectionMode.CLASSIC,
  strict: true,
});

container.register("session", asFunction(makeSessionService));
container.register(
  "userRepository",
  asClass(UserRepository).setLifetime(Lifetime.SINGLETON),
);

export { container };
