import type { ActionResponse } from "@/lib/types"

export function successResponse<T>(data: T): ActionResponse<T> {
  return {
    success: true,
    data,
    error: null
  }
}

export function errorResponse(error: string) {
  return {
    success: false,
    error,
    data: null
  }
}

export function validationErrorResponse(errors: Record<string, string[]>): ActionResponse {
  return {
    success: false,
    error: "Validation failed",
    errors,
  }
}
