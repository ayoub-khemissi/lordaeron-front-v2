import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASSWORD || "",
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  await transport.sendMail({
    from: process.env.SMTP_FROM || "Lordaeron <no-reply@lordaeron.eu>",
    to,
    subject,
    html,
  });
}
