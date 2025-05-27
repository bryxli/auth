import { Api, StackContext, use } from "sst/constructs";
import { Dynamo } from "./DynamoStack";

/**
 * Defines the API stack and its corresponding routes.
 *
 * @param stack - The SST StackContext, provided automatically by SST.
 * @returns An object containing the API construct.
 */
export function API({ stack }: StackContext) {
  const { users } = use(Dynamo);

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        runtime: "nodejs20.x",
        permissions: [users],
      },
    },
    routes: {
      /**
       * @route GET /
       * Returns a simple health check response.
       */
      "GET /": "packages/functions/src/health.handler",

      /**
       * @route POST /user/authenticate
       * Creates a new authentication request.
       */
      "POST /authenticate": "packages/functions/src/auth.authenticate",

      /**
       * @route POST /user/register
       * Creates a new user account using default type credentials.
       */
      "POST /register": "packages/functions/src/auth.register",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
}
