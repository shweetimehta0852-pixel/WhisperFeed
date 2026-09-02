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
        midnight: {
          950: "#050811",
          900: "#0a0f1d",
          850: "#0f172a",
          800: "#131e36",
          700: "#1e293b",
          600: "#334155",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
          300: "#67e8f9",
          glowing: "#00f2fe",
        },
        electric: {
          blue: "#4facfe",
          purple: "#7928ca",
          emerald: "#10b981",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "midnight-mesh": "radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(121, 40, 202, 0.12) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(15, 23, 42, 0.8) 0px, transparent 100%)",
      },
      boxShadow: {
        "cyan-glow": "0 0 25px -5px rgba(6, 182, 212, 0.4)",
        "cyan-glow-lg": "0 0 45px -5px rgba(6, 182, 212, 0.6)",
        "purple-glow": "0 0 25px -5px rgba(121, 40, 202, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-beam": "glowBeam 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glowBeam: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
