"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Heart,
  Wind,
  Moon,
  Brain,
  Salad,
  PersonStanding,
  Activity,
  HeartPulse,
  Stethoscope,
  PlayCircle,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/* ─── Layout helpers ─────────────────────────────────────────── */
const wrap = {
  maxWidth: "1100px",
  marginInline: "auto",
  paddingInline: "1.5rem",
} as const;

const sectionPy = {
  paddingTop: "clamp(80px, 10vw, 100px)",
  paddingBottom: "clamp(80px, 10vw, 100px)",
} as const;

/* ─── Filter categories ──────────────────────────────────────── */
type Category = "All" | "Chronic Care" | "Sleep Health" | "Wellness" | "Safety";

const categories: Category[] = ["All", "Chronic Care", "Sleep Health", "Wellness", "Safety"];

/* ─── Program data ───────────────────────────────────────────── */
interface Program {
  icon: React.ElementType;
  name: string;
  badge: string;
  category: Category;
  description: string;
  href: string;
  benefits: string[];
  hasVideo?: boolean;
  videoLabel?: string;
}

const programs: Program[] = [
  {
    icon: Wind,
    name: "COPD — Respiratory Care",
    badge: "Remote Monitoring",
    category: "Chronic Care",
    description:
      "Daily pulse oximetry and spirometry monitoring helps detect COPD exacerbations before they trigger emergency visits. Clinical alerts are routed directly to the managing physician.",
    href: "/programs/copd",
    benefits: [
      "Cellular-connected oximeter shipped to patient",
      "Physician alert on oxygen desaturation",
    ],
    hasVideo: true,
    videoLabel: "Watch: How COPD Monitoring Works",
  },
  {
    icon: HeartPulse,
    name: "Hypertension Monitoring",
    badge: "Remote Monitoring",
    category: "Chronic Care",
    description:
      "Daily blood pressure readings captured through a validated cellular cuff and reviewed by our clinical team. Dangerous readings trigger same-day physician notification.",
    href: "/programs/hypertension",
    benefits: [
      "No manual data entry required by patient",
      "Trend reports delivered to referring physician monthly",
    ],
  },
  {
    icon: Activity,
    name: "Diabetes — Chronic Care Management",
    badge: "CCM",
    category: "Chronic Care",
    description:
      "Structured monthly care coordination for diabetic patients, including glucose monitoring oversight, medication adherence support, and direct A1C trend reporting.",
    href: "/programs/ccm/diabetes",
    benefits: [
      "Medicare CCM billing supported",
      "Dedicated care coordinator assigned to each patient",
    ],
  },
  {
    icon: Heart,
    name: "Heart Failure — CCM",
    badge: "CCM",
    category: "Chronic Care",
    description:
      "Daily weight monitoring catches fluid retention early. Our care team responds to weight gain alerts within hours, coordinating diuretic adjustments with the cardiologist.",
    href: "/programs/ccm/heart-failure",
    benefits: [
      "Proven to reduce 30-day readmissions",
      "Cellular scale shipped to patient at no cost",
    ],
    hasVideo: true,
    videoLabel: "Watch: Heart Failure Daily Monitoring",
  },
  {
    icon: Moon,
    name: "Obstructive Sleep Apnea",
    badge: "Sleep Health",
    category: "Sleep Health",
    description:
      "Home sleep testing and CPAP compliance tracking delivered entirely without overnight lab stays. Therapy initiation and follow-up managed by our respiratory care team.",
    href: "/programs/osa",
    benefits: [
      "FDA-cleared home sleep test device",
      "Results interpreted by board-certified sleep physician",
    ],
  },
  {
    icon: Moon,
    name: "Pediatric Sleep Monitoring",
    badge: "Sleep Health",
    category: "Sleep Health",
    description:
      "Child-appropriate overnight home sleep assessment for children ages 2 to 17. Results are reviewed by a pediatric-trained sleep physician within 72 hours of recording.",
    href: "/programs/sleep/pediatric",
    benefits: [
      "No overnight hospital stay required",
      "Coordinated with referring pediatrician or ENT",
    ],
  },
  {
    icon: Moon,
    name: "Adult Sleep Monitoring",
    badge: "Sleep Health",
    category: "Sleep Health",
    description:
      "Convenient home sleep testing for adults with suspected sleep-disordered breathing. From device delivery through therapy recommendation, our team manages the full pathway.",
    href: "/programs/sleep/adult",
    benefits: [
      "WatchPAT or equivalent FDA-cleared device",
      "Prepaid return shipping included",
    ],
  },
  {
    icon: Stethoscope,
    name: "ENT Sleep Program",
    badge: "Sleep Health",
    category: "Sleep Health",
    description:
      "Pre-operative sleep apnea risk stratification for ENT surgical patients, plus post-operative compliance confirmation — delivered without additional office appointments.",
    href: "/programs/sleep/ent",
    benefits: [
      "Risk stratification report before procedure date",
      "90-day post-operative compliance monitoring",
    ],
  },
  {
    icon: Brain,
    name: "Wellness: Mental Health",
    badge: "Wellness",
    category: "Wellness",
    description:
      "Behavioral health support integrated alongside chronic disease management. Monthly care coordinator check-ins address anxiety, depression, and stress-related adherence barriers.",
    href: "/programs/wellness",
    benefits: [
      "Behavioral health screening and referral coordination",
      "Integrated into existing chronic care plan",
    ],
  },
  {
    icon: Salad,
    name: "Nutrition and Weight",
    badge: "Wellness",
    category: "Wellness",
    description:
      "Medically tailored, chef-prepared meals delivered weekly through our CookUnity partnership. Meal plans are designed around each patient's clinical dietary requirements.",
    href: "/programs/nutrition/diet/meals",
    benefits: [
      "Cardiac, diabetic, renal, and general wellness plans",
      "Full nutritional labeling on every meal",
    ],
    hasVideo: true,
    videoLabel: "Watch: Medically Tailored Meals Overview",
  },
  {
    icon: PersonStanding,
    name: "Fall Detection and Safety",
    badge: "Safety",
    category: "Safety",
    description:
      "Wearable fall detection sensors alert our 24/7 care coordination team within seconds of a detected event. Escalation protocols ensure caregivers and physicians are notified immediately.",
    href: "/programs/fall-detection",
    benefits: [
      "Waterproof wearable with automatic fall detection",
      "24/7 care team response, no manual button press needed",
    ],
  },
];

