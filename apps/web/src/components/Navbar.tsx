"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";

const programs = [
  { label: "COPD — Respiratory Care", href: "/programs/copd" },
  { label: "Hypertension Monitoring", href: "/programs/hypertension" },
  { label: "Diabetes — CCM", href: "/programs/ccm/diabetes" },
  { label: "Heart Failure — CCM", href: "/programs/ccm/heart-failure" },
  { label: "Obstructive Sleep Apnea", href: "/programs/osa" },
  { label: "Pediatric Sleep Monitoring", href: "/programs/sleep/pediatric" },
  { label: "Adult Sleep Monitoring", href: "/programs/sleep/adult" },
  { label: "ENT Sleep Program", href: "/programs/sleep/ent" },
  { label: "Wellness: Mental, Nutrition, Weight", href: "/programs/wellness" },
  { label: "Prepared Meal Program (CookUnity)", href: "/programs/nutrition/diet/meals" },
  { label: "Fall Detection — Safety & Monitoring", href: "/programs/fall-detection" },
];

export default function Navbar() {
  const [programsOpen, setProgramsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 h-16 bg-[#11263d] border-b border-white/10 transition-all duration-300"
    >
      <nav className="flex items-center justify-between h-16 max-w-7xl mx-auto px-6 md:px-12 w-full" aria-label="Main navigation">

        {/* ── Logo ── */}
        <Logo variant="horizontal" className="shrink-0 flex items-center w-40" />

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-6">
          {/* Programs Dropdown */}
          <div className="relative">
            <button
              aria-haspopup="true"
              aria-expanded={programsOpen}
              onClick={() => setProgramsOpen((o) => !o)}
              onBlur={() => setTimeout(() => setProgramsOpen(false), 150)}
              className="flex h-12 items-center gap-1 text-white font-medium px-4 rounded-md transition-colors hover:bg-white/10"
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

          {/* Shop */}
          <Link
            href="/shop"
            className="flex h-12 items-center text-white font-medium px-4 rounded-md transition-colors hover:bg-white/10"
          >
            Shop
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            className="flex h-12 items-center text-white font-medium px-4 rounded-md transition-colors hover:bg-white/10"
          >
            Contact
          </Link>

          {/* Platform Demo */}
          <a
            href="https://calendly.com/priorityhomemonitor/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center text-white font-medium px-4 rounded-md transition-colors hover:bg-white/10"
          >
            Platform Demo
          </a>

          {/* Primary CTA — Refer a Patient */}
          <Link
            href="/refer"
            className="btn-primary ml-4 flex items-center justify-center rounded-md font-bold transition-colors"
            style={{ height: "44px", backgroundColor: "#0D7377", color: "white", padding: "0 1.5rem" }}
          >
            Refer a Patient
          </Link>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden flex h-12 w-12 items-center justify-center text-white rounded-md hover:bg-white/10"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

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
              href="/shop"
              onClick={() => setMobileOpen(false)}
              className="text-white px-2 py-2 rounded-md hover:bg-white/10 font-medium flex items-center gap-2"
              style={{ minHeight: "44px" }}
            >
              Shop
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="text-white px-2 py-2 rounded-md hover:bg-white/10 font-medium"
              style={{ minHeight: "44px", display: "flex", alignItems: "center" }}
            >
              Contact
            </Link>
            <a
              href="https://calendly.com/priorityhomemonitor/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="text-white px-2 py-2 rounded-md hover:bg-white/10 font-medium"
              style={{ minHeight: "44px", display: "flex", alignItems: "center" }}
            >
              Platform Demo
            </a>
            <Link
              href="/refer"
              onClick={() => setMobileOpen(false)}
              className="mt-2 w-full flex items-center justify-center rounded-md font-bold transition-colors"
              style={{ height: "48px", backgroundColor: "#0D7377", color: "white" }}
            >
              Refer a Patient
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}