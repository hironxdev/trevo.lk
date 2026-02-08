"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { uploadDocument } from "@/actions/upload/document"
import {
  ALLOWED_DOCUMENT_TYPES,
  MAX_DOCUMENT_SIZE,
  validateFileType,
  validateFileSize,
  formatFileSize,
} from "@/lib/utils/file"
import { toast } from "sonner"
import { FileIcon, Loader2, X, Upload } from "lucide-react"

interface DocumentUploadProps {
  value?: Array<{ type: string; url: string; name?: string }>
  onChange: (documents: Array<{ type: string; url: string; name?: string }>) => void
  maxFiles?: number
  folder?: string
  disabled?: boolean
  documentTypes?: Array<{ value: string; label: string }>
}

export function DocumentUpload({
  value = [],
  onChange,
  maxFiles = 5,
  folder = "documents",
  disabled = false,
  documentTypes = [
    { value: "license", label: "Business License" },
    { value: "tax", label: "Tax Document" },
    { value: "id", label: "ID Proof" },
    { value: "other", label: "Other" },
  ],
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedType, setSelectedType] = useState(documentTypes[0]?.value || "other")

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    // Check max files limit
    if (value.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} documents`)
      return
    }

    // Validate each file
    for (const file of files) {
      if (!validateFileType(file, ALLOWED_DOCUMENT_TYPES)) {
        toast.error(`${file.name} is not a valid document type`)
        return
      }

      if (!validateFileSize(file, MAX_DOCUMENT_SIZE)) {
        toast.error(`${file.name} is too large. Max size is ${formatFileSize(MAX_DOCUMENT_SIZE)}`)
        return
      }
    }

    setIsUploading(true)

    try {
      const uploadedDocs: Array<{ type: string; url: string; name: string }> = []

      for (const file of files) {
        // Convert to base64 for upload
        const reader = new FileReader()
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })

        const base64 = await base64Promise

        // Upload to R2
        const result = await uploadDocument({
          file: base64,
          fileName: file.name,
          folder,
        })

        if (result.success && result.data) {
          uploadedDocs.push({
            type: selectedType,
            url: result.data.url,
            name: file.name,
          })
        } else {
          throw new Error(result.error || "Upload failed")
        }
      }

      const newDocs = [...value, ...uploadedDocs]
      onChange(newDocs)

      toast.success(`${files.length} document${files.length > 1 ? "s" : ""} uploaded successfully`)
    } catch (error) {
      console.error("[DOCUMENT_UPLOAD_ERROR]", error)
      toast.error("Failed to upload documents")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  function handleRemove(index: number) {
    const newDocs = value.filter((_, i) => i !== index)
    onChange(newDocs)
  }

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((doc, index) => (
            <Card key={index} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileIcon className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{doc.name || "Document"}</p>
                  <p className="text-xs text-muted-foreground">
                    {documentTypes.find((t) => t.value === doc.type)?.label || doc.type}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {value.length < maxFiles && (
        <Card className="p-6 border-dashed">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Document Type</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={disabled || isUploading}
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_DOCUMENT_TYPES.join(",")}
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
            />

            <p className="text-xs text-muted-foreground text-center">
              Accepted formats: PDF, JPG, PNG. Max size: {formatFileSize(MAX_DOCUMENT_SIZE)} each.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
