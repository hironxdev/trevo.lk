# Exact Code Changes - Line-by-Line Diffs

## 1. vehicle-form.tsx

### Import Addition
```diff
import { createVehicle } from "@/actions/vehicle/create"
import { updateVehicle } from "@/actions/vehicle/update"
import { getCategories } from "@/actions/category/list"
+ import { normalizeCategories } from "@/lib/utils/normalize-categories"
```

### useEffect Hook - Category Fetching
```diff
  useEffect(() => {
    async function fetchCategories() {
+     try {
        const result = await getCategories()
        if (result.success && result.data) {
-         setCategories(result.data)
+         setCategories(normalizeCategories(result.data))
+       } else {
+         setCategories([])
+       }
+     } catch (error) {
+       console.error("[v0] Error fetching categories:", error)
+       setCategories([])
+     }
    }
    fetchCategories()
  }, [])
```

### SelectContent Rendering
```diff
  <SelectContent>
-   {categories.map((category) => (
-     <SelectItem key={category.id} value={category.id}>
-       {category.name}
-     </SelectItem>
-   ))}
+   {Array.isArray(categories) && categories.length > 0 ? (
+     categories.map((category) => (
+       <SelectItem key={category.id} value={category.id}>
+         {category.name}
+       </SelectItem>
+     ))
+   ) : (
+     <SelectItem value="no-categories" disabled>
+       No categories available
+     </SelectItem>
+   )}
  </SelectContent>
```

---

## 2. stays-form.tsx

### Import Addition
```diff
import { createStays } from "@/actions/stays/create"
import { updateStays } from "@/actions/stays/update"
import { getStaysCategories } from "@/actions/stays-category/list"
+ import { normalizeCategories } from "@/lib/utils/normalize-categories"
```

### useEffect Hook - Category Fetching
```diff
  useEffect(() => {
    async function fetchCategories() {
+     try {
        const result = await getStaysCategories()
        if (result.success && result.data) {
-         setCategories(result.data)
+         setCategories(normalizeCategories(result.data))
+       } else {
+         setCategories([])
+       }
+     } catch (error) {
+       console.error("[v0] Error fetching stays categories:", error)
+       setCategories([])
+     }
    }
    fetchCategories()
  }, [])
```

### SelectContent Rendering
```diff
  <SelectContent>
-   {categories.map((category) => (
-     <SelectItem key={category.id} value={category.id}>
-       {category.name}
-     </SelectItem>
-   ))}
+   {Array.isArray(categories) && categories.length > 0 ? (
+     categories.map((category) => (
+       <SelectItem key={category.id} value={category.id}>
+         {category.name}
+       </SelectItem>
+     ))
+   ) : (
+     <SelectItem value="no-categories" disabled>
+       No categories available
+     </SelectItem>
+   )}
  </SelectContent>
```

---

## 3. vehicle-step.tsx

### Import Addition
```diff
  import { UseFormReturn } from "react-hook-form"
+ import { normalizeCategories } from "@/lib/utils/normalize-categories"
```

### SelectContent Rendering
```diff
  <SelectContent>
-   {categories.map((category) => (
-     <SelectItem key={category.id} value={category.id}>
-       {category.name}
-     </SelectItem>
-   ))}
+   {Array.isArray(categories) && categories.length > 0 ? (
+     normalizeCategories(categories).map((category) => (
+       <SelectItem key={category.id} value={category.id}>
+         {category.name}
+       </SelectItem>
+     ))
+   ) : (
+     <SelectItem value="no-categories" disabled>
+       No categories available
+     </SelectItem>
+   )}
  </SelectContent>
```

---

## 4. stays-category-management.tsx

### Import Addition
```diff
  import { getStaysCategories, createStaysCategory } from "@/actions/stays-category/list"
  import { Plus, Loader2, Home, Building, Castle, Star, Palmtree, Mountain, Building2, Trees } from "lucide-react"
  import { toast } from "sonner"
+ import { normalizeCategories } from "@/lib/utils/normalize-categories"
```

### Fetch Callback
```diff
  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getStaysCategories()
      if (result.success && result.data) {
-       setCategories(result.data)
+       setCategories(normalizeCategories(result.data))
+     } else {
+       setCategories([])
+     }
    } catch (error) {
+     console.error("[v0] Error fetching stays categories:", error)
      toast.error("Failed to fetch categories")
+     setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])
```

### Table Body Rendering
```diff
  <TableBody>
-   {categories.map((category) => {
-     const Icon = categoryTypeIcons[category.category] || Home
-     return (
+   {Array.isArray(categories) && categories.length > 0 ? (
+     categories.map((category) => {
+       const Icon = categoryTypeIcons[category.category] || Home
+       return (
          <TableRow key={category.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {category.name}
              </div>
            </TableCell>
            <TableCell>
-             <Badge variant="outline" className={categoryTypeColors[category.category]}>
-               {category.category.replace("_", " ")}
+             <Badge variant="outline" className={categoryTypeColors[category.category]}>
+               {category.category?.replace("_", " ") || "N/A"}
              </Badge>
            </TableCell>
-           <TableCell className="max-w-xs truncate">{category.description}</TableCell>
-           <TableCell className="text-muted-foreground">{category.slug}</TableCell>
+           <TableCell className="max-w-xs truncate">{category.description || "-"}</TableCell>
+           <TableCell className="text-muted-foreground">{category.slug || "-"}</TableCell>
          </TableRow>
-       )
-     })}
+       )
+     })
+   ) : (
+     <TableRow>
+       <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
+         No categories to display
+       </TableCell>
+     </TableRow>
+   )}
  </TableBody>
```

---

## 5. normalize-categories.ts (NEW FILE)

This file was copied from the read-only context to `/lib/utils/normalize-categories.ts`.
It contains the centralized normalization logic for all category handling.

**Key Functions:**
- `normalizeCategories(input)` - Main function that handles all data shapes
- Returns `Category[]` type (array of `{ id: string; name: string }`)
- Supports: strings, arrays, nested objects, null/undefined
- Always returns empty array if invalid input

---

## Summary of Changes

| File | Type | Changes |
|------|------|---------|
| vehicle-form.tsx | Modified | +1 import, +3 updates (fetch + render + error handling) |
| stays-form.tsx | Modified | +1 import, +3 updates (fetch + render + error handling) |
| vehicle-step.tsx | Modified | +1 import, +1 update (render guard) |
| stays-category-management.tsx | Modified | +1 import, +3 updates (fetch + render + error handling) |
| normalize-categories.ts | NEW | Centralized normalization helper |

**Total Lines Changed:** ~60 lines added/modified across 5 files

**Risk Level:** ✅ LOW - All changes are additive with proper guards. No breaking changes.
