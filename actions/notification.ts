"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils/response"
import { authOptions } from "@/lib/auth"

export async function getNotifications() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return successResponse(notifications)
  } catch (error) {
    console.error("[GET_NOTIFICATIONS_ERROR]", error)
    return errorResponse("Failed to fetch notifications")
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const notification = await prisma.notification.findUnique({
      where: { id },
    })

    if (!notification || notification.userId !== session.user.id) {
      return errorResponse("Notification not found")
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })

    return successResponse({ message: "Notification marked as read" })
  } catch (error) {
    console.error("[MARK_NOTIFICATION_READ_ERROR]", error)
    return errorResponse("Failed to mark notification as read")
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    })

    return successResponse({ message: "All notifications marked as read" })
  } catch (error) {
    console.error("[MARK_ALL_NOTIFICATIONS_READ_ERROR]", error)
    return errorResponse("Failed to mark all notifications as read")
  }
}
