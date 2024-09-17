import {
  SessionContract,
  SessionData,
} from "@/server/core/contracts/SessionContract";
import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

// TODO: Move to config in container
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "asmlingo-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};

export class IronSessionProvider implements SessionContract {
  private session: IronSession<SessionData>;

  private constructor(session: IronSession<SessionData>) {
    this.session = session;

    if (this.session.isGuest === undefined) {
      this.session.isGuest = true;
    }
  }

  /**
   * Factory method to create a new instance of the session provider.
   */
  static async instance() {
    return new IronSessionProvider(
      await getIronSession(cookies(), sessionOptions),
    );
  }

  /**
   * Retrieves all session data.
   */
  all(): SessionData {
    return this.session;
  }

  /**
   * Retrieves a value from the session data.
   */
  get<K extends keyof SessionData>(key: K): SessionData[K] {
    return this.session[key];
  }

  /**
   * Sets a value in the session data.
   */
  set<K extends keyof SessionData>(key: K, value: SessionData[K]) {
    (this.session as SessionData)[key] = value;
  }

  /**
   * Saves the session data.
   */
  async save() {
    await this.session.save();
  }

  /**
   * Destroys the session.
   */
  destroy() {
    this.session.destroy();
  }
}
