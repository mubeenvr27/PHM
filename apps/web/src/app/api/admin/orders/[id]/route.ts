import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Verify Cognito JWT token
    
    const body = await request.json();
    const { status, tracking_number } = body;
    const { id } = params;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE orders 
      SET status = $1, tracking_number = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await query(updateQuery, [status, tracking_number || null, id]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
