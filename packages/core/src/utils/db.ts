import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import type { User } from "./types";

const TABLE_NAME = process.env.USERS_TABLE || "dev-auth-users";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Gets a user from the DynamoDB table.
 *
 * This function queries the `users` table for an item with the given `user_id`.
 *
 * @param user_id - A `string` containing the `user_id` to search for.
 * @returns The user item.
 */
export async function getUserById(user_id: string) {
  const res = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { user_id },
    }),
  );

  return res?.Item as User | undefined;
}

/**
 * Puts a user into the DynamoDB table.
 *
 * This function writes the entire `User` object into the `users` table.
 * If a record with the same `user_id` already exists, it will be replaced.
 *
 * @param user - A `User` object containing the data to store.
 * @returns The user item.
 */
export async function putUser(user: User) {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: user,
    }),
  );

  return user;
}
