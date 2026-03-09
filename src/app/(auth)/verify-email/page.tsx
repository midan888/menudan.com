"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { t } from "@/lib/translations";

const i18n = t();

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your inbox";

  const l = i18n.auth.verifyEmail;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{l.title}</h1>
      <p className="mt-2 text-sm text-gray-600">
        {l.sentTo}{" "}
        <span className="font-medium text-gray-900">{email}</span>
      </p>
      <p className="mt-3 text-sm text-gray-500">{l.instructions}</p>
      <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600 text-left">
        <p className="font-medium text-gray-700 mb-1">{l.didntReceive}</p>
        <ul className="space-y-1 text-gray-500">
          <li>• {l.checkSpam}</li>
          <li>• {l.checkEmail}</li>
        </ul>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <Link
          href="/login"
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 text-center"
        >
          {l.goToSignIn}
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
