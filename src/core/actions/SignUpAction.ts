import { AlreadyLoggedInError, EmailAlreadyTakenError } from "../auth/Errors";
import { AuthContract } from "../contracts/AuthContract";
import { SessionContract } from "../contracts/SessionContract";
import { UserRepositoryContract } from "../contracts/UserRepositoryContract";
import { UserService } from "../services/UserService";

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
    private userRepository: UserRepositoryContract,
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
      ? await this.userService.update(existingUser.id, input)
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
