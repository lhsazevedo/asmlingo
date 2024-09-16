import { AlreadyLoggedInError, EmailAlreadyTakenError } from "../auth/Errors";
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
    private pendingSession: Promise<SessionContract>,
    private userRepository: UserRepositoryContract,
    private userService: UserService,
  ) {}

  async execute(input: SignUpActionDto) {
    const session = await this.pendingSession;
    if (session.get("isGuest") === false) {
      throw new AlreadyLoggedInError();
    }

    if (
      input.email !== "" &&
      (await this.userRepository.findByEmail(input.email))
    ) {
      throw new EmailAlreadyTakenError();
    }

    // Promote guest or create new user
    const user = session.get("userId")
      ? await this.userService.update(session.get("userId"), input)
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
