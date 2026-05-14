/**
 * Server-side product price catalog (cents).
 * The frontend never dictates prices — the API looks up the
 * canonical price here when calculating PaymentIntent amounts.
 */

export const PRODUCT_PRICES_CENTS: Record<string, number> = {
  // Individual devices
  "bt-bp-cuff": 2500,
  "glucose-meter": 3500,
  "peak-flow": 8000,
  "pulse-ox": 2500,
  "4g-bp-cuff": 4000,
  // Care bundles
  hypertension: 5000,
  diabetes: 6500,
  respiratory: 10500,
  "adv-heart": 10000,
};

/** Shipping costs in cents, keyed by method id */
export const SHIPPING_PRICES_CENTS: Record<string, number> = {
  standard: 869,
};
