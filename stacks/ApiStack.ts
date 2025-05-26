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
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
}
