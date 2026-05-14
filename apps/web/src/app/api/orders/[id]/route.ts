import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/orders/[id]
 * Fetches a single order by ID for the success page.
 * No auth required — the order ID from the Stripe return_url is the access token.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await query(
      `SELECT
        id, stripe_payment_intent_id, status,
        customer_name, customer_email, customer_phone,
        address_line1, address_line2, city, state, zip, country,
        shipping_method, shipping_cents,
        subtotal_cents, total_cents,
        line_items, created_at
       FROM orders
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
