import { AuthContract } from "../contracts/AuthContract";

export default class SignOutAction {
  constructor(private auth: AuthContract) {}

  async execute() {
    await this.auth.logout();
  }
}
