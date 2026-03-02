import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM =
  process.env.EMAIL_FROM || "qarta.dev <noreply@qarta.dev>";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "qarta.dev";

export async function sendWelcomeEmail(email: string, name?: string) {
  const resend = getResend();
  if (!resend) return; // Silently skip if Resend not configured

  const greeting = name ? `Hi ${name}` : "Hi there";

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Welcome to ${APP_NAME}!`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #111; margin: 0 0 16px;">
          Welcome to ${APP_NAME}
        </h1>
        <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 0 0 24px;">
          ${greeting}, thanks for signing up! You're just a few steps away from having your restaurant menu online.
        </p>
        <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin: 0 0 24px;">
          <p style="font-size: 14px; color: #333; margin: 0 0 12px; font-weight: 600;">Here's how to get started:</p>
          <ol style="font-size: 14px; color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Upload a photo of your menu (AI does the rest)</li>
            <li>Choose a beautiful theme for your menu</li>
            <li>Download your QR code and place it on tables</li>
          </ol>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/menu"
           style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          Go to Dashboard
        </a>
        <p style="font-size: 13px; color: #999; margin: 32px 0 0; line-height: 1.5;">
          If you have any questions, just reply to this email. We're happy to help!
        </p>
      </div>
    `,
  }).catch((err) => {
    console.error("Failed to send welcome email:", err);
  });
}