/* ─── Video Modal placeholder ────────────────────────────────── */
function VideoModal({ label }: { label: string }) {
  return (
    <Dialog>
      <DialogTrigger
        className="flex items-center gap-2 text-sm font-semibold mt-3 w-full"
        style={{ color: "var(--color-primary)", minHeight: "44px" }}
        aria-label={`Open video: ${label}`}
      >
        <PlayCircle size={18} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
        <span className="hover:underline underline-offset-2">{label}</span>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-2xl p-0 overflow-hidden"
        aria-describedby={undefined}
      >
        <DialogHeader className="p-4 pb-0">
          <DialogTitle style={{ color: "var(--color-primary)" }}>{label}</DialogTitle>
        </DialogHeader>
        {/* 16:9 video placeholder — replace src with real embed */}
        <div
          className="relative w-full"
          style={{ paddingBottom: "56.25%", backgroundColor: "#0A2A42" }}
          role="img"
          aria-label="Video embed placeholder — content coming soon"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <PlayCircle size={56} style={{ color: "rgba(255,255,255,0.4)" }} aria-hidden="true" />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Video content coming soon
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Program Card ───────────────────────────────────────────── */
function ProgramCard({ program }: { program: Program }) {
  const { icon: Icon, name, badge, description, href, benefits, hasVideo, videoLabel } = program;

  const badgeStyle: React.CSSProperties =
    badge === "CCM"
      ? { backgroundColor: "rgba(27,58,92,0.09)", color: "var(--color-primary)" }
      : badge === "Safety"
      ? { backgroundColor: "rgba(155,28,28,0.08)", color: "var(--color-danger)" }
      : badge === "Sleep Health"
      ? { backgroundColor: "rgba(13,115,119,0.09)", color: "var(--color-accent)" }
      : badge === "Wellness"
      ? { backgroundColor: "rgba(26,107,74,0.09)", color: "var(--color-success)" }
      : { backgroundColor: "rgba(13,115,119,0.09)", color: "var(--color-accent)" };

  return (
    <Card
      className="flex flex-col h-full"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--color-border)",
        boxShadow: "0 1px 6px rgba(27,58,92,0.06)",
        borderRadius: "0.875rem",
      }}
    >
      <CardHeader className="pb-0">
        {/* Icon + Badge row */}
        <div className="flex items-start justify-between mb-2">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: "52px",
              height: "52px",
              backgroundColor: "rgba(13,115,119,0.1)",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <Icon size={26} style={{ color: "var(--color-accent)" }} />
          </div>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={badgeStyle}
          >
            {badge}
          </span>
        </div>
        <CardTitle
          style={{ color: "var(--color-primary)", fontSize: "1.0625rem", fontWeight: 600 }}
        >
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-4 pt-3">
        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {description}
        </p>

        {/* Benefits — CheckCircle2 icons, no hyphens */}
        <ul role="list" className="flex flex-col gap-2">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <CheckCircle2
                size={15}
                style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: "2px" }}
                aria-hidden="true"
              />
              <span className="text-xs" style={{ color: "var(--color-text-primary)", lineHeight: 1.55 }}>
                {b}
              </span>
            </li>
          ))}
        </ul>

        {/* Video modal trigger */}
        {hasVideo && videoLabel && <VideoModal label={videoLabel} />}

        {/* Primary CTA — pushed to bottom */}
        <div className="mt-auto pt-2">
          <Link
            href={href}
            className="btn-primary w-full justify-center"
            style={{ height: "44px", fontSize: "0.9375rem" }}
          >
            View Program Details
            <ArrowRight size={16} className="ml-2 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function ProgramsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered =
    activeCategory === "All"
      ? programs
      : programs.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="programs-hero-heading"
        style={{
          background: "linear-gradient(150deg, var(--color-primary) 0%, #1e4d75 55%, #164463 100%)",
          paddingTop: "clamp(100px, 12vw, 130px)",
          paddingBottom: "clamp(80px, 10vw, 110px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Watermark icon */}
        <ShieldCheck
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "-60px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "420px",
            height: "420px",
            color: "rgba(255,255,255,0.04)",
            flexShrink: 0,
          }}
          strokeWidth={0.8}
        />

        <div style={wrap}>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 mb-6 text-sm"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            <Link
              href="/"
              className="hover:text-white transition-colors"
              style={{ minHeight: "44px", display: "inline-flex", alignItems: "center" }}
            >
              Home
            </Link>
            <span aria-hidden="true" style={{ padding: "0 4px" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.85)" }}>Programs</span>
          </nav>

          <div style={{ maxWidth: "660px" }}>
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(13,115,119,0.3)", color: "#6EE7E9" }}
            >
              Full Program Directory
            </span>
            <h1
              id="programs-hero-heading"
              className="text-balance mb-5"
              style={{
                color: "#ffffff",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              A Connected Ecosystem of Care
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "clamp(1rem, 2vw, 1.1875rem)",
                lineHeight: 1.7,
                maxWidth: "560px",
              }}
            >
              Each program operates independently while integrating into a
              single, proactive monitoring platform — so no clinical signal
              falls through the gap between specialties.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FILTER BAR + PROGRAM GRID
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="grid-heading"
        style={{ ...sectionPy, backgroundColor: "var(--color-surface)" }}
      >
        <div style={wrap}>
          <h2 id="grid-heading" className="sr-only">
            Program Directory
          </h2>

          {/* ── Filter Bar ── */}
          <div
            role="tablist"
            aria-label="Filter programs by category"
            className="flex flex-wrap gap-2 mb-10"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat)}
                  className="rounded-full text-sm font-semibold transition-colors"
                  style={{
                    height: "44px",
                    minWidth: "44px",
                    paddingInline: "1.25rem",
                    backgroundColor: isActive ? "var(--color-accent)" : "#ffffff",
                    color: isActive ? "#ffffff" : "var(--color-text-primary)",
                    border: isActive
                      ? "2px solid var(--color-accent)"
                      : "2px solid var(--color-border)",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              );
            })}
            <span
              className="flex items-center text-sm ml-auto"
              style={{ color: "var(--color-text-muted)" }}
              aria-live="polite"
              aria-atomic="true"
            >
              {filtered.length} program{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* ── Program Grid ── */}
          {filtered.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              role="tabpanel"
              aria-label={`${activeCategory} programs`}
            >
              {filtered.map((prog) => (
                <ProgramCard key={prog.href} program={prog} />
              ))}
            </div>
          ) : (
            <p
              className="text-center py-20"
              style={{ color: "var(--color-text-muted)" }}
            >
              No programs found in this category.
            </p>
          )}

          {/* ── Conversion Footer ── */}
          <div
            className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl p-8"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid var(--color-border)",
              boxShadow: "0 1px 6px rgba(27,58,92,0.05)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "rgba(27,58,92,0.07)",
                }}
                aria-hidden="true"
              >
                <MessageCircle size={22} style={{ color: "var(--color-primary)" }} />
              </div>
              <div>
                <p
                  className="font-semibold"
                  style={{ color: "var(--color-primary)", fontSize: "1rem" }}
                >
                  Cannot find a specific program?
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                  Our clinical team reviews each case individually. Contact us to
                  discuss whether a patient may qualify under a custom care plan.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="btn-secondary shrink-0"
              style={{ height: "48px", paddingInline: "1.75rem", whiteSpace: "nowrap" }}
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
