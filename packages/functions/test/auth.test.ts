import { describe, it, expect, vi, beforeEach } from "vitest";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { ZodError, ZodIssue } from "zod";
import { Auth } from "@auth/core/auth";
import { authenticate } from "../src/auth";

vi.mock("@auth/core/auth", () => ({
  Auth: {
    authenticate: vi.fn(),
  },
}));

let mockEvent: APIGatewayProxyEventV2;
const mockContext: Context = {} as Context;

describe("Auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockEvent = {
      requestContext: {
        http: {
          method: "POST",
        },
      },
    } as APIGatewayProxyEventV2;
  });

  it("should return 405 and error when HTTP method not POST", async () => {
    mockEvent = {
      requestContext: {
        http: {
          method: "GET",
        },
      },
    } as APIGatewayProxyEventV2;

    const res = await authenticate(mockEvent, mockContext);

    expect(res.statusCode).toBe(405);
    expect(res.body).toBe(JSON.stringify({ error: "Method Not Allowed" }));
  });

  it("should return 200 and token when successful", async () => {
    (Auth.authenticate as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => "mock_token",
    );

    const res = await authenticate(mockEvent, mockContext);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(
      JSON.stringify({ message: "Authenticated", token: "mock_token" }),
    );
    expect(Auth.authenticate).toHaveBeenCalled();
  });

  it("should return 400 and error when SyntaxError", async () => {
    (Auth.authenticate as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => {
        throw new SyntaxError();
      },
    );

    const res = await authenticate(mockEvent, mockContext);

    expect(res.statusCode).toBe(400);
    expect(res.body).toBe(JSON.stringify({ error: "Invalid JSON" }));
    expect(Auth.authenticate).toHaveBeenCalled();
  });

  it("should return 400 and error when ZodError", async () => {
    const zodIssue = { message: "ZodIssue" } as ZodIssue;

    (Auth.authenticate as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => {
        const mockZodIssues = [zodIssue];
        throw new ZodError(mockZodIssues);
      },
    );

    const res = await authenticate(mockEvent, mockContext);

    expect(res.statusCode).toBe(400);
    expect(res.body).toBe(
      JSON.stringify({ error: "Validation failed", issues: [zodIssue] }),
    );
    expect(Auth.authenticate).toHaveBeenCalled();
  });

  it("should return 401 and error when unauthorized", async () => {
    (Auth.authenticate as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => {
        throw new Error("Not authenticated");
      },
    );

    const res = await authenticate(mockEvent, mockContext);

    expect(res.statusCode).toBe(401);
    expect(res.body).toBe(JSON.stringify({ error: "Unauthorized" }));
    expect(Auth.authenticate).toHaveBeenCalled();
  });

  it("should return 500 and error when other error", async () => {
    (Auth.authenticate as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => {
        throw new Error("Other error");
      },
    );

    const res = await authenticate(mockEvent, mockContext);

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(JSON.stringify({ error: "Other error" }));
    expect(Auth.authenticate).toHaveBeenCalled();
  });

  it("should return 500 and error when unknown", async () => {
    (Auth.authenticate as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => {
        throw "Unknown";
      },
    );

    const res = await authenticate(mockEvent, mockContext);

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(JSON.stringify({ error: "Internal Server Error" }));
    expect(Auth.authenticate).toHaveBeenCalled();
  });
});
