"use server"
import { signInSchema, type SignInInput } from "@/lib/validations/auth.schema"
import type { ActionResponse } from "@/lib/types"

// Keeping it for backwards compatibility but it's not the primary sign-in method

export async function signIn(input: SignInInput): Promise<ActionResponse> {
  try {
    signInSchema.parse(input)

    return {
      success: true,
      message: "Please use signIn from next-auth/react on the client",
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Invalid credentials" }
  }
}
