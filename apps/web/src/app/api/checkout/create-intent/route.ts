import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { query } from "@/lib/db";
import { PRODUCT_PRICES_CENTS, SHIPPING_PRICES_CENTS } from "@/lib/products";

export const dynamic = "force-dynamic";

interface LineItem {
  id: string;
  name: string;
  quantity: number;
}

interface CreateIntentBody {
  items: LineItem[];
  shippingMethod: string;
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentIntentId?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateIntentBody = await request.json();
    const { items, shippingMethod, shipping, paymentIntentId } = body;

    // ── Validate items exist and have server-side prices ──
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // ── Calculate total on the server (never trust frontend) ──
    let subtotalCents = 0;
    const verifiedItems: { id: string; name: string; quantity: number; unit_price_cents: number }[] = [];

    for (const item of items) {
      const unitPrice = PRODUCT_PRICES_CENTS[item.id];
      if (unitPrice === undefined) {
        return NextResponse.json(
          { error: `Unknown product: ${item.id}` },
          { status: 400 }
        );
      }
      if (item.quantity < 1 || item.quantity > 50) {
        return NextResponse.json(
          { error: `Invalid quantity for ${item.id}` },
          { status: 400 }
        );
      }
      subtotalCents += unitPrice * item.quantity;
      verifiedItems.push({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_price_cents: unitPrice,
      });
    }

    const shippingCents = SHIPPING_PRICES_CENTS[shippingMethod] ?? 0;
    const totalCents = subtotalCents + shippingCents;

    if (totalCents < 50) {
      return NextResponse.json(
        { error: "Order total must be at least $0.50" },
        { status: 400 }
      );
    }

    if (process.env.STRIPE_SECRET_KEY === "sk_test_REPLACE_ME") {
      return NextResponse.json(
        { error: "Stripe API keys are missing. Please add your real keys to .env.local to test payments." },
        { status: 400 }
      );
    }

    let paymentIntent;

    if (paymentIntentId) {
      try {
        paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
          amount: totalCents,
          metadata: {
            customer_email: shipping.email,
            customer_name: `${shipping.firstName} ${shipping.lastName}`,
          },
        });

        // UPDATE pending order in database
        await query(
          `UPDATE orders SET
            customer_name = $2, customer_email = $3, customer_phone = $4,
            address_line1 = $5, address_line2 = $6, city = $7, state = $8, zip = $9, country = 'US',
            shipping_method = $10, shipping_cents = $11,
            subtotal_cents = $12, total_cents = $13, line_items = $14
          WHERE stripe_payment_intent_id = $1`,
          [
            paymentIntent.id,
            `${shipping.firstName} ${shipping.lastName}`,
            shipping.email,
            shipping.phone,
            shipping.addressLine1,
            shipping.addressLine2 || "",
            shipping.city,
            shipping.state,
            shipping.zip,
            shippingMethod,
            shippingCents,
            subtotalCents,
            totalCents,
            JSON.stringify(verifiedItems),
          ]
        );
      } catch (e) {
        // Fallback if intent cannot be updated (e.g. already succeeded or cancelled)
        paymentIntent = null;
      }
    }

    if (!paymentIntent) {
      paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        customer_email: shipping.email,
        customer_name: `${shipping.firstName} ${shipping.lastName}`,
      },
      receipt_email: shipping.email,
    });

    // ── INSERT pending order into database ──
    await query(
      `INSERT INTO orders (
        stripe_payment_intent_id, status,
        customer_name, customer_email, customer_phone,
        address_line1, address_line2, city, state, zip, country,
        shipping_method, shipping_cents,
        subtotal_cents, total_cents, line_items
      ) VALUES (
        $1, 'pending',
        $2, $3, $4,
        $5, $6, $7, $8, $9, 'US',
        $10, $11,
        $12, $13, $14
      )`,
      [
        paymentIntent.id,
        `${shipping.firstName} ${shipping.lastName}`,
        shipping.email,
        shipping.phone,
        shipping.addressLine1,
        shipping.addressLine2 || "",
        shipping.city,
        shipping.state,
        shipping.zip,
        shippingMethod,
        shippingCents,
        subtotalCents,
        totalCents,
        JSON.stringify(verifiedItems),
      ]
    );

    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
