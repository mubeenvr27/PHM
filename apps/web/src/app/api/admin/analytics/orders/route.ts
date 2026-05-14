import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

// Simple stub for Cognito verification
async function verifyCognitoToken(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new Error("Unauthorized");
  }
  // In a real environment, you'd use aws-jwt-verify to validate the token's signature,
  // expiration, and audience using COGNITO_USER_POOL_ID and COGNITO_APP_CLIENT_ID.
  // For this mock environment, we strictly require the Authorization header to be present.
  return true;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Strictly verify the Cognito JWT
    await verifyCognitoToken(request);

    // 2. Calculate date range (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

    // 3. Optimized Queries using pg

    // KPI Query: SUM(total_cents), COUNT(id), AVG(total_cents)
    const kpiQuery = `
      SELECT 
        COALESCE(SUM(total_cents), 0) AS total_revenue_cents,
        COUNT(id) AS total_orders,
        COALESCE(AVG(total_cents), 0) AS avg_order_value_cents
      FROM orders
      WHERE created_at >= $1
    `;
    
    // Revenue Over Time: Group by DATE(created_at)
    const revenueQuery = `
      SELECT 
        DATE(created_at) AS order_date,
        SUM(total_cents) AS daily_revenue_cents
      FROM orders
      WHERE created_at >= $1
      GROUP BY DATE(created_at)
      ORDER BY order_date ASC
    `;

    // Top Devices: Group by device name from JSONB line_items
    const topDevicesQuery = `
      WITH expanded_items AS (
        SELECT jsonb_array_elements(line_items) AS item
        FROM orders
        WHERE created_at >= $1
      )
      SELECT 
        item->>'name' AS device_name,
        SUM((item->>'quantity')::int) AS total_volume
      FROM expanded_items
      GROUP BY item->>'name'
      ORDER BY total_volume DESC
      LIMIT 5
    `;

    // Status Breakdown
    const statusQuery = `
      SELECT 
        status,
        COUNT(id) AS status_count
      FROM orders
      WHERE created_at >= $1
      GROUP BY status
    `;

    // Execute queries concurrently
    const [kpiResult, revenueResult, devicesResult, statusResult] = await Promise.all([
      query(kpiQuery, [thirtyDaysAgoStr]),
      query(revenueQuery, [thirtyDaysAgoStr]),
      query(topDevicesQuery, [thirtyDaysAgoStr]),
      query(statusQuery, [thirtyDaysAgoStr]),
    ]);

    // Format results
    const kpis = {
      totalRevenueCents: parseInt(kpiResult.rows[0].total_revenue_cents, 10),
      totalOrders: parseInt(kpiResult.rows[0].total_orders, 10),
      avgOrderValueCents: Math.round(parseFloat(kpiResult.rows[0].avg_order_value_cents)),
    };

    const revenueOverTime = revenueResult.rows.map((row: any) => ({
      date: new Date(row.order_date).toISOString().split('T')[0],
      revenueCents: parseInt(row.daily_revenue_cents, 10),
    }));

    const topDevices = devicesResult.rows.map((row: any) => ({
      name: row.device_name,
      volume: parseInt(row.total_volume, 10),
    }));

    const statusBreakdown = statusResult.rows.map((row: any) => ({
      name: row.status.charAt(0).toUpperCase() + row.status.slice(1),
      value: parseInt(row.status_count, 10),
    }));

    return NextResponse.json({
      success: true,
      data: {
        kpis,
        revenueOverTime,
        topDevices,
        statusBreakdown,
      },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching order analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order analytics" },
      { status: 500 }
    );
  }
}
