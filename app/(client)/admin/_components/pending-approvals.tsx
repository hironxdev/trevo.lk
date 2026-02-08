"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPendingPartners } from "@/actions/admin/partners"
import { getPendingVehicles } from "@/actions/admin/vehicles"
import { verifyPartnerKYC } from "@/actions/admin/partners"
import { approveVehicle } from "@/actions/admin/vehicles"
import { toast } from "sonner"
import { CheckCircle, XCircle, Building2, User, Car, Loader2, Eye } from "lucide-react"
import { PartnerDetailsSkeleton } from "./skeletons"
import Link from "next/link"
import Image from "next/image"

interface Partner {
  id: string
  partnerType: "INDIVIDUAL" | "BUSINESS"
  fullName?: string
  businessName?: string
  createdAt: string
  user: { name: string; email: string; phone: string }
}

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  licensePlate: string
  pricePerDay: number
  images: string[]
  createdAt: string
  category: { name: string }
  partner: {
    businessName?: string
    fullName?: string
    user: { name: string; email: string }
  }
}

export function PendingApprovals() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  async function fetchData() {
    try {
      const [partnersResult, vehiclesResult] = await Promise.all([getPendingPartners(), getPendingVehicles()])

      if (partnersResult.success && partnersResult.data) {
        setPartners(partnersResult.data as Partner[])
      }

      if (vehiclesResult.success && vehiclesResult.data) {
        setVehicles(vehiclesResult.data as Vehicle[])
      }
    } catch (error) {
      toast.error("Failed to load pending approvals")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function handleVerifyPartner(partnerId: string, approved: boolean) {
    setProcessingId(partnerId)
    try {
      const result = await verifyPartnerKYC(
        partnerId,
        approved ? "VERIFIED" : "REJECTED",
        approved ? undefined : "Application did not meet requirements",
      )

      if (result.success) {
        toast.success(approved ? "Partner approved successfully" : "Partner rejected")
        fetchData()
      } else {
        toast.error(result.error || "Failed to update partner")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setProcessingId(null)
    }
  }

  async function handleApproveVehicle(vehicleId: string, approved: boolean) {
    setProcessingId(vehicleId)
    try {
      const result = await approveVehicle(vehicleId, approved)

      if (result.success) {
        toast.success(approved ? "Vehicle approved successfully" : "Vehicle rejected")
        fetchData()
      } else {
        toast.error(result.error || "Failed to update vehicle")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return <PartnerDetailsSkeleton />
  }

  const totalPending = partners.length + vehicles.length

  if (totalPending === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
            <p>All caught up! No pending approvals.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Pending Approvals</CardTitle>
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
            {totalPending}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={partners.length > 0 ? "partners" : "vehicles"}>
          <TabsList className="mb-4">
            <TabsTrigger value="partners" className="gap-2">
              <User className="h-4 w-4" />
              Partners
              {partners.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {partners.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="gap-2">
              <Car className="h-4 w-4" />
              Vehicles
              {vehicles.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {vehicles.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="partners">
            {partners.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending partner verifications</p>
            ) : (
              <div className="space-y-3">
                {partners.slice(0, 5).map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {partner.partnerType === "BUSINESS" ? (
                          <Building2 className="w-5 h-5 text-primary" />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold truncate">{partner.businessName || partner.fullName}</h4>
                        <p className="text-sm text-muted-foreground truncate">{partner.user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {partner.partnerType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/admin/partners/${partner.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleVerifyPartner(partner.id, true)}
                        disabled={processingId === partner.id}
                      >
                        {processingId === partner.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleVerifyPartner(partner.id, false)}
                        disabled={processingId === partner.id}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {partners.length > 5 && (
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/admin/partners?status=pending">View all {partners.length} pending partners</Link>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="vehicles">
            {vehicles.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending vehicle approvals</p>
            ) : (
              <div className="space-y-3">
                {vehicles.slice(0, 5).map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {vehicle.images?.[0] ? (
                          <Image
                            src={vehicle.images[0] || "/placeholder.svg"}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            width={64}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Car className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold truncate">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {vehicle.partner.businessName || vehicle.partner.fullName || vehicle.partner.user.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {vehicle.category.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Rs {vehicle.pricePerDay?.toLocaleString()}/day
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/admin/vehicles/${vehicle.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApproveVehicle(vehicle.id, true)}
                        disabled={processingId === vehicle.id}
                      >
                        {processingId === vehicle.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApproveVehicle(vehicle.id, false)}
                        disabled={processingId === vehicle.id}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {vehicles.length > 5 && (
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/admin/vehicles?status=pending">View all {vehicles.length} pending vehicles</Link>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
