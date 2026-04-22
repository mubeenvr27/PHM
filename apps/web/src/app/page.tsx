import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  Clock,
  Users,
  Heart,
  Wind,
  Moon,
  Salad,
  PersonStanding,
  Brain,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  UserCheck,
  HeartPulse,
  Wifi,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Priority Home Monitor — Care That Watches Over You Every Day",
  description:
    "Priority Home Monitor delivers clinical-grade remote patient monitoring for COPD, Heart Failure, Diabetes, Hypertension, Sleep Apnea, and more. Daily oversight from a dedicated clinical team — all from home.",
};

/* ─── Data ───────────────────────────────────────────────────────── */
const trustBadges = [
  { icon: Stethoscope, label: "Clinical Team",    sub: "Board-certified oversight" },
  { icon: Activity,    label: "Daily Monitoring", sub: "Real-time readings reviewed" },
  { icon: Clock,       label: "24/7 Safety",      sub: "Alerts actioned around the clock" },
  { icon: ShieldCheck, label: "HIPAA Compliant",  sub: "Your data stays private" },
];

const weServe = [
  { icon: HeartPulse,     label: "Chronic Disease Patients",  desc: "COPD, heart failure, diabetes, hypertension, and more managed daily." },
  { icon: PersonStanding, label: "Older Adults at Home",      desc: "Independence supported with fall detection and continuous vitals oversight." },
  { icon: Moon,           label: "Sleep Apnea Patients",      desc: "CPAP compliance tracked and therapy outcomes monitored remotely." },
  { icon: Users,          label: "Value-Based Care Partners", desc: "Physicians and ACOs reducing readmissions and improving STAR ratings." },
  { icon: Brain,          label: "Behavioral Health Patients",desc: "Mental wellness integrated alongside physical chronic care management." },
  { icon: Salad,          label: "Nutrition-Guided Patients", desc: "Medically tailored meal plans coordinated with clinical dietary goals." },
];

const programs = [
  { icon: Brain,       title: "Mental Health",       desc: "Structured behavioral health support integrated into chronic care plans.",       href: "/programs/wellness" },
  { icon: Moon,        title: "Sleep Health",         desc: "Home sleep testing and therapy compliance monitoring for all ages.",            href: "/programs/osa" },
  { icon: Salad,       title: "Nutrition and Weight", desc: "Clinically tailored meal programs and medically supervised weight management.", href: "/programs/nutrition/diet/meals" },
  { icon: Heart,       title: "Heart Health",         desc: "Daily weight, blood pressure, and symptom tracking for cardiac patients.",      href: "/programs/ccm/heart-failure" },
  { icon: Wind,        title: "Respiratory Care",     desc: "Continuous oxygen saturation and spirometry monitoring for COPD patients.",     href: "/programs/copd" },
  { icon: ShieldCheck, title: "Safety and Monitoring",desc: "Wearable fall detection with 24/7 alert escalation to caregivers.",           href: "/programs/fall-detection" },
];

const team = [
  { icon: Stethoscope, role: "Medical Director",              name: "Board-Certified Physician",    desc: "Oversees all clinical protocols, program standards, and escalation pathways across every monitoring program." },
  { icon: UserCheck,   role: "Nurse Practitioners and PAs",   name: "Advanced Practice Providers",  desc: "Review daily patient readings, coordinate with referring physicians, and manage clinical interventions." },
  { icon: Users,       role: "Care Coordination Team",        name: "Dedicated Support Staff",      desc: "Handle patient onboarding, device setup, caregiver communication, and ongoing scheduling." },
];

