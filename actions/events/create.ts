"use server"

import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import { EventStatus } from "@prisma/client"
import { getCurrentUser } from "@/lib/utils/auth"
import { generateSlug } from "@/lib/utils/slug"

interface CreateEventInput {
  titleEn: string
  titleSi?: string
  descEn?: string
  descSi?: string
  category?: string
  city: string
  venueName: string
  mapUrl?: string
  posterUrl?: string
  startAt: Date
  endAt?: Date
}

interface UpdateEventInput extends CreateEventInput {
  id: string
}

interface CreateTicketTypeInput {
  name: string
  price: number
  totalQty: number
  salesStartAt?: Date
  salesEndAt?: Date
}

export async function createEvent(data: CreateEventInput) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    // Get user's partner profile
    const partner = await prisma.partner.findUnique({
      where: { userId: user.id },
    })

    if (!partner) {
      return errorResponse("You must be an approved partner to create events", 403)
    }

    if (partner.kycStatus !== "VERIFIED") {
      return errorResponse("Your account is not verified yet", 403)
    }

    // Generate unique slug
    let slug = generateSlug(data.titleEn)
    let counter = 1
    let existingEvent = await prisma.event.findUnique({ where: { slug } })

    while (existingEvent) {
      slug = `${generateSlug(data.titleEn)}-${counter}`
      existingEvent = await prisma.event.findUnique({ where: { slug } })
      counter++
    }

    const event = await prisma.event.create({
      data: {
        organizerId: partner.id,
        slug,
        titleEn: data.titleEn,
        titleSi: data.titleSi,
        descEn: data.descEn,
        descSi: data.descSi,
        category: data.category,
        city: data.city,
        venueName: data.venueName,
        mapUrl: data.mapUrl,
        posterUrl: data.posterUrl,
        startAt: new Date(data.startAt),
        endAt: data.endAt ? new Date(data.endAt) : undefined,
        status: EventStatus.DRAFT,
      },
    })

    return successResponse(event)
  } catch (error) {
    console.error("[createEvent] Error:", error)
    return errorResponse("Failed to create event")
  }
}

export async function updateEvent(data: UpdateEventInput) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    // Verify partner ownership
    const event = await prisma.event.findUnique({
      where: { id: data.id },
      include: { organizer: true },
    })

    if (!event) {
      return errorResponse("Event not found", 404)
    }

    if (event.organizer.userId !== user.id) {
      return errorResponse("You don't have permission to edit this event", 403)
    }

    // Can only edit DRAFT or REJECTED events
    if (![EventStatus.DRAFT, EventStatus.REJECTED].includes(event.status)) {
      return errorResponse("You can only edit draft or rejected events", 400)
    }

    const updated = await prisma.event.update({
      where: { id: data.id },
      data: {
        titleEn: data.titleEn,
        titleSi: data.titleSi,
        descEn: data.descEn,
        descSi: data.descSi,
        category: data.category,
        city: data.city,
        venueName: data.venueName,
        mapUrl: data.mapUrl,
        posterUrl: data.posterUrl,
        startAt: new Date(data.startAt),
        endAt: data.endAt ? new Date(data.endAt) : undefined,
      },
    })

    return successResponse(updated)
  } catch (error) {
    console.error("[updateEvent] Error:", error)
    return errorResponse("Failed to update event")
  }
}

export async function submitEventForReview(eventId: string) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    })

    if (!event) {
      return errorResponse("Event not found", 404)
    }

    if (event.organizer.userId !== user.id) {
      return errorResponse("You don't have permission to submit this event", 403)
    }

    if (event.status !== EventStatus.DRAFT && event.status !== EventStatus.REJECTED) {
      return errorResponse("Only draft or rejected events can be submitted for review", 400)
    }

    // Validate required fields
    if (!event.titleEn || !event.city || !event.venueName || !event.startAt) {
      return errorResponse("Please fill in all required fields before submitting", 400)
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        status: EventStatus.PENDING_REVIEW,
      },
    })

    return successResponse(updated)
  } catch (error) {
    console.error("[submitEventForReview] Error:", error)
    return errorResponse("Failed to submit event for review")
  }
}

export async function createTicketType(eventId: string, data: CreateTicketTypeInput) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    // Verify partner owns the event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    })

    if (!event) {
      return errorResponse("Event not found", 404)
    }

    if (event.organizer.userId !== user.id) {
      return errorResponse("You don't have permission to add tickets to this event", 403)
    }

    // Can only add tickets to DRAFT events
    if (event.status !== EventStatus.DRAFT) {
      return errorResponse("You can only add tickets to draft events", 400)
    }

    const ticketType = await prisma.ticketType.create({
      data: {
        eventId,
        name: data.name,
        price: data.price,
        totalQty: data.totalQty,
        currency: "LKR",
        salesStartAt: data.salesStartAt,
        salesEndAt: data.salesEndAt,
      },
    })

    return successResponse(ticketType)
  } catch (error) {
    console.error("[createTicketType] Error:", error)
    return errorResponse("Failed to create ticket type")
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    })

    if (!event) {
      return errorResponse("Event not found", 404)
    }

    if (event.organizer.userId !== user.id) {
      return errorResponse("You don't have permission to delete this event", 403)
    }

    // Can only delete DRAFT or REJECTED events
    if (![EventStatus.DRAFT, EventStatus.REJECTED].includes(event.status)) {
      return errorResponse("You can only delete draft or rejected events", 400)
    }

    await prisma.event.delete({
      where: { id: eventId },
    })

    return successResponse({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("[deleteEvent] Error:", error)
    return errorResponse("Failed to delete event")
  }
}
