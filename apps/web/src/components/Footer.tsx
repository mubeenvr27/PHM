import Link from "next/link";
import { Phone, MapPin, FileDown } from "lucide-react";
import Logo from "@/components/ui/Logo";

const footerNav = [
  { label: "Home",            href: "/" },
  { label: "All Programs",    href: "/programs" },
  { label: "Contact Us",      href: "/contact" },
  { label: "Refer a Patient", href: "/refer" },
  { label: "Platform Demo",   href: "/platform" },
];

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
    >
      <div className="content-max-width py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* ── Brand Column ── */}
          <div>
            <Logo variant="stacked" className="mb-6" />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)", lineHeight: "1.6" }}>
              Remote patient monitoring for patients, families,
              and the healthcare providers who care for them.
            </p>
          </div>

          {/* ── Navigation Column ── */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>
              Navigation
            </h3>
            <ul className="flex flex-col gap-1" role="list">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                    style={{ minHeight: "44px", display: "inline-flex", alignItems: "center" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Column ── */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>
              Contact
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              <li>
                <a
                  href="tel:+19725734015"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                  aria-label="Call us at +1 972-573-4015"
                  style={{ minHeight: "44px" }}
                >
                  <Phone size={16} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                  <span className="font-semibold text-white">+1 972-573-4015</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-white/80 text-sm">
                  <MapPin size={16} style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: "2px" }} />
                  <address className="not-italic" style={{ color: "rgba(255,255,255,0.65)", lineHeight: "1.6" }}>
                    Waxahachie, TX
                  </address>
                </div>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/priority_home_monitor?igsh=MXZoYnJqMnd4MDk="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                  aria-label="Follow us on Instagram"
                  style={{ minHeight: "44px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="font-semibold">Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="/PRIORITY%20HOME%20LEAFLET.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                  aria-label="PRIORITY HOME LEAFLET"
                  style={{ minHeight: "44px" }}
                >
                  <FileDown size={16} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                  <span className="font-semibold">PRIORITY HOME LEAFLET</span>
                </a>
              </li>
            </ul>

            <Link
              href="/refer"
              className="btn-primary mt-6 inline-flex"
              style={{ height: "44px" }}
            >
              Refer a Patient
            </Link>
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <hr style={{ borderColor: "rgba(255,255,255,0.15)", margin: "2rem 0 1.5rem" }} />
        <p
          className="text-xs text-center"
          style={{ color: "rgba(255,255,255,0.4)", lineHeight: "1.6", maxWidth: "800px", margin: "0 auto" }}
        >
          Priority Home Monitor is a remote patient monitoring service, not an emergency medical service.
          If you are experiencing a medical emergency, <strong style={{ color: "rgba(255,255,255,0.65)" }}>call 911 immediately</strong>.
          This site does not collect, store, or transmit Protected Health Information (PHI) as defined by HIPAA.
          Program interest information is used solely for referral coordination.
        </p>
        <p
          className="text-xs text-center mt-2"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          © {new Date().getFullYear()} Priority Home Monitor. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
