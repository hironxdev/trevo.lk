import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VehicleDetailView } from "@/app/(client)/admin/_components/vehicle-detail-view";
import { AdminBreadcrumb } from "@/app/(client)/admin/_components/admin-breadcrumb";
import { getVehicleDetailByIdAdmin } from "@/actions/vehicle/info";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminVehicleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { data: vehicle } = await getVehicleDetailByIdAdmin(id);

  if (!vehicle) {
    notFound();
  }

  return (
    <main className="flex-1 bg-muted/30 py-24">
      <div className="mx-auto container px-4 py-8">
        <AdminBreadcrumb
          items={[
            { label: "Vehicles", href: "/admin/vehicles" },
            { label: `${vehicle.make} ${vehicle.model}` },
          ]}
        />
        <VehicleDetailView vehicle={vehicle} />
      </div>
    </main>
  );
}
