import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    '[PHM/stripe] STRIPE_SECRET_KEY environment variable is not set. ' +
    'For local dev, set it in apps/web/.env.local. ' +
    'For AWS, configure it as a secret in Amplify/Secrets Manager.'
  );
}

/**
 * Server-side Stripe singleton.
 *
 * IMPORTANT: Never import this file from a client component ("use client").
 * It will expose the secret key to the browser bundle.
 *
 * Usage:
 *   import { stripe } from '@phm/stripe';
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
});

export type { Stripe };
