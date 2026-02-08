import type { UserRole, KYCStatus, PartnerType } from "@prisma/client"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      kycStatus?: KYCStatus
      partnerType?: PartnerType
      partnerId?: string
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
    kycStatus?: KYCStatus
    partnerType?: PartnerType
    partnerId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    kycStatus?: KYCStatus
    partnerType?: PartnerType
    partnerId?: string
  }
}
