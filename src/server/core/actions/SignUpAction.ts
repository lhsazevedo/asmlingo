import {
  AlreadyLoggedInError,
  EmailAlreadyTakenError,
} from "@/server/core/contracts/AuthContract";
import { AuthContract } from "@/server/core/contracts/AuthContract";
import { SessionContract } from "@/server/core/contracts/SessionContract";
import { UserService } from "@/server/core/services/UserService";
import UserRepository from "../repositories/UserRepository";

export interface SignUpActionDto {
  name: string;
  email: string;
  password: string;
}

export type SignUpActionErrors = {
  [K in keyof SignUpActionDto]?: string;
};

export default class SignUpAction {
  constructor(
    private auth: AuthContract,
    private pendingSession: Promise<SessionContract>,
    private userRepository: UserRepository,
    private userService: UserService,
  ) {}

  async execute(input: SignUpActionDto) {
    const session = await this.pendingSession;
    const existingUser = await this.auth.user();

    if (existingUser && existingUser.isGuest === false) {
      throw new AlreadyLoggedInError();
    }

    if (
      input.email !== "" &&
      (await this.userRepository.findByEmail(input.email))
    ) {
      throw new EmailAlreadyTakenError();
    }

    // Promote guest or create new user
    const user = existingUser
      ? await this.userService.promote(existingUser.id, input)
      : await this.userService.create(input);

    if (!user) {
      throw new Error("Failed to create user");
    }

    // TODO: Move the Auth service
    session.set("userId", user.id);
    session.set("isGuest", false);
    await session.save();

    return user;
  }
}
