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
      
      // 4. Leads by Program (Top 5)
      query(`
        SELECT condition_interest as program, COUNT(*) as count 
        FROM leads 
        WHERE condition_interest IS NOT NULL 
        GROUP BY condition_interest 
        ORDER BY count DESC 
        LIMIT 5
      `),
      
      // 5. Leads by Date (Last 30 Days velocity)
      query(`
        SELECT created_at::date as date, COUNT(*) as count 
        FROM leads 
        WHERE created_at >= NOW() - INTERVAL '30 days' 
        GROUP BY created_at::date 
        ORDER BY date ASC
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

    // Format leads by program
    const leadsByProgram = programResult.rows.map((row: any) => ({
      program: row.program,
      count: parseInt(row.count, 10)
    }));

    // Format leads by date
    const leadsByDate = dateResult.rows.map((row: any) => ({
      // Handle the date string format correctly depending on pg driver output
      date: row.date instanceof Date ? row.date.toISOString().split('T')[0] : String(row.date),
      count: parseInt(row.count, 10)
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
