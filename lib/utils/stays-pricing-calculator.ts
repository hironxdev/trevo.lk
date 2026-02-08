export interface StaysPricing {
  pricePerNight: number
  pricePerWeek?: number | null
  pricePerMonth?: number | null
  cleaningFee?: number | null
  depositRequired: number
}

export interface StaysBookingPricingParams {
  stays: StaysPricing
  checkIn: Date
  checkOut: Date
}

export interface StaysPricingBreakdown {
  totalNights: number

  pricePerNight: number
  nightsSubtotal: number

  weeklyDiscount: number
  monthlyDiscount: number

  cleaningFee: number

  subtotal: number
  deposit: number
  total: number // subtotal only; deposit separate
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

function toMidnight(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function safeNum(n: unknown, fallback = 0): number {
  const v = typeof n === "number" ? n : Number(n)
  return Number.isFinite(v) ? v : fallback
}

/**
 * Calculate nights between two dates (checkOut must be AFTER checkIn).
 * Example: Feb 1 -> Feb 2 = 1 night
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const start = toMidnight(checkIn).getTime()
  const end = toMidnight(checkOut).getTime()
  const diff = end - start
  if (diff <= 0) return 0
  return Math.ceil(diff / MS_PER_DAY)
}

/**
 * Calculate complete pricing breakdown for a stays booking
 * Rule: choose the cheapest among:
 * - nightly pricing
 * - weekly bundles + remaining nights
 * - monthly bundles + remaining nights
 */
export function calculateStaysBookingPrice(params: StaysBookingPricingParams): StaysPricingBreakdown {
  const { stays, checkIn, checkOut } = params

  const totalNights = calculateNights(checkIn, checkOut)

  const pricePerNight = safeNum(stays.pricePerNight)
  const pricePerWeek = stays.pricePerWeek != null ? safeNum(stays.pricePerWeek) : null
  const pricePerMonth = stays.pricePerMonth != null ? safeNum(stays.pricePerMonth) : null

  // Base nightly total (no bundles)
  const baseNightlyTotal = pricePerNight * totalNights

  // Weekly bundle total (if available)
  let weeklyTotal: number | null = null
  if (pricePerWeek != null && totalNights >= 7) {
    const weeks = Math.floor(totalNights / 7)
    const remainingNights = totalNights % 7
    weeklyTotal = weeks * pricePerWeek + remainingNights * pricePerNight
  }

  // Monthly bundle total (if available)
  let monthlyTotal: number | null = null
  if (pricePerMonth != null && totalNights >= 30) {
    const months = Math.floor(totalNights / 30)
    const remainingNights = totalNights % 30
    monthlyTotal = months * pricePerMonth + remainingNights * pricePerNight
  }

  // Choose cheapest option
  const candidates: Array<{ key: "nightly" | "weekly" | "monthly"; total: number }> = [
    { key: "nightly", total: baseNightlyTotal },
  ]
  if (weeklyTotal != null) candidates.push({ key: "weekly", total: weeklyTotal })
  if (monthlyTotal != null) candidates.push({ key: "monthly", total: monthlyTotal })

  const best = candidates.reduce((min, cur) => (cur.total < min.total ? cur : min))

  const nightsSubtotal = best.total

  // Discounts are shown as how much you saved vs base nightly
  const weeklyDiscount = best.key === "weekly" ? baseNightlyTotal - nightsSubtotal : 0
  const monthlyDiscount = best.key === "monthly" ? baseNightlyTotal - nightsSubtotal : 0

  const cleaningFee = safeNum(stays.cleaningFee)
  const subtotal = nightsSubtotal + cleaningFee
  const deposit = safeNum(stays.depositRequired)

  return {
    totalNights,
    pricePerNight,
    nightsSubtotal,
    weeklyDiscount,
    monthlyDiscount,
    cleaningFee,
    subtotal,
    deposit,
    total: subtotal, // Deposit shown separately
  }
}

/**
 * Check if a stays booking duration is valid
 */
export function isValidStaysBookingDuration(
  checkIn: Date,
  checkOut: Date,
  minNights?: number | null,
  maxNights?: number | null,
): { valid: boolean; message?: string } {
  const nights = calculateNights(checkIn, checkOut)

  if (nights <= 0) {
    return { valid: false, message: "Check-out must be after check-in" }
  }

  if (minNights != null && nights < minNights) {
    return {
      valid: false,
      message: `Minimum stay is ${minNights} night${minNights > 1 ? "s" : ""}`,
    }
  }

  if (maxNights != null && nights > maxNights) {
    return {
      valid: false,
      message: `Maximum stay is ${maxNights} nights`,
    }
  }

  return { valid: true }
}

/**
 * Format price for display
 */
export function formatStaysPrice(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0
  return `Rs ${safe.toLocaleString()}`
}
