import Link from "next/link"
import { ArrowLeft, Lock, Database, Cookie, ShieldCheck, Mail } from "lucide-react"

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  const updated = "February 2, 2026"

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="border-b bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-4 w-4" />
            Last updated: {updated}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="mx-auto w-full max-w-5xl px-4 pt-10 pb-6 sm:px-6">
        <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-primary/10 p-3">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Privacy Policy</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                This policy explains what data we collect, how we use it, and your choices when using Trevo.lk.
              </p>

              <div className="mt-4 rounded-2xl border bg-gray-50 p-4 text-sm text-muted-foreground">
                We only use your information to provide bookings, improve safety, and support you. We do not sell your personal data.
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 pb-14 sm:px-6 lg:grid-cols-12">
        {/* Table of contents */}
        <aside className="lg:col-span-4">
          <div className="sticky top-6 rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-foreground">On this page</p>
            <nav className="mt-4 space-y-2 text-sm">
              {[
                ["collect", "1. What we collect"],
                ["use", "2. How we use data"],
                ["share", "3. Sharing"],
                ["cookies", "4. Cookies"],
                ["retention", "5. Retention"],
                ["rights", "6. Your rights"],
                ["security", "7. Security"],
                ["contact", "8. Contact"],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block rounded-xl px-3 py-2 text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="mt-6 rounded-2xl border bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-xs leading-5 text-muted-foreground">
                  Booking information is shared only with partners as needed to complete your booking.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Sections */}
        <div className="space-y-6 lg:col-span-8">
          <Section id="collect" title="1. What we collect">
            <ul className="list-disc pl-5">
              <li>Account details (name, email, phone)</li>
              <li>Booking details (dates, preferences, requests)</li>
              <li>Usage data (device and basic analytics)</li>
              <li>Payment-related info (handled by payment providers when applicable)</li>
            </ul>
          </Section>

          <Section id="use" title="2. How we use data">
            <ul className="list-disc pl-5">
              <li>To create and manage your account</li>
              <li>To process bookings and send updates</li>
              <li>To provide customer support</li>
              <li>To improve platform performance and safety</li>
            </ul>
          </Section>

          <Section id="share" title="3. Sharing">
            <p>
              We share necessary booking details with partners so they can deliver your booking.
              We may also use service providers (hosting, analytics, payments) under strict agreements.
            </p>
          </Section>

          <Section id="cookies" title="4. Cookies">
            <div className="flex items-start gap-3">
              <Cookie className="h-5 w-5 text-primary mt-0.5" />
              <p>
                Cookies help us keep you signed in, remember preferences, and understand usage.
                You can control cookies through your browser settings.
              </p>
            </div>
          </Section>

          <Section id="retention" title="5. Retention">
            <p>
              We keep your data only as long as needed for business, legal, security, and support purposes.
            </p>
          </Section>

          <Section id="rights" title="6. Your rights">
            <ul className="list-disc pl-5">
              <li>Access, update, or delete your account information</li>
              <li>Request a copy of your data (where applicable)</li>
              <li>Opt out of certain communications</li>
            </ul>
          </Section>

          <Section id="security" title="7. Security">
            <p>
              We use reasonable safeguards to protect your data. However, no method is 100% secure.
            </p>
          </Section>

          <Section id="contact" title="8. Contact">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <p>
                For privacy questions, contact Trevo.lk support through official support channels.
              </p>
            </div>
          </Section>

          <div className="rounded-2xl border bg-white p-6 text-xs text-muted-foreground">
            Tip: Add your official business address, support email, and data controller details here if needed.
          </div>
        </div>
      </div>
    </main>
  )
}
