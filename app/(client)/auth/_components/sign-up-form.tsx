"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth.schema"
import { signUp } from "@/actions/auth/sign-up"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, Check } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
  { label: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
  { label: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
  { label: "One number", test: (pwd) => /\d/.test(pwd) },
]

function getPasswordStrength(password: string) {
  const passed = passwordRequirements.filter((req) => req.test(password)).length
  if (!password) return { strength: 0, label: "", bar: "" }
  if (passed <= 2) return { strength: 50, label: "Weak", bar: "bg-red-500" }
  if (passed <= 3) return { strength: 75, label: "Good", bar: "bg-yellow-500" }
  return { strength: 100, label: "Strong", bar: "bg-green-500" }
}

export function SignUpForm() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const disabled = isLoading || isGoogleLoading

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
  })

  const password = watch("password", "")
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])

  async function onSubmit(data: SignUpInput) {
    setIsLoading(true)

    try {
      const result = await signUp(data)

      if (!result?.success) {
        toast.error(result?.error || "Failed to create account")
        setIsLoading(false)
        return
      }

      toast.success("Account created successfully")

      // Auto sign-in after signup
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        router.push("/dashboard")
        router.refresh()
        return
      }

      // If auto sign-in fails, send to sign-in
      toast.message("Please sign in to continue.")
      router.push("/auth/sign-in")
      setIsLoading(false)
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)

    try {
      // This redirects the page; it may not return in success case
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (err) {
      console.error(err)
      toast.error("Failed to sign up with Google")
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
      <CardHeader className="text-center px-0">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                className="pl-10"
                placeholder="John Doe"
                disabled={disabled}
                autoComplete="name"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                placeholder="name@example.com"
                disabled={disabled}
                autoComplete="email"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                className="pl-10"
                placeholder="+94771234567"
                disabled={disabled}
                autoComplete="tel"
                {...register("phone")}
              />
            </div>
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                placeholder="Create a password"
                disabled={disabled}
                autoComplete="new-password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={disabled}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength */}
            {password && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Password strength</span>
                  <span
                    className={cn(
                      "font-medium",
                      passwordStrength.bar === "bg-red-500" && "text-red-500",
                      passwordStrength.bar === "bg-yellow-500" && "text-yellow-500",
                      passwordStrength.bar === "bg-green-500" && "text-green-500",
                    )}
                  >
                    {passwordStrength.label}
                  </span>
                </div>

                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className={cn("h-1.5 rounded-full transition-all duration-300", passwordStrength.bar)}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-1">
                  {passwordRequirements.map((req) => {
                    const ok = req.test(password)
                    return (
                      <div key={req.label} className="flex items-center gap-1.5">
                        <div
                          className={cn(
                            "h-3.5 w-3.5 rounded-full flex items-center justify-center",
                            ok ? "bg-green-500" : "bg-muted",
                          )}
                        >
                          {ok && <Check className="h-2 w-2 text-white" />}
                        </div>
                        <span className={cn("text-xs", ok ? "text-foreground" : "text-muted-foreground")}>
                          {req.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="pl-10 pr-10"
                placeholder="Confirm your password"
                disabled={disabled}
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                disabled={disabled}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          {/* Terms agreement (UI only; add to schema if you want strict validation) */}
          <div className="flex items-start gap-2">
            <input
              id="acceptTerms"
              type="checkbox"
              required
              disabled={disabled}
              className="mt-1 h-4 w-4 rounded border-muted"
            />
            <Label htmlFor="acceptTerms" className="text-sm text-muted-foreground leading-5">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </Label>
          </div>

          <Button type="submit" disabled={disabled} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignUp}
          disabled={disabled}
          className="w-full bg-transparent"
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
