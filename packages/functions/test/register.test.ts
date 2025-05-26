import { describe, it, expect, vi, beforeEach } from "vitest";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { ZodError, ZodIssue } from "zod";
import { Auth } from "@auth/core/auth";
import { register } from "../src/auth";

vi.mock("@auth/core/auth", () => ({
  Auth: {
    register: vi.fn(),
  },
}));

let mockEvent: APIGatewayProxyEventV2;
const mockContext: Context = {} as Context;
const mockUser = {
  user_id: "testuser",
  password: "testpassword",
};

describe("Register API", () => {
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

    const res = await register(mockEvent, mockContext);

    expect(res.statusCode).toBe(405);
    expect(res.body).toBe(JSON.stringify({ error: "Method Not Allowed" }));
  });

  it("should return 200 and userInfo when successful", async () => {
    (Auth.register as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      return mockUser;
    });

    const res = await register(mockEvent, mockContext);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(
      JSON.stringify({ message: "Registered", userInfo: mockUser }),
    );
    expect(Auth.register).toHaveBeenCalled();
  });

  it("should return 400 and error when SyntaxError", async () => {
    (Auth.register as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new SyntaxError();
    });

    const res = await register(mockEvent, mockContext);

    expect(res.statusCode).toBe(400);
    expect(res.body).toBe(JSON.stringify({ error: "Invalid JSON" }));
    expect(Auth.register).toHaveBeenCalled();
  });

  it("should return 400 and error when ZodError", async () => {
    const zodIssue = { message: "ZodIssue" } as ZodIssue;

    (Auth.register as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      const mockZodIssues = [zodIssue];
      throw new ZodError(mockZodIssues);
    });

    const res = await register(mockEvent, mockContext);

    expect(res.statusCode).toBe(400);
    expect(res.body).toBe(
      JSON.stringify({ error: "Validation failed", issues: [zodIssue] }),
    );
    expect(Auth.register).toHaveBeenCalled();
  });

  it("should return 403 and error when password already exists", async () => {
    (Auth.register as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error("Password already exists");
    });

    const res = await register(mockEvent, mockContext);

    expect(res.statusCode).toBe(403);
    expect(res.body).toBe(JSON.stringify({ error: "Password already exists" }));
    expect(Auth.register).toHaveBeenCalled();
  });

  it("should return 500 and error when other error", async () => {
    (Auth.register as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error("Other error");
    });

    const res = await register(mockEvent, mockContext);

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(JSON.stringify({ error: "Other error" }));
    expect(Auth.register).toHaveBeenCalled();
  });

  it("should return 500 and error when unknown", async () => {
    (Auth.register as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw "Unknown";
    });

    const res = await register(mockEvent, mockContext);

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe(JSON.stringify({ error: "Internal Server Error" }));
    expect(Auth.register).toHaveBeenCalled();
  });
});
