import { SessionContract } from "../contracts/SessionContract";

export default class SignOutAction {
  private pendingSession: Promise<SessionContract>;

  constructor(pendingSession: Promise<SessionContract>) {
    this.pendingSession = pendingSession;
  }

  async execute() {
    const session = await this.pendingSession;
    session.destroy();
  }
}
