import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ── Font Families ── */
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },

      /* ── Font Sizes — minimum 16px body ── */
      fontSize: {
        base: ["1rem", { lineHeight: "1.6" }],       // 16px body
        lg:   ["1.125rem", { lineHeight: "1.6" }],   // 18px
        xl:   ["1.25rem", { lineHeight: "1.4" }],    // 20px
        "2xl":["1.5rem",  { lineHeight: "1.3" }],    // 24px
        "3xl":["2rem",    { lineHeight: "1.2" }],    // 32px
        "4xl":["2.5rem",  { lineHeight: "1.2" }],    // 40px
        "5xl":["3rem",    { lineHeight: "1.1" }],    // 48px
      },

      /* ── Font Weights ── */
      fontWeight: {
        normal:     "400",  // body
        medium:     "500",  // subtle emphasis
        semibold:   "600",  // subheadings / H3, H4
        bold:       "700",  // headings H1, H2, CTAs
      },

      /* ── PHM Brand Colors ── */
      colors: {
        /* PHM semantic tokens */
        "phm-primary":      "#1B3A5C",
        "phm-accent":       "#0D7377",
        "phm-surface":      "#F8FAFC",
        "phm-border":       "#E2EBF4",
        "phm-text":         "#1A1A2E",
        "phm-text-muted":   "#5A6A7A",
        "phm-success":      "#1A6B4A",
        "phm-warning":      "#C75B00",
        "phm-danger":       "#9B1C1C",

        /* Shadcn/UI bridge tokens */
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
      },

      /* ── Border Radius ── */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* ── Spacing ── */
      spacing: {
        "section": "5rem",     // 80px — minimum section vertical padding
        "tap-min": "44px",     // WCAG 2.5.5 minimum tap target
      },

      /* ── Max Widths ── */
      maxWidth: {
        content: "1100px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
