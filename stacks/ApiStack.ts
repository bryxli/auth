import { Api, StackContext } from "sst/constructs";

/**
 * Defines the API stack and its corresponding routes.
 *
 * @param stack - The SST StackContext, provided automatically by SST.
 * @returns An object containing the API construct.
 */
export function API({ stack }: StackContext) {
  const api = new Api(stack, "api", {
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
