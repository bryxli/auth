import { describe, it, expect } from "vitest";
import { getUserById, putUser } from "../src/db";

const mockUser = {
  user_id: "testid",
  password: "foo",
};

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
