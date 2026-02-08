"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import { authOptions } from "@/lib/auth"
import { startOfMonth, subMonths, format, startOfYear, endOfMonth } from "date-fns"

export async function getPartnerEarnings() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
    })

    if (!partner) {
      return errorResponse("Partner profile not found")
    }

    // Get all completed bookings
    const bookings = await prisma.booking.findMany({
      where: {
        partnerId: partner.id,
        status: "COMPLETED",
      },
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            images: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { endDate: "desc" },
    })

    // Calculate monthly earnings for the last 12 months
    const monthlyData: { month: string; earnings: number; bookings: number }[] = []
    const now = new Date()

    for (let i = 11; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i))
      const monthEnd = endOfMonth(monthStart)

      const monthBookings = bookings.filter((b) => {
        const endDate = new Date(b.endDate)
        return endDate >= monthStart && endDate <= monthEnd
      })

      const monthEarnings = monthBookings.reduce((sum, b) => {
        const pricing = b.pricing as { subtotal?: number; total?: number }
        return sum + (pricing?.subtotal || pricing?.total || 0)
      }, 0)

      monthlyData.push({
        month: format(monthStart, "MMM yyyy"),
        earnings: monthEarnings,
        bookings: monthBookings.length,
      })
    }

    // Calculate totals
    const totalEarnings = bookings.reduce((sum, b) => {
      const pricing = b.pricing as { subtotal?: number; total?: number }
      return sum + (pricing?.subtotal || pricing?.total || 0)
    }, 0)

    const thisMonthStart = startOfMonth(now)
    const thisMonthBookings = bookings.filter((b) => new Date(b.endDate) >= thisMonthStart)
    const thisMonthEarnings = thisMonthBookings.reduce((sum, b) => {
      const pricing = b.pricing as { subtotal?: number; total?: number }
      return sum + (pricing?.subtotal || pricing?.total || 0)
    }, 0)

    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(lastMonthStart)
    const lastMonthBookings = bookings.filter((b) => {
      const endDate = new Date(b.endDate)
      return endDate >= lastMonthStart && endDate <= lastMonthEnd
    })
    const lastMonthEarnings = lastMonthBookings.reduce((sum, b) => {
      const pricing = b.pricing as { subtotal?: number; total?: number }
      return sum + (pricing?.subtotal || pricing?.total || 0)
    }, 0)

    // Calculate year to date
    const yearStart = startOfYear(now)
    const yearBookings = bookings.filter((b) => new Date(b.endDate) >= yearStart)
    const yearEarnings = yearBookings.reduce((sum, b) => {
      const pricing = b.pricing as { subtotal?: number; total?: number }
      return sum + (pricing?.subtotal || pricing?.total || 0)
    }, 0)

    // Recent transactions
    const recentTransactions = bookings.slice(0, 10).map((b) => ({
      id: b.id,
      date: b.endDate,
      vehicle: `${b.vehicle.make} ${b.vehicle.model}`,
      vehicleImage: b.vehicle.images[0] || null,
      customer: b.user.name || "Customer",
      amount:
        (b.pricing as { subtotal?: number; total?: number })?.subtotal ||
        (b.pricing as { subtotal?: number; total?: number })?.total ||
        0,
      startDate: b.startDate,
      endDate: b.endDate,
    }))

    // Calculate growth percentage
    const growth =
      lastMonthEarnings > 0
        ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
        : thisMonthEarnings > 0
          ? 100
          : 0

    return successResponse({
      totalEarnings,
      thisMonthEarnings,
      lastMonthEarnings,
      yearEarnings,
      thisMonthBookings: thisMonthBookings.length,
      totalBookings: bookings.length,
      monthlyData,
      recentTransactions,
      growth: Math.round(growth),
    })
  } catch (error) {
    console.error("[GET_PARTNER_EARNINGS_ERROR]", error)
    return errorResponse("Failed to fetch earnings")
  }
}

