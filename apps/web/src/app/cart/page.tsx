"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ShieldCheck,
  HeartPulse,
  Headphones,
  ArrowRight,
  ShoppingCart,
  Package,
} from "lucide-react";
import {
  useCartStore,
  selectTotalItems,
  selectSubtotalCents,
} from "@/store/cartStore";

/* ─── Constants ───────────────────────────────────────────────────── */
const SHIPPING_CENTS = 869; // $8.69 flat-rate (matches shop banner)

/* ─── Helpers ─────────────────────────────────────────────────────── */
function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/* ─── Empty State ─────────────────────────────────────────────────── */
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-28 px-6 text-center">
      {/* Medical monitor SVG */}
      <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-100">
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-14 w-14 text-[#0D7377]"
          aria-hidden="true"
        >
          {/* Monitor body */}
          <rect x="8" y="10" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="2.5" />
          {/* Screen */}
          <rect x="12" y="14" width="40" height="24" rx="2" fill="currentColor" opacity="0.08" />
          {/* Heartbeat line */}
          <polyline
            points="16,26 22,26 26,18 30,34 34,22 38,30 42,26 48,26"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Stand */}
          <line x1="32" y1="42" x2="32" y2="50" stroke="currentColor" strokeWidth="2.5" />
          <line x1="22" y1="50" x2="42" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-[#1B3A5C]">
        Your Cart is Empty
      </h1>
      <p className="mb-8 max-w-sm text-base text-slate-500 leading-relaxed">
        Browse our clinical-grade monitoring devices and care bundles to get
        started with remote health monitoring.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/shop"
          className="inline-flex h-[52px] min-w-[44px] items-center justify-center gap-2 rounded-xl bg-[#0D7377] px-8 text-base font-bold text-white transition-colors hover:bg-[#0a5f63] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0D7377]"
        >
          Browse Devices
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <Link
          href="/programs"
          className="inline-flex h-[52px] min-w-[44px] items-center justify-center gap-2 rounded-xl border-2 border-[#1B3A5C]/20 px-8 text-base font-bold text-[#1B3A5C] transition-colors hover:border-[#1B3A5C]/40 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#1B3A5C]"
        >
          Explore Programs
        </Link>
      </div>
    </div>
  );
}

/* ─── Quantity Stepper (44px tap targets) ──────────────────────────── */
function QuantityStepper({
  quantity,
  onDecrement,
  onIncrement,
}: {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrement}
        className="flex h-[44px] w-[44px] items-center justify-center rounded-l-xl text-slate-500 transition-colors hover:bg-slate-50 hover:text-[#1B3A5C] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0D7377]"
      >
        <Minus size={18} />
      </button>
      <span
        className="flex h-[44px] w-12 items-center justify-center border-x border-slate-200 text-base font-bold text-[#1B3A5C] tabular-nums select-none"
        aria-live="polite"
        aria-label={`Quantity: ${quantity}`}
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrement}
        className="flex h-[44px] w-[44px] items-center justify-center rounded-r-xl text-slate-500 transition-colors hover:bg-slate-50 hover:text-[#1B3A5C] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0D7377]"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

/* ─── Line Item ───────────────────────────────────────────────────── */
function CartLineItem({
  id,
  name,
  price_cents,
  quantity,
  image,
}: {
  id: string;
  name: string;
  price_cents: number;
  quantity: number;
  image: string;
}) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="group flex gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Product image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-2 mix-blend-multiply"
          sizes="96px"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-[#1B3A5C] leading-snug truncate">
              {name}
            </h3>
            <p className="mt-0.5 text-sm font-semibold text-[#0D7377]">
              {formatCents(price_cents)} each
            </p>
          </div>
          <p className="text-lg font-bold text-[#1B3A5C] tabular-nums whitespace-nowrap">
            {formatCents(price_cents * quantity)}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <QuantityStepper
            quantity={quantity}
            onDecrement={() => updateQuantity(id, quantity - 1)}
            onIncrement={() => updateQuantity(id, quantity + 1)}
          />
          <button
            type="button"
            aria-label={`Remove ${name} from cart`}
            onClick={() => removeItem(id)}
            className="flex h-[44px] w-[44px] items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-red-400"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Trust Badges ────────────────────────────────────────────────── */
const trustBadges = [
  {
    icon: ShieldCheck,
    label: "Secure Checkout",
    desc: "256-bit SSL encryption",
  },
  {
    icon: HeartPulse,
    label: "HIPAA-Ready",
    desc: "Compliant device handling",
  },
  {
    icon: Headphones,
    label: "Clinical Support",
    desc: "Dedicated care team on call",
  },
];

/* ─── Order Summary (Sticky) ──────────────────────────────────────── */
function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalItems = useCartStore(selectTotalItems);
  const subtotalCents = useCartStore(selectSubtotalCents);

  const shippingCents = SHIPPING_CENTS;
  const totalCents = subtotalCents + shippingCents;

  return (
    <div className="sticky top-24 space-y-6">
      {/* Summary card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md">
        <h2 className="mb-5 text-lg font-bold text-[#1B3A5C]">
          Order Summary
        </h2>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</dt>
            <dd className="font-semibold text-[#1B3A5C] tabular-nums">
              {formatCents(subtotalCents)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Estimated Shipping</dt>
            <dd className="font-semibold text-[#1B3A5C] tabular-nums">
              {formatCents(shippingCents)}
            </dd>
          </div>
          <div className="border-t border-slate-100 pt-3 flex justify-between">
            <dt className="text-base font-bold text-[#1B3A5C]">Total</dt>
            <dd className="text-xl font-extrabold text-[#1B3A5C] tabular-nums">
              {formatCents(totalCents)}
            </dd>
          </div>
        </dl>

        {/* Checkout CTA */}
        <Link
          href="/checkout"
          className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0D7377] text-base font-bold text-white transition-colors hover:bg-[#0a5f63] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0D7377]"
        >
          Proceed to Checkout
          <ArrowRight size={18} aria-hidden="true" />
        </Link>

        {/* Clear cart */}
        <button
          type="button"
          onClick={clearCart}
          className="mt-3 flex h-[44px] w-full items-center justify-center rounded-xl text-sm font-semibold text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          Clear Cart
        </button>
      </div>

      {/* Trust badges */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <ul className="space-y-4" role="list" aria-label="Trust indicators">
          {trustBadges.map(({ icon: Icon, label, desc }) => (
            <li key={label} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                <Icon size={18} className="text-[#0D7377]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1B3A5C]">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CART PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const isEmpty = items.length === 0;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <section className="w-full border-b border-slate-200 bg-white py-12">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 md:px-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
            <ShoppingCart size={22} className="text-[#0D7377]" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1B3A5C] md:text-3xl">
              Your Cart
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Review your clinical devices before enrollment.
            </p>
          </div>
        </div>
      </section>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <section className="mx-auto max-w-7xl px-6 py-10 md:px-12">
          {/* Shipping banner */}
          <div className="mb-8 flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50/50 px-5 py-3">
            <Package size={18} className="text-[#0D7377] shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium text-[#0D7377]">
              Standard flat-rate shipping:{" "}
              <span className="font-bold">{formatCents(SHIPPING_CENTS)}</span>
            </p>
          </div>

          {/* Two-column layout: 65% items / 35% summary */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
            {/* Items column */}
            <div className="space-y-4">
              {items.map((item) => (
                <CartLineItem key={item.id} {...item} />
              ))}
            </div>

            {/* Summary column */}
            <OrderSummary />
          </div>
        </section>
      )}
    </div>
  );
}
