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
  clinicalBacking = {
    stat: "92%",
    statLabel: "Patient Adherence",
    quote: '"Daily monitoring provides the clinical confidence we need to keep patients out of the hospital while improving their quality of life."',
    author: "Clinical Advisory Board",
  },
}: ProgramPageProps) {
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO — Bento Grid & Glassmorphism
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden bg-[#1B3A5C] py-24 lg:py-32"
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

        <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8">
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
                className="mb-6 text-5xl font-extrabold text-balance tracking-tight text-white"
              >
                {programName}
              </h1>

              <p className="mb-10 max-w-xl text-lg text-balance leading-relaxed text-white/80">
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
                <a
                  href="tel:+19725734015"
                  className="inline-flex h-14 items-center gap-1.5 text-base font-semibold text-white/80 transition-colors hover:text-white px-4"
                >
                  Or call us: +1 972 573 4015
                </a>
              </div>
            </div>

            {/* Right Column: Clinical Backing (Premium Glassmorphic Card) */}
            <div className="w-full max-w-lg lg:ml-auto">
              <div className="bg-[#1B3A5C]/5 backdrop-blur-md border border-[#1B3A5C]/10 rounded-2xl p-8 shadow-lg relative overflow-hidden bg-white/10 border-white/20 text-white">
                <div className="mb-8">
                  <span className="text-4xl font-extrabold tracking-tight text-[#6EE7E9]">{clinicalBacking.stat}</span>
                  <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mt-1">{clinicalBacking.statLabel}</p>
                </div>
                
                <div className="relative">
                  {/* Subtle quote mark decoration */}
                  <span className="absolute -top-4 -left-4 text-6xl text-white/10 font-serif leading-none">&quot;</span>
                  <p className="text-lg leading-relaxed text-balance italic text-white/90 relative z-10">
                    {clinicalBacking.quote}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#0D7377] flex items-center justify-center text-sm font-bold text-white shrink-0">
                      CAB
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-tight text-white">{clinicalBacking.author}</p>
                      <p className="text-xs font-medium text-white/60 text-balance">Priority Home Monitor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHO QUALIFIES (Card Grid)
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="qualify-heading"
        className="bg-[#F8FAFC] py-20 lg:py-32"
      >
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <span className="mb-3 inline-block rounded-full bg-teal-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#0D7377]">
              Eligibility
            </span>
            <h2
              id="qualify-heading"
              className="mb-4 text-4xl font-bold tracking-tight text-balance text-[#1B3A5C]"
            >
              Who Qualifies?
            </h2>
            <p className="text-lg leading-relaxed text-balance text-slate-500">
              Our clinical team works with your physician to confirm eligibility. You may qualify if you or your loved one has been diagnosed with any of the conditions below.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        className="bg-white py-20 lg:py-32 border-t border-[#E2EBF4]"
      >
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <span className="mb-3 inline-block rounded-full bg-teal-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#0D7377]">
              Process
            </span>
            <h2
              id="steps-heading"
              className="mb-4 text-4xl font-bold tracking-tight text-balance text-[#1B3A5C]"
            >
              What to Expect
            </h2>
            <p className="text-lg leading-relaxed text-balance text-slate-500">
              Enrollment is simple and your care team handles the heavy lifting.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
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
