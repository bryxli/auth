import { ZodError } from "zod";

export const errorHandler = (e: Error | unknown) => {
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
  /*                          Custom Errors                           */
  /* ---------------------------------------------------------------- */
  if (e instanceof Error && e.message === "Invalid login") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }
  if (e instanceof Error && e.message === "Password already exists") {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: e.message }),
    };
  }
  if (e instanceof Error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
  /* ----------------------------------------------------------------- */
  return {
    statusCode: 500,
    body: JSON.stringify({ error: "Internal Server Error" }),
  };
};
