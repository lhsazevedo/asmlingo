import { NextResponse } from "next/server";

// Generic type for route fields
export type RouteFields<T extends Record<string, unknown>> = T;

// Generic type for validation error response
export type ValidationErrorResponse<
  T extends RouteFields<Record<string, unknown>>,
> = {
  errors: { [K in keyof T]?: string };
};

export type ApiErrorResponse = {
  error: string;
  message: string;
};

// 4xx

export function badRequest(error: string, message?: string) {
  return NextResponse.json({ error, message } as ApiErrorResponse, {
    status: 400,
  });
}

export function unprocessableEntity<T>(errors: T) {
  return NextResponse.json({ errors }, { status: 422 });
}

// 5xx

export function internalServerError() {
  return NextResponse.json(
    {
      error: "internal_server_error",
      message: "Something went wrong, try again later!",
    } as ApiErrorResponse,
    {
      status: 500,
    },
  );
}
