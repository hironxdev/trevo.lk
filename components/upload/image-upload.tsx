"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { uploadImage } from "@/actions/upload/image";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  validateFileType,
  validateFileSize,
  formatFileSize,
} from "@/lib/utils/file";
import { createImagePreview } from "@/lib/utils/image";
import { toast } from "sonner";
import { Loader2, X, Upload } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  folder?: string;
  disabled?: boolean;
}
function sanitizeFileName(fileName: string) {
  const ext = fileName.split(".").pop();
  const name = fileName
    .replace(/\.[^/.]+$/, "") // remove extension
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces → hyphen
    .replace(/[^a-z0-9-_]/g, ""); // remove unsafe chars

  return `${name}.${ext}`;
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
  folder = "images",
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Check max files limit
    if (previews.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`);
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!validateFileType(file, ALLOWED_IMAGE_TYPES)) {
        toast.error(`${file.name} is not a valid image type`);
        return;
      }

      if (!validateFileSize(file, MAX_IMAGE_SIZE)) {
        toast.error(
          `${file.name} is too large. Max size is ${formatFileSize(
            MAX_IMAGE_SIZE
          )}`
        );
        return;
      }
    }

    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        // Create preview
        const preview = await createImagePreview(file);

        // Convert to base64 for upload
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        const base64 = await base64Promise;

        // Upload to R2
        const result = await uploadImage({
          file: base64,
          fileName: sanitizeFileName(file.name),
          folder,
        });

        if (result.success && result.data) {
          uploadedUrls.push(result.data.url);
        } else {
          throw new Error(result.error || "Upload failed");
        }
      }

      const newUrls = [...value, ...uploadedUrls];
      setPreviews(newUrls);
      onChange(newUrls);

      toast.success(
        `${files.length} image${
          files.length > 1 ? "s" : ""
        } uploaded successfully`
      );
    } catch (error) {
      console.error("[IMAGE_UPLOAD_ERROR]", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleRemove(index: number) {
    const newUrls = value.filter((_, i) => i !== index);
    setPreviews(newUrls);
    onChange(newUrls);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previews.map((url, index) => (
          <Card
            key={index}
            className="relative aspect-square overflow-hidden group"
          >
            <Image
              src={url || "/placeholder.svg"}
              alt={`Upload ${index + 1}`}
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(index)}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </Card>
        ))}

        {previews.length < maxFiles && (
          <Card
            className="aspect-square flex flex-col items-center justify-center border-dashed cursor-pointer hover:border-primary transition-colors"
            onClick={() =>
              !disabled && !isUploading && fileInputRef.current?.click()
            }
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center px-2">
                  Click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {previews.length}/{maxFiles}
                </p>
              </>
            )}
          </Card>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />

      <p className="text-xs text-muted-foreground">
        Upload up to {maxFiles} images. Accepted formats: JPG, PNG, WEBP. Max
        size: {formatFileSize(MAX_IMAGE_SIZE)} each.
      </p>
    </div>
  );
}
