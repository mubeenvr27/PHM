import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── Shipping Method Types ───────────────────────────────────────── */

export type ShippingMethodId = "standard";

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  description: string;
  price_cents: number;
  eta: string;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    label: "Standard Flat-Rate Shipping",
    description: "for all items",
    price_cents: 869,
    eta: "5–7 business days",
  },
];

/* ─── Checkout Data Types ─────────────────────────────────────────── */

export interface ShippingContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  shippingMethod: ShippingMethodId;
}

export interface CheckoutState {
  /** Current step: 1 = Shipping, 2 = Review, 3 = Payment */
  step: number;
  /** Collected form data (persisted between steps) */
  data: ShippingContactData;
  /** Stripe payment intent ID */
  paymentIntentId: string | null;
  /** Stripe client secret */
  clientSecret: string | null;
  /** Navigation */
  setStep: (step: number) => void;
  /** Update form data (partial merge) */
  setData: (data: Partial<ShippingContactData>) => void;
  /** Save payment intent details */
  setPaymentIntent: (id: string | null, secret: string | null) => void;
  /** Reset everything after successful order or abandonment */
  resetCheckout: () => void;
}

const INITIAL_DATA: ShippingContactData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
  shippingMethod: "standard",
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      step: 1,
      data: { ...INITIAL_DATA },
      paymentIntentId: null,
      clientSecret: null,

      setStep: (step) => set({ step }),

      setData: (partial) =>
        set((state) => ({
          data: { ...state.data, ...partial },
        })),

      setPaymentIntent: (id, secret) =>
        set({ paymentIntentId: id, clientSecret: secret }),

      resetCheckout: () =>
        set({
          step: 1,
          data: { ...INITIAL_DATA },
          paymentIntentId: null,
          clientSecret: null,
        }),
    }),
    {
      name: "phm-checkout",
    }
  )
);
