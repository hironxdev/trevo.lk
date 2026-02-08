"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createTicketType } from "@/actions/events/create"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const ticketTypeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  price: z.number().positive("Price must be greater than 0"),
  totalQty: z.number().int().positive("Quantity must be greater than 0"),
  salesStartAt: z.string().optional(),
  salesEndAt: z.string().optional(),
})

type TicketTypeFormData = z.infer<typeof ticketTypeSchema>

interface TicketTypeFormProps {
  eventId: string
}

export default function TicketTypeForm({ eventId }: TicketTypeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<TicketTypeFormData>({
    resolver: zodResolver(ticketTypeSchema),
    defaultValues: {
      name: "",
      price: 0,
      totalQty: 100,
      salesStartAt: "",
      salesEndAt: "",
    },
  })

  const onSubmit = async (data: TicketTypeFormData) => {
    setLoading(true)
    try {
      const result = await createTicketType(eventId, {
        ...data,
        price: data.price,
        currency: "LKR",
      })

      if (result.success) {
        toast.success("Ticket type created successfully")
        form.reset()
        router.refresh()
      } else {
        toast.error(result.message || "Failed to create ticket type")
      }
    } catch (error) {
      console.error("[v0] Ticket form error:", error)
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Ticket Type Name *</Label>
        <Input
          id="name"
          placeholder="e.g., VIP, Early Bird, Standard"
          {...form.register("name")}
          disabled={loading}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (LKR) *</Label>
          <Input
            id="price"
            type="number"
            placeholder="5000"
            step="0.01"
            {...form.register("price", {
              valueAsNumber: true,
            })}
            disabled={loading}
          />
          {form.formState.errors.price && (
            <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalQty">Total Quantity *</Label>
          <Input
            id="totalQty"
            type="number"
            placeholder="100"
            {...form.register("totalQty", {
              valueAsNumber: true,
            })}
            disabled={loading}
          />
          {form.formState.errors.totalQty && (
            <p className="text-sm text-destructive">{form.formState.errors.totalQty.message}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salesStartAt">Sales Start Date (Optional)</Label>
          <Input
            id="salesStartAt"
            type="datetime-local"
            {...form.register("salesStartAt")}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salesEndAt">Sales End Date (Optional)</Label>
          <Input
            id="salesEndAt"
            type="datetime-local"
            {...form.register("salesEndAt")}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Add Ticket Type
        </Button>
      </div>
    </form>
  )
}
