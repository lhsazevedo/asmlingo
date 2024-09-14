import {
  asClass,
  asFunction,
  createContainer,
  InjectionMode,
  Lifetime,
} from "awilix";
import { HashContract } from "@/core/contracts/HashContract";
import { SessionContract } from "@/core/contracts/SessionContract";
import { UserRepositoryContract } from "@/core/contracts/UserRepositoryContract";
import UserRepository from "@/core/repositories/UserRepository";
import Argon2HashProvider from "@/core/providers/HashProvider";
import { SessionProvider } from "@/core/providers/SessionProvider";
import SignUpAction from "@/core/actions/SignUpAction";
import SignOutAction from "@/core/actions/SignOutAction";

export type ContainerEntries = {
  // Providers
  hash: HashContract;
  pendingSession: Promise<SessionContract>; // Awiilix doesn't support async factories

  // Repositories
  userRepository: UserRepositoryContract;

  // Use cases
  SignUpAction: InstanceType<typeof SignUpAction>;
  SignOutAction: InstanceType<typeof SignOutAction>;
};

const container = createContainer<ContainerEntries>({
  injectionMode: InjectionMode.CLASSIC,
  strict: true,
});

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
  "SignUpAction",
  asClass(SignUpAction).setLifetime(Lifetime.TRANSIENT),
);

container.register(
  "SignOutAction",
  asClass(SignOutAction).setLifetime(Lifetime.TRANSIENT),
);

export { container };
