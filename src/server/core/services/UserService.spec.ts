/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";
import {
  UserService,
  CreateUserDto,
  UpdateUserDto,
  CreateUserValidationError,
} from "./UserService";
import UserRepository from "../repositories/UserRepository";
import { HashContract } from "../contracts/HashContract";
import { z } from "zod";
import { User } from "@prisma/client";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: MockProxy<UserRepository>;
  let hashContract: MockProxy<HashContract>;

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

  beforeEach(() => {
    userRepository = mock<UserRepository>();
    hashContract = mock<HashContract>();
    userService = new UserService(hashContract, userRepository, z);
  });

  describe("create", () => {
    const validCreateUserDto: CreateUserDto = {
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
    };

    it("should create a new regular user with valid data", async () => {
      const inputData = { ...validCreateUserDto };
      hashContract.make.mockResolvedValue("hashedpassword");
      userRepository.create.mockResolvedValue(mockUser);

      const result = await userService.create(inputData);

      expect(hashContract.make).toHaveBeenCalledWith(
        validCreateUserDto.password,
      );
      expect(userRepository.create).toHaveBeenCalledWith({
        ...validCreateUserDto,
        password: "hashedpassword",
        isGuest: false,
      });
      expect(result).toEqual(mockUser);
    });

    it("should throw CreateUserValidationError with invalid data", async () => {
      const invalidData = { ...validCreateUserDto, email: "invalid-email" };

      await expect(userService.create(invalidData)).rejects.toThrow(
        CreateUserValidationError,
      );
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("createGuest", () => {
    it("should create a guest user", async () => {
      const guestUser = { ...mockUser, isGuest: true };
      userRepository.create.mockResolvedValue(guestUser);

      const result = await userService.createGuest();

      expect(userRepository.create).toHaveBeenCalledWith({ isGuest: true });
      expect(result).toEqual(guestUser);
    });
  });

  describe("update", () => {
    const validUpdateUserDto: UpdateUserDto = {
      name: "Updated User",
    };

    it("should update a user with valid data", async () => {
      const inputData = { ...validUpdateUserDto };
      const updatedUser = { ...mockUser, ...validUpdateUserDto };
      userRepository.update.mockResolvedValue(updatedUser);

      const result = await userService.update(1, inputData);

      expect(userRepository.update).toHaveBeenCalledWith(1, validUpdateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it("should hash the password if included in the update", async () => {
      const updateWithPassword = {
        ...validUpdateUserDto,
        password: "newpassword123",
      };
      const inputData = { ...updateWithPassword };
      hashContract.make.mockResolvedValue("newhashed");
      userRepository.update.mockResolvedValue({
        ...mockUser,
        ...updateWithPassword,
        password: "newhashed",
      });

      await userService.update(1, inputData);

      expect(hashContract.make).toHaveBeenCalledWith("newpassword123");
      expect(userRepository.update).toHaveBeenCalledWith(1, {
        ...updateWithPassword,
        password: "newhashed",
      });
    });

    it("should throw CreateUserValidationError with invalid data", async () => {
      const invalidData = { email: "invalid-email" };

      await expect(userService.update(1, invalidData)).rejects.toThrow(
        CreateUserValidationError,
      );
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("promote", () => {
    const promoteUserDto: CreateUserDto = {
      name: "Promoted User",
      email: "promoted@example.com",
      password: "promotedpass123",
    };

    it("should promote a guest user to a regular user", async () => {
      const inputData = { ...promoteUserDto };
      const promotedUser = { ...mockUser, ...promoteUserDto, isGuest: false };
      hashContract.make.mockResolvedValue("hashedpromotedpass");
      userRepository.update.mockResolvedValue(promotedUser);

      const result = await userService.promote(1, inputData);

      expect(hashContract.make).toHaveBeenCalledWith(promoteUserDto.password);
      expect(userRepository.update).toHaveBeenCalledWith(1, {
        ...promoteUserDto,
        password: "hashedpromotedpass",
        isGuest: false,
      });
      expect(result).toEqual(promotedUser);
    });

    it("should throw CreateUserValidationError with invalid data", async () => {
      const invalidData = { ...promoteUserDto, email: "invalid-email" };

      await expect(userService.promote(1, invalidData)).rejects.toThrow(
        CreateUserValidationError,
      );
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });
});
