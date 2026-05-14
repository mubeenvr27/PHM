"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { ArrowRight, PackageCheck, Truck, Headphones, Activity } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear stores immediately upon reaching success page
    useCartStore.getState().clearCart();
    useCheckoutStore.getState().resetCheckout();
    
    // Fetch order details to fire GA4 and display details
    if (paymentIntent) {
      fetch(`/api/orders?payment_intent=${paymentIntent}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.order) {
            setOrder(data.order);
            
            // Fire GA4 Purchase Event
            if (typeof window !== "undefined" && (window as any).gtag) {
              (window as any).gtag("event", "purchase", {
                transaction_id: data.order.id,
                value: data.order.total_cents / 100,
                currency: "USD",
                items: data.order.line_items.map((item: any) => ({
                  item_id: item.id,
                  item_name: item.name,
                  price: item.unit_price_cents / 100,
                  quantity: item.quantity
                }))
              });
            }
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [paymentIntent]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-16 px-6">
      <div className="max-w-3xl w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          {/* Animated Checkmark Icon */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#0D7377] shadow-xl shadow-teal-900/10">
            <svg 
              className="w-12 h-12 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" className="animate-checkmark" />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold text-[#1B3A5C] mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Thank you for enrolling in Priority Home Monitor. Your order has been placed and a receipt has been sent to your email.
          </p>
        </div>

        {/* Clinical Timeline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm mb-10">
          <h2 className="text-xl font-bold text-[#1B3A5C] mb-8">What happens next?</h2>
          
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-[22px] w-0.5 bg-slate-100" />
            <div className="space-y-8 relative">
              
              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-50 border-4 border-white shadow-sm relative z-10">
                  <PackageCheck size={20} className="text-[#0D7377]" />
                </div>
                <div className="pt-2">
                  <h3 className="text-base font-bold text-[#1B3A5C]">Order Processing</h3>
                  <p className="mt-1 text-sm text-slate-500">We are preparing your clinical devices for shipment. Tracking details will be emailed shortly.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-50 border-4 border-white shadow-sm relative z-10">
                  <Truck size={20} className="text-slate-400" />
                </div>
                <div className="pt-2">
                  <h3 className="text-base font-bold text-[#1B3A5C]">Device Delivery</h3>
                  <p className="mt-1 text-sm text-slate-500">Your pre-configured devices arrive at your home. No complex setup or WiFi pairing required.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-50 border-4 border-white shadow-sm relative z-10">
                  <Headphones size={20} className="text-slate-400" />
                </div>
                <div className="pt-2">
                  <h3 className="text-base font-bold text-[#1B3A5C]">Care Coordinator Call</h3>
                  <p className="mt-1 text-sm text-slate-500">A dedicated PHM specialist will call you to walk through your first readings and answer any questions.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-50 border-4 border-white shadow-sm relative z-10">
                  <Activity size={20} className="text-slate-400" />
                </div>
                <div className="pt-2">
                  <h3 className="text-base font-bold text-[#1B3A5C]">Active Monitoring</h3>
                  <p className="mt-1 text-sm text-slate-500">Our clinical team monitors your vitals daily, coordinating with your primary care provider as needed.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Order Details (if loaded) */}
        {!loading && order && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-2">Order Reference</p>
            <p className="text-lg font-bold text-[#1B3A5C] break-all">{order.id}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl bg-[#0D7377] px-8 text-base font-bold text-white transition-colors hover:bg-[#0a5f63]"
          >
            Return Home
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/programs"
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-[#1B3A5C]/20 px-8 text-base font-bold text-[#1B3A5C] transition-colors hover:bg-slate-50 hover:border-[#1B3A5C]/40"
          >
            Explore Programs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0D7377] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
