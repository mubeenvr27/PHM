"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Activity,
} from "lucide-react";
import React from "react";

/* ─── Props ────────────────────────────────────────────────────── */
interface ProgramPageProps {
  programName: string;
  description: string;
  primaryCTA: string;
  ctaHref: string;
  externalCta?: boolean;
  qualifyingConditions: string[];
  steps: string[];
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

/* ─── Step Card ────────────────────────────────────────────────── */
function StepCard({
  index,
  text,
  isLast,
}: {
  index: number;
  text: string;
  isLast: boolean;
}) {
  return (
    <div className="relative flex flex-1 flex-col items-center text-center">
      {/* Connector — desktop only */}
      {!isLast && (
        <div
          className="absolute left-[calc(50%+28px)] right-[calc(-50%+28px)] top-7 hidden h-px bg-[#E2EBF4] md:block"
          aria-hidden="true"
        />
      )}

      {/* Number bubble */}
      <div
        className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0D7377] text-lg font-bold text-white shadow-[0_4px_14px_rgba(13,115,119,0.3)]"
        aria-hidden="true"
      >
        {index + 1}
      </div>

      <p className="max-w-[180px] text-sm font-medium leading-snug text-[#1A1A2E] md:text-base">
        {text}
      </p>
    </div>
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
}: ProgramPageProps) {
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO — matches home page radial gradient
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden bg-[#1B3A5C] pb-[clamp(80px,10vw,120px)] pt-[clamp(100px,12vw,130px)]"
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

        {/* Activity watermark */}
        <Activity
          aria-hidden="true"
          className="pointer-events-none absolute right-[-40px] top-1/2 -translate-y-1/2 text-white/[0.04]"
          style={{ width: 380, height: 380 }}
          strokeWidth={0.7}
        />

        <div className="relative mx-auto max-w-[1100px] px-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1 text-sm text-white/55"
          >
            <Link
              href="/programs"
              className="inline-flex min-h-[44px] items-center transition-colors hover:text-white"
            >
              Programs
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-white/85">{programName}</span>
          </nav>

          <div className="max-w-2xl">
            <h1
              id="hero-heading"
              className="mb-6 text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.15] tracking-tight text-white"
            >
              {programName}
            </h1>

            <p className="mb-10 max-w-[600px] text-[clamp(1rem,2.2vw,1.2rem)] leading-[1.7] text-white/80">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <CtaLink
                href={ctaHref}
                external={externalCta}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg bg-[#0D7377] px-8 text-[1.0625rem] font-bold text-white transition-colors hover:bg-[#0a5f63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7377]"
              >
                {primaryCTA}
                <ArrowRight size={18} aria-hidden="true" />
              </CtaLink>
              <a
                href="tel:+19725734015"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white"
              >
                Or call us: +1 972 573 4015
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHO QUALIFIES
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="qualify-heading"
        className="bg-[#F8FAFC] py-[clamp(80px,10vw,100px)]"
      >
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid items-start gap-12 md:grid-cols-2">
            {/* Left: copy */}
            <div>
              <span className="mb-3 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#0D7377]">
                Eligibility
              </span>
              <h2
                id="qualify-heading"
                className="mb-4 text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-[#1B3A5C]"
              >
                Who Qualifies?
              </h2>
              <p className="leading-[1.75] text-slate-500">
                Our clinical team works with your physician to confirm
                eligibility. You may qualify if you or your loved one has been
                diagnosed with any of the conditions below.
              </p>
            </div>

            {/* Right: conditions — CheckCircle2, no hyphens */}
            <ul role="list" className="flex flex-col gap-3" aria-label="Qualifying conditions">
              {qualifyingConditions.map((condition, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-[#E2EBF4] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-[#0D7377]"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium leading-[1.55] text-[#1A1A2E] md:text-base">
                    {condition}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHAT TO EXPECT — STEP FLOW
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="steps-heading"
        className="border-t border-[#E2EBF4] bg-white py-[clamp(80px,10vw,100px)]"
      >
        <div className="mx-auto max-w-[1100px] px-6">
          {/* Section header */}
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#0D7377]">
              Process
            </span>
            <h2
              id="steps-heading"
              className="text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-[#1B3A5C]"
            >
              What to Expect
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] text-base leading-[1.7] text-slate-500 md:text-lg">
              Enrollment is simple and your care team handles the heavy lifting.
            </p>
          </div>

          {/* Step row */}
          <div className="relative flex flex-col items-start justify-between gap-10 md:flex-row md:gap-6">
            {steps.map((step, i) => (
              <StepCard
                key={i}
                index={i}
                text={step}
                isLast={i === steps.length - 1}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center">
            <CtaLink
              href={ctaHref}
              external={externalCta}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg bg-[#0D7377] px-10 text-[1.0625rem] font-bold text-white transition-colors hover:bg-[#0a5f63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7377]"
            >
              {primaryCTA}
              <ArrowRight size={18} aria-hidden="true" />
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
        className="fixed bottom-0 left-0 right-0 z-50 flex min-h-[64px] items-center justify-between gap-3 bg-[#0D7377] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] md:hidden"
      >
        <p className="text-sm font-semibold leading-tight text-white">
          Ready to get started?
        </p>
        <CtaLink
          href={ctaHref}
          external={externalCta}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg bg-white px-5 text-sm font-bold text-[#0D7377] whitespace-nowrap"
        >
          {primaryCTA} →
        </CtaLink>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
