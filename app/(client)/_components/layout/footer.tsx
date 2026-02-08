"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Facebook,
  Instagram,
  MessageCircle,
  MapPin,
  Globe,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LocationPreferenceModal } from "@/components/location-preference-modal";
import { useLocationPreference } from "@/hooks/use-location-preference";
import { Button } from "@/components/ui/button";

const footerSections = [
  {
    title: "Explore",
    links: [
      { label: "Browse Vehicles", href: "/vehicles" },
      { label: "Browse Stays", href: "/stays" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Become a Partner", href: "/partner/register" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Safety", href: "/safety" },
      { label: "Trust & Verification", href: "/trust" },
      { label: "Contact Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Refund Policy", href: "/refund" },
    ],
  },
] as const;

type SocialLink = {
  icon: LucideIcon;
  href: string;
  label: string;
};

const socialLinks: SocialLink[] = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/share/1C9AoW7nza/",
    label: "Facebook",
  },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  {
    icon: MessageCircle,
    href: "https://chat.whatsapp.com/EfSuJAAzruEEHOZlTYEn08",
    label: "WhatsApp",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { location, isLoaded } = useLocationPreference();

  return (
    <footer className="w-full bg-gradient-to-b from-muted/30 to-muted/50 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2"
          >
            <Link
              href="/"
              className="inline-block mb-4"
              aria-label="Go to homepage"
            >
              <Image
                src="/trevo-logo.png"
                alt="Trevo"
                width={160}
                height={60}
                className="h-14 md:h-16 w-auto"
                priority
              />
            </Link>

            <p className="text-sm text-muted-foreground mb-4 max-w-xs leading-relaxed">
              විශ්වසනීය ගමනකට - All-in-one Booking platform across Sri Lanka.
            </p>

            {/* Location Preference */}
            {isLoaded && (
              <div className="bg-white rounded-xl p-3 border border-border/50 shadow-sm mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Your Location
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {location?.city || "Not set"}
                      </p>
                    </div>
                  </div>

                  <LocationPreferenceModal
                    trigger={
                      <button
                        type="button"
                        className="text-xs text-primary hover:text-primary/80 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-primary/5"
                      >
                        {location ? "Change" : "Set"}
                      </button>
                    }
                  />
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  aria-label={label}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Navigation Columns */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="col-span-1"
            >
              <h4 className="text-sm font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Partner CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 md:p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Join Our Partner Community
              </h3>
              <p className="text-sm text-muted-foreground">
                List your vehicles or properties and start earning today
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://chat.whatsapp.com/H4Ndaec0Gf92h1juuIHKZW"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                aria-label="Join WhatsApp Group"
              >
                <MessageCircle className="w-4 h-4" />
                Join WhatsApp Group
              </a>

              <Button asChild size="sm" className="rounded-full">
                <Link href="/partner/register">
                  Become a Partner
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="pt-8 border-t border-border/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Trevo. All rights reserved. Published by{" "}
              <a
                href="https://open-bird-corporate-website.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Openbird (pvt) ltd
              </a>
            </p>

            <div className="flex items-center gap-4 md:gap-6 text-sm text-muted-foreground">
              <Link
                href="/status"
                className="hover:text-primary transition-colors"
              >
                Status
              </Link>
              <Link
                href="/sitemap"
                className="hover:text-primary transition-colors"
              >
                Sitemap
              </Link>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>English</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
