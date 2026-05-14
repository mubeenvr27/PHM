"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore, selectTotalItems, selectSubtotalCents } from "@/store/cartStore";
import { useCheckoutStore, SHIPPING_METHODS } from "@/store/checkoutStore";
import ShippingStep from "./ShippingStep";
import ReviewStep from "./ReviewStep";
import PaymentStep from "./PaymentStep";
import { Check } from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────────────────── */
function formatCents(c: number) {
  return `$${(c / 100).toFixed(2)}`;
}

/* ─── Step Indicator ──────────────────────────────────────────────── */
const STEPS = [
  { num: 1, label: "Shipping" },
  { num: 2, label: "Review" },
  { num: 3, label: "Payment" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Checkout progress" className="mb-10">
      <ol className="flex items-center justify-center gap-0">
        {STEPS.map((s, i) => {
          const done = current > s.num;
          const active = current === s.num;
          return (
            <li key={s.num} className="flex items-center">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    done
                      ? "bg-[#0D7377] text-white"
                      : active
                      ? "bg-[#1B3A5C] text-white ring-4 ring-[#1B3A5C]/15"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? <Check size={16} /> : s.num}
                </span>
                <span
                  className={`text-sm font-semibold hidden sm:inline ${
                    active ? "text-[#1B3A5C]" : done ? "text-[#0D7377]" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-4 h-0.5 w-12 sm:w-20 rounded-full transition-colors ${
                    current > s.num ? "bg-[#0D7377]" : "bg-slate-200"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ─── Mini Order Sidebar ──────────────────────────────────────────── */
function OrderMini() {
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore(selectTotalItems);
  const subtotalCents = useCartStore(selectSubtotalCents);
  const shippingMethod = useCheckoutStore((s) => s.data.shippingMethod);
  const ship = SHIPPING_METHODS.find((m) => m.id === shippingMethod) || SHIPPING_METHODS[0];
  const totalCents = subtotalCents + ship.price_cents;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">
        Order ({totalItems} item{totalItems !== 1 ? "s" : ""})
      </h3>
      <ul className="space-y-3 mb-5">
        {items.map((it) => (
          <li key={it.id} className="flex justify-between text-sm">
            <span className="text-[#1B3A5C] font-medium truncate pr-4">
              {it.name} × {it.quantity}
            </span>
            <span className="font-semibold text-[#1B3A5C] tabular-nums whitespace-nowrap">
              {formatCents(it.price_cents * it.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <dl className="space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Subtotal</dt>
          <dd className="font-semibold text-[#1B3A5C] tabular-nums">{formatCents(subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Shipping</dt>
          <dd className="font-semibold text-[#1B3A5C] tabular-nums">
            {formatCents(ship.price_cents)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-3">
          <dt className="text-base font-bold text-[#1B3A5C]">Total</dt>
          <dd className="text-lg font-extrabold text-[#1B3A5C] tabular-nums">{formatCents(totalCents)}</dd>
        </div>
      </dl>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CHECKOUT PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const step = useCheckoutStore((s) => s.step);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* Guard: redirect if cart empty */
  useEffect(() => {
    if (mounted && items.length === 0) {
      toast.error("Your cart is empty.");
      router.replace("/cart");
    }
  }, [mounted, items.length, router]);

  if (!mounted || items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <section className="w-full border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <h1 className="text-2xl font-bold tracking-tight text-[#1B3A5C] md:text-3xl mb-1">
            Checkout
          </h1>
          <p className="text-sm text-slate-500">
            Complete your shipping details to finalize enrollment.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10 pb-24 md:px-12 md:pb-12">
        <StepIndicator current={step} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main step content */}
          <div>
            {step === 1 && <ShippingStep />}
            {step === 2 && <ReviewStep />}
            {step === 3 && <PaymentStep />}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <OrderMini />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
