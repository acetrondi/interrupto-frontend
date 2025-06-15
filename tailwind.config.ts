import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        storyteller: ["Fredoka", "Comic Neue", "cursive", "sans-serif"],
      },
      borderRadius: {
        xl: "32px",
        "2xl": "40px",
        "3xl": "48px",
      },
      animation: {
        "bounce-in": "bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        wiggle: "wiggle 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
      },
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)", opacity: "0.9" },
          "70%": { transform: "scale(0.9)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        wiggle: {
          "0%, 7%": { transform: "rotateZ(0)" },
          "15%": { transform: "rotateZ(-15deg)" },
          "20%": { transform: "rotateZ(10deg)" },
          "25%": { transform: "rotateZ(-10deg)" },
          "30%": { transform: "rotateZ(6deg)" },
          "35%": { transform: "rotateZ(-4deg)" },
          "40%, 100%": { transform: "rotateZ(0)" },
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0px)" },
        },
        sparkle: {
          "0%, 100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
          "50%": { transform: "scale(1.2) rotate(180deg)", opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
