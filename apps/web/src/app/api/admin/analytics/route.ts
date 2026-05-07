import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Prevent static caching

export async function GET(request: NextRequest) {
  try {
    // TODO: Phase 4 - Verify Cognito JWT token
    // const token = request.headers.get('authorization')?.replace('Bearer ', '');
    // if (!token) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // await verifyCognitoToken(token);

    // Execute all aggregation queries concurrently for maximum performance
    const [
      totalResult,
      enrolledResult,
      statusResult,
      programResult,
      dateResult
    ] = await Promise.all([
      // 1. Total Leads
      query(`SELECT COUNT(*) as total FROM leads`),
      
      // 2. Enrolled Leads (for Conversion Rate)
      query(`SELECT COUNT(*) as enrolled FROM leads WHERE status = 'enrolled'`),
      
      // 3. Leads by Status
      query(`
        SELECT status, COUNT(*) as count 
        FROM leads 
        GROUP BY status
      `),
      
      // 4. Leads by Program (Top 5, parsed from comma-separated string)
      query(`
        SELECT 
          TRIM(unnest(string_to_array(condition_interest, ','))) as name, 
          COUNT(*) as value 
        FROM leads 
        WHERE condition_interest IS NOT NULL AND condition_interest != ''
        GROUP BY name 
        ORDER BY value DESC 
        LIMIT 5
      `),
      
      // 5. Leads by Date (Last 30 Days velocity, gap-filled)
      query(`
        WITH date_series AS (
          SELECT generate_series(
            CURRENT_DATE - INTERVAL '29 days', 
            CURRENT_DATE, 
            '1 day'::interval
          )::date AS date
        )
        SELECT 
          ds.date as name, 
          COUNT(l.id) as value 
        FROM date_series ds
        LEFT JOIN leads l ON l.created_at::date = ds.date
        GROUP BY ds.date 
        ORDER BY ds.date ASC
      `)
    ]);

    // Parse scalar counts
    const totalLeads = parseInt(totalResult.rows[0]?.total || '0', 10);
    const enrolledLeads = parseInt(enrolledResult.rows[0]?.enrolled || '0', 10);
    
    // Calculate conversion rate
    const conversionRate = totalLeads > 0 
      ? Number(((enrolledLeads / totalLeads) * 100).toFixed(1)) 
      : 0;

    // Format leads by status
    const leadsByStatus = statusResult.rows.reduce((acc: Record<string, number>, row: any) => {
      acc[row.status] = parseInt(row.count, 10);
      return acc;
    }, { new: 0, contacted: 0, enrolled: 0, closed: 0 }); // Pre-fill with zeros

    // Format leads by program for Recharts
    const leadsByProgram = programResult.rows.map((row: any) => ({
      name: row.name,
      value: parseInt(row.value, 10)
    }));

    // Format leads by date for Recharts
    const leadsByDate = dateResult.rows.map((row: any) => ({
      name: row.name instanceof Date ? row.name.toISOString().split('T')[0] : String(row.name),
      value: parseInt(row.value, 10)
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalLeads,
        conversionRate,
        leadsByStatus,
        leadsByProgram,
        leadsByDate
      }
    });

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
