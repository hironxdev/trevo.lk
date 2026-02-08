"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Car,
  Home,
  Info,
  Users,
  Phone,
  LogIn,
  ChevronDown,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { UserDropdownButton } from "@/app/(client)/auth/_components/user-dropdown-button";
import { cn } from "@/lib/utils";

const navigationLinks = [
  { name: "Browse Vehicles", href: "/vehicles", icon: Car },
  { name: "Browse Stays", href: "/stays", icon: Home },
  { name: "Browse Events", href: "/events", icon: Calendar },
  { name: "How It Works", href: "/how-it-works", icon: Info },
  { name: "Become Partner", href: "/partner/register", icon: Users },
  { name: "Contact", href: "/contact", icon: Phone },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const getDashboardLink = () => {
    if (!session?.user) return "/dashboard";
    switch (session.user.role) {
      case "ADMIN":
        return "/admin";
      case "BUSINESS_PARTNER":
      case "INDIVIDUAL_PARTNER":
        return "/partner/dashboard";
      default:
        return "/dashboard";
    }
  };

  const getDashboardLabel = () => {
    if (!session?.user) return "Dashboard";
    switch (session.user.role) {
      case "ADMIN":
        return "Admin";
      case "BUSINESS_PARTNER":
      case "INDIVIDUAL_PARTNER":
        return "Partner";
      default:
        return "Dashboard";
    }
  };

  const isPartner =
    session?.user?.role === "BUSINESS_PARTNER" ||
    session?.user?.role === "INDIVIDUAL_PARTNER";

  const filteredNavLinks = isPartner
    ? navigationLinks.filter((link) => link.name !== "Become Partner")
    : navigationLinks;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-white/80 backdrop-blur-sm",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/trevo-logo.png"
                alt="Trevo"
                width={160}
                height={60}
                className="h-14 md:h-16 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-1">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-foreground/80 hover:text-primary px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-primary/5"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {status === "loading" ? (
              <div className="h-9 w-24 bg-muted animate-pulse rounded-lg" />
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 rounded-lg"
                >
                  <Link href={getDashboardLink()}>{getDashboardLabel()}</Link>
                </Button>
                <UserDropdownButton user={session.user} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-foreground/80 hover:text-foreground"
                >
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="rounded-full px-5 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                >
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-border/50 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {filteredNavLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 w-full text-left text-foreground/80 hover:text-primary hover:bg-primary/5 py-3 px-3 text-base font-medium transition-colors duration-200 rounded-lg"
                  >
                    <Icon className="h-5 w-5" />
                    {link.name}
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-border/50 space-y-3">
                {session?.user ? (
                  <>
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 h-12"
                    >
                      <Link href={getDashboardLink()} onClick={closeMobileMenu}>
                        {getDashboardLabel()}
                      </Link>
                    </Button>
                    {isPartner && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full bg-transparent h-12"
                      >
                        <Link
                          href="/partner/vehicles/new"
                          onClick={closeMobileMenu}
                        >
                          Add Vehicle
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-transparent h-12"
                    >
                      <Link href="/auth/sign-in" onClick={closeMobileMenu}>
                        <LogIn className="h-5 w-5 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 h-12"
                    >
                      <Link href="/auth/sign-up" onClick={closeMobileMenu}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
