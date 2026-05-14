"use client";

import Image from "next/image";
import { useCartStore, selectTotalItems, selectSubtotalCents } from "@/store/cartStore";
import { useCheckoutStore, SHIPPING_METHODS } from "@/store/checkoutStore";
import { Pencil, ArrowRight, ArrowLeft, ShieldCheck, HeartPulse, Headphones } from "lucide-react";

function formatCents(c: number) {
  return `$${(c / 100).toFixed(2)}`;
}

const trustBadges = [
  { icon: ShieldCheck, label: "Secure Checkout", desc: "256-bit SSL encryption" },
  { icon: HeartPulse, label: "HIPAA-Ready", desc: "Compliant device handling" },
  { icon: Headphones, label: "Clinical Support", desc: "Dedicated care team" },
];

export default function ReviewStep() {
  const data = useCheckoutStore((s) => s.data);
  const setStep = useCheckoutStore((s) => s.setStep);
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore(selectTotalItems);
  const subtotalCents = useCartStore(selectSubtotalCents);
  const ship = SHIPPING_METHODS.find((m) => m.id === data.shippingMethod) || SHIPPING_METHODS[0];
  const totalCents = subtotalCents + ship.price_cents;

  const editShipping = () => setStep(1);

  return (
    <div className="space-y-6">
      {/* ── Contact & Shipping Summary ─────────────────────────── */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1B3A5C]">Shipping Details</h2>
          <button
            type="button"
            onClick={editShipping}
            className="inline-flex h-[44px] items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-[#0D7377] transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-[#0D7377]"
          >
            <Pencil size={14} />
            Edit
          </button>
        </div>

        <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 gap-x-8 text-sm">
          <div>
            <dt className="text-slate-400 font-medium mb-0.5">Name</dt>
            <dd className="text-[#1B3A5C] font-semibold">{data.firstName} {data.lastName}</dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium mb-0.5">Email</dt>
            <dd className="text-[#1B3A5C] font-semibold">{data.email}</dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium mb-0.5">Phone</dt>
            <dd className="text-[#1B3A5C] font-semibold">{data.phone}</dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium mb-0.5">Address</dt>
            <dd className="text-[#1B3A5C] font-semibold">
              {data.addressLine1}
              {data.addressLine2 ? `, ${data.addressLine2}` : ""}
              <br />
              {data.city}, {data.state} {data.zip}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
          <span className="text-lg leading-none" aria-hidden="true">🇺🇸</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#1B3A5C]">{ship.label}</p>
            <p className="text-xs text-slate-500">{ship.eta}</p>
          </div>
          <span className="text-sm font-bold tabular-nums text-[#1B3A5C]">
            {formatCents(ship.price_cents)}
          </span>
        </div>
      </div>

      {/* ── Items Summary ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-[#1B3A5C]">
          Items ({totalItems})
        </h2>
        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                <Image src={item.image} alt={item.name} fill className="object-contain p-1.5 mix-blend-multiply" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1B3A5C] truncate">{item.name}</p>
                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-[#1B3A5C] tabular-nums whitespace-nowrap">
                {formatCents(item.price_cents * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        {/* Totals */}
        <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Subtotal</dt>
            <dd className="font-semibold text-[#1B3A5C] tabular-nums">{formatCents(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Shipping</dt>
            <dd className="font-semibold tabular-nums text-[#1B3A5C]">
              {formatCents(ship.price_cents)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3">
            <dt className="text-base font-bold text-[#1B3A5C]">Total</dt>
            <dd className="text-xl font-extrabold text-[#1B3A5C] tabular-nums">{formatCents(totalCents)}</dd>
          </div>
        </dl>
      </div>

      {/* ── Trust Badges ──────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4">
        {trustBadges.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex flex-1 items-center gap-2.5 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm min-w-[180px]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50">
              <Icon size={16} className="text-[#0D7377]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1B3A5C]">{label}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Actions ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={editShipping}
          className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 text-sm font-bold text-[#1B3A5C] transition-colors hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back to Shipping
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className="inline-flex h-[52px] flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-[#0D7377] px-8 text-base font-bold text-white transition-colors hover:bg-[#0a5f63] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0D7377]"
        >
          Continue to Payment
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
