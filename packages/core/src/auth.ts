export * as Auth from "./auth";
import jwt from "jsonwebtoken";
import { UserSchema } from "./types";

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { User } from "./types";

const JWT_SECRET = process.env.JWT_SECRET!;

const parseUser = (eventBody: string | undefined) => {
  const user: User = JSON.parse(eventBody || "{}");
  UserSchema.parse(user);
  return user;
};

/**
 * Authenticates a user.
 *
 * @param event - The API Gateway event object containing the user_id, and any authentication values
 * @returns Signed JWT token.
 * @throws Error if auth fails.
 */
export const authenticate = async (event: APIGatewayProxyEventV2) => {
  const user = parseUser(event.body);

  const userRecord = await getUserById(user.user_id);
  if (!userRecord) {
    throw new Error("User not found");
  }

  switch (user.type) {
    case "google":
      /* TODO: authenticate using Google */
      break;
    default:
      if (user.password !== userRecord.password) {
        throw new Error("Invalid login.");
      }
      break;
  }

  const jwtPayload = { user_id: user.user_id };
  const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "1h" });

  return token;
};

/**
 * Registers a user using default credentials
 *
 * @param event - The API Gateway event object container the user_id and password
 * @returns The registered user // TODO: this should exclude sensitive data
 * @throws Error if register fails.
 */
export const register = async (event: APIGatewayProxyEventV2) => {
  const user = parseUser(event.body);

  const userRecord = await getUserById(user.user_id);
  if (userRecord) {
    const { password } = userRecord;
    if (password) {
      /* TODO: edge case: change password request */
      throw new Error("Password already exists.");
    }
  }

  /* TODO: create a password for user / new user, ensure only password is updated */
  const registeredUser = await registerUser(user, "password");

  return {
    user_id: registeredUser.user_id,
  };
};
