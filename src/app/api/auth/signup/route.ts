import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { container } from "@/server/container";
import {
  AlreadyLoggedInError,
  EmailAlreadyTakenError,
} from "@/server/core/contracts/AuthContract";
import { CreateUserValidationError } from "@/server/core/services/UserService";
import {
  ApiErrorResponse,
  badRequest,
  internalServerError,
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
        name: z.string(),
        email: z.string(),
        password: z.string(),
      })
      .parse(await request.json());

    await container.createScope().resolve("SignUpAction").execute(json);
  } catch (err) {
    if (err instanceof ZodError) {
      return badRequest("invalid_input", "Invalid input");
    }

    if (err instanceof AlreadyLoggedInError) {
      return badRequest("already_logged_in", "You are already logged in");
    }

    if (err instanceof EmailAlreadyTakenError) {
      return unprocessableEntity({ email: "Email already in use" });
    }

    if (err instanceof CreateUserValidationError) {
      return unprocessableEntity(err.messages);
    }

    return internalServerError();
  }

  return new NextResponse(null, { status: 204 });
}
