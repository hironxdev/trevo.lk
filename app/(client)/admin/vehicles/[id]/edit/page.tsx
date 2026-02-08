import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminVehicleEditForm } from "@/app/(client)/admin/_components/admin-vehicle-edit-form";
import { AdminBreadcrumb } from "@/app/(client)/admin/_components/admin-breadcrumb";
import { getCategories } from "@/actions/category/list";
import { getVehicleByIdAdmin } from "@/actions/vehicle/info";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminVehicleEditPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [{ data: vehicle }, categories] = await Promise.all([
    getVehicleByIdAdmin(id),
    getCategories(),
  ]);

  if (!vehicle) {
    notFound();
  }

  return (
    <main className="flex-1 bg-muted/30 py-24">
      <div className="mx-auto container px-4 max-w-4xl py-8">
        <AdminBreadcrumb
          items={[
            { label: "Vehicles", href: "/admin/vehicles" },
            {
              label: `${vehicle.make} ${vehicle.model}`,
              href: `/admin/vehicles/${vehicle.id}`,
            },
            { label: "Edit" },
          ]}
        />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Vehicle</h1>
          <p className="text-muted-foreground">
            Editing {vehicle.make} {vehicle.model} ({vehicle.year})
          </p>
        </div>
        <AdminVehicleEditForm vehicle={vehicle} categories={categories.data} />
      </div>
    </main>
  );
}
