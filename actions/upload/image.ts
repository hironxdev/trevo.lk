"use server"

import { getServerSession } from "next-auth"
import { uploadToR2 } from "@/lib/r2-client"
import { errorResponse, successResponse } from "@/lib/utils/response"
import type { ActionResponse } from "@/lib/types"
import { authOptions } from "@/lib/auth"

interface UploadImageInput {
  file: string // Base64 encoded file
  fileName: string
  folder?: string
}

export async function uploadImage(input: UploadImageInput){
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse("Not authenticated")
    }

    const { file, fileName, folder = "images" } = input

    // Convert base64 to buffer
    const base64Data = file.split(",")[1]
    const buffer = Buffer.from(base64Data, "base64")

    // Determine content type from file extension
    const extension = fileName.split(".").pop()?.toLowerCase()
    const contentType = extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg"

    // Upload to R2
    const url = await uploadToR2(buffer, {
      folder,
      fileName,
      contentType,
    })

    return successResponse({ url })
  } catch (error) {
    console.error("[UPLOAD_IMAGE_ERROR]", error)
    return errorResponse("Failed to upload image")
  }
}
