"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Search, Download, Users, TrendingUp, Activity,
  ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, Mail, Phone,
  Globe, MessageSquare, User, Calendar, Stethoscope,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────
type LeadType   = "referral" | "consultation" | "contact"
type LeadStatus = "new" | "contacted" | "enrolled" | "closed"
type SortField  = "created_at" | "patient_name" | null
type SortDir    = "asc" | "desc"

interface Lead {
  id: string
  type: LeadType
  patient_name: string
  provider_name: string | null
  phone: string | null
  email: string | null
  condition_interest: string | null
  message: string | null
  source_page: string | null
  status: LeadStatus
  created_at: string
}

// ─── (Mock data removed — live DB fetch below) ───────────────────────────────

// ─── Config ───────────────────────────────────────────────────────────────────
const statusConfig: Record<LeadStatus, { label: string; cls: string }> = {
  new:       { label: "New",       cls: "bg-slate-100 text-slate-700 border-slate-300" },
  contacted: { label: "Contacted", cls: "bg-amber-100 text-amber-700 border-amber-300" },
  enrolled:  { label: "Enrolled",  cls: "bg-[#0D7377]/10 text-[#0D7377] border-[#0D7377]/30" },
  closed:    { label: "Closed",    cls: "bg-[#1B3A5C]/10 text-[#1B3A5C] border-[#1B3A5C]/30" },
}

const typeConfig: Record<LeadType, { label: string; cls: string }> = {
  referral:     { label: "Referral",     cls: "bg-blue-50 text-blue-700 border-blue-200" },
  consultation: { label: "Consultation", cls: "bg-violet-50 text-violet-700 border-violet-200" },
  contact:      { label: "Contact",      cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
}

const PAGE_SIZE = 8

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(d))
}

