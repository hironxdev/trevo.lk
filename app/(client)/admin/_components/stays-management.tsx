"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllStays, approveStays } from "@/actions/admin/stays"
import { deleteStays } from "@/actions/stays/delete"
import { toast } from "sonner"
import { CheckCircle, Eye, Trash2, Edit, Phone, Shield, Users, Bed, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type StaysWithRelations = Awaited<ReturnType<typeof getAllStays>>["data"]

type StaysSuccessType = Extract<StaysWithRelations, any[]>

export function StaysManagement() {
  const [stays, setStays] = useState<StaysSuccessType>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedStays, setSelectedStays] = useState<StaysSuccessType[number] | null>(null)

  async function fetchStays() {
    const result = await getAllStays()

    if (result.success && result.data) {
      setStays(result.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStays()
  }, [])

  async function handleApprove(staysId: string) {
    const result = await approveStays(staysId, true)

    if (result.success) {
      toast.success(result.data?.message || "Property approved")
      fetchStays()
    } else {
      toast.error(result.error || "Failed to approve property")
    }
  }

  async function handleDelete() {
    if (!selectedStays) return

    const result = await deleteStays(selectedStays.id)

    if (result.success) {
      toast.success("Property deleted successfully")
      fetchStays()
    } else {
      toast.error(result.error || "Failed to delete property")
    }

    setDeleteDialogOpen(false)
    setSelectedStays(null)
  }

  const filterStays = (status?: string) => {
    if (!status || status === "all") return stays
    if (status === "approved") return stays.filter((s) => s.isApproved)
    if (status === "pending") return stays.filter((s) => !s.isApproved)
    if (status === "admin-created") return stays.filter((s) => s.isAdminCreated)
    return stays.filter((s) => s.status === status.toUpperCase())
  }

  const displayedStays = filterStays(activeTab)

  if (loading) {
    return <Card className="p-6 text-center">Loading...</Card>
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({stays.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stays.filter((s) => !s.isApproved).length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({stays.filter((s) => s.isApproved).length})</TabsTrigger>
          <TabsTrigger value="admin-created">Admin ({stays.filter((s) => s.isAdminCreated).length})</TabsTrigger>
          <TabsTrigger value="available">
            Available ({stays.filter((s) => s.status === "AVAILABLE").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {displayedStays.map((property) => (
            <Card key={property.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={property.images?.[0] || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <Badge variant={property.isApproved ? "default" : "secondary"}>
                            {property.isApproved ? "Approved" : "Pending"}
                          </Badge>
                          <Badge variant="outline">{property.status}</Badge>
                          {property.isAdminCreated && (
                            <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin Created
                            </Badge>
                          )}
                          {property.contactOnly && (
                            <Badge variant="secondary">
                              <Phone className="h-3 w-3 mr-1" />
                              Contact Only
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Partner: {property.partner?.businessName || property.partner?.fullName} •{" "}
                          {property.category?.name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {property.maxGuests} guests
                          </span>
                          <span className="flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            {property.bedrooms} bed
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <span className="text-lg font-bold text-primary">
                          Rs {property.pricePerNight?.toLocaleString()}/night
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{property._count?.bookings || 0} bookings</div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/stays/${property.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/stays/${property.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      {!property.isApproved && (
                        <Button size="sm" variant="default" onClick={() => handleApprove(property.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive bg-transparent"
                        onClick={() => {
                          setSelectedStays(property)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {displayedStays.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No properties found</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this property? This action cannot be undone. Properties with
              active bookings cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
