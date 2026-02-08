"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUsers, updateUserRole } from "@/actions/admin/users";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { UserRole } from "@prisma/client";
import { Return } from "@prisma/client/runtime/library";

type UsersReturnType = Awaited<ReturnType<typeof getUsers>>["data"];
type UsersSuccessType = Extract<UsersReturnType, { data: unknown }>["data"];  

export function UserManagement() {
  const [users, setUsers] = useState<UsersSuccessType>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  async function fetchUsers() {
    setLoading(true);
    const result = await getUsers({
      search: search || undefined,
      role: roleFilter !== "ALL" ? (roleFilter as UserRole) : undefined,
    });

    if (result.success && result.data) {
      setUsers(result.data.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    const fetch = async () => {
      await fetchUsers();
    };
    fetch();
  }, []);

  async function handleRoleChange(userId: string, newRole: UserRole) {
    const result = await updateUserRole(userId, newRole);

    if (result.success) {
      toast.success("User role updated");
      fetchUsers();
    } else {
      toast.error(result.error || "Failed to update role");
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="BUSINESS_PARTNER">Partner</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchUsers}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card className="p-6 text-center">Loading...</Card>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                      {user.partner?.partnerType === "BUSINESS" && (
                        <Badge
                          variant={
                            user.partner.kycStatus === "VERIFIED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.partner.businessName}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {user.email}
                    </p>
                    {user.phone && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {user.phone}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Joined {format(new Date(user.createdAt), "MMM d, yyyy")} •{" "}
                      {user._count.bookings} bookings
                    </p>
                  </div>
                  <div>
                    <Select
                      value={user.role}
                      onValueChange={(value: UserRole) =>
                        handleRoleChange(user.id, value as UserRole)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="BUSINESS_PARTNER">
                          Partner
                        </SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
