import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { errorMap } from "zod-validation-error";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { hash, argon2id } from "argon2";

export interface SignUpRouteFields {
  name: string;
  email: string;
  password: string;
}

export type SignUpRouteErrors = {
  [K in keyof SignUpRouteFields]?: string;
} & {
  form?: string;
};

z.setErrorMap(errorMap);
const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(request: NextRequest) {
  const { session } = await getSession();
  if (session.isGuest === false) {
    return NextResponse.json(
      { error: "already_logged_in", message: "You are already logged in" },
      { status: 400 },
    );
  }

  const validated = schema.safeParse(await request.json());
  if (!validated.success) {
    const errors: SignUpRouteErrors = {};
    const zodErrors = validated.error.flatten().fieldErrors;
    Object.entries(zodErrors).forEach(([field, messages]) => {
      if (field in errors) {
        return;
      }
      const message = messages?.[0];
      if (message) {
        errors[field as keyof SignUpRouteFields] = message;
      }
    });

    return NextResponse.json({ errors }, { status: 422 });
  }

  if (await db.user.findUnique({ where: { email: validated.data.email } })) {
    const errors = {
      email: "Email already in use",
    } satisfies SignUpRouteErrors;
    return NextResponse.json({ errors }, { status: 422 });
  }

  // See OWASP Password Storage Cheat Sheet
  // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
  const hashed = await hash(validated.data.password, {
    type: argon2id,
    memoryCost: 19 * 1024,
    timeCost: 2,
    parallelism: 1,
  });

  if (session.userId) {
    // Promote guest user to full user
    await db.user.update({
      where: { id: session.userId },
      data: {
        isGuest: false,
        email: validated.data.email,
        name: validated.data.name,
        password: hashed,
      },
    });

    session.isGuest = false;
    session.save();
  } else {
    // Create new user
    const user = await db.user.create({
      data: {
        isGuest: false,
        email: validated.data.email,
        name: validated.data.name,
        password: hashed,
      },
    });

    session.userId = user.id;
    session.isGuest = false;
    session.save();
  }

  return new Response(null, { status: 204 });
}
