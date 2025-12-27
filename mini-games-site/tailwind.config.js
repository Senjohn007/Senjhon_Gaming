/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "blob-1": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "blob-2": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(-40px, 30px) scale(1.2)" },
          "66%": { transform: "translate(20px, -30px) scale(0.8)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "blob-3": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(50px, 20px) scale(0.9)" },
          "66%": { transform: "translate(-30px, -40px) scale(1.1)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "blob-4": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(-30px, -30px) scale(1.15)" },
          "66%": { transform: "translate(40px, 10px) scale(0.85)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "float": {
          "0%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(0, -20px)" },
          "100%": { transform: "translate(0, 0)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "gradient-bg": "gradient-shift 15s ease infinite",
        "gradient-shift": "gradient-shift 15s ease infinite",
        "blob-1": "blob-1 20s ease-in-out infinite",
        "blob-2": "blob-2 25s ease-in-out infinite",
        "blob-3": "blob-3 30s ease-in-out infinite",
        "blob-4": "blob-4 35s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 60s linear infinite",
      },
    }
  },
  plugins: [],
};
