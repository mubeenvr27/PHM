"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/* ─── Stripe singleton (loaded once) ──────────────────────────────── */
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

/* ─── Clinical theme for Stripe Elements ──────────────────────────── */
const APPEARANCE: import("@stripe/stripe-js").Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#0D7377",
    colorBackground: "#FFFFFF",
    colorText: "#1B3A5C",
    colorDanger: "#EF4444",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSizeBase: "15px",
    spacingUnit: "4px",
    borderRadius: "12px",
    focusBoxShadow: "0 0 0 3px rgba(13, 115, 119, 0.2)",
    focusOutline: "none",
  },
  rules: {
    ".Input": {
      border: "1.5px solid #E2E8F0",
      boxShadow: "none",
      padding: "12px 16px",
      transition: "border-color 0.15s ease",
    },
    ".Input:focus": {
      border: "1.5px solid #0D7377",
    },
    ".Label": {
      fontWeight: "600",
      marginBottom: "6px",
      color: "#1B3A5C",
    },
    ".Tab": {
      border: "1.5px solid #E2E8F0",
      borderRadius: "12px",
    },
    ".Tab--selected": {
      borderColor: "#0D7377",
      backgroundColor: "rgba(13, 115, 119, 0.04)",
    },
  },
};

/* ─── Inner form (inside Elements provider) ───────────────────────── */
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const resetCheckout = useCheckoutStore((s) => s.resetCheckout);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      setProcessing(true);
      setError(null);

      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed. Please try again.");
        setProcessing(false);
      } else {
        // Payment succeeded without redirect (e.g. card)
        setSuccess(true);
        clearCart();
        resetCheckout();
        setTimeout(() => router.push("/checkout/success"), 1500);
      }
    },
    [stripe, elements, clearCart, resetCheckout, router]
  );

  if (success) {
    return (
      <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0D7377]">
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#1B3A5C] mb-2">
          Payment Successful!
        </h2>
        <p className="text-sm text-slate-500">
          Redirecting to your confirmation page…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-[#1B3A5C]">
          Payment Details
        </h2>

        {/* Stripe PaymentElement — supports Card, Apple Pay, Google Pay */}
        <PaymentElement
          options={{
            layout: "accordion",
            business: { name: "Priority Home Monitor" },
          }}
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/50 p-4">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-red-500"
          />
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      )}

      {/* Trust badge */}
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
        <ShieldCheck size={18} className="text-[#0D7377] shrink-0" />
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-[#1B3A5C]">
            Secure payment
          </span>{" "}
          — powered by Stripe with 256-bit encryption. We never store your
          card details.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0D7377] text-base font-bold text-white transition-colors hover:bg-[#0a5f63] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0D7377] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {processing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processing…
          </>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
}

export default function PaymentStep() {
  const items = useCartStore((s) => s.items);
  const data = useCheckoutStore((s) => s.data);
  const setStep = useCheckoutStore((s) => s.setStep);
  const paymentIntentId = useCheckoutStore((s) => s.paymentIntentId);
  const storeClientSecret = useCheckoutStore((s) => s.clientSecret);
  const setPaymentIntent = useCheckoutStore((s) => s.setPaymentIntent);

  const [clientSecret, setClientSecret] = useState<string | null>(storeClientSecret);
  const [loading, setLoading] = useState(!storeClientSecret);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function createIntent() {
      try {
        const res = await fetch("/api/checkout/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              id: i.id,
              name: i.name,
              quantity: i.quantity,
            })),
            shippingMethod: data.shippingMethod,
            shipping: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              addressLine1: data.addressLine1,
              addressLine2: data.addressLine2,
              city: data.city,
              state: data.state,
              zip: data.zip,
            },
            paymentIntentId, // Send existing intent ID
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to start payment");
        setClientSecret(json.clientSecret);
        setPaymentIntent(json.paymentIntentId, json.clientSecret);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Payment setup failed");
      } finally {
        setLoading(false);
      }
    }

    createIntent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
        <div className="h-14 animate-pulse rounded-xl bg-white shadow-sm" />
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <AlertCircle size={28} className="mx-auto mb-3 text-red-400" />
        <h3 className="text-base font-bold text-[#1B3A5C] mb-1">
          Payment Setup Error
        </h3>
        <p className="text-sm text-slate-500 mb-5">{error}</p>
        <button
          onClick={() => setStep(2)}
          className="inline-flex h-[44px] items-center gap-2 rounded-xl border-2 border-slate-200 px-6 text-sm font-bold text-[#1B3A5C] transition-colors hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back to Review
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: APPEARANCE,
          loader: "auto",
        }}
      >
        <CheckoutForm />
      </Elements>

      {/* Back button */}
      <button
        type="button"
        onClick={() => setStep(2)}
        className="inline-flex h-[44px] items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-400 transition-colors hover:text-[#1B3A5C]"
      >
        <ArrowLeft size={16} />
        Back to Review
      </button>
    </div>
  );
}
