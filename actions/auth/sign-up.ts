"use server"

import { prisma } from "@/lib/prisma"
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth.schema"
import bcrypt from "bcryptjs"

export async function signUp(input: SignUpInput) {
  try {
    const validated = signUpSchema.parse(input)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10)

    // Create user with USER role
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        password: hashedPassword,
        role: "USER",
      },
    })

    return { success: true, data: { id: user.id, email: user.email } }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Failed to register user" }
  }
}

// Register business partner with BUSINESS_PARTNER role
export async function registerPartner(input: SignUpInput) {
  try {
    const validated = signUpSchema.parse(input)

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10)

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        password: hashedPassword,
        role: "BUSINESS_PARTNER",
      },
    })

    return { success: true, data: { id: user.id, email: user.email } }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Failed to register partner" }
  }
}
