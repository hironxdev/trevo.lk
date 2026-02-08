"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getPartnerSettings, updatePartnerProfile } from "@/actions/partner/settings"
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { ErrorState } from "@/components/partner/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface PartnerData {
  id: string
  partnerType: "INDIVIDUAL" | "BUSINESS"
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED"
  rejectionReason: string | null
  // Individual fields
  fullName: string | null
  nicNumber: string | null
  whatsappNumber: string | null
  residentialAddress: string | null
  drivingLicenseNumber: string | null
  // Business fields
  businessName: string | null
  businessRegNumber: string | null
  businessType: string | null
  businessHotline: string | null
  businessEmail: string | null
  businessAddress: string | null
  authorizedPersonName: string | null
  // Common
  documents: { type: string; url: string; name?: string }[]
  createdAt: Date
  user: {
    name: string | null
    email: string | null
    phone: string | null
    image: string | null
    createdAt: Date
  }
}

export function SettingsContent() {
  const [data, setData] = useState<PartnerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [residentialAddress, setResidentialAddress] = useState("")
  const [businessHotline, setBusinessHotline] = useState("")
  const [businessEmail, setBusinessEmail] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getPartnerSettings()
      if (result.success && result.data) {
        const partner = result.data as PartnerData
        setData(partner)
        // Initialize form state
        setWhatsappNumber(partner.whatsappNumber || "")
        setResidentialAddress(partner.residentialAddress || "")
        setBusinessHotline(partner.businessHotline || "")
        setBusinessEmail(partner.businessEmail || "")
        setBusinessAddress(partner.businessAddress || "")
      } else {
        setError(result.error || "Failed to load settings")
      }
    } catch (err) {
      setError("An error occurred while loading settings")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSave = async () => {
    if (!data) return

    setSaving(true)
    try {
      const updateData =
        data.partnerType === "INDIVIDUAL"
          ? { whatsappNumber, residentialAddress }
          : { businessHotline, businessEmail, businessAddress }

      const result = await updatePartnerProfile(updateData)

      if (result.success) {
        toast.success("Settings updated successfully")
        fetchData()
      } else {
        toast.error(result.error || "Failed to update settings")
      }
    } catch (err) {
      toast.error("An error occurred while saving")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />
  }

  if (!data) return null

  const isIndividual = data.partnerType === "INDIVIDUAL"

  return (
    <div className="max-w-2xl space-y-6">
      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              {data.kycStatus === "VERIFIED" ? (
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              ) : data.kycStatus === "PENDING" ? (
                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              )}
              <div>
                <p className="font-medium">
                  {data.kycStatus === "VERIFIED"
                    ? "Verified Partner"
                    : data.kycStatus === "PENDING"
                      ? "Verification Pending"
                      : "Verification Rejected"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {data.kycStatus === "VERIFIED"
                    ? "Your account is fully verified"
                    : data.kycStatus === "PENDING"
                      ? "Your application is being reviewed"
                      : data.rejectionReason || "Please contact support"}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                data.kycStatus === "VERIFIED" && "bg-green-500/10 text-green-600 border-green-500/20",
                data.kycStatus === "PENDING" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                data.kycStatus === "REJECTED" && "bg-red-500/10 text-red-600 border-red-500/20",
              )}
            >
              {data.kycStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {format(new Date(data.createdAt), "MMMM yyyy")}</span>
            </div>
            <Badge variant="secondary">{isIndividual ? "Individual Partner" : "Business Partner"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isIndividual ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
            {isIndividual ? "Personal Information" : "Business Information"}
          </CardTitle>
          <CardDescription>
            {isIndividual
              ? "Your personal details as registered with Trevo"
              : "Your business details as registered with Trevo"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isIndividual ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{data.fullName || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">NIC Number</Label>
                  <p className="font-medium">{data.nicNumber || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Driving License</Label>
                  <p className="font-medium">{data.drivingLicenseNumber || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{data.user.email || "-"}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Editable Information</h4>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="whatsapp"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Residential Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={residentialAddress}
                      onChange={(e) => setResidentialAddress(e.target.value)}
                      placeholder="Your address"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Business Name</Label>
                  <p className="font-medium">{data.businessName || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Registration Number</Label>
                  <p className="font-medium">{data.businessRegNumber || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Business Type</Label>
                  <p className="font-medium">{data.businessType || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Authorized Person</Label>
                  <p className="font-medium">{data.authorizedPersonName || "-"}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Editable Information</h4>

                <div className="space-y-2">
                  <Label htmlFor="hotline">Business Hotline</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hotline"
                      value={businessHotline}
                      onChange={(e) => setBusinessHotline(e.target.value)}
                      placeholder="+94 11 234 5678"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessEmail"
                      type="email"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      placeholder="business@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessAddress"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      placeholder="Business address"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Uploaded Documents
          </CardTitle>
          <CardDescription>Documents submitted during registration</CardDescription>
        </CardHeader>
        <CardContent>
          {data.documents && data.documents.length > 0 ? (
            <div className="space-y-3">
              {data.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{doc.type.replace("_", " ")}</p>
                      <p className="text-sm text-muted-foreground">{doc.name || "Document"}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-6">No documents uploaded</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          <Button variant="outline" asChild className="justify-start bg-transparent">
            <Link href="/contact">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Link>
          </Button>
          <Button variant="outline" asChild className="justify-start bg-transparent">
            <Link href="/terms">
              <FileText className="mr-2 h-4 w-4" />
              Terms & Conditions
            </Link>
          </Button>
          <Button variant="outline" asChild className="justify-start bg-transparent">
            <Link href="/privacy">
              <Shield className="mr-2 h-4 w-4" />
              Privacy Policy
            </Link>
          </Button>
          <Button variant="outline" asChild className="justify-start bg-transparent">
            <a href="https://chat.whatsapp.com/EfSuJAAzruEEHOZlTYEn08" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              WhatsApp Group
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
