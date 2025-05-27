import { describe, it, expect, vi } from "vitest";
import { getUserById, putUser } from "../src/utils/db";

const mockUser = {
  user_id: "testid",
  password: "testpassword",
};

vi.mock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocumentClient: {
    from: vi.fn(() => ({
      send: vi.fn(() => {
        return {
          Item: mockUser,
        };
      }),
    })),
  },
  GetCommand: vi.fn(),
  PutCommand: vi.fn(),
}));

describe("getUserById", () => {
  it("should return the item upon succesful retrieval", async () => {
    const result = await getUserById(mockUser.user_id);
    expect(result).toStrictEqual(mockUser);
  });
});

describe("putUser", () => {
  it("should return the item upon succesful update", async () => {
    const result = await putUser(mockUser);
    expect(result).toStrictEqual(mockUser);
  });
});
