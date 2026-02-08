import { SignInForm } from "@/app/(client)/auth/_components/sign-in-form";
import Image from "next/image";
import Link from "next/link";
import { Car } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-background">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/trevo-logo.png"
              alt="Trevo"
              width={160}
              height={60}
              className="h-14 md:h-16 w-auto"
            />
          </Link>
        </div>

        {/* Form */}
        <SignInForm />

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>

      {/* Right Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-primary/5 items-center justify-center p-12 relative overflow-hidden">
        <div className="max-w-md text-center relative z-10">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10">
            <Car className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome Back to Trevo</h2>
          <p className="text-muted-foreground text-lg">
            Access your bookings, manage your profile, and find your next
            perfect ride.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Vehicles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">100+</p>
              <p className="text-sm text-muted-foreground">Partners</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">10k+</p>
              <p className="text-sm text-muted-foreground">Trips</p>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
}
