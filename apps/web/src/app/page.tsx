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
import HeroSlideshow from "@/components/HeroSlideshow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Priority Home Monitor - Care That Watches Over You Every Day",
  description:
    "Priority Home Monitor delivers clinical-grade remote patient monitoring for COPD, Heart Failure, Diabetes, Hypertension, Sleep Apnea, and more. Daily oversight from a dedicated clinical team - all from home.",
};

/* ─── Data ───────────────────────────────────────────────────────── */
const trustBadges = [
  { icon: Stethoscope, label: "Clinical Team", sub: "Board-certified oversight" },
  { icon: Activity, label: "Daily Monitoring", sub: "Real-time readings reviewed" },
  { icon: Clock, label: "24/7 Safety", sub: "Alerts actioned around the clock" },
  { icon: ShieldCheck, label: "HIPAA Compliant", sub: "Your data stays private" },
];

const weServe = [
  { icon: HeartPulse, label: "Chronic Disease Patients", desc: "COPD, heart failure, diabetes, hypertension, and more managed daily." },
  { icon: PersonStanding, label: "Older Adults at Home", desc: "Independence supported with fall detection and continuous vitals oversight." },
  { icon: Moon, label: "Sleep Apnea Patients", desc: "CPAP compliance tracked and therapy outcomes monitored remotely." },
  { icon: Users, label: "Value-Based Care Partners", desc: "Physicians and ACOs reducing readmissions and improving STAR ratings." },
  { icon: Brain, label: "Behavioral Health Patients", desc: "Mental wellness integrated alongside physical chronic care management." },
  { icon: Salad, label: "Nutrition-Guided Patients", desc: "Medically tailored meal plans coordinated with clinical dietary goals." },
];

const programs = [
  { icon: Brain, title: "Mental Health", desc: "Structured behavioral health support integrated into chronic care plans.", href: "/programs/wellness" },
  { icon: Moon, title: "Sleep Health", desc: "Home sleep testing and therapy compliance monitoring for all ages.", href: "/programs/osa" },
  { icon: Salad, title: "Nutrition and Weight", desc: "Clinically tailored meal programs and medically supervised weight management.", href: "/programs/nutrition/diet/meals" },
  { icon: Heart, title: "Heart Health", desc: "Daily weight, blood pressure, and symptom tracking for cardiac patients.", href: "/programs/ccm/heart-failure" },
  { icon: Wind, title: "Respiratory Care", desc: "Continuous oxygen saturation and spirometry monitoring for COPD patients.", href: "/programs/copd" },
  { icon: ShieldCheck, title: "Safety and Monitoring", desc: "Wearable fall detection with 24/7 alert escalation to caregivers.", href: "/programs/fall-detection" },
];

const socialPosts = [
  {
    url: "https://www.instagram.com/priority_home_monitor/reel/DXpkLyek2L2/",
    label: "Instant Alert For Symptoms",
    image: "/insta_images/social/ig_post_1.jpg"
  },
  {
    url: "https://www.instagram.com/priority_home_monitor/p/DXpIw_IjZg3/",
    label: "Smart Healthcare Savings",
    image: "/insta_images/social/ig_post_2.jpg"
  },
  {
    url: "https://www.instagram.com/priority_home_monitor/reel/DXh10vbCUFH/",
    label: "Sudden Weight Gain Warning",
    image: "/insta_images/social/ig_post_7.jpg"
  },
  {
    url: "https://www.instagram.com/reel/DXsI-SzGwKP/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    label: "Healthcare Without Office Visits",
    image: "/insta_images/social/ig_post_6.jpg"
  }
];

