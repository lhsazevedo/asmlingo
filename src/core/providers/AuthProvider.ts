import { User } from "@prisma/client";
import { AuthContract, AuthCredentials } from "../contracts/AuthContract";
import { HashContract } from "../contracts/HashContract";
import { SessionContract } from "../contracts/SessionContract";
import UserRepository from "../repositories/UserRepository";

export default class AuthProvider implements AuthContract {
  constructor(
    private hash: HashContract,
    private pendingSession: Promise<SessionContract>,
    private userRepository: UserRepository,
  ) {}

  async attempt(credentials: AuthCredentials) {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      return false;
    }

    if (
      !user.password ||
      !(await this.hash.check(credentials.password, user.password))
    ) {
      return false;
    }

    await this.login(user);
    return true;
  }

  async user() {
    const session = await this.pendingSession;

    if (!session.get("userId")) {
      return null;
    }

    return this.userRepository.find(session.get("userId"));
  }

  async login(user: User) {
    const session = await this.pendingSession;

    session.set("userId", user.id);
    session.set("isGuest", user.isGuest);
  }

  async logout(): Promise<void> {
    const session = await this.pendingSession;
    // TODO: It would be better to just unset the user ID and isGuest flag
    session.destroy();
  }
}
