import type { UserRole, KYCStatus, VehicleStatus, BookingStatus, PaymentStatus, PartnerType } from "@prisma/client"

export type { UserRole, KYCStatus, VehicleStatus, BookingStatus, PaymentStatus, PartnerType }

export interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string | null
  errors?: Record<string, string[]>
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: UserRole
  kycStatus?: KYCStatus
  partnerType?: PartnerType
  partnerId?: string
}
