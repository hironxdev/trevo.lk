"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { getAllPartners, verifyPartnerKYC } from "@/actions/admin/partners"
import { toast } from "sonner"
import { CheckCircle, XCircle, Eye, Building2, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { PartnerDetailsSkeleton } from "./skeletons"

interface Partner {
  id: string
  partnerType: "INDIVIDUAL" | "BUSINESS"
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED"
  fullName?: string
  businessName?: string
  nicNumber?: string
  businessRegNumber?: string
  documents?: Array<{ type: string; url: string; name?: string }>
  bankDetails?: { bankName: string; accountName: string; accountNumber: string; branch: string }
  createdAt: string
  verifiedAt?: string
  rejectionReason?: string
  user: {
    name: string
    email: string
    phone: string
  }
  _count?: {
    vehicles: number
    bookings: number
  }
}

export function PartnerManagement() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [processing, setProcessing] = useState(false)

  async function fetchPartners() {
    setLoading(true)
    const result = await getAllPartners()
    if (result.success && result.data) {
      setPartners(result.data as Partner[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const pendingPartners = partners.filter((p) => p.kycStatus === "PENDING")
  const verifiedPartners = partners.filter((p) => p.kycStatus === "VERIFIED")
  const rejectedPartners = partners.filter((p) => p.kycStatus === "REJECTED")

  async function handleVerify(partnerId: string) {
    setProcessing(true)
    const result = await verifyPartnerKYC(partnerId, "VERIFIED")
    if (result.success) {
      toast.success("Partner verified successfully!")
      fetchPartners()
    } else {
      toast.error(result.error || "Failed to verify partner")
    }
    setProcessing(false)
  }

  async function handleReject() {
    if (!selectedPartner) return
    setProcessing(true)
    const result = await verifyPartnerKYC(selectedPartner.id, "REJECTED", rejectionReason)
    if (result.success) {
      toast.success("Partner rejected")
      fetchPartners()
      setShowRejectDialog(false)
      setRejectionReason("")
    } else {
      toast.error(result.error || "Failed to reject partner")
    }
    setProcessing(false)
  }

  function PartnerCard({ partner }: { partner: Partner }) {
    return (
      <div className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {partner.partnerType === "BUSINESS" ? (
              <Building2 className="w-5 h-5 text-primary" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <h4 className="font-semibold">{partner.businessName || partner.fullName}</h4>
            <p className="text-sm text-muted-foreground">{partner.user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={partner.partnerType === "BUSINESS" ? "default" : "secondary"}>
                {partner.partnerType}
              </Badge>
              <Badge
                variant={
                  partner.kycStatus === "VERIFIED"
                    ? "default"
                    : partner.kycStatus === "PENDING"
                      ? "secondary"
                      : "destructive"
                }
              >
                {partner.kycStatus}
              </Badge>
              {partner._count && (
                <span className="text-xs text-muted-foreground">
                  {partner._count.vehicles} vehicles • {partner._count.bookings} bookings
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/admin/partners/${partner.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Link>
          </Button>
          {partner.kycStatus === "PENDING" && (
            <>
              <Button size="sm" variant="default" onClick={() => handleVerify(partner.id)} disabled={processing}>
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setSelectedPartner(partner)
                  setShowRejectDialog(true)
                }}
                disabled={processing}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return <PartnerDetailsSkeleton />
  }

  return (
    <>
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingPartners.length})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({verifiedPartners.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedPartners.length})</TabsTrigger>
          <TabsTrigger value="all">All ({partners.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Partner Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingPartners.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pending verifications</p>
              ) : (
                <div className="space-y-4">
                  {pendingPartners.map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified">
          <Card>
            <CardHeader>
              <CardTitle>Verified Partners</CardTitle>
            </CardHeader>
            <CardContent>
              {verifiedPartners.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No verified partners</p>
              ) : (
                <div className="space-y-4">
                  {verifiedPartners.map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Partners</CardTitle>
            </CardHeader>
            <CardContent>
              {rejectedPartners.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No rejected partners</p>
              ) : (
                <div className="space-y-4">
                  {rejectedPartners.map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Partners</CardTitle>
            </CardHeader>
            <CardContent>
              {partners.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No partners found</p>
              ) : (
                <div className="space-y-4">
                  {partners.map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Partner Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be shared with the applicant.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing || !rejectionReason.trim()}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
