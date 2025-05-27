export * as Auth from "./auth";
import * as jwt from "jsonwebtoken";
import { UserSchema } from "./utils/types";
import { getUserById, putUser } from "./utils/db";

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { User } from "./utils/types";

const JWT_SECRET = process.env.JWT_SECRET || "default";

const parseUser = (eventBody: string | undefined) => {
  const user: User = JSON.parse(eventBody || "{}");
  UserSchema.parse(user);
  return user;
};

const filterResponse = (user: User) => {
  return {
    ...user,
    password: "",
  };
};

/**
 * Authenticates a user.
 *
 * @param event - The API Gateway event object containing the user_id, and any authentication values.
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
      /* feature: authenticate using Google */
      break;
    default:
      if (user.password !== userRecord.password) {
        throw new Error("Invalid login");
      }
      break;
  }

  const jwtPayload = filterResponse(userRecord);
  const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "1h" });

  return token;
};

/**
 * Registers a user using default credentials
 *
 * @param event - The API Gateway event object container the user_id and password.
 * @returns The registered user.
 * @throws Error if register fails.
 */
export const register = async (event: APIGatewayProxyEventV2) => {
  const user = parseUser(event.body);

  let newUser: User = {
    user_id: user.user_id,
    password: user.password,
  };
  const userRecord = await getUserById(user.user_id);
  if (userRecord) {
    const { password } = userRecord;
    if (password) {
      /* edge case: change password request */
      throw new Error("Password already exists");
    }
    newUser = userRecord;
    newUser.password = user.password;
  }

  const registeredUser = await putUser(newUser);

  return filterResponse(registeredUser);
};
