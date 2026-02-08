"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getStaysCategories, createStaysCategory } from "@/actions/stays-category/list"
import { Plus, Loader2, Home, Building, Castle, Star, Palmtree, Mountain, Building2, Trees } from "lucide-react"
import { toast } from "sonner"
import { normalizeCategories } from "@/lib/utils/normalize-categories"

const categoryTypeIcons: Record<string, any> = {
  BUDGET: Building,
  STANDARD: Home,
  LUXURY: Castle,
  PREMIUM: Star,
  BEACHFRONT: Palmtree,
  HILL_COUNTRY: Mountain,
  CITY_CENTER: Building2,
  RURAL: Trees,
}

const categoryTypeColors: Record<string, string> = {
  BUDGET: "bg-green-500/10 text-green-600",
  STANDARD: "bg-blue-500/10 text-blue-600",
  LUXURY: "bg-purple-500/10 text-purple-600",
  PREMIUM: "bg-amber-500/10 text-amber-600",
  BEACHFRONT: "bg-cyan-500/10 text-cyan-600",
  HILL_COUNTRY: "bg-emerald-500/10 text-emerald-600",
  CITY_CENTER: "bg-slate-500/10 text-slate-600",
  RURAL: "bg-lime-500/10 text-lime-600",
}

const CATEGORY_TYPES = [
  { value: "BUDGET", label: "Budget" },
  { value: "STANDARD", label: "Standard" },
  { value: "LUXURY", label: "Luxury" },
  { value: "PREMIUM", label: "Premium" },
  { value: "BEACHFRONT", label: "Beachfront" },
  { value: "HILL_COUNTRY", label: "Hill Country" },
  { value: "CITY_CENTER", label: "City Center" },
  { value: "RURAL", label: "Rural" },
]

export function StaysCategoryManagement() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "STANDARD",
    icon: "",
  })

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getStaysCategories()
      if (result.success && result.data) {
        setCategories(normalizeCategories(result.data))
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error("[v0] Error fetching stays categories:", error)
      toast.error("Failed to fetch categories")
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createStaysCategory({
        name: formData.name,
        description: formData.description,
        category: formData.category as any,
        icon: formData.icon || undefined,
      })

      if (result.success) {
        toast.success("Category created successfully")
        setIsDialogOpen(false)
        setFormData({ name: "", description: "", category: "STANDARD", icon: "" })
        fetchCategories()
      } else {
        toast.error(result.error || "Failed to create category")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Property Categories</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>Add a new category for stays listings</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Beachfront Villas"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beautiful properties right on the beach"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category Type</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (optional)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="home"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Category
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No categories yet. Create your first one!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Slug</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => {
                  const Icon = categoryTypeIcons[category.category] || Home
                  return (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={categoryTypeColors[category.category]}>
                          {category.category?.replace("_", " ") || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{category.description || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{category.slug || "-"}</TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No categories to display
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
