/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach } from "vitest";
import SignInUseCase, { SignInUseCaseDto } from "./SignInUseCase";
import { AuthContract, AlreadyLoggedInError } from "../contracts/AuthContract";
import { User } from "@prisma/client";
import { mock, MockProxy } from "vitest-mock-extended";

describe("SignInUseCase", () => {
  let auth: MockProxy<AuthContract>;
  let signInUseCase: SignInUseCase;
  const validInput: SignInUseCaseDto = {
    email: "test@example.com",
    password: "password123",
  };

  beforeEach(() => {
    auth = mock<AuthContract>();
    signInUseCase = new SignInUseCase(auth);
  });

  it("should successfully sign in a user", async () => {
    auth.attempt.mockResolvedValue(true);

    const result = await signInUseCase.execute(validInput);

    expect(auth.attempt).toHaveBeenCalledWith(
      validInput.email,
      validInput.password,
    );
    expect(result).toBe(true);
  });

  it("should throw AlreadyLoggedInError if a non-guest user is already logged in", async () => {
    const existingUser: User = {
      id: 1,
      email: "existing@example.com",
      password: "hashhashhash",
      name: "Existing User",
      isGuest: false,
      currentUnitId: 42,
      currentLessonId: 42,
      createdAt: new Date(),
    };
    auth.user.mockResolvedValue(existingUser);

    await expect(signInUseCase.execute(validInput)).rejects.toThrow(
      AlreadyLoggedInError,
    );
    expect(auth.user).toHaveBeenCalled();
    expect(auth.attempt).not.toHaveBeenCalled();
  });

  it("should allow sign in if current user is a guest", async () => {
    const guestUser: User = {
      id: 1,
      email: "guest@example.com",
      password: "hashhashhash",
      name: "Guest User",
      isGuest: true,
      currentUnitId: 42,
      currentLessonId: 42,
      createdAt: new Date(),
    };
    auth.user.mockResolvedValue(guestUser);
    auth.attempt.mockResolvedValue(true);

    await expect(signInUseCase.execute(validInput)).resolves.toBe(true);

    expect(auth.user).toHaveBeenCalled();
    expect(auth.attempt).toHaveBeenCalledWith(
      validInput.email,
      validInput.password,
    );
  });

  it("should pass through errors from auth.attempt", async () => {
    auth.user.mockResolvedValue(null);
    auth.attempt.mockRejectedValue(new Error("Invalid credentials"));

    await expect(signInUseCase.execute(validInput)).rejects.toThrow(
      "Invalid credentials",
    );
    expect(auth.user).toHaveBeenCalled();
    expect(auth.attempt).toHaveBeenCalledWith(
      validInput.email,
      validInput.password,
    );
    expect(auth.login).not.toHaveBeenCalled();
  });
});
