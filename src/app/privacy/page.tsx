import type { Metadata } from "next";
import Link from "next/link";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "qarta.app";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://qarta.app";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${APP_NAME}`,
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <Link
            href="/"
            className="text-sm font-bold"
          >
            <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. What We Collect</h2>
            <p className="mt-3">When you create an account, we collect:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Account info</strong> — your name, email address, and password (stored as a secure hash).</li>
              <li><strong>OAuth data</strong> — if you sign in with Google, we receive your name, email, and profile picture from Google. We do not access any other Google data.</li>
              <li><strong>Restaurant data</strong> — your restaurant name, description, address, phone number, menus, categories, items, and uploaded images.</li>
            </ul>
            <p className="mt-3">When customers view a menu, we log:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Timestamp of the visit</li>
              <li>Browser type (user agent)</li>
              <li>Selected language</li>
              <li>HTTP referrer</li>
            </ul>
            <p className="mt-2">We do <strong>not</strong> store IP addresses, and we do <strong>not</strong> use any tracking cookies or third-party analytics.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. How We Use Your Data</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>To provide and operate your digital menu</li>
              <li>To authenticate you and keep your session active</li>
              <li>To process payments for paid plans</li>
              <li>To send transactional emails (verification, password reset)</li>
              <li>To generate anonymous menu view statistics</li>
              <li>To extract menu data from photos and generate translations using AI</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Cookies</h2>
            <p className="mt-3">
              We use a <strong>single cookie</strong> (<code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">authjs.session-token</code>) to keep you logged in. This cookie is strictly necessary for the service to function and does not track you.
            </p>
            <p className="mt-2">We do not use any advertising, analytics, or third-party tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Third-Party Services</h2>
            <p className="mt-3">We use the following services to operate {APP_NAME}:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Google OAuth</strong> — for sign-in (optional). Subject to <a href="https://policies.google.com/privacy" className="text-indigo-600 underline" target="_blank" rel="noopener noreferrer">Google&apos;s Privacy Policy</a>.</li>
              <li><strong>Stripe</strong> — for payment processing. Subject to <a href="https://stripe.com/privacy" className="text-indigo-600 underline" target="_blank" rel="noopener noreferrer">Stripe&apos;s Privacy Policy</a>.</li>
              <li><strong>Amazon Web Services</strong> — for image storage.</li>
              <li><strong>Anthropic</strong> — for AI-powered menu extraction and translations. Menu data sent for processing is not stored by Anthropic.</li>
              <li><strong>Resend</strong> — for sending transactional emails.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Data Retention</h2>
            <p className="mt-3">
              We retain your data for as long as your account is active. When you delete your account, all your data — including your restaurant profile, menus, images, translations, and analytics — is permanently deleted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Your Rights</h2>
            <p className="mt-3">Under GDPR and similar regulations, you have the right to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Access</strong> — request a copy of your personal data.</li>
              <li><strong>Rectification</strong> — update or correct your data via your account settings.</li>
              <li><strong>Erasure</strong> — delete your account and all associated data from the Settings page.</li>
              <li><strong>Portability</strong> — request your data in a machine-readable format.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Security</h2>
            <p className="mt-3">
              Passwords are hashed with bcrypt. All connections are encrypted with HTTPS. We follow industry best practices to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Contact</h2>
            <p className="mt-3">
              If you have questions about this privacy policy or want to exercise your data rights, contact us at{" "}
              <a href={`mailto:support@${new URL(APP_URL).hostname}`} className="text-indigo-600 underline">
                support@{new URL(APP_URL).hostname}
              </a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="mx-auto max-w-3xl px-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
