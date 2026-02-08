import { RentalType } from "@prisma/client"

export interface VehiclePricing {
  pricePerDay: number
  pricePerKm?: number | null
  monthlyPrice?: number | null
  depositRequired: number
  driverPricePerDay?: number | null
  driverPricePerKm?: number | null
  driverPricePerMonth?: number | null
  includedKmPerDay?: number | null
  includedKmPerMonth?: number | null
  unlimitedMileage?: boolean
}

export interface BookingPricingParams {
  vehicle: VehiclePricing
  startDate: Date
  endDate: Date
  rentalType: RentalType
  withDriver: boolean
}

export interface PricingBreakdown {
  rentalType: RentalType
  totalDays: number
  totalMonths: number
  remainingDays: number

  dailyRate: number
  monthlyRate: number
  vehicleSubtotal: number

  withDriver: boolean
  driverDailyRate: number
  driverMonthlyRate: number
  driverSubtotal: number

  includedKm: number
  extraKmRate: number

  subtotal: number
  deposit: number
  total: number // subtotal only; deposit separate

  pricePerUnit: number
  unitLabel: string
}

/** Helpers */
const MS_PER_DAY = 1000 * 60 * 60 * 24

function toMidnight(d: Date) {
  // local midnight to avoid time-zone/time-of-day issues
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function safeNum(n: unknown, fallback = 0): number {
  const v = typeof n === "number" ? n : Number(n)
  return Number.isFinite(v) ? v : fallback
}

/**
 * Days between start and end (end must be AFTER start).
 * Example: Feb 1 -> Feb 2 = 1 day
 */
export function calculateDays(startDate: Date, endDate: Date): number {
  const start = toMidnight(startDate).getTime()
  const end = toMidnight(endDate).getTime()
  const diff = end - start
  if (diff <= 0) return 0
  return Math.ceil(diff / MS_PER_DAY)
}

/**
 * Months between start and end (end must be AFTER start).
 * Example: Feb 1 -> Mar 1 = 1 month
 * Rounds up partial months.
 */
export function calculateMonths(startDate: Date, endDate: Date): number {
  const start = toMidnight(startDate)
  const end = toMidnight(endDate)
  if (end <= start) return 0

  const yearsDiff = end.getFullYear() - start.getFullYear()
  const monthsDiff = end.getMonth() - start.getMonth()
  const daysDiff = end.getDate() - start.getDate()

  let months = yearsDiff * 12 + monthsDiff
  // If there are leftover days, count as an extra month
  if (daysDiff > 0) {
    months += 1
  } else if (daysDiff < 0) {
    // If end day is before start day, don't count extra month
    // but since monthsDiff is already negative, nothing to do
  } else {
    // Same day of month, already a full month
    months += 0
  }

  return months > 0 ? months : 0
}

/**
 * Split days into (full 30-day months) + remaining days.
 * Example: 65 days => 2 months + 5 days
 */
export function splitIntoMonthsAndDays(totalDays: number): { months: number; remainingDays: number } {
  if (totalDays <= 0) return { months: 0, remainingDays: 0 }
  const months = Math.floor(totalDays / 30)
  const remainingDays = totalDays % 30
  return { months, remainingDays }
}

/**
 * Calculate complete pricing breakdown for a booking
 * Pricing rule:
 * - SHORT_TERM: bill by days
 * - LONG_TERM: bill by full 30-day months + remaining days
 */
export function calculateBookingPrice(params: BookingPricingParams): PricingBreakdown {
  const { vehicle, startDate, endDate, rentalType, withDriver } = params

  const totalDays = calculateDays(startDate, endDate)
  const isLongTerm = rentalType === RentalType.LONG_TERM

  // Rates
  const dailyRate = safeNum(vehicle.pricePerDay)
  const monthlyRate = safeNum(vehicle.monthlyPrice, dailyRate * 30)

  const driverDailyRate = safeNum(vehicle.driverPricePerDay)
  const driverMonthlyRate = safeNum(vehicle.driverPricePerMonth, driverDailyRate * 30)

  // Break duration
  const { months: fullMonths, remainingDays } = splitIntoMonthsAndDays(totalDays)
  const totalMonths = isLongTerm ? Math.max(1, fullMonths) : 0 // for display

  // Vehicle subtotal
  let vehicleSubtotal = 0
  if (isLongTerm) {
    // If totalDays < 30 but someone still picked LONG_TERM, we’ll treat it as 1 month minimum.
    // (Validation should block this, but this prevents weird totals)
    const billMonths = totalDays < 30 ? 1 : fullMonths
    const billRemainingDays = totalDays < 30 ? 0 : remainingDays

    vehicleSubtotal = monthlyRate * billMonths + dailyRate * billRemainingDays
  } else {
    vehicleSubtotal = dailyRate * totalDays
  }

  // Driver subtotal
  let driverSubtotal = 0
  if (withDriver) {
    if (isLongTerm) {
      const billMonths = totalDays < 30 ? 1 : fullMonths
      const billRemainingDays = totalDays < 30 ? 0 : remainingDays

      driverSubtotal = driverMonthlyRate * billMonths + driverDailyRate * billRemainingDays
    } else {
      driverSubtotal = driverDailyRate * totalDays
    }
  }

  // Included KM
  let includedKm = 0
  const unlimitedMileage = Boolean(vehicle.unlimitedMileage)

  if (!unlimitedMileage) {
    const includedKmPerDay = safeNum(vehicle.includedKmPerDay)
    const includedKmPerMonth = safeNum(vehicle.includedKmPerMonth)

    if (isLongTerm) {
      const billMonths = totalDays < 30 ? 1 : fullMonths
      const billRemainingDays = totalDays < 30 ? 0 : remainingDays

      includedKm = includedKmPerMonth * billMonths + includedKmPerDay * billRemainingDays
    } else {
      includedKm = includedKmPerDay * totalDays
    }
  }

  // Extra KM rate
  const vehicleKmRate = safeNum(vehicle.pricePerKm)
  const driverKmRate = safeNum(vehicle.driverPricePerKm)

  // Fallback rule (like your original):
  const extraKmRate = withDriver ? (driverKmRate || vehicleKmRate || 0) : (vehicleKmRate || 0)

  // If you want ADDITIVE (vehicle + driver) instead, replace above with:
  // const extraKmRate = withDriver ? vehicleKmRate + driverKmRate : vehicleKmRate

  const subtotal = vehicleSubtotal + driverSubtotal
  const deposit = safeNum(vehicle.depositRequired)

  // Display helpers
  const pricePerUnit = isLongTerm ? monthlyRate : dailyRate
  const unitLabel = isLongTerm ? "month" : "day"

  return {
    rentalType,
    totalDays,
    totalMonths,
    remainingDays,

    dailyRate,
    monthlyRate,
    vehicleSubtotal,

    withDriver,
    driverDailyRate,
    driverMonthlyRate,
    driverSubtotal,

    includedKm,
    extraKmRate,

    subtotal,
    deposit,
    total: subtotal, // Deposit shown separately

    pricePerUnit,
    unitLabel,
  }
}

/** Format price */
export function formatPrice(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0
  return `Rs ${safe.toLocaleString()}`
}

/** Rental type label */
export function getRentalTypeLabel(rentalType: RentalType): string {
  return rentalType === RentalType.LONG_TERM ? "Long-term" : "Short-term"
}

/** Validate duration */
export function isValidRentalDuration(
  startDate: Date,
  endDate: Date,
  rentalType: RentalType,
): { valid: boolean; message?: string } {
  const days = calculateDays(startDate, endDate)

  if (days <= 0) {
    return { valid: false, message: "End date must be after start date" }
  }

  if (rentalType === RentalType.LONG_TERM && days < 30) {
    return { valid: false, message: "Long-term rentals require a minimum of 30 days (1 month)" }
  }

  return { valid: true }
}
