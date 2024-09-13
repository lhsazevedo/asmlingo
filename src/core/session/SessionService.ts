import {
  SessionServiceContract,
  SessionData,
} from "@/core/contracts/SessionServiceContract";
import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "asmlingo-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};

class SessionService implements SessionServiceContract {
  private session: IronSession<SessionData>;

  constructor(session: IronSession<SessionData>) {
    this.session = session;

    if (this.session.isGuest === undefined) {
      this.session.isGuest = true;
    }
  }

  all(): SessionData {
    return this.session;
  }

  get<K extends keyof SessionData>(key: K): SessionData[K] {
    return this.session[key];
  }

  set<K extends keyof SessionData>(key: K, value: SessionData[K]) {
    // cookies().set("test", key);
    (this.session as SessionData)[key] = value;
  }

  async save() {
    await this.session.save();
  }

  destroy() {
    this.session.destroy();
  }
}

export async function makeSessionService(): Promise<SessionServiceContract> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return new SessionService(session);
}
