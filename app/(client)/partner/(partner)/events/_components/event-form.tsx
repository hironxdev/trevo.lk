"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createEvent, updateEvent } from "@/actions/events/create"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const eventSchema = z.object({
  titleEn: z.string().min(3, "Title must be at least 3 characters").max(200),
  titleSi: z.string().optional(),
  descEn: z.string().optional(),
  descSi: z.string().optional(),
  category: z.string().optional(),
  city: z.string().min(2, "City is required"),
  venueName: z.string().min(3, "Venue name is required"),
  mapUrl: z.string().url().optional().or(z.literal("")),
  posterUrl: z.string().url().optional().or(z.literal("")),
  startAt: z.string().min(1, "Start date/time is required"),
  endAt: z.string().optional(),
})

type EventFormData = z.infer<typeof eventSchema>

interface EventFormProps {
  partnerId: string
  eventId?: string
  initialData?: Partial<EventFormData> & { id?: string }
  mode: "create" | "edit"
}

const CATEGORIES = [
  "MUSIC",
  "SPORTS",
  "CONFERENCE",
  "WORKSHOP",
  "FESTIVAL",
  "COMEDY",
  "THEATER",
  "FOOD",
  "WEDDING",
  "CORPORATE",
  "CHARITY",
  "OTHER",
]

export default function EventForm({ partnerId, eventId, initialData, mode }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      titleEn: initialData?.titleEn || "",
      titleSi: initialData?.titleSi || "",
      descEn: initialData?.descEn || "",
      descSi: initialData?.descSi || "",
      category: initialData?.category || "",
      city: initialData?.city || "",
      venueName: initialData?.venueName || "",
      mapUrl: initialData?.mapUrl || "",
      posterUrl: initialData?.posterUrl || "",
      startAt: initialData?.startAt || "",
      endAt: initialData?.endAt || "",
    },
  })

  const onSubmit = async (data: EventFormData) => {
    setLoading(true)
    try {
      const result =
        mode === "create"
          ? await createEvent({
              ...data,
              organizerId: partnerId,
            })
          : await updateEvent({
              id: eventId!,
              ...data,
            })

      if (result.success) {
        toast.success(mode === "create" ? "Event created successfully" : "Event updated successfully")
        router.push("/partner/events")
      } else {
        toast.error(result.message || "Failed to save event")
      }
    } catch (error) {
      console.error("[v0] Event form error:", error)
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* English Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">English Details</h3>

        <div className="space-y-2">
          <Label htmlFor="titleEn">Event Title (English) *</Label>
          <Input
            id="titleEn"
            placeholder="e.g., Summer Music Festival 2024"
            {...form.register("titleEn")}
            disabled={loading}
          />
          {form.formState.errors.titleEn && (
            <p className="text-sm text-destructive">{form.formState.errors.titleEn.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="descEn">Description (English)</Label>
          <Textarea
            id="descEn"
            placeholder="Describe your event..."
            rows={4}
            {...form.register("descEn")}
            disabled={loading}
          />
        </div>
      </div>

      {/* Sinhala Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Sinhala Details (Optional)</h3>

        <div className="space-y-2">
          <Label htmlFor="titleSi">Event Title (Sinhala)</Label>
          <Input
            id="titleSi"
            placeholder="ඉංග්‍රීසි ශීර්ෂකය දෙන්න"
            {...form.register("titleSi")}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descSi">Description (Sinhala)</Label>
          <Textarea
            id="descSi"
            placeholder="ඔබගේ ඉවෙන්ට විස්තරණය කරන්න..."
            rows={4}
            {...form.register("descSi")}
            disabled={loading}
          />
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Event Details</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input id="city" placeholder="e.g., Colombo" {...form.register("city")} disabled={loading} />
            {form.formState.errors.city && (
              <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              {...form.register("category")}
              disabled={loading}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="venueName">Venue Name *</Label>
          <Input
            id="venueName"
            placeholder="e.g., Colombo Convention Center"
            {...form.register("venueName")}
            disabled={loading}
          />
          {form.formState.errors.venueName && (
            <p className="text-sm text-destructive">{form.formState.errors.venueName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mapUrl">Map URL (Google Maps Link)</Label>
          <Input
            id="mapUrl"
            type="url"
            placeholder="https://maps.google.com/..."
            {...form.register("mapUrl")}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="posterUrl">Poster Image URL</Label>
          <Input
            id="posterUrl"
            type="url"
            placeholder="https://example.com/poster.jpg"
            {...form.register("posterUrl")}
            disabled={loading}
          />
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Event Dates & Times</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startAt">Start Date & Time *</Label>
            <Input
              id="startAt"
              type="datetime-local"
              {...form.register("startAt")}
              disabled={loading}
            />
            {form.formState.errors.startAt && (
              <p className="text-sm text-destructive">{form.formState.errors.startAt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endAt">End Date & Time</Label>
            <Input id="endAt" type="datetime-local" {...form.register("endAt")} disabled={loading} />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Event" : "Update Event"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">* Required fields</p>
    </form>
  )
}
