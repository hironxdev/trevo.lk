"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Car,
  FileText,
  CreditCard,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { verifyPartnerKYC } from "@/actions/admin/partners";
import { toast } from "sonner";
import { format } from "date-fns";
import { getPartnerById } from "@/actions/partner/info";

type PartnerReturnType = Awaited<ReturnType<typeof getPartnerById>>["data"];

interface PartnerDetailViewProps {
  partner: PartnerReturnType;
}

export function PartnerDetailView({ partner }: PartnerDetailViewProps) {
  const router = useRouter();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  async function handleVerify() {
    setProcessing(true);
    if (!partner) {
      toast.error("Partner data not available");
      setProcessing(false);
      return;
    }
    const result = await verifyPartnerKYC(partner?.id, "VERIFIED");
    if (result.success) {
      toast.success("Partner verified successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to verify partner");
    }
    setProcessing(false);
  }

  async function handleReject() {
    setProcessing(true);
    if (!partner) {
      toast.error("Partner data not available");
      setProcessing(false);
      return;
    }
    const result = await verifyPartnerKYC(
      partner?.id,
      "REJECTED",
      rejectionReason
    );
    if (result.success) {
      toast.success("Partner rejected");
      setRejectDialogOpen(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to reject partner");
    }
    setProcessing(false);
  }

  const isIndividual = partner?.partnerType === "INDIVIDUAL";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/partners">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              {isIndividual ? (
                <User className="h-8 w-8 text-primary" />
              ) : (
                <Building2 className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {partner?.businessName || partner?.fullName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isIndividual ? "secondary" : "default"}>
                  {partner?.partnerType}
                </Badge>
                <Badge
                  variant={
                    partner?.kycStatus === "VERIFIED"
                      ? "default"
                      : partner?.kycStatus === "PENDING"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {partner?.kycStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        {partner?.kycStatus === "PENDING" && (
          <div className="flex gap-2">
            <Button onClick={handleVerify} disabled={processing}>
              {processing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Verify Partner
            </Button>
            <Button
              variant="destructive"
              onClick={() => setRejectDialogOpen(true)}
              disabled={processing}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="vehicles">
                Vehicles ({partner?._count?.vehicles || 0})
              </TabsTrigger>
              <TabsTrigger value="bookings">
                Bookings ({partner?._count?.bookings || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Account Name
                    </p>
                    <p className="font-medium">{partner?.user?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {partner?.user?.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {partner?.user?.phone || "N/A"}
                    </p>
                  </div>
                  {partner?.whatsappNumber && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <p className="font-medium">{partner?.whatsappNumber}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Partner Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isIndividual ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                    {isIndividual ? "Personal Details" : "Business Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {isIndividual ? (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Full Name
                        </p>
                        <p className="font-medium">{partner?.fullName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          NIC Number
                        </p>
                        <p className="font-medium">{partner?.nicNumber}</p>
                      </div>
                      {partner?.dateOfBirth && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Date of Birth
                          </p>
                          <p className="font-medium">
                            {format(
                              new Date(partner?.dateOfBirth),
                              "MMM d, yyyy"
                            )}
                          </p>
                        </div>
                      )}
                      {partner?.gender && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Gender
                          </p>
                          <p className="font-medium">{partner?.gender}</p>
                        </div>
                      )}
                      {partner?.drivingLicenseNumber && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Driving License
                          </p>
                          <p className="font-medium">
                            {partner?.drivingLicenseNumber}
                          </p>
                        </div>
                      )}
                      {partner?.residentialAddress && (
                        <div className="space-y-1 md:col-span-2">
                          <p className="text-sm text-muted-foreground">
                            Address
                          </p>
                          <p className="font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {partner?.residentialAddress}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Business Name
                        </p>
                        <p className="font-medium">{partner?.businessName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Registration Number
                        </p>
                        <p className="font-medium">
                          {partner?.businessRegNumber}
                        </p>
                      </div>
                      {partner?.businessType && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Business Type
                          </p>
                          <p className="font-medium">{partner?.businessType}</p>
                        </div>
                      )}
                      {partner?.vatNumber && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            VAT Number
                          </p>
                          <p className="font-medium">{partner?.vatNumber}</p>
                        </div>
                      )}
                      {partner?.authorizedPersonName && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Authorized Person
                          </p>
                          <p className="font-medium">
                            {partner?.authorizedPersonName}
                          </p>
                        </div>
                      )}
                      {partner?.businessHotline && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Business Hotline
                          </p>
                          <p className="font-medium">
                            {partner?.businessHotline}
                          </p>
                        </div>
                      )}
                      {partner?.businessAddress && (
                        <div className="space-y-1 md:col-span-2">
                          <p className="text-sm text-muted-foreground">
                            Business Address
                          </p>
                          <p className="font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {partner?.businessAddress}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Bank Details */}
              {partner?.bankDetails &&
                typeof partner.bankDetails === "object" &&
                partner.bankDetails !== null &&
                "bankName" in partner.bankDetails && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Bank Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Bank Name</p>
                        <p className="font-medium">
                          {(partner.bankDetails as { bankName?: string }).bankName}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Account Name
                        </p>
                        <p className="font-medium">
                          {(partner.bankDetails as { accountName?: string }).accountName}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Account Number
                        </p>
                        <p className="font-medium">
                          {(partner.bankDetails as { accountNumber?: string }).accountNumber}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Branch</p>
                        <p className="font-medium">
                          {(partner.bankDetails as { branch?: string }).branch}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Rejection Reason */}
              {partner?.rejectionReason && (
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-destructive">
                      Rejection Reason
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{partner?.rejectionReason}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Uploaded Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(partner?.documents) && partner.documents.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {partner.documents
                        .filter(
                          (doc): doc is { url: string; name?: string; type: string } =>
                            !!doc && typeof doc === "object" && typeof (doc as any).url === "string" && typeof (doc as any).type === "string"
                        )
                        .map((doc, index) => (
                          <a
                            key={index}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <FileText className="h-8 w-8 text-primary" />
                            <div className="flex-1">
                              <p className="font-medium">
                                {doc.name || doc.type}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {doc.type}
                              </p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </a>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No documents uploaded
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vehicles">
              <Card>
                <CardContent className="p-4">
                  {partner?.vehicles && partner?.vehicles?.length > 0 ? (
                    <div className="space-y-4">
                      {partner?.vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="flex items-center gap-4 p-3 border rounded-lg"
                        >
                          <div className="relative w-24 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={vehicle.images?.[0] || "/placeholder.svg"}
                              alt={vehicle.make}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              {vehicle.make} {vehicle.model} ({vehicle.year})
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {vehicle.category?.name} • Rs{" "}
                              {vehicle.pricePerDay?.toLocaleString()}/day
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                vehicle.isApproved ? "default" : "secondary"
                              }
                            >
                              {vehicle.isApproved ? "Approved" : "Pending"}
                            </Badge>
                            <Badge variant="outline">{vehicle.status}</Badge>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/vehicles/${vehicle.id}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No vehicles listed
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardContent className="p-4">
                  {partner?.bookings && partner?.bookings?.length > 0 ? (
                    <div className="space-y-4">
                      {partner?.bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {booking.vehicle?.make} {booking.vehicle?.model}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.user?.name} •{" "}
                              {format(new Date(booking.startDate), "MMM d")} -{" "}
                              {format(new Date(booking.endDate), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge
                            variant={
                              booking.status === "CONFIRMED" ||
                              booking.status === "COMPLETED"
                                ? "default"
                                : booking.status === "CANCELLED" ||
                                  booking.status === "REJECTED"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No bookings yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Stats & Timeline */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Car className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <p className="text-2xl font-bold">
                    {partner?._count?.vehicles || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Vehicles</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <p className="text-2xl font-bold">
                    {partner?._count?.bookings || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Created</span>
                <span>
                  {format(
                    new Date(
                      partner?.user?.createdAt ??
                        partner?.createdAt ??
                        ""
                    ),
                    "MMM d, yyyy"
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Partner Application
                </span>
                <span>
                  {format(new Date(partner?.createdAt ?? ""), "MMM d, yyyy")}
                </span>
              </div>
              {partner?.verifiedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified On</span>
                  <span>
                    {format(new Date(partner?.verifiedAt ?? ""), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                asChild
              >
                <a href={`mailto:${partner?.user?.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </a>
              </Button>
              {partner?.user?.phone && (
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  asChild
                >
                  <a href={`tel:${partner?.user.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Partner
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Partner Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be shared with
              the applicant.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
