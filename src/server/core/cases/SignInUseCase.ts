import { AlreadyLoggedInError } from "../contracts/AuthContract";
import { AuthContract } from "../contracts/AuthContract";

export interface SignInUseCaseDto {
  email: string;
  password: string;
}

export type SignInUseCaseErrors = {
  [K in keyof SignInUseCaseDto]?: string;
};

export default class SignInUseCase {
  constructor(private auth: AuthContract) {}

  async execute(input: SignInUseCaseDto) {
    const existingUser = await this.auth.user();

    if (existingUser && existingUser.isGuest === false) {
      throw new AlreadyLoggedInError();
    }

    return await this.auth.attempt(input.email, input.password);
  }
}
