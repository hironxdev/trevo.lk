import Link from "next/link"
import { ArrowLeft, FileText, Shield, AlertTriangle, Phone } from "lucide-react"

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

export default function TermsPage() {
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
            <FileText className="h-4 w-4" />
            Last updated: {updated}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="mx-auto w-full max-w-5xl px-4 pt-10 pb-6 sm:px-6">
        <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Terms & Conditions</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                These Terms govern your use of Trevo.lk. By creating an account or using the platform,
                you agree to these Terms.
              </p>

              <div className="mt-4 rounded-2xl border bg-gray-50 p-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Trevo.lk</span> is an all-in-one booking platform in Sri Lanka
                for vehicles, stays, services, and experiences offered by trusted partners.
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
                ["about", "1. About Trevo.lk"],
                ["eligibility", "2. Eligibility"],
                ["bookings", "3. Bookings & Payments"],
                ["cancellations", "4. Cancellations & Refunds"],
                ["responsibilities", "5. Responsibilities"],
                ["prohibited", "6. Prohibited Use"],
                ["liability", "7. Limitation of Liability"],
                ["changes", "8. Changes to Terms"],
                ["contact", "9. Contact"],
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
                <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-xs leading-5 text-muted-foreground">
                  This template is a general starting point. For full legal compliance, review with a qualified
                  professional.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Sections */}
        <div className="space-y-6 lg:col-span-8">
          <Section id="about" title="1. About Trevo.lk">
            <p>
              Trevo.lk connects customers with verified partners for bookings such as vehicles, stays, services, and experiences.
              Trevo.lk may facilitate communication, payments, and support.
            </p>
          </Section>

          <Section id="eligibility" title="2. Eligibility">
            <p>You must be at least 18 years old to create an account and make bookings.</p>
            <p>You agree to provide accurate information and keep your account details updated.</p>
          </Section>

          <Section id="bookings" title="3. Bookings & Payments">
            <ul className="list-disc pl-5">
              <li>Pricing, deposits, and fees are shown before confirmation.</li>
              <li>Availability depends on partner acceptance and platform rules.</li>
              <li>Deposits (if applicable) may be collected separately and subject to partner policies.</li>
            </ul>
          </Section>

          <Section id="cancellations" title="4. Cancellations & Refunds">
            <p>
              Cancellation and refund rules depend on the specific listing and partner policy. Where refunds apply,
              processing times may vary.
            </p>
          </Section>

          <Section id="responsibilities" title="5. Responsibilities">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-gray-50 p-4">
                <p className="text-sm font-semibold text-foreground">Users</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                  <li>Provide accurate info</li>
                  <li>Use the platform lawfully</li>
                  <li>Follow partner rules during bookings</li>
                </ul>
              </div>
              <div className="rounded-2xl border bg-gray-50 p-4">
                <p className="text-sm font-semibold text-foreground">Partners</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                  <li>Provide accurate listing details</li>
                  <li>Fulfill bookings reliably</li>
                  <li>Follow Trevo.lk partner policies</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section id="prohibited" title="6. Prohibited Use">
            <ul className="list-disc pl-5">
              <li>Fraudulent activity or misuse of the platform</li>
              <li>Attempting to disrupt services or security</li>
              <li>Violating laws or partner policies</li>
            </ul>
          </Section>

          <Section id="liability" title="7. Limitation of Liability">
            <p>
              Trevo.lk facilitates bookings between customers and partners. To the maximum extent permitted by law,
              Trevo.lk is not liable for indirect damages. Liability is limited to platform fees paid (if any),
              unless otherwise required by law.
            </p>
          </Section>

          <Section id="changes" title="8. Changes to Terms">
            <p>
              We may update these Terms. Continued use of the platform after updates means you accept the updated Terms.
            </p>
          </Section>

          <Section id="contact" title="9. Contact">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <p>
                Need help? Contact Trevo.lk support through the platform’s official support channels.
              </p>
            </div>
          </Section>

          <div className="rounded-2xl border bg-white p-6 text-xs text-muted-foreground">
            Tip: You can add your company address, support email, and dispute resolution rules here.
          </div>
        </div>
      </div>
    </main>
  )
}