const team = [
  { icon: Stethoscope, role: "Medical Director", name: "Board-Certified Physician", desc: "Oversees all clinical protocols, program standards, and escalation pathways across every monitoring program." },
  { icon: UserCheck, role: "Nurse Practitioners and PAs", name: "Advanced Practice Providers", desc: "Review daily patient readings, coordinate with referring physicians, and manage clinical interventions." },
  { icon: Users, role: "Care Coordination Team", name: "Dedicated Support Staff", desc: "Handle patient onboarding, device setup, caregiver communication, and ongoing scheduling." },
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
        className="relative overflow-hidden bg-[#1B3A5C] pb-16 pt-32 lg:pb-24 lg:pt-40 w-full flex flex-col min-h-[90vh]"
      >
        <HeroSlideshow />

        {/* Visual Overlay */}
        <div className="absolute inset-0 w-full h-full bg-[#1B3A5C]/70" aria-hidden="true" />

        {/* Centered Main Content */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-center justify-center text-center flex-1">
          {/* Headline */}
          <h1
            id="hero-heading"
            className="text-balance mb-6 max-w-5xl text-5xl md:text-7xl font-bold leading-[1.15] tracking-tight text-white"
          >
            Care That Watches Over You Every Day
          </h1>

          {/* Subheadline */}
          <p className="mb-10 max-w-3xl text-xl md:text-2xl leading-[1.7] text-white/80">
            Priority Home Monitor gives patients with chronic conditions a dedicated
            clinical team that reviews their vital signs daily and acts on changes
            before they become emergencies - all from home.
          </p>

          {/* CTAs */}
          <div className="mb-14 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/refer"
              className="inline-flex min-h-[44px] min-w-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#0D7377] px-8 text-[1.0625rem] font-bold text-white transition-colors hover:bg-[#0a5f63] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0D7377]"
              style={{ height: "52px" }}
            >
              Refer a Patient
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] min-w-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-lg border-2 border-white/40 px-8 text-[1.0625rem] font-bold text-white transition-colors hover:border-white/70 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
              style={{ height: "52px" }}
            >
              Request a Provider Consultation
            </Link>
          </div>
        </div>

        {/* Trust Badges — moved to the bottom */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full mt-auto pt-8">
          <div
            className="grid grid-cols-2 gap-3 md:grid-cols-4"
            role="list"
            aria-label="Trust indicators"
          >
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                role="listitem"
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm text-left"
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
        className="bg-[#F8FAFC] py-16 lg:py-24 w-full"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="grid items-center gap-12 2xl:gap-24 md:grid-cols-2">
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
                className="mb-5 text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#1B3A5C]"
              >
                Continuous Care Between Every Appointment
              </h2>
              <p className="mb-6 leading-[1.75] text-lg md:text-xl lg:text-2xl text-slate-500">
                Most chronic conditions deteriorate silently between quarterly office
                visits. Remote patient monitoring closes that gap.
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
        className="border-t border-[#E2EBF4] bg-white py-16 lg:py-24 w-full"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="mb-12 text-center">
            <Badge className="mb-3 bg-teal-50 text-[#0D7377] hover:bg-teal-50" variant="secondary">
              Patient Population
            </Badge>
            <h2
              id="serve-heading"
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1B3A5C]"
            >
              Who We Serve
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] leading-[1.7] text-lg md:text-xl lg:text-2xl text-slate-500">
              Our programs are designed for patients managing complex chronic
              conditions, and the physicians and care teams who support them.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:gap-8">
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
        className="border-t border-[#E2EBF4] bg-[#F8FAFC] py-16 lg:py-24 w-full"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="mb-12 text-center">
            <Badge className="mb-3 bg-teal-50 text-[#0D7377] hover:bg-teal-50" variant="secondary">
              Specialties
            </Badge>
            <h2
              id="programs-heading"
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1B3A5C]"
            >
              Our Wellness Programs
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] leading-[1.7] text-lg md:text-xl lg:text-2xl text-slate-500">
              Each program is designed around a specific clinical need, with devices
              and care protocols tailored accordingly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:gap-8">
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
        className="border-t border-[#E2EBF4] bg-white py-16 lg:py-24 w-full"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="mb-12 text-center">
            <Badge className="mb-3 bg-teal-50 text-[#0D7377] hover:bg-teal-50" variant="secondary">
              Clinical Staff
            </Badge>
            <h2
              id="team-heading"
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1B3A5C]"
            >
              Our Dedicated Team
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] leading-[1.7] text-lg md:text-xl lg:text-2xl text-slate-500">
              Every patient enrolled in our programs is supported by a real clinical
              team, not automated messaging.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 2xl:gap-12">
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
          6. PATIENT SUCCESS STORIES (Social Proof)
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="reviews-heading"
        className="bg-[#F8FAFC] py-16 lg:py-24 w-full"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="mb-12 text-center">
            <Badge className="mb-3 bg-teal-50 text-[#0D7377] hover:bg-teal-50" variant="secondary">
              Success Stories
            </Badge>
            <h2
              id="reviews-heading"
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1B3A5C]"
            >
              Patient Success Stories
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] leading-[1.7] text-lg md:text-xl lg:text-2xl text-slate-500">
              Hear what our patients are saying about their experience with Pulmonics Home Monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-12">
            {[
              { name: "John D.", text: "The daily monitoring has given my family so much peace of mind. The clinical team is always responsive and truly cares about my health.", rating: 5 },
              { name: "Sarah M.", text: "I've been able to manage my COPD much better since starting this program. The equipment is easy to use and the support is fantastic.", rating: 5 },
              { name: "Robert T.", text: "Pulmonics Home Monitoring caught an issue before it became an emergency. I can't thank them enough for their proactive care.", rating: 5 },
            ].map((review, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4 text-[#0D7377]">
                    {[...Array(review.rating)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                  <p className="font-semibold text-[#1B3A5C] text-sm">{review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. FOLLOW US (Instagram Integration)
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="social-heading"
        className="bg-white py-16 lg:py-24 w-full border-t border-[#E2EBF4]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full text-center">
          <h2
            id="social-heading"
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1B3A5C] mb-4"
          >
            Follow Us on Instagram
          </h2>
          <a
            href="https://www.instagram.com/priority_home_monitor?igsh=MXZoYnJqMnd4MDk="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#0D7377] font-semibold hover:text-[#0a5f63] transition-colors mb-10"
          >
            @priority_home_monitor
          </a>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 2xl:gap-10">
            {socialPosts.map((post, i) => (
              <a
                key={i}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-[1.02]"
              >
                {/* Image background */}
                <img
                  src={post.image}
                  alt={post.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-[#1B3A5C]/0 group-hover:bg-[#1B3A5C]/20 transition-colors z-10 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-3 rounded-full text-[#1B3A5C] shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>

                {/* Optional overlay label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-[10px] font-bold uppercase tracking-wider">{post.label}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          8. CONVERSION BANNER
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="banner-heading"
        className="bg-[#0D7377] py-16 lg:py-24 w-full"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full text-center">
          <h2
            id="banner-heading"
            className="mb-4 text-balance text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white"
          >
            Partner With Us for Proactive Care
          </h2>
          <p className="mx-auto mb-10 max-w-[540px] text-lg md:text-xl lg:text-2xl leading-[1.7] text-white/82">
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
