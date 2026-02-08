"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserSchema, type UpdateUserInput } from "@/lib/validations/user.schema"
import { getCurrentUser } from "@/actions/user/info"
import { updateUser } from "@/actions/user/update"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  })

  useEffect(() => {
    async function fetchUser() {
      const result = await getCurrentUser()
      if (result.success && result.data) {
        form.reset({
          name: result.data.name || "",
          phone: result.data.phone || "",
        })
      }
      setIsFetching(false)
    }
    fetchUser()
  }, [form])

  async function onSubmit(data: UpdateUserInput) {
    setIsLoading(true)

    const result = await updateUser(data)

    if (result.success) {
      toast.success("Profile updated successfully")
    } else {
      toast.error(result.error || "Failed to update profile")
    }

    setIsLoading(false)
  }

  if (isFetching) {
    return <div className="flex justify-center py-8">Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  )
}
