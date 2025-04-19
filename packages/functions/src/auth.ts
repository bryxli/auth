import { ApiHandler } from "sst/node/api";
import { ZodError } from "zod";

import { Auth } from "@auth/core/auth";

/**
 * Auth endpoint.
 *
 * @param event - The API Gateway event object containing the credentials to authenticate.
 * @returns status 200 and JWT token upon successful authentication.
 * @returns status 400 when input validation fails.
 * @returns status 401 when unauthorized.
 * @returns status 500 otherwise.
 */
export const authenticate = ApiHandler(async (event) => {
  if (event.requestContext.http.method !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const token = Auth.authenticate(event);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Authenticated",
        token,
      }),
    };
  } catch (e: unknown) {
    if (e instanceof SyntaxError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON" }),
      };
    }
    if (e instanceof ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Validation failed", issues: e.issues }),
      };
    }
    if (e instanceof Error && e.message === "Not authenticated") {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }
    if (e instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: e.message }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
});
