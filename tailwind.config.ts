import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        mono: ["var(--font-dm-mono)", "DM Mono", "monospace"],
        display: ["var(--font-instrument)", "Instrument Serif", "serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#0f1117",
          card: "#161b27",
          border: "#1e2535",
          hover: "#1c2234",
        },
        accent: {
          DEFAULT: "#4f7ef8",
          muted: "#2a3f7a",
          glow: "rgba(79,126,248,0.15)",
        },
        status: {
          green: "#22c55e",
          "green-bg": "rgba(34,197,94,0.08)",
          yellow: "#eab308",
          "yellow-bg": "rgba(234,179,8,0.08)",
          red: "#ef4444",
          "red-bg": "rgba(239,68,68,0.08)",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.45s ease forwards",
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite",
        shimmer: "shimmer 1.5s infinite",
        "score-fill": "scoreFill 1s ease forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        scoreFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--score-width)" },
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
        "card-hover":
          "0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
        glow: "0 0 30px rgba(79,126,248,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
