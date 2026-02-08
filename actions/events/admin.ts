"use server"

import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import { EventStatus, UserRole } from "@prisma/client"
import { getCurrentUser } from "@/lib/utils/auth"

interface ApproveEventInput {
  eventId: string
  note?: string
}

interface RejectEventInput {
  eventId: string
  note: string
}

export async function approveEvent(data: ApproveEventInput) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    // Check if user is admin
    if (user.role !== UserRole.ADMIN) {
      return errorResponse("Only admins can approve events", 403)
    }

    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    })

    if (!event) {
      return errorResponse("Event not found", 404)
    }

    if (event.status !== EventStatus.PENDING_REVIEW) {
      return errorResponse("Only pending events can be approved", 400)
    }

    // Update event and create admin review record
    const [updated] = await Promise.all([
      prisma.event.update({
        where: { id: data.eventId },
        data: {
          status: EventStatus.APPROVED,
          adminNote: data.note,
        },
      }),
      prisma.adminEventReview.create({
        data: {
          eventId: data.eventId,
          adminId: user.id,
          decision: EventStatus.APPROVED,
          note: data.note,
        },
      }),
    ])

    return successResponse(updated)
  } catch (error) {
    console.error("[approveEvent] Error:", error)
    return errorResponse("Failed to approve event")
  }
}

export async function rejectEvent(data: RejectEventInput) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    // Check if user is admin
    if (user.role !== UserRole.ADMIN) {
      return errorResponse("Only admins can reject events", 403)
    }

    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    })

    if (!event) {
      return errorResponse("Event not found", 404)
    }

    if (event.status !== EventStatus.PENDING_REVIEW) {
      return errorResponse("Only pending events can be rejected", 400)
    }

    // Update event and create admin review record
    const [updated] = await Promise.all([
      prisma.event.update({
        where: { id: data.eventId },
        data: {
          status: EventStatus.REJECTED,
          adminNote: data.note,
        },
      }),
      prisma.adminEventReview.create({
        data: {
          eventId: data.eventId,
          adminId: user.id,
          decision: EventStatus.REJECTED,
          note: data.note,
        },
      }),
    ])

    return successResponse(updated)
  } catch (error) {
    console.error("[rejectEvent] Error:", error)
    return errorResponse("Failed to reject event")
  }
}

export async function cancelEvent(eventId: string, reason?: string) {
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

    // Either organizer or admin can cancel
    const isOrganizer = event.organizer.userId === user.id
    const isAdmin = user.role === UserRole.ADMIN

    if (!isOrganizer && !isAdmin) {
      return errorResponse("You don't have permission to cancel this event", 403)
    }

    if (event.status === EventStatus.CANCELLED) {
      return errorResponse("Event is already cancelled", 400)
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        status: EventStatus.CANCELLED,
        adminNote: reason || event.adminNote,
      },
    })

    return successResponse(updated)
  } catch (error) {
    console.error("[cancelEvent] Error:", error)
    return errorResponse("Failed to cancel event")
  }
}
