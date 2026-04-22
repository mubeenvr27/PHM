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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Priority Home Monitor — Care That Watches Over You Every Day",
  description:
    "Priority Home Monitor delivers clinical-grade remote patient monitoring for COPD, Heart Failure, Diabetes, Hypertension, Sleep Apnea, and more. Daily oversight from a dedicated clinical team — all from home.",
};

/* ─── Shared layout helpers ─────────────────────────────────────── */
const wrap = {
  maxWidth: "1100px",
  marginInline: "auto",
  paddingInline: "1.5rem",
} as const;

const sectionPy = {
  paddingTop: "clamp(80px, 10vw, 100px)",
  paddingBottom: "clamp(80px, 10vw, 100px)",
} as const;

/* ─── Data ───────────────────────────────────────────────────────── */
const trustBadges = [
  { icon: Stethoscope,  label: "Clinical Team",       sub: "Board-certified oversight" },
  { icon: Activity,     label: "Daily Monitoring",    sub: "Real-time readings reviewed" },
  { icon: Clock,        label: "24/7 Safety",         sub: "Alerts actioned around the clock" },
  { icon: ShieldCheck,  label: "HIPAA Compliant",     sub: "Your data stays private" },
];

const weServe = [
  { icon: HeartPulse,      label: "Chronic Disease Patients",  desc: "COPD, heart failure, diabetes, hypertension, and more managed daily." },
  { icon: PersonStanding,  label: "Older Adults at Home",      desc: "Independence supported with fall detection and continuous vitals oversight." },
  { icon: Moon,            label: "Sleep Apnea Patients",      desc: "CPAP compliance tracked and therapy outcomes monitored remotely." },
  { icon: Users,           label: "Value-Based Care Partners", desc: "Physicians and ACOs reducing readmissions and improving STAR ratings." },
  { icon: Brain,           label: "Behavioral Health Patients",desc: "Mental wellness integrated alongside physical chronic care management." },
  { icon: Salad,           label: "Nutrition-Guided Patients", desc: "Medically tailored meal plans coordinated with clinical dietary goals." },
];

const programs = [
  { icon: Brain,       title: "Mental Health",          desc: "Structured behavioral health support integrated into chronic care plans.",    href: "/programs/wellness" },
  { icon: Moon,        title: "Sleep Health",           desc: "Home sleep testing and therapy compliance monitoring for all ages.",          href: "/programs/osa" },
  { icon: Salad,       title: "Nutrition and Weight",   desc: "Clinically tailored meal programs and medically supervised weight management.", href: "/programs/nutrition/diet/meals" },
  { icon: Heart,       title: "Heart Health",           desc: "Daily weight, blood pressure, and symptom tracking for cardiac patients.",    href: "/programs/ccm/heart-failure" },
  { icon: Wind,        title: "Respiratory Care",       desc: "Continuous oxygen saturation and spirometry monitoring for COPD patients.",   href: "/programs/copd" },
  { icon: ShieldCheck, title: "Safety and Monitoring",  desc: "Wearable fall detection with 24/7 alert escalation to caregivers.",         href: "/programs/fall-detection" },
];

