"use server"

// Sign out should be done on client side using signOut from "next-auth/react"
// This is kept for backwards compatibility
export async function signOut() {
  return {
    success: true,
    message: "Please use signOut from next-auth/react on the client",
  }
}
