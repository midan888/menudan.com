"use client";

import { useState } from "react";
import { PLAN_LIMITS } from "@/lib/constants";
import type { PlanType } from "@/lib/constants";

interface BillingViewProps {
  currentPlan: string;
  hasStripeCustomer: boolean;
}

const PLANS = [
  {
    id: "free" as PlanType,
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "1 menu",
      "20 item images",
      "1 AI upload",
      "All themes",
      "QR code download",
      "\"Powered by\" watermark",
    ],
  },
  {
    id: "pro" as PlanType,
    name: "Pro",
    price: "$9",
    period: "/month",
    features: [
      "5 menus",
      "200 item images",
      "Unlimited AI uploads",
      "All themes",
      "Custom domain",
      "No watermark",
    ],
    popular: true,
  },
  {
    id: "business" as PlanType,
    name: "Business",
    price: "$19",
    period: "/month",
    features: [
      "Unlimited menus",
      "Unlimited images",
      "Unlimited AI uploads",
      "All themes",
      "Custom domain",
      "No watermark",
      "Priority support",
    ],
  },
];

export function BillingView({
  currentPlan,
  hasStripeCustomer,
}: BillingViewProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleUpgrade(plan: "pro" | "business") {
    setLoading(plan);
    setError("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start checkout");
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(null);
    }
  }

  async function handleManage() {
    setLoading("manage");
    setError("");

    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to open portal");
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Portal failed");
    } finally {
      setLoading(null);
    }
  }

  const limits = PLAN_LIMITS[currentPlan as PlanType] || PLAN_LIMITS.free;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your subscription and plan.
          </p>
        </div>
        {hasStripeCustomer && (
          <button
            onClick={handleManage}
            disabled={loading === "manage"}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {loading === "manage" ? "Opening..." : "Manage Subscription"}
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Current plan badge */}
      <div className="mt-6 flex items-center gap-3 rounded-lg bg-gray-50 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">
          {currentPlan.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Current plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
          </p>
          <p className="text-xs text-gray-500">
            {limits.maxMenus === Infinity ? "Unlimited" : limits.maxMenus} menus,{" "}
            {limits.maxItemImages === Infinity
              ? "unlimited"
              : limits.maxItemImages}{" "}
            images
          </p>
        </div>
      </div>

      {/* Plan cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const isDowngrade =
            (currentPlan === "business" && plan.id !== "business") ||
            (currentPlan === "pro" && plan.id === "free");

          return (
            <div
              key={plan.id}
              className={`relative rounded-xl border-2 p-6 ${
                plan.popular
                  ? "border-gray-900"
                  : isCurrent
                  ? "border-gray-400"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-4 rounded-full bg-gray-900 px-3 py-0.5 text-xs font-medium text-white">
                  Most Popular
                </span>
              )}

              <div className="text-sm font-medium text-gray-500">
                {plan.name}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-2">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <svg
                      className="h-4 w-4 shrink-0 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {isCurrent ? (
                  <div className="w-full rounded-lg bg-gray-100 py-2.5 text-center text-sm font-medium text-gray-500">
                    Current Plan
                  </div>
                ) : isDowngrade ? (
                  <button
                    onClick={handleManage}
                    disabled={!!loading}
                    className="w-full rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Manage Plan
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleUpgrade(plan.id as "pro" | "business")
                    }
                    disabled={!!loading || plan.id === "free"}
                    className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    {loading === plan.id ? "Redirecting..." : `Upgrade to ${plan.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature comparison */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          All plans include
        </h3>
        <ul className="mt-2 grid gap-1 text-xs text-gray-500 sm:grid-cols-2">
          <li>4 beautiful menu themes</li>
          <li>QR code generation (PNG + SVG)</li>
          <li>Multi-language support with AI translation</li>
          <li>Real-time menu updates</li>
          <li>Mobile-optimized menu pages</li>
          <li>OpenGraph meta tags for sharing</li>
        </ul>
      </div>
    </div>
  );
}
