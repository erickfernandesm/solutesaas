import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#060607",
          900: "#0A0A0C",
          850: "#0F0F12",
          800: "#141418",
          700: "#1B1B21",
          600: "#26262D",
          500: "#34343C",
        },
        fog: {
          DEFAULT: "#EDEDF0",
          300: "#C4C4CC",
          400: "#A0A0AA",
          500: "#82828D",
          600: "#5E5E68",
        },
        brand: {
          DEFAULT: "#F38C23",
          soft: "#FFAE5C",
          deep: "#D2740F",
        },
        ok: "#5BC98A",
        bad: "#F2777A",
      },
      fontFamily: {
        display: ["var(--font-sora)", "Segoe UI", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "Cascadia Mono", "SF Mono", "Consolas", "monospace"],
      },
      maxWidth: { site: "1200px" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        pulseDot: "pulseDot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
