import { ApiHandler } from "sst/node/api";

/**
 * Health check endpoint.
 *
 * Returns a 200 status to indicate the service is running.
 */
export const handler = ApiHandler(async () => {
  return {
    statusCode: 200,
    body: "Healthy!",
  };
});
