"use client"

/**
 * ============================================================
 * /admin/leads/[id] — Lead Detail & Status Management
 * ============================================================
 *
 * Data Flow:
 *   1. On mount → GET /api/admin/leads/[id]  (real API)
 *   2. Status change → optimistic UI update → PATCH /api/admin/leads/[id]
 *   3. On PATCH failure → revert UI state → destructive toast
 *
 * No Delete Policy:
 *   Archiving maps to setting status = 'closed'. There are no
 *   DELETE requests or destructive data mutations anywhere in this file.
 *
 * Mock Failure Simulation:
 *   Set SIMULATE_PATCH_FAILURE = true to force every PATCH to fail,
 *   which exercises the full optimistic-revert + toast error path.
 *   In production this constant is removed; real server errors drive reverts.
 */

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Mail,
  Phone,
  Stethoscope,
  Globe,
  Calendar,
  MessageSquare,
  User,
  Building2,
  Archive,
  Loader2,
  AlertCircle,
  RefreshCw,
  ListTodo,
  ShoppingBag,
  BarChart3,
  PackageSearch,
  Clock,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────
// ⚠️  MOCK FAILURE SWITCH — remove before production deployment
// Set to `true` to force all PATCH requests to fail and exercise
// the optimistic revert + destructive toast error path.
// ─────────────────────────────────────────────────────────────
const SIMULATE_PATCH_FAILURE = false

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type LeadType   = "referral" | "consultation" | "contact"
type LeadStatus = "new" | "contacted" | "enrolled" | "closed"

interface Lead {
  id:                 string
  type:               LeadType
  patient_name:       string
  provider_name:      string | null
  phone:              string | null
  email:              string | null
  condition_interest: string | null
  message:            string | null
  source_page:        string | null
  status:             LeadStatus
  created_at:         string
}

// ─────────────────────────────────────────────────────────────
// Config maps
// ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<LeadStatus, { label: string; pill: string; dot: string }> = {
  new:       {
    label: "New",
    pill:  "bg-slate-100 text-slate-700 border border-slate-300",
    dot:   "bg-slate-400",
  },
  contacted: {
    label: "Contacted",
    pill:  "bg-amber-100 text-amber-800 border border-amber-300",
    dot:   "bg-amber-500",
  },
  enrolled:  {
    label: "Enrolled",
    pill:  "bg-teal-50 text-[#0D7377] border border-[#0D7377]/30",
    dot:   "bg-[#0D7377]",
  },
  closed:    {
    label: "Closed / Archived",
    pill:  "bg-[#1B3A5C]/8 text-[#1B3A5C] border border-[#1B3A5C]/25",
    dot:   "bg-[#1B3A5C]",
  },
}

const TYPE_CONFIG: Record<LeadType, { label: string; cls: string }> = {
  referral:     { label: "Referral",     cls: "bg-blue-50 text-blue-700 border-blue-200" },
  consultation: { label: "Consultation", cls: "bg-violet-50 text-violet-700 border-violet-200" },
  contact:      { label: "Contact Form", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", year: "numeric",
  }).format(new Date(iso))
}

function fmtDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  }).format(new Date(iso))
}

function fmtRelative(iso: string) {
  const diffMs  = Date.now() - new Date(iso).getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1)  return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24)   return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7)    return `${diffD}d ago`
  return fmtDate(iso)
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

/** Labelled detail row used throughout the info sections */
function DetailRow({
  icon: Icon,
  label,
  children,
  className = "",
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50">
        <Icon size={15} className="text-[#0D7377]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <div className="mt-0.5 text-sm text-slate-700">{children}</div>
      </div>
    </div>
  )
}

