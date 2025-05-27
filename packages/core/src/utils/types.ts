import { z } from "zod";

/**
 * The structure of an authenticated object.
 * @property user_id - A unique identifier for the user, the partition key in DynamoDB.
 */
export const UserSchema = z.object({
  user_id: z.string(),
  password: z.string().optional(),
  type: z.string().optional(),
});

/**
 * User type inferred from UserSchema.
 */
export type User = z.infer<typeof UserSchema>;
