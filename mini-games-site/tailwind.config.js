// tailwind.config.js
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
        "blob-move": {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(20%, -10%, 0) scale(1.15)" },
          "66%": { transform: "translate3d(-15%, 15%, 0) scale(0.9)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" },
        },
      },
      animation: {
        "gradient-bg": "gradient-shift 20s ease-in-out infinite",
        "blob-slow": "blob-move 18s ease-in-out infinite",
        "blob-slower": "blob-move 26s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};