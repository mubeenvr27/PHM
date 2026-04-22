"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";

/* ─── Props Interface ──────────────────────────────────────────── */
interface ProgramPageProps {
  programName: string;
  description: string;
  primaryCTA: string;
  ctaHref: string;
  externalCta?: boolean;          // true → opens in new tab with rel=noopener
  qualifyingConditions: string[];
  steps: string[];
}

/* ─── Step Indicator ──────────────────────────────────────────── */
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
    <div className="flex flex-col items-center text-center flex-1 min-w-0 relative">
      {/* Step number bubble */}
      <div
        className="flex items-center justify-center rounded-full font-bold text-white text-lg mb-4 shrink-0"
        style={{
          width: "56px",
          height: "56px",
          backgroundColor: "var(--color-accent)",
          boxShadow: "0 4px 14px rgba(13,115,119,0.3)",
        }}
      >
        {index + 1}
      </div>

      {/* Connector line (between steps, desktop only) */}
      {!isLast && (
        <div
          className="hidden md:block absolute top-7 left-[calc(50%+28px)] right-[calc(-50%+28px)]"
          style={{
            height: "2px",
            backgroundColor: "var(--color-border)",
            zIndex: 0,
          }}
        />
      )}

      <p
        className="text-sm md:text-base font-medium leading-snug"
        style={{ color: "var(--color-text-primary)", maxWidth: "180px" }}
      >
        {text}
      </p>
    </div>
  );
}

/* ─── Polymorphic CTA — internal Link or external anchor ────── */
function CtaLink({
  href,
  external,
  className,
  style,
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
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
          HERO SECTION
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hero-heading"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, #22527A 60%, #164463 100%)",
          paddingTop: "clamp(80px, 10vw, 120px)",
          paddingBottom: "clamp(80px, 10vw, 120px)",
        }}
      >
        <div
          className="content-max-width"
          style={{ maxWidth: "1100px", marginInline: "auto", paddingInline: "1.5rem" }}
        >
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1 mb-6 text-sm"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              <Link
                href="/programs"
                className="hover:text-white transition-colors"
                style={{ minHeight: "44px", display: "inline-flex", alignItems: "center" }}
              >
                Programs
              </Link>
              <ChevronRight size={14} />
              <span style={{ color: "rgba(255,255,255,0.85)" }}>{programName}</span>
            </nav>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-balance mb-6"
              style={{ color: "#ffffff", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700 }}
            >
              {programName}
            </h1>

            {/* Description */}
            <p
              className="text-lg md:text-xl mb-10 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.8)", maxWidth: "600px" }}
            >
              {description}
            </p>

            {/* Primary CTA */}
            <div className="flex flex-wrap gap-4 items-center">
              <CtaLink
                href={ctaHref}
                external={externalCta}
                className="btn-primary"
                style={{ height: "52px", fontSize: "1.0625rem", paddingInline: "2rem" }}
              >
                {primaryCTA}
                <ArrowRight size={18} className="ml-2 shrink-0" />
              </CtaLink>
              <a
                href="tel:+19725734015"
                className="text-white font-semibold text-sm hover:underline"
                style={{
                  minHeight: "44px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  opacity: 0.85,
                }}
              >
                Or call us: +1 972‑573‑4015
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
        style={{
          paddingTop: "clamp(80px, 10vw, 100px)",
          paddingBottom: "clamp(80px, 10vw, 100px)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <div
          style={{ maxWidth: "1100px", marginInline: "auto", paddingInline: "1.5rem" }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: copy */}
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(13,115,119,0.1)",
                  color: "var(--color-accent)",
                }}
              >
                Eligibility
              </span>
              <h2
                id="qualify-heading"
                className="mb-4"
                style={{ color: "var(--color-primary)", fontWeight: 700 }}
              >
                Who Qualifies?
              </h2>
              <p style={{ color: "var(--color-text-muted)", lineHeight: "1.7" }}>
                Our clinical team works with your physician to confirm eligibility. You may qualify if
                you or your loved one has been diagnosed with any of the conditions below.
              </p>
            </div>

            {/* Right: conditions list */}
            <ul role="list" className="flex flex-col gap-3" aria-label="Qualifying conditions">
              {qualifyingConditions.map((condition, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl p-4"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 1px 4px rgba(27,58,92,0.06)",
                  }}
                >
                  <CheckCircle2
                    size={20}
                    className="shrink-0 mt-0.5"
                    style={{ color: "var(--color-accent)" }}
                  />
                  <span
                    className="font-medium text-sm md:text-base"
                    style={{ color: "var(--color-text-primary)", lineHeight: "1.5" }}
                  >
                    {condition}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHAT TO EXPECT — 3-STEP FLOW
          ══════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="steps-heading"
        style={{
          paddingTop: "clamp(80px, 10vw, 100px)",
          paddingBottom: "clamp(80px, 10vw, 100px)",
          backgroundColor: "#fff",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{ maxWidth: "1100px", marginInline: "auto", paddingInline: "1.5rem" }}
        >
          {/* Section header */}
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(13,115,119,0.1)",
                color: "var(--color-accent)",
              }}
            >
              Process
            </span>
            <h2
              id="steps-heading"
              style={{ color: "var(--color-primary)", fontWeight: 700 }}
            >
              What to Expect
            </h2>
            <p
              className="mt-3 mx-auto text-base md:text-lg"
              style={{ color: "var(--color-text-muted)", maxWidth: "520px", lineHeight: "1.7" }}
            >
              Enrollment is simple and your care team handles the heavy lifting.
            </p>
          </div>

          {/* Step cards row */}
          <div
            className="flex flex-col md:flex-row items-start justify-between gap-10 md:gap-6 relative"
          >
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
          <div className="text-center mt-14">
            <CtaLink
              href={ctaHref}
              external={externalCta}
              className="btn-primary"
              style={{ height: "52px", paddingInline: "2.5rem", fontSize: "1.0625rem" }}
            >
              {primaryCTA}
              <ArrowRight size={18} className="ml-2 shrink-0" />
            </CtaLink>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STICKY BOTTOM CTA BAR (Mobile only)
          ══════════════════════════════════════════════════════ */}
      <div
        role="complementary"
        aria-label="Enroll now"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-3"
        style={{
          backgroundColor: "var(--color-accent)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
          minHeight: "64px",
        }}
      >
        <p className="text-white font-semibold text-sm leading-tight">
          Ready to get started?
        </p>
        <CtaLink
          href={ctaHref}
          external={externalCta}
          className="shrink-0 font-bold text-sm rounded-lg px-5"
          style={{
            backgroundColor: "#fff",
            color: "var(--color-accent)",
            height: "44px",
            display: "inline-flex",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          {primaryCTA} →
        </CtaLink>
      </div>

      {/* Spacer so sticky bar doesn't overlap footer on mobile */}
      <div className="md:hidden" style={{ height: "64px" }} aria-hidden="true" />
    </>
  );
}
