import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const paymentIntentId = request.nextUrl.searchParams.get('payment_intent');
  if (!paymentIntentId) {
    return NextResponse.json({ error: 'Missing payment_intent' }, { status: 400 });
  }

  try {
    const result = await query(
      `SELECT
        id, stripe_payment_intent_id, status,
        customer_name, customer_email, customer_phone,
        address_line1, address_line2, city, state, zip, country,
        shipping_method, shipping_cents,
        subtotal_cents, total_cents,
        line_items, created_at
       FROM orders
       WHERE stripe_payment_intent_id = $1`,
      [paymentIntentId]
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
