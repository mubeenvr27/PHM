"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend
} from "recharts"
import { Activity, BarChart3, ListTodo, Users, Target, TrendingUp } from "lucide-react"

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

const COLORS = ["#1B3A5C", "#0D7377", "#475569", "#94A3B8", "#CBD5E1"]

export default function AnalyticsPage() {
  const pathname = usePathname()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    fetchAnalytics()
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

  // Formatting for PieChart
  const funnelData = [
    { name: "New", value: data.leadsByStatus.new || 0 },
    { name: "Contacted", value: data.leadsByStatus.contacted || 0 },
    { name: "Enrolled", value: data.leadsByStatus.enrolled || 0 },
    { name: "Closed", value: data.leadsByStatus.closed || 0 }
  ].filter(item => item.value > 0)

  // Custom premium tooltip
  const PremiumTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">
          <p className="mb-1 font-semibold text-slate-300">{label}</p>
          <p className="font-medium">
            <span style={{ color: payload[0].color || "#0D7377" }} className="mr-2">●</span>
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* ── Header & Tabs ── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B3A5C]">
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              High-level overview of lead velocity and conversion performance.
            </p>
          </div>

          <div className="flex w-fit items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <Link
              href="/admin/leads"
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                pathname === "/admin/leads"
                  ? "bg-slate-100 text-[#1B3A5C]"
                  : "text-slate-500 hover:text-[#1B3A5C]"
              }`}
            >
              <ListTodo size={16} />
              Lead Management
            </Link>
            <Link
              href="/admin/analytics"
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                pathname === "/admin/analytics"
                  ? "bg-slate-100 text-[#1B3A5C]"
                  : "text-slate-500 hover:text-[#1B3A5C]"
              }`}
            >
              <BarChart3 size={16} />
              Analytics
            </Link>
          </div>
        </div>

        {/* ── Charts Grid ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* Chart 1: Lead Velocity (Full Width) */}
          <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <TrendingUp className="text-[#0D7377]" size={20} />
              <h2 className="text-lg font-bold text-[#1B3A5C]">Lead Velocity (Last 30 Days)</h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.leadsByDate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D7377" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0D7377" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 12 }} 
                    dy={10}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getMonth()+1}/${d.getDate()}`;
                    }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip content={<PremiumTooltip />} />
                  <Area type="monotone" dataKey="value" name="Leads" stroke="#0D7377" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Program Distribution */}
          <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Target className="text-[#0D7377]" size={20} />
              <h2 className="text-lg font-bold text-[#1B3A5C]">Top Programs</h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.leadsByProgram} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    width={100}
                    tick={{ fill: "#64748b", fontSize: 11 }} 
                    tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                  />
                  <Tooltip content={<PremiumTooltip />} />
                  <Bar dataKey="value" name="Leads" fill="#1B3A5C" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Conversion Funnel */}
          <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Activity className="text-[#0D7377]" size={20} />
              <h2 className="text-lg font-bold text-[#1B3A5C]">Status Breakdown</h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={funnelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PremiumTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
