import { User } from "@prisma/client";
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import db from "./db";
import "server-only";

export interface SessionData {
  userId: number;
  isGuest: boolean;
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

  let user = undefined;
  if (session.userId) {
    // Ensure the user exists
    user = await db.user.findUnique({
      where: { id: session.userId },
    });
  }

  return { session, user };
}

export async function getOrCreateSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  let user: User;
  if (!session.userId) {
    user = await db.user.create({ data: { isGuest: true } });
    session.userId = user.id;
    session.isGuest = true;
    await session.save();
  } else {
    // Ensure the user exists
    const maybeUser = await db.user.findUnique({
      where: { id: session.userId },
    });

    if (!maybeUser) {
      user = await db.user.create({ data: { isGuest: true } });
      session.userId = user.id;
      session.isGuest = true;
      await session.save();
    }
  }

  // TODO: Rethink return type
  return { session, user };
}
