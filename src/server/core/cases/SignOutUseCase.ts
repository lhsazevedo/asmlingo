import { AuthContract } from "../contracts/AuthContract";

export default class SignOutUseCase {
  constructor(private auth: AuthContract) {}

  async execute() {
    await this.auth.logout();
  }
}
