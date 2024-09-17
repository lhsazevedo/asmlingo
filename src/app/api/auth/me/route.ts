import { container } from "@/container";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { unauthorized } from "../../util";

export type PublicUser = Omit<User, "password">;

export async function GET() {
  const auth = container.createScope().resolve("auth");
  const user = await auth.user();

  if (!user) {
    return unauthorized();
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password, ...publicUser } = user;

  return NextResponse.json({ user: publicUser });
}
