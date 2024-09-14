import { AlreadyLoggedInError, EmailAlreadyTakenError } from "../auth/Errors";
import { SessionContract } from "../contracts/SessionContract";
import { UserRepositoryContract } from "../contracts/UserRepositoryContract";
import { User } from "../entities/User";
import { CreateUserDto } from "../repositories/UserRepository";
import { HashContract } from "../contracts/HashContract";

export default class SignUpAction {
  private pendingSession: Promise<SessionContract>;
  private hash: HashContract;
  private userRepository: UserRepositoryContract;

  constructor(
    pendingSession: Promise<SessionContract>,
    hash: HashContract,
    userRepository: UserRepositoryContract,
  ) {
    this.pendingSession = pendingSession;
    this.hash = hash;
    this.userRepository = userRepository;
  }

  async execute({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const session = await this.pendingSession;
    if (session.get("isGuest") === false) {
      throw new AlreadyLoggedInError();
    }

    if (await this.userRepository.findByEmail(email)) {
      throw new EmailAlreadyTakenError();
    }

    const hashed = await this.hash.make(password);

    const userData: CreateUserDto = {
      email,
      name,
      password: hashed,
      isGuest: false,
    };

    // Promote guest or create new user
    const user = session.get("userId")
      ? await this.userRepository.update(session.get("userId"), userData)
      : await this.userRepository.create(userData);

    session.set("userId", user.id);
    session.set("isGuest", false);
    await session.save();

    return user;
  }
}
