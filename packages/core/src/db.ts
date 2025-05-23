import type { User } from "./types";

/**
 * Gets a user from the DynamoDB table.
 *
 * This function queries the `users` table for an item with the given `user_id`.
 *
 * @param user_id - A `string` containing the `user_id` to search for.
 * @returns The result of the `GetCommand` operation.
 */
export async function getUserById(user_id: string) {
  /* TODO: retrieve user from DynamoDB */
  const res: User = {
    user_id,
    password: "foo",
  };

  return res;
}

/**
 * Puts a user into the DynamoDB table.
 *
 * This function writes the entire `User` object into the `users` table.
 * If a record with the same `user_id` already exists, it will be replaced.
 *
 * @param user - A `User` object containing the data to store.
 * @returns The result of the `PutCommand` operation.
 */
export async function putUser(user: User) {
  /* TODO: put user to DynamoDB */
  const res: User = {
    ...user,
  };

  return res;
}
