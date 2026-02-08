"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface VehicleGalleryProps {
  images: string[]
}

export function VehicleGallery({ images }: VehicleGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (images.length === 0) {
    return (
      <Card className="aspect-video flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="relative aspect-video">
          <Image src={images[selectedImage] || "/placeholder.svg"} alt="Vehicle" fill className="object-cover" />
        </div>
      </Card>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <Card
              key={index}
              className={`overflow-hidden cursor-pointer ${selectedImage === index ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative aspect-video">
                <Image src={image || "/placeholder.svg"} alt={`Vehicle ${index + 1}`} fill className="object-cover" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
