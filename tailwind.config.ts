import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base canvas
        ink: "#0A0E1A",
        "ink-soft": "#0E1424",
        // Brand
        brand: {
          blue: "#3B82F6",
          "blue-deep": "#2563EB",
          violet: "#8B5CF6",
          "violet-soft": "#A78BFA",
        },
        // Metric accents
        metric: {
          steps: "#3B82F6",
          calories: "#F97316",
          heart: "#EF4444",
          sleep: "#6366F1",
          active: "#10B981",
        },
        // Text
        head: "#F8FAFC",
        muted: "#94A3B8",
        hint: "#64748B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.18) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(59,130,246,0.45)",
        "glow-violet": "0 0 50px -10px rgba(139,92,246,0.5)",
        card: "0 8px 40px -12px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 24px -6px rgba(59,130,246,0.5)" },
          "50%": { opacity: "0.85", boxShadow: "0 0 40px -4px rgba(139,92,246,0.7)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