function fmtDateTime(d: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(d))
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, iconColor = "#1B3A5C" }: {
  icon: React.ElementType; label: string; value: string | number; sub: string; iconColor?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight" style={{ color: "#1B3A5C" }}>{value}</p>
          <p className="mt-1 text-xs text-slate-400">{sub}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
          <Icon size={22} style={{ color: iconColor }} />
        </div>
      </div>
      <div className="absolute -bottom-3 -right-3 h-16 w-16 rounded-full opacity-5" style={{ background: iconColor }} />
    </div>
  )
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────
function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (sortField !== field) return <ChevronsUpDown size={14} className="ml-1 text-slate-300" />
  return sortDir === "asc"
    ? <ChevronUp size={14} className="ml-1 text-[#0D7377]" />
    : <ChevronDown size={14} className="ml-1 text-[#0D7377]" />
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [page, setPage] = useState(1)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // ── Live fetch ──
  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch("/api/admin/leads?limit=200")
      const data = await res.json()
      if (res.ok && data.success) {
        setLeads(data.data)
      } else {
        const msg = data.error ?? "Failed to load leads"
        setFetchError(msg)
        toast.error("Connection Error", { description: msg })
      }
    } catch {
      const msg = "Could not reach the database. Check your connection."
      setFetchError(msg)
      toast.error("Connection Error", { description: msg })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  // ── All hooks & derived values MUST come before any conditional returns ──
  const totalLeads      = leads.length
  const activeReferrals = leads.filter(l => l.type === "referral" && l.status !== "closed").length
  const enrolled        = leads.filter(l => l.status === "enrolled").length
  const enrollRate      = totalLeads > 0 ? Math.round((enrolled / totalLeads) * 100) : 0

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let result = leads.filter(l =>
      l.patient_name.toLowerCase().includes(q) ||
      (l.condition_interest ?? "").toLowerCase().includes(q) ||
      (l.email ?? "").toLowerCase().includes(q) ||
      (l.provider_name ?? "").toLowerCase().includes(q)
    )
    if (sortField) {
      result = [...result].sort((a, b) => {
        const av = a[sortField] ?? ""
        const bv = b[sortField] ?? ""
        const cmp = av < bv ? -1 : av > bv ? 1 : 0
        return sortDir === "asc" ? cmp : -cmp
      })
    }
    return result
  }, [leads, search, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("desc") }
    setPage(1)
  }

  async function handleStatusChange(leadId: string, newStatus: LeadStatus) {
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
    setUpdatingId(leadId)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(`Status updated to "${statusConfig[newStatus].label}"`, { description: "Lead record saved." })
      } else {
        // Revert on failure
        toast.error("Failed to update status", { description: data.error ?? "Database error. Please try again." })
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: l.status } : l))
      }
    } catch {
      toast.error("Connection error", { description: "Could not reach the database." })
    } finally {
      setUpdatingId(null)
    }
  }

  function exportCSV() {
    const headers = ["Date", "Name", "Type", "Program Interest", "Email", "Phone", "Provider", "Status", "Source", "Message"]
    const rows = filtered.map(l => [
      fmtDate(l.created_at), l.patient_name, l.type,
      l.condition_interest ?? "", l.email ?? "", l.phone ?? "",
      l.provider_name ?? "", l.status, l.source_page ?? "", (l.message ?? "").replace(/,/g, ";"),
    ])
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a"); a.href = url; a.download = "phm-leads.csv"; a.click()
    URL.revokeObjectURL(url)
    toast.success("Export complete", { description: `${filtered.length} leads exported.` })
  }

  // ── Conditional renders AFTER all hooks ──
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <svg className="h-10 w-10 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#1B3A5C" strokeWidth="4" />
            <path className="opacity-80" fill="#0D7377" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-sm font-medium text-[#1B3A5C]">Loading leads…</p>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="max-w-sm rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <Activity size={22} className="text-red-400" />
          </div>
          <h3 className="mb-1 text-base font-semibold text-[#1B3A5C]">Connection Error</h3>
          <p className="mb-5 text-sm text-slate-500">{fetchError}</p>
          <button
            onClick={fetchLeads}
            className="rounded-xl px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: "#0D7377" }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#1B3A5C" }}>
              Lead Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor and manage all patient and provider inquiries in real time.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Activity size={14} className="text-[#0D7377]" />
            <span>Last synced: just now</span>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={Users}     label="Total Leads"      value={totalLeads}          sub="All time submissions"          />
          <StatCard icon={TrendingUp} label="Active Referrals" value={activeReferrals}     sub="Open provider referrals"       iconColor="#0D7377" />
          <StatCard icon={Activity}  label="Enrollment Rate"  value={`${enrollRate}%`}    sub={`${enrolled} patients enrolled`} iconColor="#0D7377" />
        </div>

        {/* ── Table Card ── */}
        <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl">

          {/* Toolbar */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, program, email…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#0D7377] focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20 transition"
              />
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#0D7377" }}
            >
              <Download size={15} />
              Export CSV
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 hover:bg-transparent">
                  <TableHead
                    className="cursor-pointer select-none whitespace-nowrap font-semibold text-[#1B3A5C]"
                    onClick={() => toggleSort("created_at")}
                  >
                    <span className="inline-flex items-center">
                      Date <SortIcon field="created_at" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none font-semibold text-[#1B3A5C]"
                    onClick={() => toggleSort("patient_name")}
                  >
                    <span className="inline-flex items-center">
                      Patient Name <SortIcon field="patient_name" sortField={sortField} sortDir={sortDir} />
                    </span>
                  </TableHead>
                  <TableHead className="font-semibold text-[#1B3A5C]">Type</TableHead>
                  <TableHead className="font-semibold text-[#1B3A5C]">Program Interest</TableHead>
                  <TableHead className="font-semibold text-[#1B3A5C]">Contact</TableHead>
                  <TableHead className="font-semibold text-[#1B3A5C]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-16 text-center text-slate-400">
                      No leads match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map(lead => (
                    <TableRow
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="cursor-pointer border-b border-slate-50 transition-colors hover:bg-teal-50/30"
                    >
                      <TableCell className="whitespace-nowrap text-sm text-slate-500">
                        {fmtDate(lead.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-[#1B3A5C]">{lead.patient_name}</div>
                        {lead.provider_name && (
                          <div className="text-xs text-slate-400">via {lead.provider_name}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${typeConfig[lead.type].cls}`}>
                          {typeConfig[lead.type].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <span className="block truncate text-sm text-slate-600">
                          {lead.condition_interest ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5 text-sm">
                          {lead.email && <div className="text-slate-600">{lead.email}</div>}
                          {lead.phone && <div className="text-slate-400">{lead.phone}</div>}
                          {!lead.email && !lead.phone && <span className="text-slate-300">—</span>}
                        </div>
                      </TableCell>
                      <TableCell onClick={e => e.stopPropagation()}>
                        <Select
                          value={lead.status}
                          onValueChange={v => handleStatusChange(lead.id, v as LeadStatus)}
                          disabled={updatingId === lead.id}
                        >
                          <SelectTrigger className={`h-7 w-[130px] border text-xs font-medium ${statusConfig[lead.status].cls} ${updatingId === lead.id ? "opacity-60" : ""}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(statusConfig) as LeadStatus[]).map(s => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {statusConfig[s].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
            <span>
              Showing <strong className="text-[#1B3A5C]">{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}</strong>–<strong className="text-[#1B3A5C]">{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of <strong className="text-[#1B3A5C]">{filtered.length}</strong> leads
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="px-3 text-xs font-medium text-[#1B3A5C]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lead Detail Modal ── */}
      <Dialog open={!!selectedLead} onOpenChange={open => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">
          {selectedLead && (
            <>
              {/* Modal header band */}
              <div className="px-6 py-5" style={{ background: "#1B3A5C" }}>
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-white">
                    Patient Profile
                  </DialogTitle>
                  <DialogDescription className="text-slate-300 text-sm">
                    Lead submitted {fmtDateTime(selectedLead.created_at)}
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Modal body */}
              <div className="space-y-4 p-6">
                {/* Name + badges */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xl font-bold text-[#1B3A5C]">{selectedLead.patient_name}</p>
                    {selectedLead.provider_name && (
                      <p className="text-sm text-slate-400">Referred by {selectedLead.provider_name}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={`text-xs ${typeConfig[selectedLead.type].cls}`}>
                      {typeConfig[selectedLead.type].label}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${statusConfig[selectedLead.status].cls}`}>
                      {statusConfig[selectedLead.status].label}
                    </Badge>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedLead.email && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail size={14} className="shrink-0 text-[#0D7377]" />
                      <span className="truncate">{selectedLead.email}</span>
                    </div>
                  )}
                  {selectedLead.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone size={14} className="shrink-0 text-[#0D7377]" />
                      <span>{selectedLead.phone}</span>
                    </div>
                  )}
                  {selectedLead.condition_interest && (
                    <div className="flex items-center gap-2 text-slate-600 col-span-2">
                      <Stethoscope size={14} className="shrink-0 text-[#0D7377]" />
                      <span>{selectedLead.condition_interest}</span>
                    </div>
                  )}
                  {selectedLead.source_page && (
                    <div className="flex items-center gap-2 text-slate-600 col-span-2">
                      <Globe size={14} className="shrink-0 text-[#0D7377]" />
                      <span className="font-mono text-xs text-slate-400">{selectedLead.source_page}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-500 col-span-2">
                    <Calendar size={14} className="shrink-0 text-[#0D7377]" />
                    <span>{fmtDateTime(selectedLead.created_at)}</span>
                  </div>
                </div>

                {selectedLead.message && (
                  <>
                    <div className="h-px bg-slate-100" />
                    <div>
                      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <MessageSquare size={12} /> Notes / Message
                      </div>
                      <p className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600 leading-relaxed">
                        {selectedLead.message}
                      </p>
                    </div>
                  </>
                )}

                {/* Status changer inside modal */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium text-slate-500">Update Status</span>
                  <Select
                    value={selectedLead.status}
                    onValueChange={v => {
                      handleStatusChange(selectedLead.id, v as LeadStatus)
                      setSelectedLead(prev => prev ? { ...prev, status: v as LeadStatus } : null)
                    }}
                  >
                    <SelectTrigger className={`h-8 w-[140px] border text-xs font-medium ${statusConfig[selectedLead.status].cls}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(statusConfig) as LeadStatus[]).map(s => (
                        <SelectItem key={s} value={s} className="text-xs">{statusConfig[s].label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
