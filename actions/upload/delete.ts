"use server"

import { getServerSession } from "next-auth"
import { deleteFromR2 } from "@/lib/r2-client"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

export async function deleteFile(fileUrl: string): Promise<ActionResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    await deleteFromR2(fileUrl)

    return successResponse({ message: "File deleted successfully" })
  } catch (error) {
    console.error("[DELETE_FILE_ERROR]", error)
    return errorResponse("Failed to delete file")
  }
}