/** Status select pill with colour-coded trigger */
function StatusSelect({
  leadId,
  currentStatus,
  isUpdating,
  onStatusChange,
}: {
  leadId:          string
  currentStatus:   LeadStatus
  isUpdating:      boolean
  onStatusChange:  (id: string, status: LeadStatus) => void
}) {
  const cfg = STATUS_CONFIG[currentStatus]

  return (
    <Select
      value={currentStatus}
      onValueChange={(v) => onStatusChange(leadId, v as LeadStatus)}
      disabled={isUpdating}
    >
      <SelectTrigger
        id="lead-status-select"
        className={`h-9 w-[175px] gap-2 border text-sm font-medium transition-opacity ${cfg.pill} ${isUpdating ? "opacity-60" : ""}`}
      >
        {isUpdating
          ? <Loader2 size={13} className="shrink-0 animate-spin" />
          : <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
        }
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((s) => (
          <SelectItem key={s} value={s} className="text-sm">
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
              {STATUS_CONFIG[s].label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Skeleton loader card */
function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-20 rounded bg-slate-100" />
            <div className={`h-3.5 rounded bg-slate-100 ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string

  // ── State ────────────────────────────────────────────────
  const [lead,       setLead]       = useState<Lead | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  /**
   * We keep a `previousStatus` ref so the optimistic revert never
   * needs to look up the old state asynchronously — it is captured
   * at the moment the user triggers the change.
   */
  const previousStatusRef = useRef<LeadStatus | null>(null)

  // ── Fetch ────────────────────────────────────────────────
  const fetchLead = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res  = await fetch(`/api/admin/leads/${leadId}`, { cache: "no-store" })
      const data = await res.json()

      if (res.ok && data.success) {
        setLead(data.data)
      } else {
        const msg = data.error ?? "Failed to load lead."
        setFetchError(msg)
        toast.error("Failed to load lead", { description: msg })
      }
    } catch {
      const msg = "Could not reach the server. Check your connection."
      setFetchError(msg)
      toast.error("Connection Error", { description: msg })
    } finally {
      setLoading(false)
    }
  }, [leadId])

  useEffect(() => { fetchLead() }, [fetchLead])

  // ── Status update with optimistic UI ─────────────────────
  /**
   * Optimistic update flow:
   *   1. Capture old status in a ref (for rollback).
   *   2. Immediately update local state (user sees the change instantly).
   *   3. Fire PATCH to the API.
   *   4a. Success → success toast.
   *   4b. Failure → revert local state to previousStatus → destructive toast.
   *
   * No Delete:
   *   Changing status to "closed" is the archive action.
   *   There is no DELETE path anywhere in this file.
   */
  const handleStatusChange = useCallback(async (id: string, newStatus: LeadStatus) => {
    if (!lead || lead.status === newStatus || isUpdating) return

    // ── Step 1: Capture for rollback ──
    previousStatusRef.current = lead.status

    // ── Step 2: Optimistic update ──
    setLead((prev) => prev ? { ...prev, status: newStatus } : null)
    setIsUpdating(true)

    try {
      // ── MOCK FAILURE PATH ────────────────────────────────────
      // When SIMULATE_PATCH_FAILURE is true every PATCH is rejected
      // locally without hitting the network, exercising the full
      // revert + destructive toast error path.
      if (SIMULATE_PATCH_FAILURE) {
        throw new Error("Simulated PATCH failure (SIMULATE_PATCH_FAILURE=true)")
      }
      // ── END MOCK FAILURE PATH ────────────────────────────────

      const res  = await fetch(`/api/admin/leads/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        // Sync with server-returned data to stay canonical
        setLead(data.data)
        toast.success(`Status updated to "${STATUS_CONFIG[newStatus].label}"`, {
          description: "Lead record saved successfully.",
        })
      } else {
        throw new Error(data.error ?? `Server responded with ${res.status}`)
      }
    } catch (err) {
      // ── Step 4b: Revert ──
      const oldStatus = previousStatusRef.current
      if (oldStatus) {
        setLead((prev) => prev ? { ...prev, status: oldStatus } : null)
      }

      const reason = err instanceof Error ? err.message : "Unknown error."
      toast.error("Status update failed", {
        description: `Could not save the new status. ${reason} The previous status has been restored.`,
        // sonner with richColors maps this to the destructive/red variant
        // equivalent of Shadcn toast's variant="destructive"
        // @ts-expect-error — sonner's `type` prop provides variant="destructive" colouring
        type: "error",
      })
    } finally {
      setIsUpdating(false)
      previousStatusRef.current = null
    }
  }, [lead, isUpdating])

  // ─────────────────────────────────────────────────────────
  // Loading state
  // ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Back nav skeleton */}
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

          {/* Header card skeleton */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm animate-pulse">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-7 w-48 rounded bg-slate-100" />
                <div className="h-4 w-32 rounded bg-slate-100" />
              </div>
              <div className="h-9 w-36 rounded-lg bg-slate-100" />
            </div>
          </div>

          {/* Detail cards skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <SkeletonCard lines={4} />
            </div>
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <SkeletonCard lines={3} />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <SkeletonCard lines={2} />
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────
  // Error state
  // ─────────────────────────────────────────────────────────
  if (fetchError || !lead) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#F8FAFC] p-6">
        <div className="max-w-sm rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle size={26} className="text-red-400" />
          </div>
          <h2 className="mb-1 text-lg font-semibold text-[#1B3A5C]">
            {fetchError?.includes("not found") ? "Lead Not Found" : "Connection Error"}
          </h2>
          <p className="mb-6 text-sm text-slate-500">
            {fetchError ?? "This lead could not be loaded."}
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={fetchLead}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: "#0D7377" }}
            >
              <RefreshCw size={14} /> Retry
            </button>
            <button
              onClick={() => router.push("/admin/leads")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={14} /> Back to Leads
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  const statusCfg = STATUS_CONFIG[lead.status]
  const typeCfg   = TYPE_CONFIG[lead.type]

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* ── Breadcrumb / Back navigation ── */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/leads"
            id="back-to-leads-link"
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#1B3A5C]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Lead Management
          </Link>

          {/* Admin nav tabs */}
          <div className="hidden sm:flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm gap-0.5">
            <Link
              href="/admin/leads"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-slate-100 text-[#1B3A5C] transition-colors"
            >
              <ListTodo size={13} /> Leads
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-[#1B3A5C] transition-colors"
            >
              <ShoppingBag size={13} /> Orders
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-[#1B3A5C] transition-colors"
            >
              <PackageSearch size={13} /> Products
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-[#1B3A5C] transition-colors"
            >
              <BarChart3 size={13} /> Analytics
            </Link>
          </div>
        </div>

        {/* ── Hero Header Card ── */}
        <div
          className="relative overflow-hidden rounded-3xl shadow-lg"
          style={{ background: "linear-gradient(135deg, #1B3A5C 0%, #0f2540 100%)" }}
        >
          {/* Background texture */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, #0D7377 0%, transparent 60%)",
            }}
          />

          <div className="relative p-6 sm:p-8">
            {/* Type + Status badges */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${typeCfg.cls}`}
              >
                {typeCfg.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusCfg.pill}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
              {lead.status === "closed" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                  <Archive size={11} /> Archived
                </span>
              )}
            </div>

            {/* Name + provider */}
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {lead.patient_name}
            </h1>
            {lead.provider_name && (
              <p className="mt-1 text-sm text-white/60">
                Referred by{" "}
                <span className="font-medium text-white/80">{lead.provider_name}</span>
              </p>
            )}

            {/* Submission time */}
            <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
              <Clock size={12} />
              <span>
                Submitted {fmtDateTime(lead.created_at)}
                {" "}·{" "}
                {fmtRelative(lead.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Status Management Panel ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/70 bg-white px-6 py-5 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-[#1B3A5C]">Lead Status</p>
            <p className="mt-0.5 text-xs text-slate-400">
              Update status to track this lead through the clinical pipeline.
              Setting to <em className="not-italic font-medium text-slate-500">Closed</em> archives the lead.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Archive shortcut button — maps to status = 'closed', no DELETE */}
            {lead.status !== "closed" && (
              <button
                id="archive-lead-btn"
                onClick={() => handleStatusChange(lead.id, "closed")}
                disabled={isUpdating}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition-all hover:border-[#1B3A5C]/30 hover:bg-[#1B3A5C]/5 hover:text-[#1B3A5C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Archive size={14} />
                Archive Lead
              </button>
            )}

            {/* Status select — primary control */}
            <StatusSelect
              leadId={lead.id}
              currentStatus={lead.status}
              isUpdating={isUpdating}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        {/* ── Detail Cards Grid ── */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Patient Contact Information */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Contact Information
            </h2>

            <DetailRow icon={User} label="Patient Name">
              <span className="font-medium text-[#1B3A5C]">{lead.patient_name}</span>
            </DetailRow>

            {lead.provider_name && (
              <DetailRow icon={Building2} label="Referring Provider">
                {lead.provider_name}
              </DetailRow>
            )}

            {lead.email ? (
              <DetailRow icon={Mail} label="Email Address">
                <a
                  href={`mailto:${lead.email}`}
                  className="text-[#0D7377] underline underline-offset-2 hover:opacity-80 transition-opacity break-all"
                >
                  {lead.email}
                </a>
              </DetailRow>
            ) : (
              <DetailRow icon={Mail} label="Email Address">
                <span className="text-slate-300">Not provided</span>
              </DetailRow>
            )}

            {lead.phone ? (
              <DetailRow icon={Phone} label="Phone Number">
                <a
                  href={`tel:${lead.phone}`}
                  className="text-[#0D7377] underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  {lead.phone}
                </a>
              </DetailRow>
            ) : (
              <DetailRow icon={Phone} label="Phone Number">
                <span className="text-slate-300">Not provided</span>
              </DetailRow>
            )}
          </div>

          {/* Clinical Interest + Source */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Clinical Interest
            </h2>

            <DetailRow icon={Stethoscope} label="Condition / Program Interest">
              {lead.condition_interest ? (
                <span className="font-medium">{lead.condition_interest}</span>
              ) : (
                <span className="text-slate-300">Not specified</span>
              )}
            </DetailRow>

            <DetailRow icon={Globe} label="Submission Source">
              {lead.source_page ? (
                <span className="font-mono text-xs text-slate-500 break-all">
                  {lead.source_page}
                </span>
              ) : (
                <span className="text-slate-300">Unknown</span>
              )}
            </DetailRow>

            <DetailRow icon={Calendar} label="Submission Date">
              <span>{fmtDate(lead.created_at)}</span>
              <span className="ml-2 text-xs text-slate-400">
                ({fmtRelative(lead.created_at)})
              </span>
            </DetailRow>
          </div>
        </div>

        {/* ── Message / Notes (full-width) ── */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare size={15} className="text-[#0D7377]" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Message / Notes
            </h2>
          </div>

          {lead.message ? (
            /**
             * Free-form user input handling:
             *   - `whitespace-pre-wrap` preserves intentional line breaks from the textarea
             *   - `break-words` prevents very long unbroken strings (URLs, alphanumeric IDs)
             *     from overflowing their container
             *   - `max-h-[400px] overflow-y-auto` caps extreme-length submissions
             *     so they don't push the page layout out of proportion
             *   - `leading-relaxed` improves readability of dense paragraph text
             */
            <div
              className={`
                rounded-xl border bg-slate-50 p-5
                text-sm text-slate-700 leading-relaxed
                whitespace-pre-wrap break-words
                max-h-[400px] overflow-y-auto
                scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent
              `}
            >
              {lead.message}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-slate-300">
              <MessageSquare size={28} />
              <p className="text-sm">No message was included with this submission.</p>
            </div>
          )}
        </div>

        {/* ── ID / Audit Footer ── */}
        <div className="rounded-xl border border-slate-100 bg-white/50 px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Lead ID</span>
              <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-slate-600">
                {lead.id}
              </code>
            </div>
            <div className="flex items-center gap-4">
              <span>
                Created:{" "}
                <span className="text-slate-500">{fmtDateTime(lead.created_at)}</span>
              </span>
              <Badge
                variant="outline"
                className={`text-xs ${TYPE_CONFIG[lead.type].cls}`}
              >
                {TYPE_CONFIG[lead.type].label}
              </Badge>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
