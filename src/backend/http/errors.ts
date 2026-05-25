export class BackendError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly code = "BACKEND_ERROR",
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "BackendError";
  }
}

export function isBackendError(error: unknown): error is BackendError {
  return error instanceof BackendError;
}

export function assertRequired(value: unknown, message: string, code: string) {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  throw new BackendError(message, 400, code);
}

