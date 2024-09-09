import { User } from '@prisma/client';
import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from "next/headers";
import db from './db';
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

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  return session;
}

export async function getOrCreateSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  let user: User;
  if (!session.userId) {
    user = await db.user.create({ data: { isGuest: true } });
    session.userId = user.id;
    await session.save();
  } else {
    // Ensure the user exists
    user = await db.user.findUniqueOrThrow({
      where: { id: session.userId },
    });
  }

  // TODO: Rethink return type
  return { session, user };
}

