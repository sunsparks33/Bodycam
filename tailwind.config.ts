import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        zoomIn: {
          "0%": { transform: "scale(0.98)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(6, 182, 212, 0.05)" },
          "50%": { boxShadow: "0 0 25px rgba(6, 182, 212, 0.2)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out forwards",
        slideUp: "slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        zoomIn: "zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        pulseGlow: "pulseGlow 3s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
