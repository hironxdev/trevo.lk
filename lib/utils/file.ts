export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
export const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024 // 10MB

type AllowedMime = string

function normalizeMime(mime: string) {
  // some places might provide image/jpg; normalize it
  return mime === "image/jpg" ? "image/jpeg" : mime
}

export function getFileExtension(filename: string): string {
  const name = filename.trim()
  const lastDot = name.lastIndexOf(".")
  if (lastDot <= 0 || lastDot === name.length - 1) return ""
  return name.slice(lastDot + 1).toLowerCase()
}

export function validateFileType(file: File, allowedTypes: readonly AllowedMime[]): boolean {
  const mime = normalizeMime(file.type || "")
  if (mime && allowedTypes.includes(mime)) return true

  // Fallback: sometimes file.type is empty → validate by extension
  const ext = getFileExtension(file.name)

  const allowedExts = new Set(
    allowedTypes.map((t) => {
      if (t === "application/pdf") return "pdf"
      if (t === "image/jpeg") return "jpg" // also accept jpeg
      if (t === "image/png") return "png"
      if (t === "image/webp") return "webp"
      return ""
    }),
  )
  if (allowedTypes.includes("image/jpeg") as any) allowedExts.add("jpeg")

  return ext ? allowedExts.has(ext) : false
}

export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size > 0 && file.size <= maxSize
}

export function generateFileName(originalName: string): string {
  const ext = getFileExtension(originalName) || "bin"
  const timestamp = Date.now()

  // Prefer crypto.randomUUID when available (browser + modern node)
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 12)

  return `${timestamp}-${id}.${ext}`
}

/**
 * Client-safe: returns Uint8Array
 * (Avoid Node Buffer in browser bundles)
 */
export async function fileToBytes(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

/**
 * Server-only convenience: convert bytes to Buffer.
 * Use this only in Node/server environments.
 */
export function bytesToBuffer(bytes: Uint8Array): Buffer {
  return Buffer.from(bytes)
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)
  const value = bytes / Math.pow(k, i)
  return `${Math.round(value * 100) / 100} ${sizes[i]}`
}
