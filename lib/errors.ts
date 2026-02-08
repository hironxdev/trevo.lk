export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "You are not authorized to perform this action") {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404)
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>

  constructor(message = "Validation failed", errors: Record<string, string[]> = {}) {
    super(message, 400)
    this.errors = errors
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409)
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function handleError(error: unknown): { message: string; statusCode: number } {
  if (isAppError(error)) {
    return { message: error.message, statusCode: error.statusCode }
  }

  if (error instanceof Error) {
    console.error("[UNHANDLED_ERROR]", error)
    return { message: "An unexpected error occurred", statusCode: 500 }
  }

  console.error("[UNKNOWN_ERROR]", error)
  return { message: "An unexpected error occurred", statusCode: 500 }
}
