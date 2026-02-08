import nodemailer from "nodemailer"

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to: Array.isArray(to) ? to.join(",") : to,
    subject,
    html,
  })
}
