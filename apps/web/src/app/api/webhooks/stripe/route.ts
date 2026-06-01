import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { query } from "@/lib/db";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

/**
 * Stripe requires the raw, unparsed body to verify webhook signatures.
 *
 * Critical Next.js 14 Rule: Use request.arrayBuffer() to read the raw body.
 * This guarantees byte-perfect fidelity for the HMAC signature check —
 * avoiding any charset re-encoding that could occur with request.text().
 * The Buffer is then passed directly to stripe.webhooks.constructEvent().
 */
export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("Missing stripe-signature header or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook configuration error" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // ── Read raw body via arrayBuffer() for byte-perfect HMAC verification ──
    const rawBody = Buffer.from(await request.arrayBuffer());
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // ── Handle events ──────────────────────────────────────────────
  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log(`✅ PaymentIntent succeeded: ${pi.id}`);

      try {
        // Update order status to 'paid'
        const result = await query(
          `UPDATE orders SET status = 'paid', updated_at = NOW()
           WHERE stripe_payment_intent_id = $1 AND status = 'pending'
           RETURNING id, customer_email, customer_name, total_cents`,
          [pi.id]
        );

        if (result.rows.length === 0) {
          console.warn(`No pending order found for PI: ${pi.id}`);
          break;
        }

        const order = result.rows[0] as OrderRow;
        console.log(`Order ${order.id} marked as paid`);

        // ── Dual SES Emails ──
        // Patient confirmation
        await sendPatientConfirmation(order);
        // PHM team alert
        await sendTeamAlert(order);
      } catch (dbErr) {
        console.error("Error updating order:", dbErr);
        // Return 200 anyway so Stripe doesn't retry indefinitely
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log(`❌ PaymentIntent failed: ${pi.id}`);

      try {
        await query(
          `UPDATE orders SET status = 'failed', updated_at = NOW()
           WHERE stripe_payment_intent_id = $1`,
          [pi.id]
        );
      } catch (dbErr) {
        console.error("Error updating failed order:", dbErr);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}

/* ─── Email Helpers (SES stubs) ───────────────────────────────────── */

interface OrderRow {
  id: string;
  customer_email: string;
  customer_name: string;
  total_cents: number;
}

/**
 * Send order confirmation to the patient.
 * TODO: Replace with AWS SES SendEmailCommand when SES is configured.
 */
async function sendPatientConfirmation(order: OrderRow) {
  const totalFormatted = `$${(order.total_cents / 100).toFixed(2)}`;

  // SES placeholder — log for now
  console.log(`📧 [PATIENT EMAIL] To: ${order.customer_email}`);
  console.log(`   Subject: Your PHM Order Confirmation #${order.id.slice(0, 8)}`);
  console.log(`   Body: Hi ${order.customer_name}, your order of ${totalFormatted} has been confirmed.`);
  console.log(`   Your devices will be shipped shortly. Our clinical team will reach out for onboarding.`);

  // When SES is ready:
  // const { SESClient, SendEmailCommand } = await import("@aws-sdk/client-ses");
  // const ses = new SESClient({ region: "us-east-1" });
  // await ses.send(new SendEmailCommand({ ... }));
}

/**
 * Send new order alert to the PHM operations team.
 * TODO: Replace with AWS SES SendEmailCommand when SES is configured.
 */
async function sendTeamAlert(order: OrderRow) {
  const totalFormatted = `$${(order.total_cents / 100).toFixed(2)}`;
  const teamEmail = process.env.PHM_TEAM_EMAIL || "team@priorityhomemonitor.com";

  console.log(`📧 [TEAM ALERT] To: ${teamEmail}`);
  console.log(`   Subject: 🎉 New Order #${order.id.slice(0, 8)} — ${totalFormatted}`);
  console.log(`   Customer: ${order.customer_name} (${order.customer_email})`);
  console.log(`   Action: Prepare device shipment and schedule onboarding call.`);
}
