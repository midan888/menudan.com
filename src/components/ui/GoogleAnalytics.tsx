"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = "G-H4GSRG292N";
const CONSENT_KEY = "cookie-consent";

export function GoogleAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem(CONSENT_KEY);
      setConsentGiven(consent === "accepted");
    };

    checkConsent();

    // Listen for consent changes from CookieBanner
    window.addEventListener("cookie-consent-update", checkConsent);
    return () => {
      window.removeEventListener("cookie-consent-update", checkConsent);
    };
  }, []);

  if (!consentGiven) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}
