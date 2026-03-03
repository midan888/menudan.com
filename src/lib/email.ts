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
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function emailLayout(content: string): string {
  return `
    <div style="background:#f4f4f5;padding:40px 16px;min-height:100vh;">
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;">
        <div style="margin-bottom:24px;">
          <span style="font-size:18px;font-weight:700;color:#111;">${APP_NAME}</span>
        </div>
        <div style="background:#fff;border-radius:12px;padding:40px;border:1px solid #e4e4e7;">
          ${content}
        </div>
        <p style="font-size:12px;color:#a1a1aa;margin:24px 0 0;text-align:center;line-height:1.6;">
          You're receiving this email because you have an account at ${APP_NAME}.<br>
          If you didn't request this, you can safely ignore it.
        </p>
      </div>
    </div>
  `;
}

function ctaButton(href: string, label: string): string {
  return `
    <a href="${href}"
       style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;margin:24px 0;">
      ${label}
    </a>
  `;
}

export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const resend = getResend();
  if (!resend) return;

  const greeting = name ? `Hi ${name},` : "Hi there,";
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Confirm your email — ${APP_NAME}`,
    html: emailLayout(`
      <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 12px;">${greeting}</h1>
      <p style="font-size:15px;color:#555;line-height:1.6;margin:0 0 8px;">
        Thanks for signing up for ${APP_NAME}! Please confirm your email address to complete your account setup.
      </p>
      ${ctaButton(verifyUrl, "Verify Email")}
      <p style="font-size:13px;color:#888;margin:0;line-height:1.5;">
        This link expires in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.
      </p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;">
      <p style="font-size:12px;color:#a1a1aa;margin:0;word-break:break-all;">
        Or copy this link: ${verifyUrl}
      </p>
    `),
  }).catch((err) => {
    console.error("Failed to send verification email:", err);
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resend = getResend();
  if (!resend) return;

  const resetUrl = `${APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Reset your password — ${APP_NAME}`,
    html: emailLayout(`
      <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 12px;">Reset your password</h1>
      <p style="font-size:15px;color:#555;line-height:1.6;margin:0 0 8px;">
        We received a request to reset the password for your ${APP_NAME} account.
        Click the button below to choose a new password.
      </p>
      ${ctaButton(resetUrl, "Reset Password")}
      <p style="font-size:13px;color:#888;margin:0;line-height:1.5;">
        This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your password won't change.
      </p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;">
      <p style="font-size:12px;color:#a1a1aa;margin:0;word-break:break-all;">
        Or copy this link: ${resetUrl}
      </p>
    `),
  }).catch((err) => {
    console.error("Failed to send password reset email:", err);
  });
}
