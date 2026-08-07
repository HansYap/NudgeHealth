import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep Teal ramp — brand-700 is the exact Design System primary (#0D5C75).
        // Other steps are derived tints/shades for hover/focus/surface states.
        brand: {
          50: "#E6F2F5", // Teal Light — card fills, selected states, secondary surfaces
          100: "#CFE6EC",
          200: "#A3CDD9",
          300: "#71AFC0",
          400: "#3D8CA3",
          500: "#136987",
          600: "#0F647E",
          700: "#0D5C75", // Deep Teal — primary. Headers, primary buttons, nav, active states.
          800: "#0A4A5E",
          900: "#083C4C",
          950: "#052831",
        },
        // Coral — decorative accent only for icons, illustrations, large numerals,
        // badges, and text-safe CTA buttons/links (never body text on light bg).
        coral: {
          DEFAULT: "#E36414",
          dark: "#B54A16",
          light: "#FDEDE3", // icon chip fill
          surface: "#FFF6EF", // callout / disclaimer background
        },
        // App background — used instead of plain white per Design System 01.
        alabaster: "#F1F5F9",
        // Risk-band / semantic colors (Design System 05) — always paired with an
        // icon + text label in UI, never color alone.
        sage: { DEFAULT: "#3E7D5A", light: "#E4F2E9" }, // low risk / success
        amber: { DEFAULT: "#9C6A0E", light: "#FBF1DE" }, // moderate risk / gamification accent
        rust: { DEFAULT: "#B03A1F", light: "#FBE4DE" }, // elevated risk / error / destructive
        ink: {
          900: "#16262B",
        },
        // Figma card/divider border on light surfaces
        hairline: "#D8E3E6",
      },
      fontFamily: {
        // Inter — body copy, everything read at length. Body text floor is 16px.
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        // Sora — headings, numerals, and anything that needs visual presence
        // (rounded, geometric, warm) per Design System 02.
        sora: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      // Exact type scale from Design System 02 — use these instead of ad-hoc
      // text-[Npx] so every page matches pixel-for-pixel.
      fontSize: {
        display: ["34px", { lineHeight: "1.2", fontWeight: "800" }], // Sora
        h2: ["24px", { lineHeight: "1.3", fontWeight: "700" }], // Sora
        h3: ["18px", { lineHeight: "1.4", fontWeight: "700" }], // Sora
        body: ["18px", { lineHeight: "1.6", fontWeight: "400" }], // Inter — default
        "body-sm": ["16px", { lineHeight: "1.5", fontWeight: "400" }], // Inter — floor, never smaller
        caption: [
          "13px",
          { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0.02em" },
        ], // Inter — labels/timestamps only
      },
      // 8px grid (Design System 03) — 4/8/12/16/24/32/48/64 already match
      // Tailwind's default spacing scale (1/2/3/4/6/8/12/16), so no extension
      // is needed; use those tokens directly. min-h-12 (48px) = min tap target.
      minHeight: {
        tap: "48px",
      },
      boxShadow: {
        panel: "0 1px 2px 0 rgb(16 24 40 / 0.04)",
        popover:
          "0 4px 6px -1px rgb(16 24 40 / 0.08), 0 2px 4px -2px rgb(16 24 40 / 0.06)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
