"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

const programs = [
  { label: "COPD — Respiratory Care",              href: "/programs/copd" },
  { label: "Hypertension Monitoring",               href: "/programs/hypertension" },
  { label: "Diabetes — CCM",                        href: "/programs/ccm/diabetes" },
  { label: "Heart Failure — CCM",                   href: "/programs/ccm/heart-failure" },
  { label: "Obstructive Sleep Apnea",               href: "/programs/osa" },
  { label: "Pediatric Sleep Monitoring",            href: "/programs/sleep/pediatric" },
  { label: "Adult Sleep Monitoring",                href: "/programs/sleep/adult" },
  { label: "ENT Sleep Program",                     href: "/programs/sleep/ent" },
  { label: "Wellness: Mental, Nutrition, Weight",   href: "/programs/wellness" },
  { label: "Prepared Meal Program (CookUnity)",     href: "/programs/nutrition/diet/meals" },
  { label: "Fall Detection — Safety & Monitoring",  href: "/programs/fall-detection" },
];

export default function Navbar() {
  const [programsOpen, setProgramsOpen] = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);

  return (
    <header
      role="banner"
      style={{ backgroundColor: "var(--color-primary)" }}
      className="sticky top-0 z-50 shadow-md"
    >
      <div className="content-max-width flex items-center justify-between py-0">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-white text-lg leading-tight"
          aria-label="Priority Home Monitor — Home"
          style={{ minHeight: "64px" }}
        >
          <span
            className="flex items-center justify-center rounded-md font-extrabold text-sm"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#fff",
              width: "36px",
              height: "36px",
              flexShrink: 0,
            }}
          >
            PHM
          </span>
          <span className="hidden sm:block">
            Priority<br />
            <span style={{ color: "var(--color-accent)" }}>Home Monitor</span>
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-1"
        >
          {/* Programs Dropdown */}
          <div className="relative">
            <button
              aria-haspopup="true"
              aria-expanded={programsOpen}
              onClick={() => setProgramsOpen((o) => !o)}
              onBlur={() => setTimeout(() => setProgramsOpen(false), 150)}
              className="flex items-center gap-1 text-white font-medium px-4 rounded-md transition-colors hover:bg-white/10"
              style={{ height: "64px", minWidth: "44px" }}
            >
              Programs
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${programsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {programsOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-1 w-72 rounded-lg shadow-xl border py-2 z-50"
                style={{
                  backgroundColor: "#fff",
                  borderColor: "var(--color-border)",
                }}
              >
                <Link
                  href="/programs"
                  role="menuitem"
                  className="block px-4 py-2 text-sm font-semibold transition-colors"
                  style={{ color: "var(--color-accent)", minHeight: "44px", display: "flex", alignItems: "center" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  View All Programs →
                </Link>
                <hr style={{ borderColor: "var(--color-border)", margin: "4px 0" }} />
                {programs.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    role="menuitem"
                    className="block px-4 py-2 text-sm transition-colors"
                    style={{ color: "var(--color-text-primary)", minHeight: "44px", display: "flex", alignItems: "center" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Contact */}
          <Link
            href="/contact"
            className="text-white font-medium px-4 rounded-md transition-colors hover:bg-white/10"
            style={{ height: "64px", minWidth: "44px", display: "flex", alignItems: "center" }}
          >
            Contact
          </Link>

          {/* Platform Demo */}
          <Link
            href="/platform"
            className="text-white font-medium px-4 rounded-md transition-colors hover:bg-white/10"
            style={{ height: "64px", minWidth: "44px", display: "flex", alignItems: "center" }}
          >
            Platform Demo
          </Link>

          {/* Primary CTA — Refer a Patient */}
          <Link
            href="/refer"
            className="btn-primary ml-4"
            style={{ height: "44px" }}
          >
            Refer a Patient
          </Link>
        </nav>

        {/* ── Mobile Hamburger ── */}
        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden text-white p-2 rounded-md hover:bg-white/10"
          style={{ minHeight: "44px", minWidth: "44px" }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t"
          style={{
            backgroundColor: "var(--color-primary)",
            borderColor: "rgba(255,255,255,0.15)",
          }}
        >
          <div className="content-max-width py-4 flex flex-col gap-1">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest px-2 mb-1">
              Programs
            </p>
            <Link
              href="/programs"
              onClick={() => setMobileOpen(false)}
              className="text-white font-semibold px-2 py-2 rounded-md hover:bg-white/10"
              style={{ minHeight: "44px", display: "flex", alignItems: "center" }}
            >
              View All Programs
            </Link>
            {programs.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setMobileOpen(false)}
                className="text-white/80 px-4 py-2 rounded-md hover:bg-white/10 text-sm"
                style={{ minHeight: "44px", display: "flex", alignItems: "center" }}
              >
                {p.label}
              </Link>
            ))}
            <hr style={{ borderColor: "rgba(255,255,255,0.15)", margin: "8px 0" }} />
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="text-white px-2 py-2 rounded-md hover:bg-white/10 font-medium"
              style={{ minHeight: "44px", display: "flex", alignItems: "center" }}
            >
              Contact
            </Link>
            <Link
              href="/platform"
              onClick={() => setMobileOpen(false)}
              className="text-white px-2 py-2 rounded-md hover:bg-white/10 font-medium"
              style={{ minHeight: "44px", display: "flex", alignItems: "center" }}
            >
              Platform Demo
            </Link>
            <Link
              href="/refer"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-2 w-full justify-center"
            >
              Refer a Patient
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
