// lib/utils/normalize-categories.ts

export type CategoryOption = {
  label: string
  value: string
}

/**
 * Normalizes "categories" from any source into an array of {label, value}.
 *
 * Accepts:
 * - string[]                     e.g. ["SUV", "Sedan"]
 * - {label,value}[]              e.g. [{label:"SUV", value:"suv"}]
 * - {name/title/label, slug/id}[] (common API shapes)
 * - Record<string, string>       e.g. { suv: "SUV", sedan: "Sedan" }
 * - comma-separated string       e.g. "SUV, Sedan"
 * - null/undefined/unknown       -> []
 */
export function normalizeCategories(input: unknown): CategoryOption[] {
  if (!input) return []

  // If it's already an array, normalize each item
  if (Array.isArray(input)) {
    return input
      .map((item) => normalizeOne(item))
      .filter((x): x is CategoryOption => Boolean(x))
  }

  // If it's a comma-separated string: "A, B, C"
  if (typeof input === "string") {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({ label: s, value: slugify(s) }))
  }

  // If it's an object map: { key: "Label" }
  if (typeof input === "object") {
    const obj = input as Record<string, unknown>

    // Common case: { categories: [...] } or { data: [...] }
    if (Array.isArray(obj.categories)) {
      return normalizeCategories(obj.categories)
    }
    if (Array.isArray(obj.data)) {
      return normalizeCategories(obj.data)
    }

    // Key-value map case
    const entries = Object.entries(obj)
    if (entries.length > 0 && entries.every(([, v]) => typeof v === "string")) {
      return entries.map(([k, v]) => ({
        label: String(v),
        value: String(k),
      }))
    }
  }

  return []
}

function normalizeOne(item: unknown): CategoryOption | null {
  if (!item) return null

  if (typeof item === "string") {
    const s = item.trim()
    if (!s) return null
    return { label: s, value: slugify(s) }
  }

  if (typeof item === "object") {
    const obj = item as Record<string, unknown>

    // Already in correct shape
    const label = pickString(obj, ["label", "name", "title"])
    const value = pickString(obj, ["value", "slug", "id", "key"])

    if (label && value) return { label, value }
    if (label && !value) return { label, value: slugify(label) }
    if (!label && value) return { label: value, value }
  }

  return null
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === "string" && v.trim()) return v.trim()
    if (typeof v === "number") return String(v)
  }
  return null
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