/* ─── Static Dashboard Mockup ────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl w-full"
      role="img"
      aria-label="Illustration of a patient monitoring dashboard"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Patient Overview</p>
          <p className="text-sm font-bold text-[#1B3A5C] mt-0.5">Today — Live</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
          Syncing
        </span>
      </div>

      {/* Vitals row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "SpO₂", value: "97%", status: "Normal", color: "emerald" },
          { label: "BP", value: "122/80", status: "Stable", color: "blue" },
          { label: "Weight", value: "183 lb", status: "On Target", color: "emerald" },
        ].map(({ label, value, status, color }) => (
          <div
            key={label}
            className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex flex-col gap-1"
          >
            <span className="text-xs text-slate-400 font-medium">{label}</span>
            <span className="text-lg font-bold text-[#1B3A5C] leading-none">{value}</span>
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded-full w-fit
                ${color === "emerald"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-blue-50 text-blue-700"
                }`}
            >
              {status}
            </span>
          </div>
        ))}
      </div>

      {/* Fake chart — static bar viz */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 font-medium mb-2">7-Day Blood Pressure Trend</p>
        <div className="flex items-end gap-1.5 h-16">
          {[55, 72, 60, 80, 65, 70, 58].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm" style={{
              height: `${h}%`,
              backgroundColor: i === 3 ? "#0D7377" : "#E2EBF4",
            }} aria-hidden="true" />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
            <span key={d} className="text-xs text-slate-300 flex-1 text-center">{d}</span>
          ))}
        </div>
      </div>

      {/* Alert row */}
      <div className="flex items-center gap-3 rounded-xl bg-teal-50 border border-teal-100 p-3">
        <Wifi size={16} className="text-[#0D7377] shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#0D7377]">Readings received 7 of 7 days</p>
          <p className="text-xs text-teal-600 truncate">Next physician report: Friday</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          1. HERO
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden bg-[#1B3A5C] pt-[clamp(100px,12vw,140px)] pb-[clamp(80px,10vw,120px)]"
      >
        {/* Radial depth gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(30,77,117,0.9) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1100px] px-6">
          {/* Headline */}
          <h1
            id="hero-heading"
            className="text-balance mb-6 max-w-[720px] text-[clamp(2.25rem,5.5vw,3.25rem)] font-bold leading-[1.15] tracking-tight text-white"
          >
            Care That Watches Over You Every Day
          </h1>

          {/* Subheadline */}
          <p className="mb-10 max-w-[560px] text-[clamp(1rem,2.2vw,1.2rem)] leading-[1.7] text-white/80">
            Priority Home Monitor gives patients with chronic conditions a dedicated
            clinical team that reviews their vital signs daily and acts on changes
            before they become emergencies — all from home.
          </p>

          {/* CTAs */}
          <div className="mb-14 flex flex-wrap items-center gap-4">
            <Link
              href="/refer"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg bg-[#0D7377] px-8 text-[1.0625rem] font-bold text-white transition-colors hover:bg-[#0a5f63] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0D7377]"
              style={{ height: "52px" }}
            >
              Refer a Patient
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg border-2 border-white/40 px-8 text-[1.0625rem] font-bold text-white transition-colors hover:border-white/70 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
              style={{ height: "52px" }}
            >
              Request a Provider Consultation
            </Link>
          </div>

          {/* Trust Badges — glass effect */}
          <div
            className="grid grid-cols-2 gap-3 md:grid-cols-4"
            role="list"
            aria-label="Trust indicators"
          >
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                role="listitem"
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
              >
                <Icon
                  size={22}
                  className="mt-0.5 shrink-0 text-[#0D7377]"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="mt-0.5 text-xs text-white/55">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. WHAT IS HOME MONITORING — BENTO BOX
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="what-heading"
        className="bg-[#F8FAFC] py-[clamp(80px,10vw,100px)]"
      >
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Left: copy + feature list */}
            <div>
              <Badge
                className="mb-4 bg-teal-50 text-[#0D7377] hover:bg-teal-50"
                variant="secondary"
              >
                How It Works
              </Badge>
              <h2
                id="what-heading"
                className="mb-5 text-[clamp(1.75rem,4vw,2.25rem)] font-bold leading-tight tracking-tight text-[#1B3A5C]"
              >
                Continuous Care Between Every Appointment
              </h2>
              <p className="mb-6 leading-[1.75] text-slate-500">
                Most chronic conditions deteriorate silently between quarterly office
                visits. Remote patient monitoring closes that gap. Our clinical team
                reviews patient readings every single day and contacts the physician
                when a reading requires intervention.
              </p>

              <ul role="list" className="flex flex-col gap-4">
                {[
                  "Clinically validated devices shipped directly to the patient",
                  "Daily data reviewed by our clinical team, not an algorithm alone",
                  "Physician receives structured reports and alert escalations",
                  "Medicare and Medicaid billing handled entirely by our team",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-[#0D7377]"
                      aria-hidden="true"
                    />
                    <span className="text-[0.9375rem] leading-[1.6] text-[#1A1A2E]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Static Dashboard Mockup */}
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. WHO WE SERVE
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="serve-heading"
        className="border-t border-[#E2EBF4] bg-white py-[clamp(80px,10vw,100px)]"
      >
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-3 bg-teal-50 text-[#0D7377] hover:bg-teal-50" variant="secondary">
              Patient Population
            </Badge>
            <h2
              id="serve-heading"
              className="text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-[#1B3A5C]"
            >
              Who We Serve
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] leading-[1.7] text-slate-500">
              Our programs are designed for patients managing complex chronic
              conditions, and the physicians and care teams who support them.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {weServe.map(({ icon: Icon, label, desc }) => (
              <Card
                key={label}
                className="border border-[#E2EBF4] bg-[#F8FAFC] shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-[#0D7377]/50 hover:shadow-lg"
              >
                <CardHeader>
                  <div
                    className="mb-1 flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50"
                    aria-hidden="true"
                  >
                    <Icon size={22} className="text-[#0D7377]" />
                  </div>
                  <CardTitle className="text-base font-semibold text-[#1B3A5C]">
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-[1.65] text-slate-500">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. WELLNESS PROGRAMS GRID
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="programs-heading"
        className="border-t border-[#E2EBF4] bg-[#F8FAFC] py-[clamp(80px,10vw,100px)]"
      >
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-3 bg-teal-50 text-[#0D7377] hover:bg-teal-50" variant="secondary">
              Specialties
            </Badge>
            <h2
              id="programs-heading"
              className="text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-[#1B3A5C]"
            >
              Our Wellness Programs
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] leading-[1.7] text-slate-500">
              Each program is designed around a specific clinical need, with devices
              and care protocols tailored accordingly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map(({ icon: Icon, title, desc, href }) => (
              <Card
                key={title}
                className="flex flex-col border border-[#E2EBF4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0D7377]/50 hover:shadow-lg"
              >
                <CardHeader>
                  <div
                    className="mb-1 flex h-11 w-11 items-center justify-center rounded-lg bg-[#1B3A5C]/8"
                    aria-hidden="true"
                  >
                    <Icon size={22} className="text-[#1B3A5C]" />
                  </div>
                  <CardTitle className="text-base font-semibold text-[#1B3A5C]">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <p className="text-sm leading-[1.65] text-slate-500">{desc}</p>
                  <div className="mt-auto">
                    <Link
                      href={href}
                      className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-[#0D7377] underline underline-offset-2 hover:text-[#0a5f63]"
                    >
                      Explore Program
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/programs"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg border-2 border-[#1B3A5C] px-8 font-bold text-[#1B3A5C] transition-colors hover:bg-[#1B3A5C] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#1B3A5C]"
              style={{ height: "50px" }}
            >
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. OUR DEDICATED TEAM
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="team-heading"
        className="border-t border-[#E2EBF4] bg-white py-[clamp(80px,10vw,100px)]"
      >
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-3 bg-teal-50 text-[#0D7377] hover:bg-teal-50" variant="secondary">
              Clinical Staff
            </Badge>
            <h2
              id="team-heading"
              className="text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-[#1B3A5C]"
            >
              Our Dedicated Team
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] leading-[1.7] text-slate-500">
              Every patient enrolled in our programs is supported by a real clinical
              team, not automated messaging.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {team.map(({ icon: Icon, role, name, desc }) => (
              <div
                key={role}
                className="flex flex-col items-center rounded-2xl border border-[#E2EBF4] bg-[#F8FAFC] p-8 text-center"
              >
                <div
                  className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-teal-50"
                  aria-hidden="true"
                >
                  <Icon size={30} className="text-[#0D7377]" />
                </div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#0D7377]">
                  {role}
                </p>
                <h3 className="mb-3 text-[1.0625rem] font-semibold text-[#1B3A5C]">{name}</h3>
                <p className="text-sm leading-[1.7] text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. CONVERSION BANNER
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="banner-heading"
        className="bg-[#0D7377] py-[clamp(72px,9vw,96px)]"
      >
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <h2
            id="banner-heading"
            className="mb-4 text-balance text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-white"
          >
            Partner With Us for Proactive Care
          </h2>
          <p className="mx-auto mb-10 max-w-[540px] text-[1.0625rem] leading-[1.7] text-white/82">
            See how Priority Home Monitor integrates with your practice workflow
            to reduce readmissions, improve patient outcomes, and capture remote
            care revenue you are already entitled to.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/platform"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg bg-white px-8 text-[1.0625rem] font-bold text-[#0D7377] transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
              style={{ height: "52px" }}
            >
              Request a Platform Demo
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/refer"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg border-2 border-white/45 px-8 text-[1.0625rem] font-bold text-white transition-colors hover:border-white/70 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
              style={{ height: "52px" }}
            >
              Refer a Patient Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