export async function getPartnerAnalytics() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const partner = await prisma.partner.findUnique({
      where: { userId: session.user.id },
    })

    if (!partner) {
      return errorResponse("Partner profile not found")
    }

    // Get all bookings
    const allBookings = await prisma.booking.findMany({
      where: { partnerId: partner.id },
      include: {
        vehicle: {
          include: {
            category: true,
          },
        },
      },
    })

    // Get all vehicles with reviews
    const vehicles = await prisma.vehicle.findMany({
      where: { partnerId: partner.id },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
        },
        _count: {
          select: { bookings: true },
        },
      },
    })

    // Calculate booking status distribution
    const statusCounts = allBookings.reduce(
      (acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Calculate vehicle performance
    const vehiclePerformance = vehicles.map((v) => {
      const vehicleBookings = allBookings.filter((b) => b.vehicleId === v.id)
      const completedBookings = vehicleBookings.filter((b) => b.status === "COMPLETED")
      const revenue = completedBookings.reduce((sum, b) => {
        const pricing = b.pricing as { subtotal?: number; total?: number }
        return sum + (pricing?.subtotal || pricing?.total || 0)
      }, 0)
      const avgRating = v.reviews.length > 0 ? v.reviews.reduce((sum, r) => sum + r.rating, 0) / v.reviews.length : 0

      return {
        id: v.id,
        name: `${v.make} ${v.model}`,
        image: v.images[0] || null,
        category: v.category.name,
        totalBookings: v._count.bookings,
        completedBookings: completedBookings.length,
        revenue,
        rating: avgRating,
        reviewCount: v.reviews.length,
        status: v.status,
        isApproved: v.isApproved,
      }
    })

    // Sort by revenue
    vehiclePerformance.sort((a, b) => b.revenue - a.revenue)

    // Category distribution
    const categoryStats = vehicles.reduce(
      (acc, v) => {
        const cat = v.category.name
        if (!acc[cat]) {
          acc[cat] = { count: 0, bookings: 0, revenue: 0 }
        }
        acc[cat].count += 1
        const vehicleBookings = allBookings.filter((b) => b.vehicleId === v.id && b.status === "COMPLETED")
        acc[cat].bookings += vehicleBookings.length
        acc[cat].revenue += vehicleBookings.reduce((sum, b) => {
          const pricing = b.pricing as { subtotal?: number; total?: number }
          return sum + (pricing?.subtotal || pricing?.total || 0)
        }, 0)
        return acc
      },
      {} as Record<string, { count: number; bookings: number; revenue: number }>,
    )

    // Monthly bookings trend
    const now = new Date()
    const monthlyBookings: { month: string; total: number; completed: number; cancelled: number }[] = []

    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i))
      const monthEnd = endOfMonth(monthStart)

      const monthData = allBookings.filter((b) => {
        const created = new Date(b.createdAt)
        return created >= monthStart && created <= monthEnd
      })

      monthlyBookings.push({
        month: format(monthStart, "MMM"),
        total: monthData.length,
        completed: monthData.filter((b) => b.status === "COMPLETED").length,
        cancelled: monthData.filter((b) => ["CANCELLED", "REJECTED"].includes(b.status)).length,
      })
    }

    // Average booking duration
    const completedBookings = allBookings.filter((b) => b.status === "COMPLETED")
    const avgDuration =
      completedBookings.length > 0
        ? completedBookings.reduce((sum, b) => {
            const days = Math.ceil(
              (new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24),
            )
            return sum + days
          }, 0) / completedBookings.length
        : 0

    // Conversion rate
    const conversionRate = allBookings.length > 0 ? (completedBookings.length / allBookings.length) * 100 : 0

    // Average rating across all vehicles
    const allRatings = vehicles.flatMap((v) => v.reviews.map((r) => r.rating))
    const avgRating = allRatings.length > 0 ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length : 0

    return successResponse({
      statusCounts,
      vehiclePerformance,
      categoryStats,
      monthlyBookings,
      metrics: {
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter((v) => v.isApproved && v.status === "AVAILABLE").length,
        totalBookings: allBookings.length,
        completedBookings: completedBookings.length,
        avgDuration: Math.round(avgDuration * 10) / 10,
        conversionRate: Math.round(conversionRate),
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews: allRatings.length,
      },
    })
  } catch (error) {
    console.error("[GET_PARTNER_ANALYTICS_ERROR]", error)
    return errorResponse("Failed to fetch analytics")
  }
}
