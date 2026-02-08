import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { UserRole } from "@prisma/client"
import type { SessionUser } from "@/lib/types"

export async function getCurrentSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
    kycStatus: session.user.kycStatus,
    partnerType: session.user.partnerType,
    partnerId: session.user.partnerId,
  }
}

export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("Authentication required")
  }

  return session
}

export async function requireRole(roles: UserRole[]) {
  const session = await requireAuth()

  if (!roles.includes(session.user.role)) {
    throw new Error("Insufficient permissions")
  }

  return session
}

export async function requireAdmin() {
  return await requireRole(["ADMIN"])
}

export async function requirePartner() {
  return await requireRole(["INDIVIDUAL_PARTNER", "BUSINESS_PARTNER", "ADMIN"])
}

export async function requireVerifiedPartner() {
  const session = await requirePartner()

  if (session.user.role !== "ADMIN" && session.user.kycStatus !== "VERIFIED") {
    throw new Error("Partner verification required")
  }

  return session
}

export function isAdmin(role?: string) {
  return role === "ADMIN"
}

export function isUser(role?: string) {
  return role === "USER"
}

export function isIndividualPartner(role?: string) {
  return role === "INDIVIDUAL_PARTNER"
}

export function isBusinessPartner(role?: string) {
  return role === "BUSINESS_PARTNER"
}

export function isPartner(role?: string) {
  return role === "INDIVIDUAL_PARTNER" || role === "BUSINESS_PARTNER"
}

export function isPartnerOrAdmin(role?: string) {
  return isPartner(role) || isAdmin(role)
}
