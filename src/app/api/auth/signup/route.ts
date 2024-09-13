import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/container";
import signUpActionFactory from "@/core/actions/signUpAction";
import {
  AlreadyLoggedInError,
  EmailAlreadyTakenError,
} from "@/core/auth/Errors";
import { redirect } from "next/navigation";

export interface SignUpRouteFields {
  name: string;
  email: string;
  password: string;
}

export type SignUpRouteErrors = {
  [K in keyof SignUpRouteFields]?: string;
};

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(request: NextRequest) {
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

  const signUpAction = signUpActionFactory(
    await container.resolve("session"),
    container.resolve("userRepository"),
  );

  try {
    await signUpAction(validated.data);
  } catch (err) {
    if (err instanceof AlreadyLoggedInError) {
      return NextResponse.json(
        { error: "already_logged_in", message: "You are already logged in" },
        { status: 400 },
      );
    }

    if (err instanceof EmailAlreadyTakenError) {
      const errors = {
        email: "Email already in use",
      } satisfies SignUpRouteErrors;
      return NextResponse.json({ errors }, { status: 422 });
    }
  }

  redirect("/");
}
