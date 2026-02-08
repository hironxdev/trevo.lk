"use server"

import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import { EventStatus } from "@prisma/client"

interface EventListParams {
  page?: number
  limit?: number
  city?: string
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  startDate?: Date
  endDate?: Date
}

export async function getEvents(params: EventListParams = {}) {
  try {
    const {
      page = 1,
      limit = 12,
      city,
      search,
      category,
      minPrice,
      maxPrice,
      startDate,
      endDate,
    } = params

    const skip = (page - 1) * limit

    // Only show approved events to public users
    const where: any = {
      status: EventStatus.APPROVED,
      startAt: {
        gte: new Date(), // Future events only
      },
    }

    if (city) {
      where.city = { contains: city, mode: "insensitive" }
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { titleEn: { contains: search, mode: "insensitive" } },
        { titleSi: { contains: search, mode: "insensitive" } },
        { descEn: { contains: search, mode: "insensitive" } },
        { venueName: { contains: search, mode: "insensitive" } },
      ]
    }

    if (startDate || endDate) {
      where.startAt = {}
      if (startDate) where.startAt.gte = startDate
      if (endDate) where.startAt.lte = endDate
    }

    // Get events with ticket type info to calculate price range
    const events = await prisma.event.findMany({
      where,
      skip,
      take: limit,
      include: {
        organizer: {
          include: {
            user: true,
          },
        },
        ticketTypes: true,
      },
      orderBy: {
        startAt: "asc",
      },
    })

    // Filter by price range if specified
    let filteredEvents = events
    if (minPrice !== undefined || maxPrice !== undefined) {
      filteredEvents = events.filter((event) => {
        if (event.ticketTypes.length === 0) return true
        const minEventPrice = Math.min(...event.ticketTypes.map((t) => t.price))
        const maxEventPrice = Math.max(...event.ticketTypes.map((t) => t.price))

        if (minPrice !== undefined && maxEventPrice < minPrice) return false
        if (maxPrice !== undefined && minEventPrice > maxPrice) return false
        return true
      })
    }

    const total = await prisma.event.count({ where })

    return successResponse({
      data: filteredEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[getEvents] Error:", error)
    return errorResponse("Failed to fetch events")
  }
}

export async function getEventBySlug(slug: string) {
  try {
    const event = await prisma.event.findFirst({
      where: {
        slug,
        status: EventStatus.APPROVED, // Only return approved events
      },
      include: {
        organizer: {
          include: {
            user: true,
          },
        },
        ticketTypes: {
          orderBy: { price: "asc" },
        },
        promoCodes: {
          where: { active: true },
        },
        groupDiscountRules: {
          where: { active: true },
        },
      },
    })

    if (!event) {
      return errorResponse("Event not found", 404)
    }

    return successResponse(event)
  } catch (error) {
    console.error("[getEventBySlug] Error:", error)
    return errorResponse("Failed to fetch event")
  }
}

export async function getPartnerEvents(partnerId: string, status?: EventStatus) {
  try {
    const where: any = { organizerId: partnerId }
    if (status) where.status = status

    const events = await prisma.event.findMany({
      where,
      include: {
        ticketTypes: true,
        bookings: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(events)
  } catch (error) {
    console.error("[getPartnerEvents] Error:", error)
    return errorResponse("Failed to fetch partner events")
  }
}

export async function getPendingApprovalEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { status: EventStatus.PENDING_REVIEW },
      include: {
        organizer: {
          include: {
            user: true,
          },
        },
        ticketTypes: true,
        bookings: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(events)
  } catch (error) {
    console.error("[getPendingApprovalEvents] Error:", error)
    return errorResponse("Failed to fetch pending events")
  }
}
