"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2, Search, Building2, User, Car, CheckCircle, XCircle, Clock, X } from "lucide-react"
import { searchPartners, getAllPartners } from "@/actions/admin/partners"
import { useDebounce } from "@/hooks/use-debounce"

type Partner = {
  id: string
  partnerType: "INDIVIDUAL" | "BUSINESS"
  fullName: string | null
  businessName: string | null
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED"
  user: {
    name: string | null
    email: string
    phone: string | null
    image: string | null
  }
  _count: {
    vehicles: number
    bookings: number
  }
}

interface PartnerSearchProps {
  onSelect: (partner: Partner) => void
  selectedPartner: Partner | null
  onClear: () => void
}

export function PartnerSearch({ onSelect, selectedPartner, onClear }: PartnerSearchProps) {
  const [query, setQuery] = useState("")
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const debouncedQuery = useDebounce(query, 300)

  // Load all partners initially
  useEffect(() => {
    async function loadAllPartners() {
      const result = await getAllPartners()
      if (result.success && result.data) {
        setPartners(result.data as Partner[])
      }
      setInitialLoading(false)
    }
    loadAllPartners()
  }, [])

  // Search when query changes
  useEffect(() => {
    async function search() {
      if (!debouncedQuery.trim()) {
        // Reset to all partners when search is cleared
        const result = await getAllPartners()
        if (result.success && result.data) {
          setPartners(result.data as Partner[])
        }
        return
      }

      setLoading(true)
      const result = await searchPartners(debouncedQuery)
      if (result.success && result.data) {
        setPartners(result.data as Partner[])
      }
      setLoading(false)
    }
    search()
  }, [debouncedQuery])

  const getKycBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  if (selectedPartner) {
    return (
      <Card className="border-primary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedPartner.user.image || undefined} />
                <AvatarFallback>
                  {selectedPartner.partnerType === "BUSINESS" ? (
                    <Building2 className="h-6 w-6" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">
                    {selectedPartner.businessName || selectedPartner.fullName || selectedPartner.user.name}
                  </h3>
                  {getKycBadge(selectedPartner.kycStatus)}
                </div>
                <p className="text-sm text-muted-foreground">{selectedPartner.user.email}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Car className="h-3 w-3" />
                    {selectedPartner._count.vehicles} vehicles
                  </span>
                  <span>{selectedPartner.partnerType === "BUSINESS" ? "Business Partner" : "Individual Partner"}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, business name, or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {(loading || initialLoading) && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && !initialLoading && partners.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No partners found</p>
        </Card>
      )}

      {!loading && !initialLoading && partners.length > 0 && (
        <div className="grid gap-3 max-h-[400px] overflow-y-auto">
          {partners.map((partner) => (
            <Card
              key={partner.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => onSelect(partner)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={partner.user.image || undefined} />
                    <AvatarFallback>
                      {partner.partnerType === "BUSINESS" ? (
                        <Building2 className="h-5 w-5" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium truncate">
                        {partner.businessName || partner.fullName || partner.user.name}
                      </h4>
                      {getKycBadge(partner.kycStatus)}
                      <Badge variant="outline" className="text-xs">
                        {partner.partnerType === "BUSINESS" ? "Business" : "Individual"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{partner.user.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {partner._count.vehicles} vehicles
                      </span>
                      {partner.user.phone && <span>{partner.user.phone}</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
