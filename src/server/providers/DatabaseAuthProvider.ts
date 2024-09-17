import { User } from "@prisma/client";
import { AuthContract } from "../core/contracts/AuthContract";
import { HashContract } from "../core/contracts/HashContract";
import { SessionContract } from "../core/contracts/SessionContract";
import UserRepository from "../core/repositories/UserRepository";

export default class DatabaseAuthProvider implements AuthContract {
  constructor(
    private hash: HashContract,
    private pendingSession: Promise<SessionContract>,
    private userRepository: UserRepository,
  ) {}

  /**
   * Attempt to log in a user with the given email and password.
   */
  async attempt(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return false;
    }

    if (!user.password || !(await this.hash.check(password, user.password))) {
      return false;
    }

    await this.login(user);
    return true;
  }

  /**
   * Get the currently authenticated user.
   */
  async user() {
    const session = await this.pendingSession;

    if (!session.get("userId")) {
      return null;
    }

    return this.userRepository.find(session.get("userId"));
  }

  /**
   * Log in a user.
   */
  async login(user: User) {
    const session = await this.pendingSession;

    session.set("userId", user.id);
    session.set("isGuest", user.isGuest);
    await session.save();
  }

  /**
   * Log out the currently authenticated user.
   */
  async logout(): Promise<void> {
    const session = await this.pendingSession;
    // TODO: It's better to just userId and isGuest.
    session.destroy();
  }
}
