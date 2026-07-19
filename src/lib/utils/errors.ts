import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "AUTH_REQUIRED");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(resource + " not found", 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429, "RATE_LIMIT");
    this.name = "RateLimitError";
  }
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    // ZodError in newer versions uses 'issues' instead of 'errors'
    const details = (error as any).issues || (error as any).errors || [];
    return NextResponse.json(
      {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: Array.isArray(details) ? details.map((e: any) => ({
          field: e.path?.join(".") || "unknown",
          message: e.message || "Invalid value",
        })) : [],
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === "development" 
          ? error.message 
          : "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: "An unexpected error occurred",
      code: "INTERNAL_ERROR",
    },
    { status: 500 }
  );
}

export function withErrorHandler(handler: Function) {
  return async function errorHandlerWrapper(...args: any[]) {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}