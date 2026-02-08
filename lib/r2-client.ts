import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME
const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.warn("Cloudflare R2 credentials not found. File uploads will not work.")
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
})

export const R2_CONFIG = {
  bucketName: R2_BUCKET_NAME || "",
  publicUrl: NEXT_PUBLIC_CDN_URL || "",
}

interface UploadOptions {
  folder?: string
  fileName?: string
  contentType?: string
}

export async function uploadToR2(file: Buffer, options: UploadOptions): Promise<string> {
  const { folder = "uploads", fileName, contentType = "application/octet-stream" } = options

  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const key = `${folder}/${timestamp}-${randomString}-${fileName || "file"}`

  const command = new PutObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  try {
    await r2Client.send(command)
    return `${R2_CONFIG.publicUrl}/${key}`
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function deleteFromR2(fileUrl: string): Promise<void> {
  const key = fileUrl.replace(`${R2_CONFIG.publicUrl}/`, "")

  const command = new DeleteObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
  })

  await r2Client.send(command)
}

export async function getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_CONFIG.bucketName,
    Key: key,
  })

  return await getSignedUrl(r2Client, command, { expiresIn })
}
