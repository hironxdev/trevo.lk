"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { approveEvent, rejectEvent } from "@/actions/events/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

const approvalSchema = z.object({
  note: z.string().optional(),
})

type ApprovalFormData = z.infer<typeof approvalSchema>

interface EventApprovalFormProps {
  eventId: string
}

export default function EventApprovalForm({ eventId }: EventApprovalFormProps) {
  const router = useRouter()
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [confirmReject, setConfirmReject] = useState(false)

  const form = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      note: "",
    },
  })

  const onApprove = async (data: ApprovalFormData) => {
    setApproving(true)
    try {
      const result = await approveEvent({
        eventId,
        note: data.note,
      })

      if (result.success) {
        toast.success("Event approved successfully")
        router.push("/admin/events/pending")
      } else {
        toast.error(result.message || "Failed to approve event")
      }
    } catch (error) {
      console.error("[v0] Approval error:", error)
      toast.error("An error occurred")
    } finally {
      setApproving(false)
    }
  }

  const onReject = async (data: ApprovalFormData) => {
    if (!confirmReject) {
      setConfirmReject(true)
      return
    }

    setRejecting(true)
    try {
      const result = await rejectEvent({
        eventId,
        note: data.note,
      })

      if (result.success) {
        toast.success("Event rejected successfully")
        router.push("/admin/events/pending")
      } else {
        toast.error(result.message || "Failed to reject event")
      }
    } catch (error) {
      console.error("[v0] Rejection error:", error)
      toast.error("An error occurred")
    } finally {
      setRejecting(false)
    }
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-base">Admin Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="note">Review Notes (Optional)</Label>
          <Textarea
            id="note"
            placeholder="Add notes about your decision (visible to partner if rejected)"
            rows={3}
            {...form.register("note")}
            disabled={approving || rejecting}
          />
        </div>

        <div className="space-y-2">
          {!confirmReject ? (
            <>
              <Button
                onClick={form.handleSubmit(onApprove)}
                disabled={approving || rejecting}
                className="w-full gap-2 bg-green-600 hover:bg-green-700"
              >
                {approving && <Loader2 className="h-4 w-4 animate-spin" />}
                <CheckCircle2 className="h-4 w-4" />
                Approve Event
              </Button>

              <Button
                onClick={form.handleSubmit(onReject)}
                disabled={approving || rejecting}
                variant="outline"
                className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
                Reject Event
              </Button>
            </>
          ) : (
            <>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm font-medium text-red-700 mb-3">
                  Are you sure you want to reject this event?
                </p>
              </div>

              <Button
                onClick={form.handleSubmit(onReject)}
                disabled={rejecting}
                className="w-full gap-2 bg-red-600 hover:bg-red-700"
              >
                {rejecting && <Loader2 className="h-4 w-4 animate-spin" />}
                <XCircle className="h-4 w-4" />
                Confirm Rejection
              </Button>

              <Button
                onClick={() => {
                  setConfirmReject(false)
                  form.reset()
                }}
                disabled={rejecting}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
