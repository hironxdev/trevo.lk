import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/mailer"

function csvToList(v: string | undefined) {
  return (v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const admins = csvToList(process.env.ADMIN_EMAILS)
    const cs = csvToList(process.env.CS_EMAILS)

    if (body.type === "booking_confirmed") {
      // 1) Customer
      await sendEmail({
        to: body.customerEmail,
        subject: `✅ Booking Confirmed (#${body.bookingId})`,
        html: `
          <div style="font-family:Arial">
            <h2>Booking Confirmed 🎉</h2>
            <p>Hi ${body.customerName},</p>
            <p>Your booking is confirmed for <b>${body.vehicleTitle}</b>.</p>
            <p><b>Dates:</b> ${body.startDate} → ${body.endDate}</p>
            <p><b>Booking ID:</b> ${body.bookingId}</p>
            <p>Thanks,<br/>Trevo.lk</p>
          </div>
        `,
      })

      // 2) Partner
      await sendEmail({
        to: body.partnerEmail,
        subject: `📩 Confirmed Booking (#${body.bookingId})`,
        html: `
          <div style="font-family:Arial">
            <h3>New Confirmed Booking</h3>
            <p><b>Vehicle:</b> ${body.vehicleTitle}</p>
            <p><b>Dates:</b> ${body.startDate} → ${body.endDate}</p>
            <p><b>Booking ID:</b> ${body.bookingId}</p>
          </div>
        `,
      })

      // 3) Admin + CS
      const internal = [...admins, ...cs]
      if (internal.length) {
        await sendEmail({
          to: internal,
          subject: `🔔 Booking Confirmed (#${body.bookingId})`,
          html: `
            <div style="font-family:Arial">
              <h3>Booking Confirmed</h3>
              <p><b>ID:</b> ${body.bookingId}</p>
              <p><b>Customer:</b> ${body.customerEmail}</p>
              <p><b>Partner:</b> ${body.partnerEmail}</p>
              <p><b>Vehicle:</b> ${body.vehicleTitle}</p>
              <p><b>Dates:</b> ${body.startDate} → ${body.endDate}</p>
            </div>
          `,
        })
      }
    }

    return NextResponse.json({ ok: true })
} catch (err) {
  return NextResponse.json(
    { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
    { status: 500 }
  )
}

}
