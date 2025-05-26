import { ApiHandler } from "sst/node/api";

import { Auth } from "@auth/core/auth";
import { errorHandler } from "./utils/errorHandler";

/**
 * Auth endpoint.
 *
 * @param event - The API Gateway event object containing the credentials to authenticate.
 * @returns status 200 and JWT token upon successful authentication.
 * @returns status 400 when input validation fails.
 * @returns status 401 when unauthorized.
 * @returns status 405 when not POST.
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
    const token = await Auth.authenticate(event);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Authenticated",
        token,
      }),
    };
  } catch (e: unknown) {
    return errorHandler(e);
  }
});

/**
 * Default register endpoint.
 *
 * @param event - The API Gateway event object containing the credentials to register.
 * @returns status 200 upon successful registration.
 * @returns status 400 when input validation fails.
 * @returns status 401 when unauthorized.
 * @returns status 405 when not POST.
 * @returns status 500 otherwise.
 */
export const register = ApiHandler(async (event) => {
  if (event.requestContext.http.method !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const userInfo = await Auth.register(event);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Registered",
        userInfo,
      }),
    };
  } catch (e: unknown) {
    return errorHandler(e);
  }
});
