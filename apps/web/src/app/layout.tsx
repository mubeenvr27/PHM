import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import ChatWidget from "@/components/ChatWidget";

/* ── Inter — PHM design system typography ── */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Priority Home Monitor",
    template: "%s | Priority Home Monitor",
  },
  description:
    "Priority Home Monitor — remote patient monitoring for COPD, Heart Failure, Diabetes, Hypertension, and more. Serving patients and healthcare providers in Waxahachie, TX.",
  keywords: [
    "remote patient monitoring",
    "home health",
    "COPD monitoring",
    "chronic care management",
    "Waxahachie TX",
    "Priority Home Monitor",
  ],
  openGraph: {
    title: "Priority Home Monitor",
    description:
      "Professional remote patient monitoring — your clinical team, every day.",
    type: "website",
  },
  icons: {
    icon: "/logo-horizontal.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased" style={{ backgroundColor: "var(--color-surface)" }}>
        {/* Global sticky navigation */}
        <Navbar />

        {/* Page content — grows to fill available height */}
        <main id="main-content" tabIndex={-1} className="min-h-screen flex-1 w-full max-w-7xl mx-auto px-6 md:px-8">
          {children}
        </main>

        {/* Global footer */}
        <Footer />

        {/* Global utilities */}
        <ScrollToTop />
        <ChatWidget />
      </body>
    </html>
  );
}
