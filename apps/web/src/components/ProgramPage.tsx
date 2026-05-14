"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Activity,
} from "lucide-react";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

/* ─── Props ────────────────────────────────────────────────────── */
interface ProgramPageProps {
  programName: string;
  description: string;
  primaryCTA: string;
  ctaHref: string;
  externalCta?: boolean;
  qualifyingConditions: string[];
  steps: string[];
  icon?: React.ElementType;
  clinicalBacking?: {
    stat: string;
    statLabel: string;
    quote: string;
    author: string;
  };
  secondaryCTA?: string;
  secondaryCtaHref?: string;
  devices?: string[];
  image1?: string;
  image2?: string;
}

/* ─── Polymorphic CTA ──────────────────────────────────────────── */
function CtaLink({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function ProgramPage({
  programName,
  description,
  primaryCTA,
  ctaHref,
  externalCta = false,
  qualifyingConditions,
  steps,
  icon: Icon = Activity,
  secondaryCTA,
  secondaryCtaHref,
  image1,
  image2,
}: ProgramPageProps) {
  // Fallback generic image if a program is missing images entirely or only provides one.
  const fallbackImg = "/PHM Program pictures/CLINICAL TEAM_4040.jpg";
  const finalImage1 = image1 || fallbackImg;
  const finalImage2 = image2 || (image1 ? undefined : fallbackImg);
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO — Bento Grid & Glassmorphism
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden bg-[#1B3A5C] py-24 lg:py-32 w-full"
      >
        {/* Radial depth layer */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e4d75] to-[#1B3A5C]"
          aria-hidden="true"
        />

        {/* Background Activity Icon Watermark */}
        <Activity
          aria-hidden="true"
          className="pointer-events-none absolute right-[-40px] top-1/2 -translate-y-1/2 text-white/5 w-96 h-96"
          strokeWidth={0.5}
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-1 text-sm text-white/55 font-medium"
          >
            <Link
              href="/programs"
              className="inline-flex min-h-[44px] items-center transition-colors hover:text-white"
            >
              Programs
            </Link>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
            <span className="text-white/85">{programName}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Program Identity */}
            <div className="flex flex-col items-start">
              <div className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Icon className="h-8 w-8 text-[#6EE7E9]" />
              </div>
              
              <h1
                id="hero-heading"
                className="mb-6 text-4xl md:text-6xl lg:text-8xl font-extrabold text-balance tracking-tight text-white"
              >
                {programName}
              </h1>

              <p className="mb-10 max-w-xl text-lg md:text-xl lg:text-2xl text-balance leading-relaxed text-white/80">
                {description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <CtaLink
                  href={ctaHref}
                  external={externalCta}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#0D7377] px-8 text-lg font-bold text-white transition-all duration-300 hover:bg-[#0a5f63] hover:shadow-lg hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7377]"
                >
                  {primaryCTA}
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </CtaLink>
                {secondaryCTA && secondaryCtaHref && (
                  <CtaLink
                    href={secondaryCtaHref}
                    className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-white/20 px-6 text-base font-bold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {secondaryCTA}
                  </CtaLink>
                )}
                <a
                  href="tel:+19725734015"
                  className="inline-flex h-14 items-center gap-1.5 text-base font-semibold text-white/80 transition-colors hover:text-white px-4"
                >
                  Or call us: +1 972 573 4015
                </a>
              </div>
            </div>

            {/* Right Column: Featured Imagery — Diagonal Staircase */}
            <div className="w-full relative lg:ml-auto flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
              {finalImage1 && finalImage2 ? (
                /* ── Diagonal staircase: both images fully visible ── */
                <div
                  className="relative w-full max-w-[500px]"
                  style={{ height: "400px" }}
                >
                  {/* ── Card 1: top-left, tilted counter-clockwise ── */}
                  <div
                    className="absolute overflow-hidden rounded-2xl border-[3px] border-white/30 shadow-[0_16px_48px_rgba(0,0,0,0.50)] transition-transform duration-500 hover:-translate-y-1"
                    style={{
                      width: "62%",
                      aspectRatio: "3/2",
                      top: "0",
                      left: "0",
                      transform: "rotate(-2.5deg)",
                      zIndex: 2,
                    }}
                  >
                    <img
                      src={finalImage1}
                      alt={`${programName} — primary`}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* label strip */}
                    <div
                      className="absolute bottom-0 left-0 right-0 px-3 py-2"
                      style={{ background: "rgba(13,115,119,0.75)", backdropFilter: "blur(10px)" }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white">
                        {programName}
                      </p>
                    </div>
                  </div>

                  {/* ── Card 2: bottom-right, tilted clockwise ── */}
                  <div
                    className="absolute overflow-hidden rounded-2xl border-[3px] border-white/30 shadow-[0_16px_48px_rgba(0,0,0,0.50)] transition-transform duration-500 hover:translate-y-1"
                    style={{
                      width: "62%",
                      aspectRatio: "3/2",
                      bottom: "0",
                      right: "0",
                      transform: "rotate(2.5deg)",
                      zIndex: 2,
                    }}
                  >
                    <img
                      src={finalImage2}
                      alt={`${programName} — secondary`}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* label strip */}
                    <div
                      className="absolute bottom-0 left-0 right-0 px-3 py-2"
                      style={{ background: "rgba(27,58,92,0.75)", backdropFilter: "blur(10px)" }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white">
                        Monitoring &amp; Support
                      </p>
                    </div>
                  </div>

                  {/* ── Center connector dot ── */}
                  <div
                    className="absolute flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#6EE7E9]/60 bg-[#0D7377] shadow-lg"
                    style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 5 }}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-[#6EE7E9]" />
                  </div>

                  {/* ── Pulsing live badge ── */}
                  <div
                    className="absolute flex items-center gap-1.5 rounded-full bg-[#0D7377] px-3 py-1.5 shadow-lg"
                    style={{ top: "52%", left: "50%", transform: "translate(-50%, 18px)", zIndex: 6, whiteSpace: "nowrap" }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6EE7E9] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6EE7E9]" />
                    </span>
                    <span className="text-[10px] font-bold text-white">Active Monitoring</span>
                  </div>

                  {/* ── Stat chip top-right ── */}
                  <div
                    className="absolute rounded-xl border border-white/25 px-3 py-2 text-center shadow-xl"
                    style={{
                      top: "6%",
                      right: "2%",
                      background: "rgba(255,255,255,0.13)",
                      backdropFilter: "blur(14px)",
                      zIndex: 6,
                    }}
                  >
                    <p className="text-lg font-extrabold text-white">24/7</p>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-white/70">Care Team</p>
                  </div>

                  {/* ── Stat chip bottom-left ── */}
                  <div
                    className="absolute rounded-xl border border-white/25 px-3 py-2 text-center shadow-xl"
                    style={{
                      bottom: "6%",
                      left: "2%",
                      background: "rgba(255,255,255,0.13)",
                      backdropFilter: "blur(14px)",
                      zIndex: 6,
                    }}
                  >
                    <p className="text-lg font-extrabold text-white">92%</p>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-white/70">Adherence</p>
                  </div>
                </div>
              ) : (
                /* ── Single image ── */
                <div
                  className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl hover:scale-[1.02] transition-transform duration-300"
                  style={{ aspectRatio: "3/2" }}
                >
                  <img
                    src={finalImage1 || finalImage2}
                    alt={`${programName} Image`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHO QUALIFIES (Card Grid)
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="qualify-heading"
        className="bg-[#F8FAFC] py-20 lg:py-32 w-full"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <span className="mb-3 inline-block rounded-full bg-teal-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#0D7377]">
              Eligibility
            </span>
            <h2
              id="qualify-heading"
              className="mb-4 text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-[#1B3A5C]"
            >
              Who Qualifies?
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-balance text-slate-500">
              Our clinical team works with your physician to confirm eligibility. You may qualify if you or your loved one has been diagnosed with any of the conditions below.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:gap-16">
            {qualifyingConditions.map((condition, i) => (
              <Card 
                key={i}
                className="border-none bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ring-1 ring-[#E2EBF4] hover:ring-[#0D7377]/30"
              >
                <CardContent className="p-0 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                    <CheckCircle2 className="h-6 w-6 text-[#0D7377]" />
                  </div>
                  <p className="text-base font-medium leading-relaxed text-[#1A1A2E] text-balance pt-1">
                    {condition}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHAT TO EXPECT (Card Grid)
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="steps-heading"
        className="bg-white py-20 lg:py-32 border-t border-[#E2EBF4] w-full"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <span className="mb-3 inline-block rounded-full bg-teal-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#0D7377]">
              Process
            </span>
            <h2
              id="steps-heading"
              className="mb-4 text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-[#1B3A5C]"
            >
              What to Expect
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-balance text-slate-500">
              Enrollment is simple and your care team handles the heavy lifting.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 2xl:gap-16">
            {steps.map((step, i) => (
              <Card 
                key={i}
                className="relative overflow-hidden border-none bg-[#F8FAFC] p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ring-1 ring-[#E2EBF4] hover:ring-[#0D7377]/30"
              >
                <div className="absolute -right-4 -top-4 text-9xl font-extrabold text-[#1B3A5C]/5 pointer-events-none select-none">
                  {i + 1}
                </div>
                <CardContent className="p-0 relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D7377] text-white shadow-lg shadow-[#0D7377]/20">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1B3A5C] mb-3 tracking-tight">Step {i + 1}</h3>
                  <p className="text-base font-medium leading-relaxed text-slate-600 text-balance">
                    {step}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <CtaLink
              href={ctaHref}
              external={externalCta}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#0D7377] px-10 text-lg font-bold text-white transition-all duration-300 hover:bg-[#0a5f63] hover:shadow-lg hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7377]"
            >
              {primaryCTA}
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </CtaLink>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STICKY MOBILE CTA BAR
          ══════════════════════════════════════════════════════ */}
      <div
        role="complementary"
        aria-label="Enroll now"
        className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-between gap-4 bg-[#0D7377] px-6 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:hidden border-t border-white/10"
      >
        <p className="text-base font-bold tracking-tight text-white">
          Ready to get started?
        </p>
        <CtaLink
          href={ctaHref}
          external={externalCta}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-white px-6 text-sm font-extrabold tracking-tight text-[#0D7377] whitespace-nowrap shadow-sm active:scale-95 transition-transform"
        >
          {primaryCTA} →
        </CtaLink>
      </div>

      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
