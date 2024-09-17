import { AlreadyLoggedInError } from "../contracts/AuthContract";
import { AuthContract } from "../contracts/AuthContract";

export interface SignInActionDto {
  email: string;
  password: string;
}

export type SignInActionErrors = {
  [K in keyof SignInActionDto]?: string;
};

export default class SignInAction {
  constructor(private auth: AuthContract) {}

  async execute(input: SignInActionDto) {
    const existingUser = await this.auth.user();

    if (existingUser && existingUser.isGuest === false) {
      throw new AlreadyLoggedInError();
    }

    return await this.auth.attempt(input.email, input.password);
  }
}
