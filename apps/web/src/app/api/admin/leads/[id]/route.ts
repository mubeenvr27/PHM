import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Valid status values
const VALID_STATUSES = ['new', 'contacted', 'enrolled', 'closed'] as const;
type LeadStatus = typeof VALID_STATUSES[number];

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/admin/leads/[id]
 * Fetch a single lead by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Phase 4 - Verify Cognito JWT token
    // const token = request.headers.get('authorization')?.replace('Bearer ', '');
    // if (!token) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // await verifyCognitoToken(token);

    const { id } = params;

    // Validate UUID format
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid lead ID format' },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT 
        id, 
        type, 
        patient_name, 
        provider_name, 
        phone, 
        email, 
        condition_interest, 
        message, 
        source_page, 
        status, 
        created_at
      FROM leads 
      WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch lead',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/leads/[id]
 * Update lead status
 * 
 * Request Body:
 * {
 *   "status": "new" | "contacted" | "enrolled" | "closed"
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Phase 4 - Verify Cognito JWT token
    // const token = request.headers.get('authorization')?.replace('Bearer ', '');
    // if (!token) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // await verifyCognitoToken(token);

    const { id } = params;

    // Validate UUID format
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid lead ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status value
    if (!status || !VALID_STATUSES.includes(status as LeadStatus)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid status value',
          validStatuses: VALID_STATUSES 
        },
        { status: 400 }
      );
    }

    // Update the lead status
    const result = await query(
      `UPDATE leads 
       SET status = $1 
       WHERE id = $2 
       RETURNING 
         id, 
         type, 
         patient_name, 
         provider_name, 
         phone, 
         email, 
         condition_interest, 
         message, 
         source_page, 
         status, 
         created_at`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // TODO: Phase 4 - Log to CloudWatch
    // await logToCloudWatch({
    //   action: 'lead_status_updated',
    //   leadId: id,
    //   newStatus: status,
    //   timestamp: new Date().toISOString(),
    // });

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Lead status updated successfully',
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update lead',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
