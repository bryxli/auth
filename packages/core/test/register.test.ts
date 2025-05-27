process.env.JWT_SECRET = "test_secret";

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ZodError } from "zod";

import { register } from "../src/auth";
import * as db from "../src/db";

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { User } from "../src/types";

const mockGetUserById = vi.spyOn(db, "getUserById");
const mockPutUser = vi.spyOn(db, "putUser");
const mockUser: User = { user_id: "testuser" };

describe("register", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should register a new user successfully", async () => {
    mockGetUserById.mockResolvedValue(mockUser);
    mockPutUser.mockResolvedValue(mockUser);

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    const user = await register(event);

    expect(user).toEqual(mockUser);
    expect(mockGetUserById).toHaveBeenCalledWith(mockUser.user_id);
    expect(mockPutUser).toHaveBeenCalledWith(mockUser);
  });

  it("should throw an error if password already exists", async () => {
    mockGetUserById.mockResolvedValue({
      ...mockUser,
      password: "testpassword",
    });

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    await expect(() => register(event)).rejects.toThrow(
      "Password already exists",
    );
  });

  it("should handle undefined event body", async () => {
    const event = {} as APIGatewayProxyEventV2;

    await expect(() => register(event)).rejects.toThrow(ZodError);
  });
});
