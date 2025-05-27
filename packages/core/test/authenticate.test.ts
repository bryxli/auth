process.env.JWT_SECRET = "test_secret";

import { describe, it, expect, vi, beforeEach } from "vitest";

import { authenticate } from "../src/auth";
import * as db from "../src/db";

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { User } from "../src/types";

const mockGetUserById = vi.spyOn(db, "getUserById");
const mockUser: User = { user_id: "testuser", password: "testpassword" };
const mockToken = "mock_jwt_token";

vi.mock("jsonwebtoken", () => ({
  sign: vi.fn(() => mockToken),
}));

describe("register", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return a signed JWT token upon successful authentication", async () => {
    mockGetUserById.mockResolvedValue(mockUser);

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    const token = await authenticate(event);

    expect(token).toEqual(mockToken);
    expect(mockGetUserById).toHaveBeenCalledWith(mockUser.user_id);
  });

  it("should return a signed JWT token upon successful authentication with Google", async () => {
    mockGetUserById.mockResolvedValue({ ...mockUser, type: "google" });

    const event = {
      body: JSON.stringify({ ...mockUser, type: "google" }),
    } as APIGatewayProxyEventV2;

    const token = await authenticate(event);

    expect(token).toEqual(mockToken);
    expect(mockGetUserById).toHaveBeenCalledWith(mockUser.user_id);
  });

  it("should throw an error if user is not found", async () => {
    mockGetUserById.mockResolvedValue(undefined);

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    await expect(() => authenticate(event)).rejects.toThrow("User not found");
  });

  it("should throw an error if user password does not match the record", async () => {
    mockGetUserById.mockResolvedValue({
      ...mockUser,
      password: "userPassword",
    });

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    await expect(() => authenticate(event)).rejects.toThrow("Invalid login");
  });
});
