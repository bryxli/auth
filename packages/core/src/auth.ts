export * as Auth from "./auth";
import jwt from "jsonwebtoken";
import { UserSchema } from "./types";

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { User } from "./types";

const JWT_SECRET = process.env.JWT_SECRET!; // TODO: Set this in .env

/**
 * Authenticates a user.
 *
 * @param event - The API Gateway event object containing the credentials to authenticate.
 * @returns Signed JWT token.
 * @throws Error if auth fails.
 */
export const authenticate = (event: APIGatewayProxyEventV2) => {
  const credentials: User = JSON.parse(event.body || "{}");
  UserSchema.parse(credentials);

  // TODO: create validation logic for authentication
  const isValid = true;
  if (!isValid) {
    throw new Error("Not authenticated");
  }

  const token = jwt.sign(credentials.user_id, JWT_SECRET, { expiresIn: "1h" });

  return token;
};
