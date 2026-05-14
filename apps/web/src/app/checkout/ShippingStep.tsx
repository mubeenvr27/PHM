"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingSchema, type ShippingFormValues } from "@/lib/checkoutSchema";
import {
  useCheckoutStore,
  SHIPPING_METHODS,
  type ShippingMethodId,
} from "@/store/checkoutStore";
import { Package, ArrowRight } from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────────────────── */
function formatCents(c: number) {
  return `$${(c / 100).toFixed(2)}`;
}

const SHIP_ICONS: Record<ShippingMethodId, typeof Package> = {
  standard: Package,
};

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV",
  "NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
  "TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

/* ─── Component ───────────────────────────────────────────────────── */
export default function ShippingStep() {
  const storeData = useCheckoutStore((s) => s.data);
  const setData = useCheckoutStore((s) => s.setData);
  const setStep = useCheckoutStore((s) => s.setStep);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: storeData.firstName,
      lastName: storeData.lastName,
      email: storeData.email,
      phone: storeData.phone,
      addressLine1: storeData.addressLine1,
      addressLine2: storeData.addressLine2 || "",
      city: storeData.city,
      state: storeData.state,
      zip: storeData.zip,
      country: "US",
      shippingMethod: storeData.shippingMethod,
    },
  });

  const selectedMethod = watch("shippingMethod");

  const onSubmit = (values: ShippingFormValues) => {
    setData(values);
    setStep(2);
  };

  /* shared input classes */
  const inputCls =
    "w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#1B3A5C] placeholder:text-slate-400 transition-colors focus:border-[#0D7377] focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20 disabled:bg-slate-50 disabled:text-slate-500";
  const errorCls = "mt-1 text-xs font-medium text-red-500";
  const labelCls = "mb-1.5 block text-sm font-semibold text-[#1B3A5C]";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-8"
    >
      {/* ── Contact Information ─────────────────────────────────── */}
      <fieldset className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <legend className="mb-5 text-lg font-bold text-[#1B3A5C]">
          Contact Information
        </legend>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className={labelCls}>First Name</label>
            <input id="firstName" {...register("firstName")} className={inputCls} placeholder="John" />
            {errors.firstName && <p className={errorCls}>{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className={labelCls}>Last Name</label>
            <input id="lastName" {...register("lastName")} className={inputCls} placeholder="Doe" />
            {errors.lastName && <p className={errorCls}>{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Email */}
          <div>
            <label htmlFor="email" className={labelCls}>Email</label>
            <input id="email" type="email" {...register("email")} className={inputCls} placeholder="john@example.com" />
            {errors.email && <p className={errorCls}>{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelCls}>
              Phone <span className="text-xs font-normal text-slate-400">(E.164)</span>
            </label>
            <input id="phone" type="tel" {...register("phone")} className={inputCls} placeholder="+12025551234" />
            {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* ── Shipping Address ───────────────────────────────────── */}
      <fieldset className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <legend className="mb-5 text-lg font-bold text-[#1B3A5C]">
          Shipping Address
        </legend>

        {/* Country (locked) */}
        <div className="mb-5">
          <label className={labelCls}>Country</label>
          <div className="flex h-12 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4">
            <span className="text-lg leading-none" aria-hidden="true">🇺🇸</span>
            <span className="text-sm font-medium text-slate-500">United States</span>
          </div>
          <input type="hidden" {...register("country")} value="US" />
        </div>

        {/* Street */}
        <div className="mb-5">
          <label htmlFor="addressLine1" className={labelCls}>Street Address</label>
          <input id="addressLine1" {...register("addressLine1")} className={inputCls} placeholder="123 Main St" />
          {errors.addressLine1 && <p className={errorCls}>{errors.addressLine1.message}</p>}
        </div>

        <div className="mb-5">
          <label htmlFor="addressLine2" className={labelCls}>
            Apt / Suite <span className="text-xs font-normal text-slate-400">(optional)</span>
          </label>
          <input id="addressLine2" {...register("addressLine2")} className={inputCls} placeholder="Suite 200" />
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {/* City */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="city" className={labelCls}>City</label>
            <input id="city" {...register("city")} className={inputCls} placeholder="Waxahachie" />
            {errors.city && <p className={errorCls}>{errors.city.message}</p>}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className={labelCls}>State</label>
            <select id="state" {...register("state")} className={inputCls + " appearance-none"}>
              <option value="">--</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.state && <p className={errorCls}>{errors.state.message}</p>}
          </div>

          {/* ZIP */}
          <div>
            <label htmlFor="zip" className={labelCls}>ZIP Code</label>
            <input id="zip" {...register("zip")} className={inputCls} placeholder="75165" inputMode="numeric" />
            {errors.zip && <p className={errorCls}>{errors.zip.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* ── Shipping Method ────────────────────────────────────── */}
      <fieldset className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <legend className="mb-5 text-lg font-bold text-[#1B3A5C]">
          Shipping Method
        </legend>

        <div className="flex justify-center" role="radiogroup" aria-label="Shipping method">
          {SHIPPING_METHODS.map((m) => {
            const Icon = SHIP_ICONS[m.id];
            const checked = selectedMethod === m.id;
            return (
              <label
                key={m.id}
                htmlFor={`ship-${m.id}`}
                className={`flex w-fit cursor-pointer items-center justify-center gap-3 rounded-full border-2 px-8 py-4 transition-all ${
                  checked
                    ? "border-[#0D7377] bg-white shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  id={`ship-${m.id}`}
                  value={m.id}
                  {...register("shippingMethod")}
                  className="sr-only"
                  onChange={() => setValue("shippingMethod", m.id)}
                />
                <Icon size={20} className="text-[#0D7377]" />
                <span className="text-[15px] font-bold text-[#1B3A5C]">
                  {m.label}: ${m.price_cents / 100} {m.description}
                </span>
              </label>
            );
          })}
        </div>
        {errors.shippingMethod && <p className={errorCls}>{errors.shippingMethod.message}</p>}
      </fieldset>

      {/* ── Submit ─────────────────────────────────────────────── */}
      <button
        type="submit"
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0D7377] text-base font-bold text-white transition-colors hover:bg-[#0a5f63] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0D7377]"
      >
        Continue to Review
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
