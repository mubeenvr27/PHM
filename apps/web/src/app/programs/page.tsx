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
import { Badge } from "@/components/ui/badge";

/* ─── Filter categories ────────────────────────────────────────── */
type Category = "All" | "Chronic Care" | "Sleep Health" | "Wellness" | "Safety";
const categories: Category[] = ["All", "Chronic Care", "Sleep Health", "Wellness", "Safety"];

/* ─── Program data — zero hyphens ─────────────────────────────── */
interface Program {
  icon: React.ElementType;
  name: string;
  badge: string;
  badgeStyle: "teal" | "navy" | "rose" | "violet" | "amber";
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
    name: "COPD - Respiratory Care",
    badge: "Remote Monitoring",
    badgeStyle: "teal",
    category: "Chronic Care",
    description:
      "Daily pulse oximetry and spirometry monitoring helps detect COPD exacerbations before they trigger emergency visits. Clinical alerts route directly to the managing physician.",
    href: "/programs/copd",
    benefits: [
      "Cellular connected oximeter shipped to patient",
      "Physician alert on oxygen desaturation events",
    ],
    hasVideo: true,
    videoLabel: "Watch: How COPD Monitoring Works",
  },
  {
    icon: HeartPulse,
    name: "Hypertension Monitoring",
    badge: "Remote Monitoring",
    badgeStyle: "teal",
    category: "Chronic Care",
    description:
      "Daily blood pressure readings captured through a validated cellular cuff and reviewed by our clinical team. Dangerous readings trigger same-day physician notification.",
    href: "/programs/hypertension",
    benefits: [
      "No manual data entry required by patient",
      "Monthly trend reports delivered to referring physician",
    ],
  },
  {
    icon: Activity,
    name: "Diabetes - Chronic Care Management",
    badge: "CCM",
    badgeStyle: "navy",
    category: "Chronic Care",
    description:
      "Structured monthly care coordination for diabetic patients including glucose monitoring oversight, medication adherence support, and direct A1C trend reporting.",
    href: "/programs/ccm/diabetes",
    benefits: [
      "Medicare CCM billing supported",
      "Dedicated care coordinator assigned to each patient",
    ],
  },
  {
    icon: Heart,
    name: "Heart Failure - CCM",
    badge: "CCM",
    badgeStyle: "navy",
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
    badgeStyle: "violet",
    category: "Sleep Health",
    description:
      "Home sleep testing and CPAP compliance tracking delivered entirely without overnight lab stays. Therapy initiation and follow-up managed by our respiratory care team.",
    href: "/programs/osa",
    benefits: [
      "FDA cleared home sleep test device",
      "Results interpreted by board-certified sleep physician",
    ],
  },
  {
    icon: Moon,
    name: "Pediatric Sleep Monitoring",
    badge: "Sleep Health",
    badgeStyle: "violet",
    category: "Sleep Health",
    description:
      "Child-appropriate overnight home sleep assessment for children ages 2 to 17. Results reviewed by a pediatric sleep physician within 72 hours of recording.",
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
    badgeStyle: "violet",
    category: "Sleep Health",
    description:
      "Convenient home sleep testing for adults with suspected sleep-disordered breathing. From device delivery through therapy recommendation, our team manages the full pathway.",
    href: "/programs/sleep/adult",
    benefits: [
      "WatchPAT or equivalent FDA cleared device",
      "Prepaid return shipping included",
    ],
  },
  {
    icon: Stethoscope,
    name: "ENT Sleep Program",
    badge: "Sleep Health",
    badgeStyle: "violet",
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
    badgeStyle: "amber",
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
    badgeStyle: "amber",
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
    badgeStyle: "rose",
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

/* ─── Badge color map ──────────────────────────────────────────── */
const badgeColorMap: Record<Program["badgeStyle"], string> = {
  teal: "bg-teal-50   text-[#0D7377] border-teal-100",
  navy: "bg-[#1B3A5C]/8 text-[#1B3A5C] border-[#1B3A5C]/15",
  rose: "bg-rose-50   text-rose-700   border-rose-100",
  violet: "bg-violet-50 text-violet-700  border-violet-100",
  amber: "bg-amber-50  text-amber-700   border-amber-100",
};

/* ─── Video Modal ──────────────────────────────────────────────── */
function VideoModal({ label }: { label: string }) {
  return (
    <Dialog>
      <DialogTrigger
        className="flex min-h-[44px] w-full items-center gap-2 text-sm font-semibold text-[#1B3A5C]"
        aria-label={`Open video: ${label}`}
      >
        <PlayCircle
          size={18}
          className="shrink-0 text-[#0D7377]"
          aria-hidden="true"
        />
        <span className="hover:underline underline-offset-2">{label}</span>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-2xl overflow-hidden p-0"
        aria-describedby={undefined}
      >
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-[#1B3A5C]">{label}</DialogTitle>
        </DialogHeader>
        <div
          className="relative w-full bg-[#0A2A42]"
          style={{ paddingBottom: "56.25%" }}
          role="img"
          aria-label="Video embed placeholder — content coming soon"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <PlayCircle size={56} className="text-white/30" aria-hidden="true" />
            <p className="text-sm text-white/50">Video content coming soon</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Program Card ─────────────────────────────────────────────── */
function ProgramCard({ program }: { program: Program }) {
  const {
    icon: Icon,
    name,
    badge,
    badgeStyle,
    description,
    href,
    benefits,
    hasVideo,
    videoLabel,
  } = program;

  return (
    <Card className="flex h-full flex-col border border-[#E2EBF4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0D7377]/50 hover:shadow-xl">
      <CardHeader className="pb-0">
        {/* Icon + Badge row */}
        <div className="mb-3 flex items-start justify-between">
          <div
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-teal-50"
            aria-hidden="true"
          >
            <Icon size={26} className="text-[#0D7377]" />
          </div>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeColorMap[badgeStyle]}`}
          >
            {badge}
          </span>
        </div>
        <CardTitle className="text-[1.0625rem] font-semibold leading-snug text-[#1B3A5C]">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pt-3">
        {/* Description */}
        <p className="text-sm leading-relaxed text-slate-500">{description}</p>

        {/* Benefits — CheckCircle2, no hyphens */}
        <ul role="list" className="flex flex-col gap-2">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <CheckCircle2
                size={15}
                className="mt-[2px] shrink-0 text-[#0D7377]"
                aria-hidden="true"
              />
              <span className="text-xs leading-[1.55] text-[#1A1A2E]">{b}</span>
            </li>
          ))}
        </ul>

        {/* Optional video trigger */}
        {hasVideo && videoLabel && <VideoModal label={videoLabel} />}

        {/* Primary CTA — pushed to bottom */}
        <div className="mt-auto pt-2">
          <Link
            href={href}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#0D7377] px-5 text-[0.9375rem] font-bold text-white transition-colors hover:bg-[#0a5f63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7377]"
          >
            View Program Details
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
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
          HERO — matches home page gradient
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="programs-hero-heading"
        className="relative overflow-hidden bg-[#1B3A5C] pb-[clamp(80px,10vw,110px)] pt-[clamp(100px,12vw,130px)]"
      >
        {/* Radial depth layer */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(30,77,117,0.9) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* ShieldCheck watermark */}
        <ShieldCheck
          aria-hidden="true"
          className="pointer-events-none absolute right-[-60px] top-1/2 -translate-y-1/2 text-white/[0.04]"
          style={{ width: 420, height: 420 }}
          strokeWidth={0.8}
        />

        <div className="relative mx-auto max-w-7xl w-full px-6 md:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1 text-sm text-white/55"
          >
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center transition-colors hover:text-white"
            >
              Home
            </Link>
            <span aria-hidden="true" className="px-1">›</span>
            <span className="text-white/85">Programs</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="flex flex-col items-start">
              <div className="max-w-[660px]">
                <Badge className="mb-4 bg-teal-900/40 text-[#6EE7E9] hover:bg-teal-900/40">
                  Full Program Directory
                </Badge>
                <h1
                  id="programs-hero-heading"
                  className="mb-5 text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.15] tracking-tight text-white"
                >
                  A Connected Ecosystem of Care
                </h1>
                <p className="max-w-[560px] text-[clamp(1rem,2vw,1.1875rem)] leading-[1.7] text-white/80">
                  Each program operates independently while integrating into a
                  single, proactive monitoring platform - so no clinical signal
                  falls through the gap between specialties.
                </p>
              </div>

              {/* ── Glassmorphic Filter Bar ── */}
              <div
                role="tablist"
                aria-label="Filter programs by category"
                className="mt-10 flex flex-wrap gap-2 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md w-fit"
              >
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(cat)}
                      className={`min-h-[44px] min-w-[44px] rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                        ${isActive
                          ? "bg-[#0D7377] text-white shadow-sm"
                          : "text-white/75 hover:bg-white/15 hover:text-white"
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Featured Image */}
            <div className="w-full relative lg:ml-auto flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
              <div className="relative aspect-square sm:aspect-[4/3] w-full max-w-lg rounded-2xl shadow-2xl border-4 border-white/10 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src="/PHM Program pictures/OUR_PROGRAMS.png" 
                  alt="Priority Home Monitor Programs Overview" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROGRAM GRID
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="grid-label"
        className="bg-[#F8FAFC] py-[clamp(80px,10vw,100px)]"
      >
        <div className="mx-auto max-w-7xl w-full px-6 md:px-8">
          {/* Results count + active label */}
          <div className="mb-8 flex items-center justify-between">
            <h2
              id="grid-label"
              className="text-sm font-semibold text-[#1B3A5C]"
            >
              {activeCategory === "All" ? "All Programs" : activeCategory}
            </h2>
            <span
              className="text-sm text-slate-400"
              aria-live="polite"
              aria-atomic="true"
            >
              {filtered.length} program{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              role="tabpanel"
              aria-label={`${activeCategory} programs`}
            >
              {filtered.map((prog) => (
                <ProgramCard key={prog.href} program={prog} />
              ))}
            </div>
          ) : (
            <p className="py-20 text-center text-slate-400">
              No programs found in this category.
            </p>
          )}

          {/* ── Conversion Footer ── */}
          <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#E2EBF4] bg-white p-8 shadow-sm sm:flex-row">
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1B3A5C]/7"
                aria-hidden="true"
              >
                <MessageCircle size={22} className="text-[#1B3A5C]" />
              </div>
              <div>
                <p className="font-semibold text-[#1B3A5C]">
                  Cannot find a specific program?
                </p>
                <p className="mt-1 text-sm leading-[1.6] text-slate-500">
                  Our clinical team reviews each case individually. Contact us to
                  discuss whether a patient may qualify under a custom care plan.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-[#1B3A5C] px-7 font-bold text-[#1B3A5C] transition-colors hover:bg-[#1B3A5C] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B3A5C]"
              style={{ height: "48px" }}
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
