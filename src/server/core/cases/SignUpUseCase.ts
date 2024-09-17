import {
  AlreadyLoggedInError,
  EmailAlreadyTakenError,
} from "../contracts/AuthContract";
import { AuthContract } from "../contracts/AuthContract";
import { UserService } from "../services/UserService";
import UserRepository from "../repositories/UserRepository";

export interface SignUpUseCaseDto {
  name: string;
  email: string;
  password: string;
}

export type SignUpUseCaseErrors = {
  [K in keyof SignUpUseCaseDto]?: string;
};

export default class SignUpUseCase {
  constructor(
    private auth: AuthContract,
    private userRepository: UserRepository,
    private userService: UserService,
  ) {}

  async execute(input: SignUpUseCaseDto) {
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
