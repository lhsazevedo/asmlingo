/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";
import SignOutUseCase from "./SignOutUseCase";
import { AuthContract } from "../contracts/AuthContract";

describe("SignOutUseCase", () => {
  let signOutUseCase: SignOutUseCase;
  let auth: MockProxy<AuthContract>;

  beforeEach(() => {
    auth = mock<AuthContract>();
    signOutUseCase = new SignOutUseCase(auth);
  });

  it("should call auth.logout", async () => {
    await signOutUseCase.execute();
    expect(auth.logout).toHaveBeenCalledOnce();
  });

  it("should not throw an error if logout is successful", async () => {
    auth.logout.mockResolvedValue(undefined);
    await expect(signOutUseCase.execute()).resolves.not.toThrow();
  });

  it("should throw an error if logout fails", async () => {
    auth.logout.mockRejectedValue(new Error("Logout failed"));
    await expect(signOutUseCase.execute()).rejects.toThrow("Logout failed");
  });
});
