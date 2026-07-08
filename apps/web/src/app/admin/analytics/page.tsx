"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend
} from "recharts"
import { Activity, BarChart3, ListTodo, Users, Target, TrendingUp, ShoppingBag, DollarSign, Package } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import AdminNav from "@/components/admin/AdminNav"

interface AnalyticsData {
  totalLeads: number
  conversionRate: number
  leadsByStatus: {
    new: number
    contacted: number
    enrolled: number
    closed: number
  }
  leadsByProgram: { name: string; value: number }[]
  leadsByDate: { name: string; value: number }[]
}

interface OrderAnalyticsData {
  kpis: {
    totalRevenueCents: number;
    totalOrders: number;
    avgOrderValueCents: number;
  };
  revenueOverTime: { date: string; revenueCents: number }[];
  topDevices: { name: string; volume: number }[];
  statusBreakdown: { name: string; value: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  New: "#64748B",      // Slate
  Contacted: "#0D7377", // Teal
  Enrolled: "#1B3A5C",  // Navy
  Closed: "#334155",    // Dark Slate
}

const FULFILLMENT_COLORS: Record<string, string> = {
  Processing: "#0D7377", // Teal
  Shipped: "#2D4A6B",    // Steel Blue
  Delivered: "#1B3A5C",  // Navy
  Pending: "#94A3B8",    // Light Slate
  Canceled: "#991B1B",   // Deep Red (Professional)
}

const PROF_PALETTE = [
  "#1B3A5C", // Navy
  "#0D7377", // Teal
  "#2D4A6B", // Steel Blue
  "#14B8A6", // Modern Teal
  "#475569", // Slate
  "#64748B", // Medium Slate
  "#94A3B8", // Light Slate
];

export default function AnalyticsPage() {
  const pathname = usePathname()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [orderData, setOrderData] = useState<OrderAnalyticsData | null>(null)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics", { cache: "no-store" })
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        } else {
          setError(json.error || "Failed to load analytics")
        }
      } catch (err) {
        setError("Could not reach the analytics endpoint.")
      } finally {
        setLoading(false)
      }
    }

    async function fetchOrdersAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics/orders", { 
          cache: "no-store",
          headers: {
            "Authorization": "Bearer test-admin-token"
          }
        })
        const json = await res.json()
        if (json.success) {
          setOrderData(json.data)
        } else {
          setOrdersError(json.error || "Failed to load order analytics")
        }
      } catch (err) {
        setOrdersError("Could not reach the order analytics endpoint.")
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchAnalytics()
    fetchOrdersAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200"></div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-80 w-full animate-pulse rounded-3xl bg-white shadow-sm"></div>
            <div className="h-80 w-full animate-pulse rounded-3xl bg-white shadow-sm"></div>
            <div className="h-80 w-full animate-pulse rounded-3xl bg-white shadow-sm lg:col-span-2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="max-w-sm rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <Activity size={22} className="text-red-400" />
          </div>
          <h3 className="mb-1 text-base font-semibold text-[#1B3A5C]">Connection Error</h3>
          <p className="mb-5 text-sm text-slate-500">{error}</p>
        </div>
      </div>
    )
  }

  const funnelData = [
    { name: "New", value: data.leadsByStatus.new || 0 },
    { name: "Contacted", value: data.leadsByStatus.contacted || 0 },
    { name: "Enrolled", value: data.leadsByStatus.enrolled || 0 },
    { name: "Closed", value: data.leadsByStatus.closed || 0 }
  ].filter(item => item.value > 0)

  const PremiumTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isCents = payload[0].name === "Revenue" || payload[0].dataKey === "revenueCents";
      const value = isCents 
        ? `$${(payload[0].value / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}` 
        : payload[0].value;

      return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[16px] text-[#1B3A5C] shadow-lg">
          <p className="mb-1 font-semibold text-slate-500">{label}</p>
          <p className="font-bold">
            <span style={{ color: payload[0].payload?.fill || payload[0].color || "#0D7377" }} className="mr-2">●</span>
            {payload[0].name}: {value}
          </p>
        </div>
      )
    }
    return null
  }

  const renderOrderAnalytics = () => {
    if (ordersLoading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Skeleton className="h-[104px] w-full rounded-3xl" />
            <Skeleton className="h-[104px] w-full rounded-3xl" />
            <Skeleton className="h-[104px] w-full rounded-3xl" />
          </div>
          <Skeleton className="h-[380px] w-full rounded-3xl" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="h-[380px] w-full rounded-3xl" />
            <Skeleton className="h-[380px] w-full rounded-3xl" />
          </div>
        </div>
      )
    }

    if (ordersError) {
      return (
        <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-red-500">{ordersError}</p>
        </div>
      )
    }

    if (!orderData || orderData.kpis.totalOrders === 0) {
      return (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50">
          <p className="text-lg font-medium text-slate-500">No order data available for the last 30 days</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
              <DollarSign size={24} className="text-[#0D7377]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-[#1B3A5C]">
                ${(orderData.kpis.totalRevenueCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
              <ShoppingBag size={24} className="text-[#0D7377]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Orders</p>
              <p className="text-2xl font-bold text-[#1B3A5C]">{orderData.kpis.totalOrders}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
              <Activity size={24} className="text-[#0D7377]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Average Order Value</p>
              <p className="text-2xl font-bold text-[#1B3A5C]">
                ${(orderData.kpis.avgOrderValueCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Row 1: Revenue Over Time */}
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="text-[#0D7377]" size={20} />
            <h2 className="text-lg font-bold text-[#1B3A5C]">Revenue Over Time (30 Days)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderData.revenueOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D7377" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0D7377" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 16 }} dy={10} tickFormatter={(val) => val.substring(5).replace('-', '/')} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 16 }} tickFormatter={(val) => `$${(val / 100).toLocaleString()}`} />
                <Tooltip content={<PremiumTooltip />} />
                <Area isAnimationActive={false} type="monotone" dataKey="revenueCents" name="Revenue" stroke="#0D7377" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* Top Selling Devices */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md">
            <div className="mb-6 flex items-center gap-2">
              <Package className="text-[#1B3A5C]" size={20} />
              <h2 className="text-lg font-bold text-[#1B3A5C]">Top Selling Devices</h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderData.topDevices} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 16 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={140} tick={{ fill: "#64748b", fontSize: 16 }} tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val} />
                  <Tooltip content={<PremiumTooltip />} />
                  <Bar isAnimationActive={false} dataKey="volume" name="Units Sold" radius={[0, 4, 4, 0]} barSize={24}>
                    {orderData.topDevices.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PROF_PALETTE[index % PROF_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Fulfillment Status */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md">
            <div className="mb-6 flex items-center gap-2">
              <Activity className="text-[#1B3A5C]" size={20} />
              <h2 className="text-lg font-bold text-[#1B3A5C]">Order Fulfillment Status</h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie isAnimationActive={false} data={orderData.statusBreakdown} cx="50%" cy="50%" innerRadius={85} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                    {orderData.statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={FULFILLMENT_COLORS[entry.name] || PROF_PALETTE[index % PROF_PALETTE.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<PremiumTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '16px', color: '#64748b' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* ── Header & Navigation ── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B3A5C]">
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              High-level overview of lead velocity, conversions, and order performance.
            </p>
          </div>
          <AdminNav />
        </div>

        {/* ── Analytics Toggle ── */}
        <div className="w-full">
          <Tabs defaultValue="leads" className="w-full flex flex-col">
            <div className="flex justify-center mb-10">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                <TabsTrigger 
                  value="leads" 
                  className="rounded-xl py-3 text-sm font-bold transition-all duration-300 data-active:bg-[#0D7377] data-active:text-white data-active:shadow-lg"
                >
                  Lead Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="rounded-xl py-3 text-sm font-bold transition-all duration-300 data-active:bg-[#0D7377] data-active:text-white data-active:shadow-lg"
                >
                  Order Analytics
                </TabsTrigger>
              </TabsList>
            </div>

          {/* ── Lead Analytics Tab ── */}
          <TabsContent value="leads" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Lead Velocity */}
              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md lg:col-span-2">
                <div className="mb-6 flex items-center gap-2">
                  <TrendingUp className="text-[#0D7377]" size={20} />
                  <h2 className="text-lg font-bold text-[#1B3A5C]">Lead Velocity (Last 30 Days)</h2>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.leadsByDate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0D7377" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#0D7377" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 16 }} dy={10} tickFormatter={(val) => { const d = new Date(val); return `${d.getMonth()+1}/${d.getDate()}`; }} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 16 }} />
                      <Tooltip content={<PremiumTooltip />} />
                      <Area isAnimationActive={false} type="monotone" dataKey="value" name="Leads" stroke="#0D7377" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Program Distribution */}
              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md">
                <div className="mb-6 flex items-center gap-2">
                  <Target className="text-[#1B3A5C]" size={20} />
                  <h2 className="text-lg font-bold text-[#1B3A5C]">Top Programs</h2>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.leadsByProgram} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 16 }} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={140} tick={{ fill: "#64748b", fontSize: 16 }} tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val} />
                      <Tooltip content={<PremiumTooltip />} />
                      <Bar isAnimationActive={false} dataKey="value" name="Leads" radius={[0, 4, 4, 0]} barSize={24}>
                        {data.leadsByProgram.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PROF_PALETTE[index % PROF_PALETTE.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Conversion Funnel */}
              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md">
                <div className="mb-6 flex items-center gap-2">
                  <Activity className="text-[#0D7377]" size={20} />
                  <h2 className="text-lg font-bold text-[#1B3A5C]">Status Breakdown</h2>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <Pie isAnimationActive={false} data={funnelData} cx="50%" cy="50%" innerRadius={85} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                        {funnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip content={<PremiumTooltip />} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '16px', color: '#64748b' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Order Analytics Tab ── */}
          <TabsContent value="orders">
            {renderOrderAnalytics()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
  )
}
