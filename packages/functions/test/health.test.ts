import { describe, it, expect } from "vitest";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { handler } from "../src/health";

const mockEvent: APIGatewayProxyEventV2 = {} as APIGatewayProxyEventV2;
const mockContext: Context = {} as Context;

describe("Health Check API", () => {
  it("should return 200 and 'Healthy!'", async () => {
    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("Healthy!");
  });
});
