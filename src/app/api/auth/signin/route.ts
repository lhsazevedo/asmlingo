import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { container } from "@/server/container";
import { AlreadyLoggedInError } from "@/server/core/contracts/AuthContract";
import {
  ApiErrorResponse,
  badRequest,
  internalServerError,
  noContent,
  unprocessableEntity,
} from "@/app/api/util";

export interface SignUpRouteFields {
  name: string;
  email: string;
  password: string;
}

export type SignUpRouteValidationErrorResponse = {
  errors: { [K in keyof SignUpRouteFields]?: string };
};

export type SignUpRouteErrors =
  | ApiErrorResponse
  | SignUpRouteValidationErrorResponse;

export async function POST(request: NextRequest) {
  try {
    const json = z
      .object({
        email: z.string(),
        password: z.string(),
      })
      .parse(await request.json());

    const loggedIn = await container
      .createScope()
      .resolve("SignInUseCase")
      .execute(json);

    if (loggedIn) {
      return noContent();
    }

    return unprocessableEntity({ form: "Invalid email or password" });
  } catch (err) {
    if (err instanceof ZodError) {
      return badRequest("invalid_input", "Invalid input");
    }

    if (err instanceof AlreadyLoggedInError) {
      return badRequest("already_logged_in", "You are already logged in");
    }

    return internalServerError();
  }

  return new NextResponse(null, { status: 204 });
}