const team = [
  {
    icon: Stethoscope,
    role: "Medical Director",
    name: "Board-Certified Physician",
    desc: "Oversees all clinical protocols, program standards, and escalation pathways across every monitoring program.",
  },
  {
    icon: UserCheck,
    role: "Nurse Practitioners and PAs",
    name: "Advanced Practice Providers",
    desc: "Review daily patient readings, coordinate with referring physicians, and manage clinical interventions.",
  },
  {
    icon: Users,
    role: "Care Coordination Team",
    name: "Dedicated Support Staff",
    desc: "Handle patient onboarding, device setup, caregiver communication, and ongoing scheduling.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          1. HERO
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hero-heading"
        style={{
          background: "linear-gradient(150deg, var(--color-primary) 0%, #1e4d75 55%, #164463 100%)",
          paddingTop: "clamp(100px, 12vw, 140px)",
          paddingBottom: "clamp(80px, 10vw, 120px)",
        }}
      >
        <div style={wrap}>
          {/* Headline */}
          <h1
            id="hero-heading"
            className="text-balance mb-6"
            style={{
              color: "#ffffff",
              fontSize: "clamp(2.25rem, 5.5vw, 3.25rem)",
              fontWeight: 700,
              maxWidth: "720px",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Care That Watches Over You Every Day
          </h1>

          {/* Subheadline */}
          <p
            className="mb-10"
            style={{
              color: "rgba(255,255,255,0.82)",
              fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
              maxWidth: "580px",
              lineHeight: 1.7,
            }}
          >
            Priority Home Monitor gives patients with chronic conditions a
            dedicated clinical team that reviews their vital signs daily and
            acts on changes before they become emergencies — all from home.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 items-center mb-14">
            <Link
              href="/refer"
              className="btn-primary"
              style={{ height: "52px", fontSize: "1.0625rem", paddingInline: "2rem" }}
            >
              Refer a Patient
              <ArrowRight size={18} className="ml-2 shrink-0" />
            </Link>
            <Link
              href="/contact"
              className="btn-secondary"
              style={{
                height: "52px",
                fontSize: "1.0625rem",
                paddingInline: "2rem",
                borderColor: "rgba(255,255,255,0.55)",
                color: "#ffffff",
              }}
            >
              Request a Provider Consultation
            </Link>
          </div>

          {/* Trust Badges */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            role="list"
            aria-label="Trust indicators"
          >
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                role="listitem"
                className="flex items-start gap-3 rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <Icon
                  size={22}
                  style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: "2px" }}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-sm text-white">{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. WHAT IS HOME MONITORING
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="what-heading"
        style={{ ...sectionPy, backgroundColor: "var(--color-surface)" }}
      >
        <div style={wrap}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(13,115,119,0.1)", color: "var(--color-accent)" }}
              >
                How It Works
              </span>
              <h2
                id="what-heading"
                className="mb-5"
                style={{ color: "var(--color-primary)", fontWeight: 700 }}
              >
                Continuous Care Between Every Appointment
              </h2>
              <p className="mb-4" style={{ color: "var(--color-text-muted)", lineHeight: 1.75 }}>
                Most chronic conditions deteriorate silently between quarterly office
                visits. Remote patient monitoring closes that gap. Our clinical team
                reviews patient readings every single day and contacts the physician
                when a reading requires intervention.
              </p>

              <ul role="list" className="flex flex-col gap-3 mt-6">
                {[
                  "Clinically validated devices shipped directly to the patient",
                  "Daily data reviewed by our clinical team, not an algorithm alone",
                  "Physician receives structured reports and alert escalations",
                  "Medicare and Medicaid billing handled entirely by our team",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={19}
                      style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: "2px" }}
                      aria-hidden="true"
                    />
                    <span style={{ color: "var(--color-text-primary)", lineHeight: 1.6, fontSize: "0.9375rem" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: visual placeholder */}
            <div
              className="flex flex-col items-center justify-center rounded-2xl"
              style={{
                backgroundColor: "#E8EFF6",
                border: "1px solid var(--color-border)",
                minHeight: "340px",
                gap: "16px",
              }}
              role="img"
              aria-label="Patient monitoring dashboard illustration"
            >
              <Activity
                size={56}
                style={{ color: "var(--color-accent)", opacity: 0.7 }}
                aria-hidden="true"
              />
              <p
                className="text-sm font-medium text-center px-8"
                style={{ color: "var(--color-text-muted)" }}
              >
                Clinical monitoring dashboard
                <br />
                <span style={{ fontSize: "0.8125rem", opacity: 0.7 }}>
                  Patient portal view coming in Phase 3
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. WHO WE SERVE
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="serve-heading"
        style={{ ...sectionPy, backgroundColor: "#ffffff", borderTop: "1px solid var(--color-border)" }}
      >
        <div style={wrap}>
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(13,115,119,0.1)", color: "var(--color-accent)" }}
            >
              Patient Population
            </span>
            <h2
              id="serve-heading"
              style={{ color: "var(--color-primary)", fontWeight: 700 }}
            >
              Who We Serve
            </h2>
            <p
              className="mt-3 mx-auto"
              style={{ color: "var(--color-text-muted)", maxWidth: "520px", lineHeight: 1.7 }}
            >
              Our programs are designed for patients managing complex chronic
              conditions, and the physicians and care teams who support them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {weServe.map(({ icon: Icon, label, desc }) => (
              <Card
                key={label}
                className="border-0 shadow-sm"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <CardHeader>
                  <div
                    className="flex items-center justify-center rounded-lg mb-1"
                    style={{
                      width: "44px",
                      height: "44px",
                      backgroundColor: "rgba(13,115,119,0.1)",
                    }}
                    aria-hidden="true"
                  >
                    <Icon size={22} style={{ color: "var(--color-accent)" }} />
                  </div>
                  <CardTitle
                    className="font-semibold"
                    style={{ color: "var(--color-primary)", fontSize: "1rem" }}
                  >
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)", lineHeight: 1.65 }}>
                    {desc}
                  </p>
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
        style={{ ...sectionPy, backgroundColor: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}
      >
        <div style={wrap}>
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(13,115,119,0.1)", color: "var(--color-accent)" }}
            >
              Specialties
            </span>
            <h2
              id="programs-heading"
              style={{ color: "var(--color-primary)", fontWeight: 700 }}
            >
              Our Wellness Programs
            </h2>
            <p
              className="mt-3 mx-auto"
              style={{ color: "var(--color-text-muted)", maxWidth: "520px", lineHeight: 1.7 }}
            >
              Each program is designed around a specific clinical need, with
              devices and care protocols tailored accordingly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map(({ icon: Icon, title, desc, href }) => (
              <Card
                key={title}
                className="flex flex-col"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 1px 6px rgba(27,58,92,0.06)",
                }}
              >
                <CardHeader>
                  <div
                    className="flex items-center justify-center rounded-lg mb-1"
                    style={{
                      width: "44px",
                      height: "44px",
                      backgroundColor: "rgba(27,58,92,0.07)",
                    }}
                    aria-hidden="true"
                  >
                    <Icon size={22} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <CardTitle
                    style={{ color: "var(--color-primary)", fontSize: "1rem", fontWeight: 600 }}
                  >
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 flex-1">
                  <p className="text-sm" style={{ color: "var(--color-text-muted)", lineHeight: 1.65 }}>
                    {desc}
                  </p>
                  <div className="mt-auto">
                    <Link
                      href={href}
                      className="link-teal text-sm font-semibold inline-flex items-center gap-1"
                      style={{ minHeight: "44px" }}
                    >
                      Explore Program
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/programs"
              className="btn-secondary"
              style={{ height: "50px", paddingInline: "2rem" }}
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
        style={{ ...sectionPy, backgroundColor: "#ffffff", borderTop: "1px solid var(--color-border)" }}
      >
        <div style={wrap}>
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(13,115,119,0.1)", color: "var(--color-accent)" }}
            >
              Clinical Staff
            </span>
            <h2
              id="team-heading"
              style={{ color: "var(--color-primary)", fontWeight: 700 }}
            >
              Our Dedicated Team
            </h2>
            <p
              className="mt-3 mx-auto"
              style={{ color: "var(--color-text-muted)", maxWidth: "520px", lineHeight: 1.7 }}
            >
              Every patient enrolled in our programs is supported by a real clinical
              team, not automated messaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map(({ icon: Icon, role, name, desc }) => (
              <div
                key={role}
                className="flex flex-col items-center text-center rounded-2xl p-8"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* Avatar circle */}
                <div
                  className="flex items-center justify-center rounded-full mb-5"
                  style={{
                    width: "72px",
                    height: "72px",
                    backgroundColor: "rgba(13,115,119,0.12)",
                  }}
                  aria-hidden="true"
                >
                  <Icon size={30} style={{ color: "var(--color-accent)" }} />
                </div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: "var(--color-accent)" }}
                >
                  {role}
                </p>
                <h3
                  className="mb-3"
                  style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "1.0625rem" }}
                >
                  {name}
                </h3>
                <p className="text-sm" style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                  {desc}
                </p>
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
        style={{
          backgroundColor: "var(--color-accent)",
          paddingTop: "clamp(72px, 9vw, 96px)",
          paddingBottom: "clamp(72px, 9vw, 96px)",
        }}
      >
        <div style={{ ...wrap, textAlign: "center" }}>
          <h2
            id="banner-heading"
            className="text-balance mb-4"
            style={{
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Partner With Us for Proactive Care
          </h2>
          <p
            className="mb-10 mx-auto"
            style={{
              color: "rgba(255,255,255,0.82)",
              maxWidth: "540px",
              lineHeight: 1.7,
              fontSize: "1.0625rem",
            }}
          >
            See how Priority Home Monitor integrates with your practice workflow
            to reduce readmissions, improve patient outcomes, and capture remote
            care revenue you are already entitled to.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/platform"
              className="inline-flex items-center justify-center gap-2 font-bold rounded-lg"
              style={{
                backgroundColor: "#ffffff",
                color: "var(--color-accent)",
                height: "52px",
                paddingInline: "2rem",
                fontSize: "1.0625rem",
                minWidth: "44px",
                textDecoration: "none",
              }}
            >
              Request a Platform Demo
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/refer"
              className="inline-flex items-center justify-center gap-2 font-bold rounded-lg"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                border: "2px solid rgba(255,255,255,0.55)",
                height: "52px",
                paddingInline: "2rem",
                fontSize: "1.0625rem",
                minWidth: "44px",
                textDecoration: "none",
              }}
            >
              Refer a Patient Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
