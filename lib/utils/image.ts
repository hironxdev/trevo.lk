export interface ImageDimensions {
  width: number
  height: number
}

function isImageFile(file: File) {
  return file.type.startsWith("image/")
}

export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error("Selected file is not an image"))
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    const cleanup = () => {
      URL.revokeObjectURL(url)
      img.onload = null
      img.onerror = null
    }

    img.onload = () => {
      cleanup()
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      })
    }

    img.onerror = () => {
      cleanup()
      reject(new Error("Failed to load image"))
    }

    img.src = url
  })
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error("Selected file is not an image"))
      return
    }

    const reader = new FileReader()

    const cleanup = () => {
      reader.onload = null
      reader.onerror = null
      reader.onabort = null
    }

    reader.onload = () => {
      cleanup()
      const result = reader.result
      if (typeof result === "string") resolve(result)
      else reject(new Error("Failed to create preview"))
    }

    reader.onerror = () => {
      cleanup()
      reject(new Error("Failed to read file"))
    }

    reader.onabort = () => {
      cleanup()
      reject(new Error("File reading was aborted"))
    }

    reader.readAsDataURL(file)
  })
}
