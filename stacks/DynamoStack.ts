import { StackContext, Table } from "sst/constructs";

/**
 * Defines and configures the DynamoDB resources used in the application.
 *
 * This stack creates a single DynamoDB table named "users", which is used
 * to store user account data. The table uses `user_id` as the partition key.
 *
 * @param stack - The SST StackContext, provided automatically by SST.
 * @returns An object containing a reference to the `users` table.
 */
export function Dynamo({ stack }: StackContext) {
  const users = new Table(stack, "users", {
    fields: {
      user_id: "string",
    },
    primaryIndex: { partitionKey: "user_id" },
  });

  return { users };
}
