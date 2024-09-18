/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";
import SignUpUseCase, { SignUpUseCaseDto } from "./SignUpUseCase";
import {
  AuthContract,
  AlreadyLoggedInError,
  EmailAlreadyTakenError,
} from "../contracts/AuthContract";
import { UserService } from "../services/UserService";
import UserRepository from "../repositories/UserRepository";
import { User } from "@prisma/client";

describe("SignUpUseCase", () => {
  let signUpUseCase: SignUpUseCase;
  let auth: MockProxy<AuthContract>;
  let userRepository: MockProxy<UserRepository>;
  let userService: MockProxy<UserService>;

  const mockUser: User = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    password: "hashedpassword",
    isGuest: false,
    currentUnitId: 1,
    currentLessonId: 1,
    createdAt: new Date(),
  };

  const mockInput: SignUpUseCaseDto = {
    name: "New User",
    email: "newuser@example.com",
    password: "newpassword123",
  };

  beforeEach(() => {
    auth = mock<AuthContract>();
    userRepository = mock<UserRepository>();
    userService = mock<UserService>();
    signUpUseCase = new SignUpUseCase(auth, userRepository, userService);
  });

  it("should create a new user", async () => {
    auth.user.mockResolvedValue(null);
    userRepository.findByEmail.mockResolvedValue(null);
    userService.create.mockResolvedValue(mockUser);

    const result = await signUpUseCase.execute(mockInput);

    expect(userService.create).toHaveBeenCalledWith(mockInput);
    expect(auth.login).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it("should promote a guest user to a regular user", async () => {
    const guestUser = { ...mockUser, isGuest: true };
    auth.user.mockResolvedValue(guestUser);
    userRepository.findByEmail.mockResolvedValue(null);
    userService.promote.mockResolvedValue(mockUser);

    const result = await signUpUseCase.execute(mockInput);

    expect(userService.promote).toHaveBeenCalledWith(guestUser.id, mockInput);
    expect(auth.login).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it("should throw AlreadyLoggedInError when a non-guest user is logged in", async () => {
    auth.user.mockResolvedValue(mockUser);

    await expect(signUpUseCase.execute(mockInput)).rejects.toThrow(
      AlreadyLoggedInError,
    );
    expect(userService.create).not.toHaveBeenCalled();
    expect(userService.promote).not.toHaveBeenCalled();
  });

  it("should throw EmailAlreadyTakenError when the email is already in use", async () => {
    auth.user.mockResolvedValue(null);
    userRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(signUpUseCase.execute(mockInput)).rejects.toThrow(
      EmailAlreadyTakenError,
    );
    expect(userService.create).not.toHaveBeenCalled();
    expect(userService.promote).not.toHaveBeenCalled();
  });

  it("should throw an error when user creation fails", async () => {
    auth.user.mockResolvedValue(null);
    userRepository.findByEmail.mockResolvedValue(null);
    userService.create.mockRejectedValue(new Error("Failed to create user"));

    await expect(signUpUseCase.execute(mockInput)).rejects.toThrow(
      "Failed to create user",
    );
    expect(auth.login).not.toHaveBeenCalled();
  });

  it("should not check for existing email if input email is empty", async () => {
    auth.user.mockResolvedValue(null);
    userService.create.mockResolvedValue(mockUser);

    const inputWithEmptyEmail = { ...mockInput, email: "" };
    await signUpUseCase.execute(inputWithEmptyEmail);

    expect(userRepository.findByEmail).not.toHaveBeenCalled();
    // Email will be validated in the UserService
    expect(userService.create).toHaveBeenCalledWith(inputWithEmptyEmail);
  });
});
