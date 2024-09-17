import {
  AlreadyLoggedInError,
  EmailAlreadyTakenError,
} from "../contracts/AuthContract";
import { AuthContract } from "../contracts/AuthContract";
import { UserService } from "../services/UserService";
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
    private userRepository: UserRepository,
    private userService: UserService,
  ) {}

  async execute(input: SignUpActionDto) {
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

    await this.auth.login(user);

    return user;
  }
}
