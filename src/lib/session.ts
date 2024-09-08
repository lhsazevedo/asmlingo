import { SessionOptions } from 'iron-session';
import 'server-only'

export interface SessionData {
  userId: number;
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "asmling-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};

